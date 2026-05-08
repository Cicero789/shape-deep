import type { ShapeDefinition } from '../../types/shapes'

export const kiteDef: ShapeDefinition = {
  id: 'kite',
  name: 'Kite',
  category: '2d-extruded',
  icon: '⧖',
  params: [
    { key: 'diag1', label: 'Diagonal 1', min: 1, max: 10, step: 0.5, default: 6 },
    { key: 'diag2', label: 'Diagonal 2', min: 1, max: 8, step: 0.5, default: 4 },
    { key: 'topRatio', label: 'Top ratio', min: 0.2, max: 0.8, step: 0.1, default: 0.4 },
  ],
  formulas: {
    perimeter: {
      expression: '2 * sqrt((diag1*topRatio)^2 + (diag2/2)^2) + 2 * sqrt((diag1*(1-topRatio))^2 + (diag2/2)^2)',
      steps: [
        'Perimeter = 2 × sideA + 2 × sideB',
        'sideA = √((d1×r)² + (d2/2)²)',
        'sideB = √((d1×(1-r))² + (d2/2)²)',
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
