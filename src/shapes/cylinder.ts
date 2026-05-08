import type { ShapeDefinition } from '../types/shapes'

export const cylinderDef: ShapeDefinition = {
  id: 'cylinder',
  name: 'Cylinder',
  category: '3d-primitive',
  icon: '⬤',
  params: [
    { key: 'radius', label: 'Radius', min: 0.5, max: 5, step: 0.5, default: 2 },
    { key: 'height', label: 'Height', min: 1, max: 10, step: 0.5, default: 4 },
  ],
  formulas: {
    surfaceArea: {
      expression: '2 * pi * radius * radius + 2 * pi * radius * height',
      steps: [
        'Surface Area = 2 × base circles + curved side',
        'Two circular bases: 2 × πr² = 2π × ({radius})²',
        'Curved side (unrolled): 2πr × h = 2π × {radius} × {height}',
        'SA = 2πr² + 2πrh',
        'SA = {result} units²',
      ],
    },
    volume: {
      expression: 'pi * radius^2 * height',
      steps: [
        'Volume = base area × height',
        'Base area = π × r² = π × ({radius})²',
        'V = πr² × h',
        'V = π × {r_sq} × {height}',
        'V = {result} units³',
      ],
    },
  },
}
