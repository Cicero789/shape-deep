import { useMemo } from 'react'
import type { FormulaDef, CalcMode } from '../../types/shapes'
import { buildSteps } from '../../lib/calculations'

export default function CalculationSteps({
  formula,
  dims,
  mode,
}: {
  formula: FormulaDef | undefined
  dims: Record<string, number>
  mode: CalcMode
}) {
  const rendered = useMemo(() => {
    if (!formula) return null
    const modeLabel =
      mode === 'surface-area' ? 'Surface Area' : mode === 'volume' ? 'Volume' : 'Perimeter'
    const steps = buildSteps(formula.steps, dims, formula.expression)
    return { label: modeLabel, steps }
  }, [formula, dims, mode])

  if (!rendered) {
    return (
      <p className="text-sm text-slate-400 italic">
        No {mode === 'surface-area' ? 'surface area' : mode === 'volume' ? 'volume' : 'perimeter'} formula for this shape.
      </p>
    )
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
        {rendered.label} Calculation
      </h3>
      <div className="bg-white rounded-xl p-4 border border-slate-200 space-y-2">
        {rendered.steps.map((step, i) => (
          <p
            key={i}
            className={`text-sm font-mono ${
              i === rendered.steps.length - 1
                ? 'text-emerald-600 font-bold text-base bg-emerald-50 px-3 py-2 rounded-lg'
                : 'text-slate-700'
            }`}
          >
            {step}
          </p>
        ))}
      </div>
    </div>
  )
}
