import { useMemo } from 'react'
import { evaluate } from 'mathjs'
import type { FormulaDef, CalcMode } from '../../types/shapes'

export default function ResultBadge({
  formula,
  dims,
  mode,
}: {
  formula: FormulaDef | undefined
  dims: Record<string, number>
  mode: CalcMode
}) {
  const result = useMemo(() => {
    if (!formula) return null
    const val = evaluate(formula.expression, dims)
    return Number.isInteger(val) ? val.toString() : val.toFixed(2)
  }, [formula, dims])

  if (!result) return null

  const unit = mode === 'volume' ? 'units³' : 'units²'
  const modeLabel =
    mode === 'surface-area' ? 'Surface Area' : mode === 'volume' ? 'Volume' : 'Perimeter'

  return (
    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-5 text-white text-center shadow-lg">
      <p className="text-xs uppercase tracking-wider opacity-80 mb-1">{modeLabel}</p>
      <p className="text-3xl font-bold">
        {result} <span className="text-lg opacity-80">{unit}</span>
      </p>
    </div>
  )
}
