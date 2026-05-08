import type { ShapeDefinition } from '../types/shapes'

export const rectangularPrismDef: ShapeDefinition = {
  id: 'rectangular-prism',
  name: 'Rectangular Prism',
  category: '3d-primitive',
  icon: '▯',
  params: [
    { key: 'length', label: 'Length', min: 1, max: 10, step: 0.5, default: 5 },
    { key: 'width', label: 'Width', min: 1, max: 10, step: 0.5, default: 3 },
    { key: 'height', label: 'Height', min: 1, max: 10, step: 0.5, default: 2 },
  ],
  formulas: {
    surfaceArea: {
      expression: '2 * (length * width + width * height + height * length)',
      steps: [
        '3 pairs of faces: front/back, top/bottom, left/right',
        'Front + Back = 2 × (l × h) = 2 × {length} × {height} = {hl}',
        'Top + Bottom = 2 × (l × w) = 2 × {length} × {width} = {lw}',
        'Left + Right = 2 × (w × h) = 2 × {width} × {height} = {wh}',
        'SA = 2(lw + wh + hl) = 2({lw} + {wh} + {hl})',
        'SA = 2({sum}) = {result} units²',
      ],
    },
    volume: {
      expression: 'length * width * height',
      steps: [
        'Volume = length × width × height',
        'V = l × w × h',
        'V = {length} × {width} × {height}',
        'V = {result} units³',
      ],
    },
  },
}
