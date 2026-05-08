import { useMemo, useState, useCallback } from 'react'
import { evaluate } from 'mathjs'
import { useShapeStore } from '../../store/useShapeStore'
import type { AttachFace } from '../../store/useShapeStore'
import { getShape } from '../../shapes/registry'
import type { CalcMode, FormulaDef } from '../../types/shapes'
import { buildSteps } from '../../lib/calculations'
import DimensionInputs from './DimensionInputs'

const ALL_FACES: { face: AttachFace; label: string }[] = [
  { face: 'top', label: 'Top' },
  { face: 'bottom', label: 'Bottom' },
  { face: 'left', label: 'Left' },
  { face: 'right', label: 'Right' },
  { face: 'front', label: 'Front' },
  { face: 'back', label: 'Back' },
]

function ResultCard({
  mode,
  formula,
  dims,
}: {
  mode: CalcMode
  formula: FormulaDef | undefined
  dims: Record<string, number>
}) {
  const [showSteps, setShowSteps] = useState(false)

  const result = useMemo(() => {
    if (!formula) return null
    try {
      const val = evaluate(formula.expression, dims)
      return Number.isInteger(val) ? val.toString() : val.toFixed(2)
    } catch { return null }
  }, [formula, dims])

  const steps = useMemo(() => {
    if (!formula) return null
    return buildSteps(formula.steps, dims, formula.expression)
  }, [formula, dims])

  const config = {
    'surface-area': { label: 'Surface Area', unit: 'units²', color: '#00A598', bg: '#E6F7F5' },
    volume: { label: 'Volume', unit: 'units³', color: '#C4820E', bg: '#FDF5E6' },
    perimeter: { label: 'Perimeter', unit: 'units', color: '#3B7EA1', bg: '#EDF4F8' },
  }[mode]

  if (!result) {
    return (
      <div className="rounded-2xl p-6" style={{ background: '#F5F3EE', border: '1px solid #CFDDEC' }}>
        <p className="text-xs uppercase tracking-[0.12em] font-semibold" style={{ color: '#3B7EA1' }}>{config.label}</p>
        <p className="text-sm italic mt-1.5" style={{ color: '#CFDDEC' }}>Not available</p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl p-6 transition-all duration-200 animate-fade-in"
      style={{ background: '#FFFDF7', border: `2px solid ${config.color}`, borderLeftWidth: '4px' }}>
      <div className="flex items-center gap-2.5 mb-4">
        <span className="w-2 h-2 rounded-full" style={{ background: config.color }} />
        <p className="text-xs uppercase tracking-[0.12em] font-semibold" style={{ color: config.color }}>{config.label}</p>
      </div>
      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-5xl font-semibold tracking-tight leading-none" style={{ color: '#003262' }}>{result}</span>
        <span className="text-sm font-medium" style={{ color: '#3B7EA1' }}>{config.unit}</span>
      </div>
      {steps && (
        <>
          <button
            onClick={() => setShowSteps(!showSteps)}
            className="mt-3 text-xs font-medium flex items-center gap-1 transition-colors"
            style={{ color: config.color }}
          >
            {showSteps ? 'Hide step-by-step' : 'Show step-by-step'}
          </button>
          {showSteps && (
            <div className="mt-3 pt-3 space-y-1.5 animate-fade-in" style={{ borderTop: '1px solid #CFDDEC' }}>
              {steps.map((s, i) => (
                <p
                  key={i}
                  className="text-xs font-mono leading-relaxed"
                  style={{
                    color: i === steps.length - 1 ? '#003262' : '#3B7EA1',
                    fontWeight: i === steps.length - 1 ? 600 : 400,
                    background: i === steps.length - 1 ? config.bg : 'transparent',
                    padding: i === steps.length - 1 ? '6px 12px' : '0',
                    borderRadius: i === steps.length - 1 ? '8px' : '0',
                  }}
                >
                  {s}
                </p>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

function AttachControls() {
  const checkedShapes = useShapeStore((s) => s.checkedShapes)
  const attachments = useShapeStore((s) => s.attachments)
  const setAttachment = useShapeStore((s) => s.setAttachment)

  if (checkedShapes.length < 2) return null

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: '#FDB515' }}>
        Attachment faces
      </h3>
      {checkedShapes.slice(1).map((shapeId) => {
        const shape = getShape(shapeId)
        const currentFace = attachments[shapeId] ?? 'top'
        return (
          <div key={shapeId} className="space-y-1.5">
            <p className="text-xs font-medium" style={{ color: '#3B7EA1' }}>
              {shape?.name ?? shapeId} attaches at
            </p>
            <div className="grid grid-cols-3 gap-1">
              {ALL_FACES.map(({ face, label }) => (
                <button
                  key={face}
                  onClick={() => setAttachment(shapeId, face)}
                  className="text-xs font-medium px-3 py-2 rounded-lg transition-all border"
                  style={{
                    background: currentFace === face ? '#003262' : '#FFFDF7',
                    color: currentFace === face ? '#FFFDF7' : '#3B7EA1',
                    borderColor: currentFace === face ? '#003262' : '#CFDDEC',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function InfoPanel() {
  const activeShape = useShapeStore((s) => s.activeShape)
  const dimensions = useShapeStore((s) => s.dimensions)
  const showLabels = useShapeStore((s) => s.showLabels)
  const toggleLabels = useShapeStore((s) => s.toggleLabels)
  const autoRotate = useShapeStore((s) => s.autoRotate)
  const toggleAutoRotate = useShapeStore((s) => s.toggleAutoRotate)
  const combineMode = useShapeStore((s) => s.combineMode)
  const editingShapeId = useShapeStore((s) => s.editingShapeId)
  const checkedShapes = useShapeStore((s) => s.checkedShapes)
  const remix = useShapeStore((s) => s.remix)
  const [spinning, setSpinning] = useState(false)

  const handleRemix = useCallback(() => {
    setSpinning(true)
    remix()
    setTimeout(() => setSpinning(false), 500)
  }, [remix])

  const shape = getShape(combineMode ? editingShapeId : activeShape)
  const formulas = shape?.formulas

  return (
    <div className="w-96 overflow-y-auto flex flex-col shrink-0" style={{ background: '#FFFDF7', borderLeft: '1px solid #CFDDEC' }}>
      <div className="p-7 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold tracking-tight" style={{ color: '#003262' }}>
              {shape?.name ?? 'Shape'}
            </h2>
            <p className="text-xs mt-1" style={{ color: '#3B7EA1' }}>
              {combineMode
                ? `Editing — ${checkedShapes.length} of 2 shapes`
                : 'Adjust dimensions'}
            </p>
          </div>
          <button
            onClick={handleRemix}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all text-xs font-medium shrink-0 ${
              spinning ? 'remix-spin pointer-events-none' : ''
            }`}
            style={{ background: '#FFFDF7', border: '2px solid #FDB515', color: '#003262' }}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Remix
          </button>
        </div>

        {combineMode && <AttachControls />}

        {shape && <DimensionInputs params={shape.params} />}

        <div className="space-y-4">
          <ResultCard mode="surface-area" formula={formulas?.surfaceArea} dims={dimensions} />
          <ResultCard mode="volume" formula={formulas?.volume} dims={dimensions} />
          <ResultCard mode="perimeter" formula={formulas?.perimeter} dims={dimensions} />
        </div>

        <div className="space-y-4 pt-4" style={{ borderTop: '1px solid #CFDDEC' }}>
          <label className="flex items-start justify-between cursor-pointer group py-1.5 gap-4">
            <div>
              <span className="text-sm transition-colors font-medium" style={{ color: '#003262' }}>
                Show labels
              </span>
              <p className="text-[11px] mt-0.5" style={{ color: '#3B7EA1' }}>Sides, area &amp; volume</p>
            </div>
            <div className="relative shrink-0">
              <input type="checkbox" checked={showLabels} onChange={toggleLabels} className="sr-only peer" />
              <div className="w-8 h-4 rounded-full transition-all duration-300" style={{ background: showLabels ? '#003262' : '#CFDDEC' }} />
              <div className="absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full peer-checked:translate-x-4 transition-all duration-300 shadow-sm" style={{ border: '1px solid #CFDDEC' }} />
            </div>
          </label>
          <label className="flex items-start justify-between cursor-pointer group py-1.5 gap-4">
            <div>
              <span className="text-sm transition-colors font-medium" style={{ color: '#003262' }}>
                Auto rotate
              </span>
              <p className="text-[11px] mt-0.5" style={{ color: '#3B7EA1' }}>Smooth camera orbit</p>
            </div>
            <div className="relative shrink-0">
              <input type="checkbox" checked={autoRotate} onChange={toggleAutoRotate} className="sr-only peer" />
              <div className="w-8 h-4 rounded-full transition-all duration-300" style={{ background: autoRotate ? '#003262' : '#CFDDEC' }} />
              <div className="absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full peer-checked:translate-x-4 transition-all duration-300 shadow-sm" style={{ border: '1px solid #CFDDEC' }} />
            </div>
          </label>
        </div>
      </div>
    </div>
  )
}
