const fs = require('fs')
const path = require('path')

const r1 = 144
const r2 = 132

const sin = (angle) => Math.sin((angle * Math.PI) / 180)
const cos = (angle) => Math.cos((angle * Math.PI) / 180)

// 坐标系偏移量
const OFFSET = 145

// 坐标取整 + 加偏移，缩小体积
const f = (n) => parseFloat((n + OFFSET).toFixed(1))
function draw(an) {
  const k = an % 30
  const a = an + (k ? 0 : 0.4)
  const b = an + 6 - (k ? 0.3 : 0.4)

  const x1 = f(r1 * cos(a))
  const y1 = f(r1 * sin(a))
  const x2 = f(r2 * cos(a))
  const y2 = f(r2 * sin(a))
  const x3 = f(r2 * cos(b))
  const y3 = f(r2 * sin(b))
  const x4 = f(r1 * cos(b))
  const y4 = f(r1 * sin(b))

  return `${x1} ${y1} ${x2} ${y2} ${x3} ${y3} ${x4} ${y4}`
}

function generateSVG(s) {
  let path = ''
  for (let i = 0; i < 60 - s; i++) {
    path += `M${draw(-96 - i * 6)}Z`
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="290" height="290" viewBox="0 0 290 290"><path d="${path}" fill="#000"/></svg>`
}

const outputDir = path.join(__dirname, 'svg_output')
fs.mkdirSync(outputDir, { recursive: true })

for (let s = 0; s < 60; s++) {
  fs.writeFileSync(path.join(outputDir, `${s}.svg`), generateSVG(s))
}

console.log('✅ 60 个 SVG 文件生成完成')
