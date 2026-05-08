import type { ShapeDefinition } from '../../types/shapes'

export const rhombusDef: ShapeDefinition = {
  id: 'rhombus',
  name: 'Rhombus',
  category: '2d-extruded',
  icon: '◇',
  params: [
    { key: 'diag1', label: 'Diagonal 1', min: 1, max: 10, step: 0.5, default: 6 },
    { key: 'diag2', label: 'Diagonal 2', min: 1, max: 8, step: 0.5, default: 4 },
  ],
  formulas: {
    perimeter: {
      expression: '4 * sqrt((diag1/2)^2 + (diag2/2)^2)',
      steps: [
        'Perimeter = 4 × side',
        'side = √((d1/2)² + (d2/2)²)',
        'side = √(({diag1}/2)² + ({diag2}/2)²)',
        'P = 4 × side',
        'P = {result} units',
      ],
    },
    surfaceArea: {
      expression: '(diag1 * diag2) / 2',
      steps: [
        'Area = (d1 × d2) / 2',
        'A = ({diag1} × {diag2}) / 2',
        'A = {result} units²',
      ],
    },
  },
}
