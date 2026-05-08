import type { ShapeDefinition } from '../types/shapes'

export const pyramidDef: ShapeDefinition = {
  id: 'pyramid',
  name: 'Square Pyramid',
  category: '3d-primitive',
  icon: '◺',
  params: [
    { key: 'base', label: 'Base side', min: 1, max: 10, step: 0.5, default: 3 },
    { key: 'height', label: 'Height', min: 1, max: 10, step: 0.5, default: 4 },
  ],
  formulas: {
    surfaceArea: {
      expression: 'base^2 + 2 * base * sqrt((base/2)^2 + height^2)',
      steps: [
        'Surface Area = base area + 4 triangular faces',
        'Base (square): b² = ({base})² = {b_sq}',
        'Slant height = √((b/2)² + h²)',
        'Slant = √(({base}/2)² + {height}²)',
        'Each triangular face = ½ × b × slant',
        '4 faces = 2 × b × slant',
        'SA = b² + 2b × slant = {result} units²',
      ],
    },
    volume: {
      expression: '(1/3) * base^2 * height',
      steps: [
        'Volume = ⅓ × base area × height',
        'Base area = b² = ({base})² = {b_sq}',
        'V = ⅓ × {b_sq} × {height}',
        'V = {result} units³',
      ],
    },
  },
}
