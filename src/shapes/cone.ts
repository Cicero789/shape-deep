import type { ShapeDefinition } from '../types/shapes'

export const coneDef: ShapeDefinition = {
  id: 'cone',
  name: 'Cone',
  category: '3d-primitive',
  icon: '▲',
  params: [
    { key: 'radius', label: 'Radius', min: 0.5, max: 5, step: 0.5, default: 2 },
    { key: 'height', label: 'Height', min: 1, max: 10, step: 0.5, default: 4 },
  ],
  formulas: {
    surfaceArea: {
      expression: 'pi * radius * (radius + sqrt(radius^2 + height^2))',
      steps: [
        'Surface Area = π × radius × (radius + √(radius² + height²))',
        'SA = πr(r + √(r² + h²))',
        'SA = π × {radius} × ({radius} + √({radius}² + {height}²))',
        'SA = π × {radius} × ({radius} + √({slant_sq}))',
        'SA = π × {radius} × {r_plus_l}',
        'SA = {result} units²',
      ],
    },
    volume: {
      expression: '(1/3) * pi * radius^2 * height',
      steps: [
        'Volume = ⅓ × π × radius² × height',
        'V = ⅓πr²h',
        'V = ⅓ × π × ({radius})² × {height}',
        'V = ⅓ × π × {r_sq} × {height}',
        'V = {result} units³',
      ],
    },
  },
}
