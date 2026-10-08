/**
 * BlueOS Canvas 类型声明
 * 对应官方文档：https://developers-watch.vivo.com.cn/component/others/canvas/
 *
 * 使用方式：
 *   1. 把本文件放到项目 typings/ 目录下；
 *   2. 在 tsconfig.json 的 "include" 中加入 "typings/**//*.d.ts"；
 *   3. 页面脚本中即可获得对 this.$element('canvas').getContext('2d') 的类型提示。
 */

/* ============================ 枚举字面量类型 ============================ */

/** 传入 Canvas.getContext 的上下文类型，当前仅支持 2d */
export type CanvasContextType = '2d'

/** CanvasRenderingContext2D.textAlign 取值 */
export type CanvasTextAlign = 'start' | 'end' | 'left' | 'center' | 'right'

/** CanvasRenderingContext2D.textBaseline 取值 */
export type CanvasTextBaseline =
  | 'alphabetic'
  | 'middle'
  | 'top'
  | 'hanging'
  | 'bottom'
  | 'ideographic'

/**
 * 填充色 / 描边色。
 * 文档列出的合法取值：CSS Color 字符串、以及通过 createLinearGradient() 创建的 CanvasGradient 对象。
 */
export type CanvasColor = string | CanvasGradient

/* ============================ CanvasGradient ============================ */

/**
 * 渐变对象，通过 CanvasRenderingContext2D.createLinearGradient() 创建。
 * 文档未暴露任何可读取的属性，仅提供 addColorStop 方法。
 */
export interface CanvasGradient {
  /**
   * 在渐变对象上添加一个由偏移值和颜色值指定的断点。
   * @param offset 0 到 1 之间的值，表示渐变点在起点和终点中的位置
   * @param color  CSS Color
   */
  addColorStop(offset: number, color: string): void
}

/* ============================ CanvasRenderingContext2D ============================ */

/**
 * Canvas 绘图上下文。
 * 通过 canvas.getContext('2d') 获取，用于在 canvas 上绘制矩形、文本和其他对象。
 *
 * 注意：本接口只声明 BlueOS 官方文档列出的能力，未列出的 Web 标准方法（如 drawImage、
 * createPattern、measureText、save / restore、setLineDash 等）均未包含，避免误用。
 */
export interface CanvasRenderingContext2D {
  /* -------------------- 绘制样式 -------------------- */

  /** 设置填充色，可为 CSS Color 或 CanvasGradient */
  fillStyle: CanvasColor

  /** 设置边框（描边）颜色，可为 CSS Color 或 CanvasGradient */
  strokeStyle: CanvasColor

  /** 设置线条的宽度 */
  lineWidth: number

  /** 设置线条的端点样式 */
  lineCap: CanvasLineCap

  /** 设置文字的水平对齐方式 */
  textAlign: CanvasTextAlign

  /** 设置文字的基线对齐方式 */
  textBaseline: CanvasTextBaseline

  /**
   * 设置当前字体样式。
   * 支持字重与字体大小，可独立设置字重和字体；同时设置时以空格分隔且字重在前面。
   * 默认值为 "30px"。
   */
  font: string

  /* -------------------- 渐变 -------------------- */

  /**
   * 创建一个线性渐变颜色。
   * @param x0 起点 x 坐标
   * @param y0 起点 y 坐标
   * @param x1 终点 x 坐标
   * @param y1 终点 y 坐标
   */
  createLinearGradient(
    x0: number,
    y0: number,
    x1: number,
    y1: number
  ): CanvasGradient

  /* -------------------- 路径 -------------------- */

  /** 开始创建一个新路径 */
  beginPath(): void

  /** 封闭一个路径 */
  closePath(): void

  /** 把路径移动到画布中的指定点 */
  moveTo(x: number, y: number): void

  /** 使用直线连接子路径的终点到 x, y 坐标 */
  lineTo(x: number, y: number): void

  /**
   * 画一条弧线。
   * @param x            圆心 x 坐标
   * @param y            圆心 y 坐标
   * @param radius       半径
   * @param startAngle   起始弧度
   * @param endAngle     结束弧度
   * @param anticlockwise 是否逆时针绘制
   */
  arc(
    x: number,
    y: number,
    radius: number,
    startAngle: number,
    endAngle: number,
    anticlockwise: boolean
  ): void

