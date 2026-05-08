export { rectDef } from './extruded/rectangle'
export { cubeDef } from './cube'
export { rectangularPrismDef } from './rectangularPrism'
export { triangularPrismDef } from './triangularPrism'
export { cylinderDef } from './cylinder'
export { coneDef } from './cone'
export { pyramidDef } from './pyramid'
export { sphereDef } from './sphere'
export { regularPrismDef } from './regularPrism'
export { squareDef } from './2d/square'
export { parallelogramDef } from './2d/parallelogram'
export { trapezoidDef } from './2d/trapezoid'
export { triangleDef } from './2d/triangle'
export { circleDef } from './2d/circle'
export { ovalDef } from './2d/oval'
export { rhombusDef } from './2d/rhombus'
export { kiteDef } from './2d/kite'
export { houseDef } from './combined/house'
export { archDef } from './combined/arch'
export { stackedDef } from './combined/stacked'

import type { ShapeDefinition } from '../types/shapes'
import { cubeDef } from './cube'
import { rectangularPrismDef } from './rectangularPrism'
import { triangularPrismDef } from './triangularPrism'
import { cylinderDef } from './cylinder'
import { coneDef } from './cone'
import { pyramidDef } from './pyramid'
import { sphereDef } from './sphere'
import { regularPrismDef } from './regularPrism'
import { rectDef } from './extruded/rectangle'
import { squareDef } from './2d/square'
import { parallelogramDef } from './2d/parallelogram'
import { trapezoidDef } from './2d/trapezoid'
import { triangleDef } from './2d/triangle'
import { circleDef } from './2d/circle'
import { ovalDef } from './2d/oval'
import { rhombusDef } from './2d/rhombus'
import { kiteDef } from './2d/kite'
import { houseDef } from './combined/house'
import { archDef } from './combined/arch'
import { stackedDef } from './combined/stacked'

export const allShapes: ShapeDefinition[] = [
  cubeDef,
  rectangularPrismDef,
  triangularPrismDef,
  regularPrismDef,
  cylinderDef,
  coneDef,
  pyramidDef,
  sphereDef,
  rectDef,
  squareDef,
  parallelogramDef,
  trapezoidDef,
  triangleDef,
  circleDef,
  ovalDef,
  rhombusDef,
  kiteDef,
  houseDef,
  archDef,
  stackedDef,
]

export function getShape(id: string): ShapeDefinition | undefined {
  return allShapes.find((s) => s.id === id)
}
