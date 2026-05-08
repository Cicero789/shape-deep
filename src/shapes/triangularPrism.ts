import type { ShapeDefinition } from '../types/shapes'

export const triangularPrismDef: ShapeDefinition = {
  id: 'triangular-prism',
  name: 'Triangular Prism',
  category: '3d-primitive',
  icon: '△',
  params: [
    { key: 'sideA', label: 'Side a (base)', min: 1, max: 10, step: 0.5, default: 4 },
    { key: 'sideB', label: 'Side b', min: 1, max: 10, step: 0.5, default: 4 },
    { key: 'sideC', label: 'Side c', min: 1, max: 10, step: 0.5, default: 4 },
    { key: 'depth', label: 'Depth', min: 1, max: 10, step: 0.5, default: 5 },
  ],
  formulas: {
    surfaceArea: {
      expression: '2 * sqrt(((sideA+sideB+sideC)/2) * ((sideA+sideB+sideC)/2 - sideA) * ((sideA+sideB+sideC)/2 - sideB) * ((sideA+sideB+sideC)/2 - sideC)) + (sideA+sideB+sideC) * depth',
      steps: [
        'Surface Area = 2 × base area + perimeter × depth',
        'Step 1: semi-perimeter s = (a+b+c)/2 = ({sideA}+{sideB}+{sideC})/2',
        'Step 2: base area = √(s(s-a)(s-b)(s-c))  [Heron\'s formula]',
        'Step 3: perimeter = a+b+c = {sideA}+{sideB}+{sideC}',
        'Step 4: lateral area = perimeter × depth',
        'Step 5: total SA = 2 × base area + lateral area',
        'SA = {result} units²',
      ],
    },
    volume: {
      expression: 'sqrt(((sideA+sideB+sideC)/2) * ((sideA+sideB+sideC)/2 - sideA) * ((sideA+sideB+sideC)/2 - sideB) * ((sideA+sideB+sideC)/2 - sideC)) * depth',
      steps: [
        'Volume = base area × depth',
        'Step 1: semi-perimeter s = (a+b+c)/2',
        'Step 2: base area = √(s(s-a)(s-b)(s-c))  [Heron\'s formula]',
        'Step 3: V = base area × {depth}',
        'V = {result} units³',
      ],
    },
  },
}
