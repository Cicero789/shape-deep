import type { ShapeDefinition } from '../../types/shapes'

export const houseDef: ShapeDefinition = {
  id: 'house',
  name: 'House (Triangle + Rectangle)',
  category: 'combined',
  icon: '🏠',
  params: [
    { key: 'width', label: 'Width', min: 2, max: 10, step: 0.5, default: 5 },
    { key: 'wallHeight', label: 'Wall Height', min: 1, max: 8, step: 0.5, default: 3 },
    { key: 'roofHeight', label: 'Roof Height', min: 1, max: 6, step: 0.5, default: 2 },
    { key: 'depth', label: 'Depth', min: 1, max: 8, step: 0.5, default: 4 },
  ],
  formulas: {
    surfaceArea: {
      expression:
        '2*(width*wallHeight + wallHeight*depth + depth*width) + width*sqrt((width/2)^2+roofHeight^2)*2 + roofHeight*width - width*wallHeight',
      steps: [
        'Surface Area = SA(walls) + SA(roof faces) − shared face',
        'SA = SA(walls) + SA(roof) − shared',
        'Wall SA = 2(w×h_w + h_w×d + d×w)',
        'Roof faces = 2 × w × √((w/2)² + h_r²)',
        'SA = {result} units²',
      ],
    },
    volume: {
      expression: 'width * wallHeight * depth + 0.5 * width * roofHeight * depth',
      steps: [
        'Volume = rect prism volume + triangular prism volume',
        'V = V(walls) + V(roof prism)',
        'V = w × h_w × d + ½ × w × h_r × d',
        'V = {width}×{wallHeight}×{depth} + ½×{width}×{roofHeight}×{depth}',
        'V = {result} units³',
      ],
    },
  },
}
