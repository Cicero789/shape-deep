import type { ShapeDefinition } from '../../types/shapes'

export const rectDef: ShapeDefinition = {
  id: 'rectangle',
  name: 'Rectangle',
  category: '2d-extruded',
  icon: '▬',
  params: [
    { key: 'width', label: 'Width', min: 1, max: 10, step: 0.5, default: 5 },
    { key: 'height', label: 'Height', min: 1, max: 10, step: 0.5, default: 3 },
  ],
  formulas: {
    perimeter: {
      expression: '2 * (width + height)',
      steps: [
        'Perimeter = 2 × (width + height)',
        'P = 2(w + h)',
        'P = 2({width} + {height})',
        'P = 2({w_plus_h})',
        'P = {result} units',
      ],
    },
    surfaceArea: {
      expression: 'width * height',
      steps: [
        'Area = width × height',
        'A = w × h',
        'A = {width} × {height}',
        'A = {result} units²',
      ],
    },
  },
}