  /**
   * 根据控制点和半径绘制圆弧路径。
   * @param x1 第一个点的 x 坐标
   * @param y1 第一个点的 y 坐标
   * @param x2 第二个点的 x 坐标
   * @param y2 第二个点的 y 坐标
   * @param radius 半径
   */
  arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void

  /**
   * 绘制三次贝塞尔曲线路径。
   * @param cp1x 第一个控制点 x
   * @param cp1y 第一个控制点 y
   * @param cp2x 第二个控制点 x
   * @param cp2y 第二个控制点 y
   * @param x    结束点 x
   * @param y    结束点 y
   */
  bezierCurveTo(
    cp1x: number,
    cp1y: number,
    cp2x: number,
    cp2y: number,
    x: number,
    y: number
  ): void

  /**
   * 创建二次贝塞尔曲线路径。
   * @param cpx 控制点 x
   * @param cpy 控制点 y
   * @param x   结束点 x
   * @param y   结束点 y
   */
  quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void

  /** 创建一个矩形路径 */
  rect(x: number, y: number, width: number, height: number): void

  /** 对当前路径中的内容进行填充 */
  fill(): void

  /** 画出当前路径的边框 */
  stroke(): void

  /* -------------------- 矩形 -------------------- */

  /**
   * 清除画布上在该矩形区域内的内容。
   * - 矩形区域大于等于 canvas 组件时：清除之前绘制的内容；
   * - 矩形区域小于 canvas 组件时：清除区域默认为黑色，可通过设置 canvas 背景色更改。
   */
  clearRect(x: number, y: number, width: number, height: number): void

  /** 填充一个矩形 */
  fillRect(x: number, y: number, width: number, height: number): void

  /** 画一个非填充矩形（仅边框） */
  strokeRect(x: number, y: number, width: number, height: number): void

  /* -------------------- 文本 -------------------- */

  /**
   * 填充文本。
   * @param text 在画布上输出的文本
   * @param x    绘制文本的左上角 x 坐标位置
   * @param y    绘制文本的左上角 y 坐标位置
   */
  fillText(text: string, x: number, y: number): void

  /**
   * 填充弧形文本。
   * @param text       要绘制的文本
   * @param x          文本起始点的 x 轴坐标
   * @param y          文本起始点的 y 轴坐标
   * @param radius     圆的半径
   * @param startAngle 起始弧度，从 y 轴方向开始计算，单位为弧度
   */
  fillArcText(
    text: string,
    x: number,
    y: number,
    radius: number,
    startAngle: number
  ): void

  /* -------------------- 变换 -------------------- */

  /** 顺时针旋转当前坐标轴，单位为弧度 */
  rotate(angle: number): void

  /**
   * 沿 x 水平方向、y 垂直方向为 canvas 单位添加缩放变换。
   */
  scale(x: number, y: number): void

  /** 对当前坐标系的原点 (0, 0) 进行平移变换 */
  translate(x: number, y: number): void

  /**
   * 沿 x 水平方向、y 垂直方向为 canvas 单位添加错切变换。
   * 注意：这是 BlueOS 的扩展方法，标准 Web Canvas 2D 无此方法。
   */
  shear(x: number, y: number): void
}

/* ============================ Canvas 元素 ============================ */

/**
 * canvas 组件实例。
 * 组件本身支持通用属性与通用样式，此处只声明绘图相关方法。
 */
export interface CanvasElement {
  /**
   * 获取 Canvas 绘图上下文。
   * @param contextType 当前仅支持 '2d'
   * @returns CanvasRenderingContext2D
   */
  getContext(contextType: '2d'): CanvasRenderingContext2D

  /** 获取画布的宽度（单位 px） */
  readonly width: number

  /** 获取画布的高度（单位 px） */
  readonly height: number
}

/* ============================ 全局增强 ============================ */

/**
 * 全局选择器返回值联合类型。
 * BlueOS 页面中通过 this.$element(id) 获取组件，当 id 为 canvas 时返回 CanvasElement。
 *
 * 如需更精确的类型，可在业务代码中自行收窄：
 *    const ctx = (this.$element('myCanvas') as CanvasElement).getContext('2d');
 */
declare global {
  interface BlueOSSelectors {
    (id: string): CanvasElement | Element
  }
}

export {}
