import type { ShapeDefinition } from '../types/shapes'

export const regularPrismDef: ShapeDefinition = {
  id: 'regular-prism',
  name: 'Regular Prism',
  category: '3d-primitive',
  icon: '⬡',
  params: [
    { key: 'sides', label: 'Base sides', min: 3, max: 8, step: 1, default: 6 },
    { key: 'radius', label: 'Radius', min: 1, max: 5, step: 0.5, default: 2 },
    { key: 'height', label: 'Height', min: 1, max: 10, step: 0.5, default: 4 },
  ],
  formulas: {
    surfaceArea: {
      expression: 'sides * radius^2 * sin(2 * pi / sides) + sides * 2 * radius * sin(pi / sides) * height',
      steps: [
        'Surface Area = 2 × base area + lateral area',
        'Base: regular {sides}-gon, each side = 2r × sin(π/n)',
        'Base area = (n/2) × r² × sin(2π/n)',
        'Lateral area = n × side × height = perimeter × h',
        'SA = 2 × base + lateral',
        'SA = {result} units²',
      ],
    },
    volume: {
      expression: '(sides / 2) * radius^2 * sin(2 * pi / sides) * height',
      steps: [
        'Volume = base area × height',
        'Base area = (n/2) × r² × sin(2π/n)',
        'V = (n/2) × r² × sin(2π/n) × h',
        'V = {result} units³',
      ],
    },
  },
}
