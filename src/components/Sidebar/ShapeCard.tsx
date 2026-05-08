import type { ShapeDefinition } from '../../types/shapes'
import { useShapeStore } from '../../store/useShapeStore'

export default function ShapeCard({ shape }: { shape: ShapeDefinition }) {
  const activeShape = useShapeStore((s) => s.activeShape)
  const setActiveShape = useShapeStore((s) => s.setActiveShape)
  const combineMode = useShapeStore((s) => s.combineMode)
  const checkedShapes = useShapeStore((s) => s.checkedShapes)
  const toggleCheckedShape = useShapeStore((s) => s.toggleCheckedShape)
  const editingShapeId = useShapeStore((s) => s.editingShapeId)
  const selectEditingShape = useShapeStore((s) => s.selectEditingShape)

  const isActive = activeShape === shape.id
  const isChecked = checkedShapes.includes(shape.id)
  const isEditing = combineMode && editingShapeId === shape.id

  const defaults: Record<string, number> = {}
  shape.params.forEach((p) => { defaults[p.key] = p.default })

  const handleClick = () => {
    if (combineMode) {
      if (isChecked) { selectEditingShape(shape.id) }
      else { toggleCheckedShape(shape.id) }
    } else {
      setActiveShape(shape.id, defaults)
    }
  }

  return (
    <div
      onClick={handleClick}
      style={{
        background: isEditing ? '#003262'
          : (isActive && !combineMode) || isChecked ? '#F5F3EE'
          : 'transparent',
        color: isEditing ? '#FFFDF7'
          : (isActive && !combineMode) || isChecked ? '#003262'
          : '#3B7EA1',
      }}
      className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl transition-all duration-200 cursor-pointer hover:opacity-80"
    >
      {combineMode && (
        <input
          type="checkbox"
          checked={isChecked}
          onChange={(e) => { e.stopPropagation(); toggleCheckedShape(shape.id) }}
          className="w-3.5 h-3.5 rounded cursor-pointer shrink-0"
          style={{ accentColor: '#003262' }}
        />
      )}
      <span className="text-base w-6 text-center shrink-0">{shape.icon}</span>
      <div className="flex-1 min-w-0">
        <span className="text-xs font-medium block truncate">{shape.name}</span>
        {isEditing && (
          <span className="text-[10px] font-medium" style={{ color: '#FDB515' }}>Editing</span>
        )}
      </div>
    </div>
  )
}
