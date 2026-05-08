import type { ShapeDefinition } from '../../types/shapes'

export const squareDef: ShapeDefinition = {
  id: 'square',
  name: 'Square',
  category: '2d-extruded',
  icon: '□',
  params: [
    { key: 'side', label: 'Side length', min: 1, max: 10, step: 0.5, default: 4 },
  ],
  formulas: {
    perimeter: {
      expression: '4 * side',
      steps: [
        'Perimeter = 4 × side',
        'P = 4s',
        'P = 4 × {side}',
        'P = {result} units',
      ],
    },
    surfaceArea: {
      expression: 'side^2',
      steps: [
        'Area = side × side = s²',
        'A = ({side})²',
        'A = {result} units²',
      ],
    },
  },
}
