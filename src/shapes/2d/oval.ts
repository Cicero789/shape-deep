import type { ShapeDefinition } from '../../types/shapes'

export const ovalDef: ShapeDefinition = {
  id: 'oval',
  name: 'Oval',
  category: '2d-extruded',
  icon: '⬭',
  params: [
    { key: 'radiusX', label: 'Radius X', min: 0.5, max: 5, step: 0.5, default: 3 },
    { key: 'radiusY', label: 'Radius Y', min: 0.5, max: 5, step: 0.5, default: 2 },
  ],
  formulas: {
    perimeter: {
      expression: '2 * pi * sqrt((radiusX^2 + radiusY^2) / 2)',
      steps: [
        'Circumference ≈ 2π × √((rx² + ry²)/2)',
        'C ≈ 2π × √(({radiusX}² + {radiusY}²)/2)',
        'C = {result} units',
      ],
    },
    surfaceArea: {
      expression: 'pi * radiusX * radiusY',
      steps: [
        'Area = π × rx × ry',
        'A = π × {radiusX} × {radiusY}',
        'A = {result} units²',
      ],
    },
  },
}
