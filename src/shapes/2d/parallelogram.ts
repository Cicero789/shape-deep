import type { ShapeDefinition } from '../../types/shapes'

export const parallelogramDef: ShapeDefinition = {
  id: 'parallelogram',
  name: 'Parallelogram',
  category: '2d-extruded',
  icon: '▱',
  params: [
    { key: 'base', label: 'Base', min: 1, max: 10, step: 0.5, default: 5 },
    { key: 'height', label: 'Height', min: 1, max: 8, step: 0.5, default: 3 },
    { key: 'side', label: 'Side length', min: 1, max: 8, step: 0.5, default: 3.5 },
    { key: 'skew', label: 'Skew offset', min: 0.5, max: 3, step: 0.25, default: 1.5 },
  ],
  formulas: {
    perimeter: {
      expression: '2 * (base + side)',
      steps: [
        'Perimeter = 2 × (base + side)',
        'P = 2(b + s)',
        'P = 2({base} + {side})',
        'P = {result} units',
      ],
    },
    surfaceArea: {
      expression: 'base * height',
      steps: [
        'Area = base × height  (height is perpendicular, not side length)',
        'A = b × h',
        'A = {base} × {height}',
        'A = {result} units²',
      ],
    },
  },
}
