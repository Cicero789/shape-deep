import { evaluate } from 'mathjs'

export function evaluateFormula(
  expression: string,
  dims: Record<string, number>
): number {
  try {
    return evaluate(expression, dims)
  } catch {
    return 0
  }
}

function computeIntermediates(
  dims: Record<string, number>,
  expression: string
): Record<string, string> {
  const vals: Record<string, string> = {}

  for (const [k, v] of Object.entries(dims)) {
    vals[k] = v.toString()
  }

  const s = dims.side ?? dims.width ?? dims.length ?? dims.base ?? dims.bottomW ?? 3
  const w = dims.width ?? dims.length ?? dims.bottomW ?? s
  const h = dims.height ?? dims.wallHeight ?? dims.rectHeight ?? dims.triHeight ?? s
  const r = dims.radius ?? 2
  const b = dims.base ?? dims.bottomW ?? s
  const rh = dims.roofHeight ?? 0
  const l = dims.length ?? w
  const b1 = dims.base1 ?? 6
  const b2 = dims.base2 ?? 4
  const side = dims.side ?? s

  vals.side_sq = (s * s).toString()
  vals.r_sq = (r * r).toString()
  vals.r_cu = (r * r * r).toString()
  vals.b_sq = (b * b).toString()
  vals.w_plus_h = (w + h).toString()
  vals.r_plus_h = (r + h).toString()
  vals.half_sq = ((b / 2) * (b / 2)).toString()
  vals.lw = (l * w).toString()
  vals.wh = (w * h).toString()
  vals.hl = (h * l).toString()
  vals.sum = (l * w + w * h + h * l).toString()
  vals.slant_sq = (r * r + h * h).toString()
  vals.r_plus_l = (r + Math.sqrt(r * r + h * h)).toString()

  vals.b1_plus_b2 = (b1 + b2).toString()
  vals.b1_minus_b2 = (b1 - b2).toString()
  vals.b_plus_s = (s + side).toString()

  if (rh && w) {
    vals.rh_sq = (rh * rh).toString()
    vals.half_w_sq = ((w / 2) * (w / 2)).toString()
  }

  try {
    const result = evaluate(expression, dims)
    vals.result = Number.isInteger(result) ? result.toString() : result.toFixed(2)
  } catch {
    vals.result = '?'
  }

  return vals
}

export function buildSteps(
  steps: string[],
  dims: Record<string, number>,
  expression: string
): string[] {
  const vals = computeIntermediates(dims, expression)
  return steps.map((step) => {
    return step.replace(/\{(\w+)\}/g, (_, key) => vals[key] ?? key)
  })
}

export function roundResult(n: number, decimals = 2): string {
  return Number.isInteger(n) ? n.toString() : n.toFixed(decimals)
}
