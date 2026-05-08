import type { FormulaDef, CalcMode } from '../../types/shapes'

export default function FormulaDisplay({
  formula,
  mode,
}: {
  formula: FormulaDef | undefined
  mode: CalcMode
}) {
  if (!formula) return null

  const modeLabel =
    mode === 'surface-area' ? 'SA' : mode === 'volume' ? 'V' : 'P'

  return (
    <div className="bg-slate-100 rounded-xl px-4 py-3">
      <span className="text-xs text-slate-500 uppercase tracking-wide">Formula</span>
      <p className="text-lg font-mono font-semibold text-slate-800 mt-0.5">
        {modeLabel} = {formula.expression}
      </p>
    </div>
  )
}
