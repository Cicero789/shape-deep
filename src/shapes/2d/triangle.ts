import type { ShapeDefinition } from '../../types/shapes'

export const triangleDef: ShapeDefinition = {
  id: 'triangle',
  name: 'Triangle',
  category: '2d-extruded',
  icon: '△',
  params: [
    { key: 'base', label: 'Side a', min: 1, max: 10, step: 0.5, default: 5 },
    { key: 'sideB', label: 'Side b', min: 1, max: 10, step: 0.5, default: 4 },
    { key: 'sideC', label: 'Side c', min: 1, max: 10, step: 0.5, default: 4 },
  ],
  formulas: {
    perimeter: {
      expression: 'base + sideB + sideC',
      steps: [
        'Perimeter = a + b + c  (sum of all three sides)',
        'P = {base} + {sideB} + {sideC}',
        'P = {result} units',
      ],
    },
    surfaceArea: {
      expression: 'sqrt(((base+sideB+sideC)/2) * ((base+sideB+sideC)/2 - base) * ((base+sideB+sideC)/2 - sideB) * ((base+sideB+sideC)/2 - sideC))',
      steps: [
        'Area uses Heron\'s formula (side-based):',
        's = (a+b+c)/2  (semi-perimeter)',
        'A = √(s(s-a)(s-b)(s-c))',
        's = ({base}+{sideB}+{sideC})/2',
        'A = {result} units²',
      ],
    },
  },
}
