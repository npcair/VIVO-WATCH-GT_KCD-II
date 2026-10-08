import struct, os, sys

path = sys.argv[1]
outdir = sys.argv[2]
data = open(path, 'rb').read()

magic = data[:0x40].rstrip(b'\x00').decode()
print(f"magic: {magic!r}, total size: {len(data)}")

f1, f2 = struct.unpack_from('<II', data, 0x40)
pkg = data[0x48:0x88].rstrip(b'\x00').decode()
print(f"field1=0x{f1:x}, field2=0x{f2:x}, package={pkg!r}")

count = struct.unpack_from('<I', data, 0xAC)[0]
print(f"entry count: {count}")

pos = 0xB0
entries = []
for _ in range(count):
    (nlen,) = struct.unpack_from('<I', data, pos); pos += 4
    name = data[pos:pos+nlen].decode(); pos += nlen
    off, size = struct.unpack_from('<II', data, pos); pos += 8
    entries.append((name, off, size))
    print(f"  {name:40s} offset=0x{off:06x} size={size}")

os.makedirs(outdir, exist_ok=True)
for name, off, size in entries:
    dest = os.path.join(outdir, name.replace('/', os.sep))
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    with open(dest, 'wb') as f:
        f.write(data[off:off+size])
print(f"\nextracted {count} files to {outdir}")
