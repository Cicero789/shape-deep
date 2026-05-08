import type { ShapeDefinition } from '../types/shapes'

export const cubeDef: ShapeDefinition = {
  id: 'cube',
  name: 'Cube',
  category: '3d-primitive',
  icon: '◻',
  params: [
    { key: 'side', label: 'Side length', min: 1, max: 10, step: 0.5, default: 3 },
  ],
  formulas: {
    surfaceArea: {
      expression: '6 * side^2',
      steps: [
        'All 6 faces are identical squares',
        'Area of one face = s × s = s²',
        'Total Surface Area = 6 × s²',
        'SA = 6 × ({side})²',
        'SA = 6 × {side_sq}',
        'SA = {result} units²',
      ],
    },
    volume: {
      expression: 'side^3',
      steps: [
        'Volume = side × side × side = s³',
        'V = ({side})³',
        'V = {result} units³',
      ],
    },
  },
}
