import type { ShapeDefinition } from '../../types/shapes'

export const trapezoidDef: ShapeDefinition = {
  id: 'trapezoid',
  name: 'Trapezoid',
  category: '2d-extruded',
  icon: '⏢',
  params: [
    { key: 'base1', label: 'Base 1 (top)', min: 1, max: 10, step: 0.5, default: 6 },
    { key: 'base2', label: 'Base 2 (bottom)', min: 1, max: 10, step: 0.5, default: 4 },
    { key: 'height', label: 'Height', min: 1, max: 8, step: 0.5, default: 3 },
  ],
  formulas: {
    perimeter: {
      expression: 'base1 + base2 + 2 * sqrt(((base1 - base2)/2)^2 + height^2)',
      steps: [
        'Perimeter = b₁ + b₂ + 2 × slant side',
        'Slant = √(((b₁-b₂)/2)² + h²)',
        'P = {base1} + {base2} + 2 × slant',
        'P = {result} units',
      ],
    },
    surfaceArea: {
      expression: '((base1 + base2) / 2) * height',
      steps: [
        'Area = average of bases × height',
        'A = (b₁ + b₂)/2 × h',
        'A = (({base1} + {base2})/2) × {height}',
        'A = {result} units²',
      ],
    },
  },
}
