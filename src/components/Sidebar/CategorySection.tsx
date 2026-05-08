import type { ShapeDefinition, ShapeCategory } from '../../types/shapes'
import ShapeCard from './ShapeCard'

const CATEGORY_LABELS: Record<ShapeCategory, string> = {
  '3d-primitive': '3D Primitives',
  '2d-extruded': '2D Shapes',
  combined: 'Combined Shapes',
}

export default function CategorySection({
  category,
  shapes,
}: {
  category: ShapeCategory
  shapes: ShapeDefinition[]
}) {
  return (
    <div className="space-y-0.5">
      <h3 className="text-[10px] font-semibold uppercase tracking-[0.12em] px-1 mb-1.5" style={{ color: '#FDB515' }}>
        {CATEGORY_LABELS[category]}
      </h3>
      {shapes.map((s) => (
        <ShapeCard key={s.id} shape={s} />
      ))}
    </div>
  )
}
