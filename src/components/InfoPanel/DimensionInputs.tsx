import type { ParamDef } from '../../types/shapes'
import { useShapeStore } from '../../store/useShapeStore'

export default function DimensionInputs({ params }: { params: ParamDef[] }) {
  const dimensions = useShapeStore((s) => s.dimensions)
  const setDimension = useShapeStore((s) => s.setDimension)

  return (
    <div className="space-y-3.5">
      <h3 className="text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: '#FDB515' }}>
        Dimensions
      </h3>
      {params.map((p) => (
        <div key={p.key} className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium" style={{ color: '#003262' }}>{p.label}</label>
            <input
              type="number"
              value={dimensions[p.key] ?? p.default}
              min={p.min}
              max={p.max}
              step={p.step}
              onChange={(e) => setDimension(p.key, parseFloat(e.target.value) || p.default)}
              className="w-16 px-2.5 py-1 text-xs font-mono rounded-lg text-center focus:outline-none transition-all"
              style={{ background: '#FFFDF7', border: '1px solid #CFDDEC', color: '#003262' }}
            />
          </div>
          <input
            type="range"
            value={dimensions[p.key] ?? p.default}
            min={p.min}
            max={p.max}
            step={p.step}
            onChange={(e) => setDimension(p.key, parseFloat(e.target.value))}
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
            style={{ accentColor: '#FDB515' }}
          />
        </div>
      ))}
    </div>
  )
}
