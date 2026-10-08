// src/types/math-shim.d.ts

// 直接重新声明，覆盖 node_modules 里的
declare const Math: {
  readonly PI: number
  readonly E: number
  readonly LN2: number
  readonly LN10: number
  readonly LOG2E: number
  readonly LOG10E: number
  readonly SQRT1_2: number
  readonly SQRT2: number
  abs(x: number): number
  acos(x: number): number
  acosh(x: number): number
  asin(x: number): number
  asinh(x: number): number
  atan(x: number): number
  atan2(y: number, x: number): number
  atanh(x: number): number
  cbrt(x: number): number
  ceil(x: number): number
  clz32(x: number): number
  cos(x: number): number
  cosh(x: number): number
  exp(x: number): number
  expm1(x: number): number
  floor(x: number): number
  fround(x: number): number
  hypot(...values: number[]): number
  imul(a: number, b: number): number
  log(x: number): number
  log1p(x: number): number
  log10(x: number): number
  log2(x: number): number
  max(...values: number[]): number
  min(...values: number[]): number
  pow(base: number, exponent: number): number
  random(): number
  round(x: number): number
  sign(x: number): number
  sin(x: number): number
  sinh(x: number): number
  sqrt(x: number): number
  tan(x: number): number
  tanh(x: number): number
  trunc(x: number): number
}
