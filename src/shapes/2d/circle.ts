import type { ShapeDefinition } from '../../types/shapes'

export const circleDef: ShapeDefinition = {
  id: 'circle',
  name: 'Circle',
  category: '2d-extruded',
  icon: '○',
  params: [
    { key: 'radius', label: 'Radius', min: 0.5, max: 5, step: 0.5, default: 2.5 },
  ],
  formulas: {
    perimeter: {
      expression: '2 * pi * radius',
      steps: [
        'Circumference = 2 × π × r',
        'C = 2πr',
        'C = 2π × {radius}',
        'C = {result} units',
      ],
    },
    surfaceArea: {
      expression: 'pi * radius^2',
      steps: [
        'Area = π × r²',
        'A = πr²',
        'A = π × ({radius})²',
        'A = π × {r_sq}',
        'A = {result} units²',
      ],
    },
  },
}
