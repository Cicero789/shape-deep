export type ShapeCategory = '3d-primitive' | '2d-extruded' | 'combined'
export type CalcMode = 'surface-area' | 'volume' | 'perimeter'

export interface ParamDef {
  key: string
  label: string
  min: number
  max: number
  step: number
  default: number
}

export interface FormulaDef {
  expression: string
  steps: string[]
}

export interface ShapeDefinition {
  id: string
  name: string
  category: ShapeCategory
  icon: string
  params: ParamDef[]
  formulas: {
    surfaceArea?: FormulaDef
    volume?: FormulaDef
    perimeter?: FormulaDef
  }
}
