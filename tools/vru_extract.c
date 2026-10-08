#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdint.h>

#ifdef _WIN32
#include <direct.h>
#include <windows.h>
#endif

/* 小端读取 uint32 */
static uint32_t read_u32_le(const unsigned char *buf) {
    return (uint32_t)buf[0] | ((uint32_t)buf[1] << 8) | 
           ((uint32_t)buf[2] << 16) | ((uint32_t)buf[3] << 24);
}

/* UTF-8 字符串转 wchar_t (UTF-16) */
static wchar_t* utf8_to_wchar(const char *utf8) {
    int len = MultiByteToWideChar(CP_UTF8, 0, utf8, -1, NULL, 0);
    if (len == 0) return NULL;
    wchar_t *wstr = (wchar_t*)malloc(len * sizeof(wchar_t));
    MultiByteToWideChar(CP_UTF8, 0, utf8, -1, wstr, len);
    return wstr;
}

/* 递归创建目录（宽字符版，支持中文） */
static void wmkdir_recursive(const wchar_t *wpath) {
    wchar_t tmp[512];
    wchar_t *p;
    wcsncpy(tmp, wpath, 511);
    tmp[511] = L'\0';
    
    for (p = tmp + 1; *p; p++) {
        if (*p == L'/' || *p == L'\\') {
            wchar_t saved = *p;
            *p = L'\0';
            _wmkdir(tmp);
            *p = saved;
        }
    }
    _wmkdir(tmp);
}

/* 使用 wmain 接收 Unicode 命令行参数 */
int wmain(int argc, wchar_t *argv[]) {
    if (argc < 2) {
        wprintf(L"请拖拽 vru 文件到本程序上，或通过右键打开方式使用。\n");
        system("pause");
        return 1;
    }

    const wchar_t *wpath = argv[1];

    /* 1. 用 _wfopen 打开文件（支持中文路径） */
    FILE *fp = _wfopen(wpath, L"rb");
    if (!fp) {
        _wperror(L"无法打开文件");
        system("pause");
        return 1;
    }

    fseek(fp, 0, SEEK_END);
    long fsize = ftell(fp);
    fseek(fp, 0, SEEK_SET);

    unsigned char *data = (unsigned char *)malloc(fsize);
    if (!data) {
        perror("内存分配失败");
        fclose(fp);
        system("pause");
        return 1;
    }
    fread(data, 1, fsize, fp);
    fclose(fp);

    /* 2. 解析头部（头部字段一般是 ASCII） */
    char magic[0x41] = {0};
    memcpy(magic, data, 0x40);
    printf("magic: %s, total size: %ld\n", magic, fsize);

    uint32_t f1 = read_u32_le(data + 0x40);
    uint32_t f2 = read_u32_le(data + 0x44);
    
    char pkg[0x41] = {0};
    memcpy(pkg, data + 0x48, 0x40);
    printf("field1=0x%x, field2=0x%x, package=%s\n", f1, f2, pkg);

    uint32_t count = read_u32_le(data + 0xAC);
    printf("entry count: %u\n", count);

    /* 3. 确定输出目录（与 vru 同名的文件夹，支持中文） */
    wchar_t outdir[512] = {0};
    wchar_t drive[_MAX_DRIVE] = {0};
    wchar_t dir[_MAX_DIR] = {0};
    wchar_t fname[_MAX_FNAME] = {0};
    wchar_t ext[_MAX_EXT] = {0};
    
    _wsplitpath(wpath, drive, dir, fname, ext);
    wcsncpy(outdir, drive, 511);
    wcsncat(outdir, dir, 511 - wcslen(outdir));
    wcsncat(outdir, fname, 511 - wcslen(outdir));
    _wmkdir(outdir);

    /* 4. 解析条目并解包 */
    size_t pos = 0xB0;
    for (uint32_t i = 0; i < count; i++) {
        if (pos + 4 > fsize) break;
        uint32_t nlen = read_u32_le(data + pos);
        pos += 4;

        if (pos + nlen > fsize) break;
        /* 文件名在包里是 UTF-8 编码 */
        char *name_utf8 = (char *)malloc(nlen + 1);
        memcpy(name_utf8, data + pos, nlen);
        name_utf8[nlen] = '\0';
        pos += nlen;

        if (pos + 8 > fsize) { free(name_utf8); break; }
        uint32_t off = read_u32_le(data + pos); pos += 4;
        uint32_t size = read_u32_le(data + pos); pos += 4;

        printf("  %-40s offset=0x%06x size=%u\n", name_utf8, off, size);

        /* UTF-8 文件名 → 宽字符（解决中文文件名） */
        wchar_t *name_w = utf8_to_wchar(name_utf8);
        if (!name_w) {
            free(name_utf8);
            continue;
        }

        /* 替换 / 为 \ (Windows) */
        wchar_t *p;
        for (p = name_w; *p; p++) {
            if (*p == L'/') *p = L'\\';
        }

        /* 构造目标路径 */
        wchar_t dest[512];
        wcsncpy(dest, outdir, 511);
        wcsncat(dest, L"\\", 511 - wcslen(dest));
        wcsncat(dest, name_w, 511 - wcslen(dest));

        /* 创建子目录 */
        wchar_t *last_slash = wcsrchr(dest, L'\\');
        if (last_slash) {
            *last_slash = L'\0';
            wmkdir_recursive(dest);
            *last_slash = L'\\';
        }

        /* 用 _wfopen 写入（支持中文文件名） */
        FILE *outfp = _wfopen(dest, L"wb");
        if (outfp) {
            fwrite(data + off, 1, size, outfp);
            fclose(outfp);
        } else {
            _wperror(L"  写入失败");
        }

        free(name_utf8);
        free(name_w);
    }

    free(data);
    wprintf(L"\n解包完成！文件已释放到：\n%s\n", outdir);
    system("pause");
    return 0;
}
