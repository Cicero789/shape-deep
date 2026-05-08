import type { ShapeDefinition } from '../../types/shapes'

export const stackedDef: ShapeDefinition = {
  id: 'stacked',
  name: 'Stacked Prisms',
  category: 'combined',
  icon: '⬒',
  params: [
    { key: 'bottomW', label: 'Bottom Width', min: 2, max: 10, step: 0.5, default: 5 },
    { key: 'bottomH', label: 'Bottom Height', min: 1, max: 6, step: 0.5, default: 2 },
    { key: 'topW', label: 'Top Width', min: 1, max: 8, step: 0.5, default: 3 },
    { key: 'topH', label: 'Top Height', min: 1, max: 6, step: 0.5, default: 2 },
    { key: 'depth', label: 'Depth', min: 1, max: 8, step: 0.5, default: 4 },
  ],
  formulas: {
    surfaceArea: {
      expression:
        '2*(bottomW*bottomH + bottomH*depth + depth*bottomW) + 2*(topW*topH + topH*depth + depth*topW) - 2*topW*depth',
      steps: [
        'Surface Area = SA(bottom prism) + SA(top prism) − 2 × shared face',
        'SA = SA(bottom) + SA(top) − 2 × shared face',
        'Bottom SA = 2(w_b×h_b + h_b×d + d×w_b)',
        'Top SA = 2(w_t×h_t + h_t×d + d×w_t)',
        'Shared face = 2 × w_t × d',
        'SA = {result} units²',
      ],
    },
    volume: {
      expression: 'bottomW * bottomH * depth + topW * topH * depth',
      steps: [
        'Volume = bottom prism volume + top prism volume',
        'V = V(bottom) + V(top)',
        'V = w_b×h_b×d + w_t×h_t×d',
        'V = {bottomW}×{bottomH}×{depth} + {topW}×{topH}×{depth}',
        'V = {result} units³',
      ],
    },
  },
}
