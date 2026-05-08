import type { ShapeDefinition } from '../../types/shapes'

export const archDef: ShapeDefinition = {
  id: 'arch',
  name: 'Arch (Semicircle + Rectangle)',
  category: 'combined',
  icon: '⌒',
  params: [
    { key: 'width', label: 'Width', min: 2, max: 10, step: 0.5, default: 4 },
    { key: 'rectHeight', label: 'Wall Height', min: 1, max: 8, step: 0.5, default: 3 },
    { key: 'depth', label: 'Depth', min: 1, max: 8, step: 0.5, default: 3 },
  ],
  formulas: {
    surfaceArea: {
      expression:
        '2*(width*rectHeight + rectHeight*depth + depth*width) - width*rectHeight + pi*(width/2)^2 + pi*(width/2)*depth',
      steps: [
        'Surface Area = SA(walls) − shared + SA(semicircle) + curved side',
        'SA = SA(walls) − shared face + SA(semicircle) + semicircle depth',
        'Wall SA = 2(w×h + h×d + d×w)',
        'Semicircle area = π(w/2)²',
        'SA = {result} units²',
      ],
    },
    volume: {
      expression:
        'width * rectHeight * depth + 0.5 * pi * (width/2)^2 * depth',
      steps: [
        'Volume = rect prism volume + half-cylinder volume',
        'V = V(walls) + V(half-cylinder)',
        'V = w×h×d + ½×π×(w/2)²×d',
        'V = {result} units³',
      ],
    },
  },
}
