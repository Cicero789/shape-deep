import type { ShapeDefinition } from '../types/shapes'

export const sphereDef: ShapeDefinition = {
  id: 'sphere',
  name: 'Sphere',
  category: '3d-primitive',
  icon: '●',
  params: [
    { key: 'radius', label: 'Radius', min: 0.5, max: 5, step: 0.5, default: 2 },
  ],
  formulas: {
    surfaceArea: {
      expression: '4 * pi * radius^2',
      steps: [
        'Surface Area = 4 × π × r²',
        'SA = 4π × ({radius})²',
        'SA = 4π × {r_sq}',
        'SA = {result} units²',
      ],
    },
    volume: {
      expression: '(4/3) * pi * radius^3',
      steps: [
        'Volume = ⁴⁄₃ × π × r³',
        'V = ⁴⁄₃ × π × ({radius})³',
        'V = ⁴⁄₃ × π × {r_cu}',
        'V = {result} units³',
      ],
    },
  },
}
