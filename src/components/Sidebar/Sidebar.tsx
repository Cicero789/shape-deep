import { allShapes } from '../../shapes/registry'
import { useShapeStore } from '../../store/useShapeStore'
import CategorySection from './CategorySection'

export default function Sidebar() {
  const combineMode = useShapeStore((s) => s.combineMode)
  const toggleCombineMode = useShapeStore((s) => s.toggleCombineMode)
  const checkedShapes = useShapeStore((s) => s.checkedShapes)

  const shapes3D = allShapes.filter((s) => s.category === '3d-primitive')
  const shapes2D = allShapes.filter((s) => s.category === '2d-extruded')
  const shapesCombined = allShapes.filter((s) => s.category === 'combined')

  return (
    <div className="w-72 overflow-y-auto shrink-0 flex flex-col" style={{ background: '#FFFDF7', borderRight: '1px solid #CFDDEC' }}>
      <div className="p-7">
        <div className="mb-8">
          <h1 className="text-lg font-semibold tracking-tight" style={{ color: '#003262' }}>
            ShapeDeep
          </h1>
          <p className="text-xs mt-1 font-normal" style={{ color: '#3B7EA1' }}>
            Learn geometry in three dimensions
          </p>
        </div>

        <label className="flex items-center justify-between mb-6 px-4 py-3 rounded-xl cursor-pointer transition-all"
          style={{ background: '#FFFDF7', border: '2px solid #FDB515' }}>
          <span className="text-sm font-medium" style={{ color: '#003262' }}>Combine Mode</span>
          <div className="relative">
            <input type="checkbox" checked={combineMode} onChange={toggleCombineMode} className="sr-only peer" />
            <div className="w-8 h-4 rounded-full transition-all duration-300" style={{ background: combineMode ? '#003262' : '#CFDDEC' }} />
            <div className="absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full peer-checked:translate-x-4 transition-all duration-300 shadow-sm border" style={{ borderColor: '#CFDDEC' }} />
          </div>
        </label>

        {combineMode && (
          <div className="mb-6 px-4 py-3 rounded-xl animate-fade-in" style={{ background: '#F5F3EE', border: '1px solid #FDB515' }}>
            <p className="text-sm font-medium" style={{ color: '#003262' }}>
              {checkedShapes.length} / 2 shapes combined
            </p>
            <p className="text-[11px] mt-0.5" style={{ color: '#3B7EA1' }}>
              Max 2 shapes &middot; Click to edit &middot; Set attachment face in panel
            </p>
          </div>
        )}

        <div className="space-y-6">
          <CategorySection category="3d-primitive" shapes={shapes3D} />
          <CategorySection category="2d-extruded" shapes={shapes2D} />
          <CategorySection category="combined" shapes={shapesCombined} />
        </div>
      </div>

      <div className="mt-auto p-5" style={{ borderTop: '1px solid #CFDDEC' }}>
        <p className="text-[11px] text-center" style={{ color: '#3B7EA1' }}>
          Built to make geometry beautiful
        </p>
      </div>
    </div>
  )
}
