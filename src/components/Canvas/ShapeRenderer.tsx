import { useMemo } from 'react'
import * as THREE from 'three'
import { Edges, Text } from '@react-three/drei'
import { useShapeStore } from '../../store/useShapeStore'
import type { AttachFace } from '../../store/useShapeStore'
import { SHAPE_COLORS, COLORS } from '../../lib/colors'

interface LabelDef {
  pos: [number, number, number]
  text: string
  fontSize?: number
  color?: string
}

function fmtVal(val: number): string {
  return Number.isInteger(val) ? val.toString() : val.toFixed(1)
}

function faceLabel(label: string, val: number, pos: [number, number, number], fontSize = 0.42): LabelDef {
  return { pos, text: `${label} = ${fmtVal(val)}`, fontSize, color: COLORS.labelArea }
}

function volLabel(val: number, pos: [number, number, number], fontSize = 0.44): LabelDef {
  return { pos, text: `Vol = ${fmtVal(val)}`, fontSize, color: COLORS.labelVolume }
}

/** Compute triangle vertices from 3 side lengths, centered at origin */
function triangleVerts(a: number, b: number, c: number): [number, number][] {
  const cosA = (b * b + a * a - c * c) / (2 * b * a)
  const sinA = Math.sqrt(Math.max(0, 1 - cosA * cosA))
  const pts: [number, number][] = [
    [-a / 2, 0],
    [a / 2, 0],
    [-a / 2 + b * cosA, b * sinA],
  ]
  const cy = (pts[0][1] + pts[1][1] + pts[2][1]) / 3
  return pts.map(([x, y]) => [x, y - cy] as [number, number])
}

function getFaceLabels(id: string, d: Record<string, number>): LabelDef[] {
  const labels: LabelDef[] = []
  const off = 0.5
  switch (id) {
    case 'cube': {
      const s = d.side ?? 3
      labels.push(faceLabel('Area', s * s, [0, s / 2 + off, 0]))
      break
    }
    case 'rectangular-prism': {
      const l = d.length ?? 5; const h = d.height ?? 2; const w = d.width ?? 3
      labels.push(
        faceLabel('Area', l * w, [0, h / 2 + off, 0]),
        faceLabel('Area', l * h, [0, 0, w / 2 + off]),
        faceLabel('Area', w * h, [l / 2 + off, 0, 0]),
      )
      break
    }
    case 'regular-prism': {
      const n = d.sides ?? 6; const r = d.radius ?? 2
      labels.push(
        faceLabel('Area', (n / 2) * r * r * Math.sin(2 * Math.PI / n), [0, (d.height ?? 4) / 2 + off, 0]),
      )
      break
    }
    case 'cylinder': {
      const r = d.radius ?? 2
      labels.push(
        faceLabel('Area', Math.PI * r * r, [0, (d.height ?? 4) / 2 + off, 0]),
      )
      break
    }
    case 'pyramid': {
      const b = d.base ?? 3
      labels.push(faceLabel('Area', b * b, [0, -(d.height ?? 4) / 2 - off, 0]))
      break
    }
    case 'cone': {
      break
    }
    case 'sphere': {
      const r = d.radius ?? 2
      labels.push(faceLabel('Surface', 4 * Math.PI * r * r, [0, r + 0.35, 0]))
      break
    }
    case 'rectangle': {
      const w = d.width ?? 5; const h = d.height ?? 3
      labels.push(faceLabel('Area', w * h, [0, 0, 0.25]))
      break
    }
    case 'square': {
      const s = d.side ?? 4
      labels.push(faceLabel('Area', s * s, [0, 0, 0.25]))
      break
    }
    case 'parallelogram': {
      const b = d.base ?? 5; const h = d.height ?? 3
      labels.push(faceLabel('Area', b * h, [0, 0, 0.25]))
      break
    }
    case 'trapezoid': {
      const b1 = d.base1 ?? 6; const b2 = d.base2 ?? 4; const h = d.height ?? 3
      labels.push(faceLabel('Area', ((b1 + b2) / 2) * h, [0, 0, 0.25]))
      break
    }
    case 'triangle': {
      const a = d.base ?? 5; const bd = d.sideB ?? 4; const c = d.sideC ?? 4
      const s = (a + bd + c) / 2
      const area = Math.sqrt(Math.max(0, s * (s - a) * (s - bd) * (s - c)))
      labels.push(faceLabel('Area', area, [0, 0, 0.25]))
      break
    }
    case 'circle': {
      const r = d.radius ?? 2.5
      labels.push(faceLabel('Area', Math.PI * r * r, [0, 0, 0.25]))
      break
    }
    case 'oval': {
      const rx = d.radiusX ?? 3; const ry = d.radiusY ?? 2
      labels.push(faceLabel('Area', Math.PI * rx * ry, [0, 0, 0.25]))
      break
    }
    case 'rhombus': {
      const d1 = d.diag1 ?? 6; const d2 = d.diag2 ?? 4
      labels.push(faceLabel('Area', (d1 * d2) / 2, [0, 0, 0.25]))
      break
    }
    case 'kite': {
      const d1 = d.diag1 ?? 6; const d2 = d.diag2 ?? 4
      labels.push(faceLabel('Area', (d1 * d2) / 2, [0, 0, 0.25]))
      break
    }
  }
  return labels
}

function dimLabel(name: string, val: number, pos: [number, number, number], fontSize = 0.38): LabelDef {
  return { pos, text: `${name} = ${fmtVal(val)}`, fontSize, color: COLORS.labelDim }
}

function getEdgeLabels(id: string, d: Record<string, number>): LabelDef[] {
  const labels: LabelDef[] = []
  const off = 0.6
  switch (id) {
    case 'cube': {
      const s = d.side ?? 3
      labels.push(dimLabel('side', s, [s / 2 + off, s / 2, 0]))
      break
    }
    case 'rectangular-prism': {
      const l = d.length ?? 5; const h = d.height ?? 2; const w = d.width ?? 3
      labels.push(
        dimLabel('length', l, [0, -h / 2 - off, w / 2]),
        dimLabel('width', w, [l / 2, -h / 2 - off, 0], 0.3),
        dimLabel('height', h, [l / 2 + off, 0, w / 2]),
      )
      break
    }
    case 'triangular-prism': {
      const a = d.sideA ?? 4; const b = d.sideB ?? 4; const c = d.sideC ?? 4; const dp = d.depth ?? 5
      const verts = triangleVerts(a, b, c)
      labels.push(
        dimLabel('a', a, [0, verts[0][1] - off, dp / 2], 0.30),
        dimLabel('b', b, [(verts[0][0] + verts[2][0]) / 2 - 0.45, (verts[0][1] + verts[2][1]) / 2, dp / 2], 0.28),
        dimLabel('c', c, [(verts[1][0] + verts[2][0]) / 2 + 0.45, (verts[1][1] + verts[2][1]) / 2, dp / 2], 0.28),
        dimLabel('depth', dp, [verts[1][0] + off, verts[0][1], 0], 0.30),
      )
      break
    }
    case 'regular-prism': {
      const n = d.sides ?? 6; const r = d.radius ?? 2; const h = d.height ?? 4
      const sideLen = 2 * r * Math.sin(Math.PI / n)
      labels.push(
        dimLabel('radius', r, [r + off, 0, 0]),
        dimLabel('height', h, [r + off, r * 0.5, h / 2]),
        dimLabel('side', sideLen, [r * Math.cos(Math.PI / n), -(r + off), h / 2], 0.28),
      )
      break
    }
    case 'cylinder': {
      const r = d.radius ?? 2; const h = d.height ?? 4
      labels.push(
        dimLabel('radius', r, [r + off, -h / 2, 0]),
        dimLabel('height', h, [r + off, 0, 0]),
      )
      break
    }
    case 'cone': {
      const r = d.radius ?? 2; const h = d.height ?? 4
      labels.push(
        dimLabel('radius', r, [r + off, -h / 2, 0]),
        dimLabel('height', h, [r + off, 0, 0]),
      )
      break
    }
    case 'pyramid': {
      const b = d.base ?? 3; const h = d.height ?? 4
      labels.push(
        dimLabel('base', b, [b / 2 + off, -h / 2, b / 2]),
        dimLabel('height', h, [b / 2 + off, 0, 0]),
      )
      break
    }
    case 'sphere': {
      const r = d.radius ?? 2
      labels.push(dimLabel('radius', r, [r + off, 0, 0]))
      break
    }
    case 'rectangle': {
      const w = d.width ?? 5; const h = d.height ?? 3
      labels.push(
        dimLabel('width', w, [0, -h / 2 - off, 0]),
        dimLabel('height', h, [-w / 2 - off, 0, 0]),
      )
      break
    }
    case 'square': {
      const s = d.side ?? 4
      labels.push(dimLabel('side', s, [s / 2 + off, 0, 0]))
      break
    }
    case 'parallelogram': {
      const b = d.base ?? 5; const s = d.side ?? 3.5
      labels.push(
        dimLabel('base', b, [0, -0.45, 0]),
        dimLabel('side', s, [b / 2 + 0.45, 0.45, 0], 0.28),
      )
      break
    }
    case 'trapezoid': {
      const b1 = d.base1 ?? 6; const b2 = d.base2 ?? 4; const h = d.height ?? 3
      labels.push(
        dimLabel('base₁', b1, [0, h / 2 + off, 0]),
        dimLabel('base₂', b2, [0, -h / 2 - off, 0]),
        dimLabel('height', h, [b1 / 2 + off, 0, 0]),
      )
      break
    }
    case 'triangle': {
      const a = d.base ?? 5; const b = d.sideB ?? 4; const c = d.sideC ?? 4
      const verts = triangleVerts(a, b, c)
      // label each side near its midpoint
      labels.push(
        dimLabel('a', a, [0, verts[0][1] - 0.25, 0], 0.30),
        dimLabel('b', b, [(verts[0][0] + verts[2][0]) / 2 - 0.45, (verts[0][1] + verts[2][1]) / 2, 0], 0.28),
        dimLabel('c', c, [(verts[1][0] + verts[2][0]) / 2 + 0.45, (verts[1][1] + verts[2][1]) / 2, 0], 0.28),
      )
      break
    }
    case 'circle': {
      const r = d.radius ?? 2.5
      labels.push(
        dimLabel('radius', r, [r + off, 0, 0]),
      )
      break
    }
    case 'oval': {
      const rx = d.radiusX ?? 3; const ry = d.radiusY ?? 2
      labels.push(
        dimLabel('rx', rx, [rx + off, 0, 0]),
        dimLabel('ry', ry, [0, ry + off, 0]),
      )
      break
    }
    case 'rhombus': {
      const d1 = d.diag1 ?? 6
      labels.push(
        dimLabel('d1', d1, [0, d1 / 2 + off, 0]),
        dimLabel('d2', d.diag2 ?? 4, [d1 / 2 + off, 0, 0]),
      )
      break
    }
    case 'kite': {
      const d1 = d.diag1 ?? 6; const d2 = d.diag2 ?? 4
      labels.push(
        dimLabel('d1', d1, [0, d1 / 2 + off, 0]),
        dimLabel('d2', d2, [d2 / 2 + off, 0, 0]),
      )
      break
    }
    case 'house': {
      const w = d.width ?? 5; const wh = d.wallHeight ?? 3; const rh = d.roofHeight ?? 2; const dp = d.depth ?? 4
      labels.push(
        dimLabel('width', w, [0, -wh / 2 - off, dp / 2]),
        dimLabel('wall h', wh, [w / 2 + off, 0, dp / 2]),
        dimLabel('roof h', rh, [w / 2 + off, wh / 2 + rh / 2, dp / 2], 0.28),
        dimLabel('depth', dp, [0, -wh / 2 - off, 0]),
      )
      break
    }
  }
  return labels
}

function getVolumeLabels(id: string, d: Record<string, number>): LabelDef[] {
  const labels: LabelDef[] = []
  switch (id) {
    case 'cube': {
      const s = d.side ?? 3
      labels.push(volLabel(s * s * s, [0, 0, 0]))
      break
    }
    case 'rectangular-prism': {
      const l = d.length ?? 5; const w = d.width ?? 3; const h = d.height ?? 2
      labels.push(volLabel(l * w * h, [0, 0, 0]))
      break
    }
    case 'triangular-prism': {
      const a = d.sideA ?? 4; const b = d.sideB ?? 4; const c = d.sideC ?? 4; const dp = d.depth ?? 5
      const s = (a + b + c) / 2
      const area = Math.sqrt(Math.max(0, s * (s - a) * (s - b) * (s - c)))
      labels.push(volLabel(area * dp, [0, 0, 0]))
      break
    }
    case 'regular-prism': {
      const n = d.sides ?? 6; const r = d.radius ?? 2; const h = d.height ?? 4
      const area = (n / 2) * r * r * Math.sin(2 * Math.PI / n)
      labels.push(volLabel(area * h, [0, 0, 0]))
      break
    }
    case 'cylinder': {
      const r = d.radius ?? 2; const h = d.height ?? 4
      labels.push(volLabel(Math.PI * r * r * h, [0, 0, 0]))
      break
    }
    case 'cone': {
      const r = d.radius ?? 2; const h = d.height ?? 4
      labels.push(volLabel((1 / 3) * Math.PI * r * r * h, [0, h * 0.15, 0]))
      break
    }
    case 'pyramid': {
      const b = d.base ?? 3; const h = d.height ?? 4
      labels.push(volLabel((1 / 3) * b * b * h, [0, 0, 0]))
      break
    }
    case 'sphere': {
      const r = d.radius ?? 2
      labels.push(volLabel((4 / 3) * Math.PI * r * r * r, [0, 0, 0]))
      break
    }
    case 'house': {
      const w = d.width ?? 5; const wh = d.wallHeight ?? 3; const rh = d.roofHeight ?? 2; const dp = d.depth ?? 4
      labels.push(volLabel(w * wh * dp + 0.5 * w * rh * dp, [0, 0, 0]))
      break
    }
    case 'arch': {
      const w = d.width ?? 4; const rh = d.rectHeight ?? 3; const dp = d.depth ?? 3
      labels.push(volLabel(w * rh * dp + 0.5 * Math.PI * (w / 2) * (w / 2) * dp, [0, 0, 0]))
      break
    }
    case 'stacked': {
      const bw = d.bottomW ?? 5; const bh = d.bottomH ?? 2; const tw = d.topW ?? 3; const th = d.topH ?? 2; const dp = d.depth ?? 4
      labels.push(volLabel(bw * bh * dp + tw * th * dp, [0, 0, 0]))
      break
    }
  }
  return labels
}

function getShapeHeight(id: string, d: Record<string, number>): number {
  switch (id) {
    case 'cube': return d.side ?? 3
    case 'rectangular-prism': return d.height ?? 2
    case 'triangular-prism': {
      const verts = triangleVerts(d.sideA ?? 4, d.sideB ?? 4, d.sideC ?? 4)
      return verts[2][1] - verts[0][1]
    }
    case 'cylinder': return d.height ?? 4
    case 'cone': return d.height ?? 4
    case 'pyramid': return d.height ?? 4
    case 'sphere': return (d.radius ?? 2) * 2
    case 'regular-prism': return d.height ?? 4
    case 'rectangle': return d.height ?? 3
    case 'square': return d.side ?? 4
    case 'parallelogram': return d.height ?? 3
    case 'trapezoid': return d.height ?? 3
    case 'triangle': {
      const verts = triangleVerts(d.base ?? 5, d.sideB ?? 4, d.sideC ?? 4)
      return verts[2][1] - verts[0][1]
    }
    case 'circle': return (d.radius ?? 2.5) * 2
    case 'oval': return (d.radiusY ?? 2) * 2
    case 'rhombus': return d.diag1 ?? 6
    case 'kite': return d.diag1 ?? 6
    case 'house': return (d.wallHeight ?? 3) + (d.roofHeight ?? 2)
    case 'arch': return (d.rectHeight ?? 3) + (d.width ?? 4) / 2
    case 'stacked': return (d.bottomH ?? 2) + (d.topH ?? 2)
    default: return 3
  }
}

function getShapeDepth(id: string, d: Record<string, number>): number {
  switch (id) {
    case 'cube': return d.side ?? 3
    case 'rectangular-prism': return d.width ?? 3
    case 'triangular-prism': return d.depth ?? 5
    case 'cylinder': return (d.radius ?? 2) * 2
    case 'cone': return (d.radius ?? 2) * 2
    case 'pyramid': return d.base ?? 3
    case 'sphere': return (d.radius ?? 2) * 2
    case 'regular-prism': return (d.radius ?? 2) * 2
    case 'rectangle': return 0
    case 'square': return 0
    case 'parallelogram': return 0
    case 'trapezoid': return 0
    case 'triangle': return 0
    case 'circle': return 0
    case 'oval': return 0
    case 'rhombus': return 0
    case 'kite': return 0
    case 'house': return d.depth ?? 4
    case 'arch': return d.depth ?? 3
    case 'stacked': return d.depth ?? 4
    default: return 3
  }
}

function getShapeWidth(id: string, d: Record<string, number>): number {
  switch (id) {
    case 'cube': return d.side ?? 3
    case 'rectangular-prism': return d.length ?? 5
    case 'triangular-prism': return d.sideA ?? 4
    case 'cylinder': return (d.radius ?? 2) * 2
    case 'cone': return (d.radius ?? 2) * 2
    case 'pyramid': return d.base ?? 3
    case 'sphere': return (d.radius ?? 2) * 2
    case 'regular-prism': return (d.radius ?? 2) * 2
    case 'rectangle': return d.width ?? 5
    case 'square': return d.side ?? 4
    case 'parallelogram': return (d.base ?? 5) + (d.skew ?? 1.5)
    case 'trapezoid': return Math.max(d.base1 ?? 6, d.base2 ?? 4)
    case 'triangle': return d.base ?? 5
    case 'circle': return (d.radius ?? 2.5) * 2
    case 'oval': return (d.radiusX ?? 3) * 2
    case 'rhombus': return d.diag2 ?? 4
    case 'kite': return d.diag2 ?? 4
    case 'house': return d.width ?? 5
    case 'arch': return d.width ?? 4
    case 'stacked': return Math.max(d.bottomW ?? 5, d.topW ?? 3)
    default: return 3
  }
}

const FACE_OFFSETS: Record<AttachFace, (w: number, h: number, d: number) => [number, number, number]> = {
  top:    (_w, h, _d) => [0, h / 2, 0],
  bottom: (_w, h, _d) => [0, -h / 2, 0],
  right:  (w, _h, _d) => [w / 2, 0, 0],
  left:   (w, _h, _d) => [-w / 2, 0, 0],
  front:  (_w, _h, d) => [0, 0, d / 2],
  back:   (_w, _h, d) => [0, 0, -d / 2],
}

function getOpposite(face: AttachFace): AttachFace {
  const map: Record<AttachFace, AttachFace> = {
    top: 'bottom', bottom: 'top', left: 'right', right: 'left', front: 'back', back: 'front',
  }
  return map[face]
}

function computeCombinedLayout(
  shapeIds: string[],
  attachments: Record<string, AttachFace>,
  dimMap: Record<string, Record<string, number>>,
  dimensions: Record<string, number>,
) {
  if (shapeIds.length === 0) return []
  if (shapeIds.length === 1) {
    const id = shapeIds[0]
    const d = dimMap[id] ?? dimensions
    return [{ id, dims: d, position: [0, 0, 0] as [number, number, number] }]
  }

  const positions = new Map<string, [number, number, number]>()
  const first = shapeIds[0]
  positions.set(first, [0, 0, 0])

  for (let i = 1; i < shapeIds.length; i++) {
    const shapeId = shapeIds[i]
    const prevId = shapeIds[i - 1]
    const prevPos = positions.get(prevId) ?? [0, 0, 0]
    const prevDims = dimMap[prevId] ?? dimensions
    const myDims = dimMap[shapeId] ?? dimensions
    const pw = getShapeWidth(prevId, prevDims)
    const ph = getShapeHeight(prevId, prevDims)
    const pd = getShapeDepth(prevId, prevDims)
    const mw = getShapeWidth(shapeId, myDims)
    const mh = getShapeHeight(shapeId, myDims)
    const md = getShapeDepth(shapeId, myDims)

    const attachFace = attachments[shapeId] ?? 'top'
    const [tx, ty, tz] = FACE_OFFSETS[attachFace](pw, ph, pd)
    const targetCenter: [number, number, number] = [
      prevPos[0] + tx,
      prevPos[1] + ty,
      prevPos[2] + tz,
    ]

    const myOppositeFace = getOpposite(attachFace)
    const [ox, oy, oz] = FACE_OFFSETS[myOppositeFace](mw, mh, md)
    const myCenter: [number, number, number] = [
      targetCenter[0] - ox,
      targetCenter[1] - oy,
      targetCenter[2] - oz,
    ]
    positions.set(shapeId, myCenter)
  }

  return shapeIds.map((id) => {
    const d = dimMap[id] ?? dimensions
    return { id, dims: d, position: positions.get(id) ?? [0, 0, 0] as [number, number, number] }
  })
}

function SingleShape({
  id,
  dims,
  color,
  position,
}: {
  id: string
  dims: Record<string, number>
  color: string
  position: [number, number, number]
}) {
  const showLabels = useShapeStore((s) => s.showLabels)
  const edgeLs = useMemo(() => getEdgeLabels(id, dims), [id, dims])
  const faceLs = useMemo(() => getFaceLabels(id, dims), [id, dims])
  const volLs = useMemo(() => getVolumeLabels(id, dims), [id, dims])

  const shapeEl = useMemo(() => {
    const mat = <meshPhongMaterial color={color} transparent opacity={0.35} side={THREE.DoubleSide} />
    const edge = <Edges color={COLORS.edge} linewidth={1.5} />
    switch (id) {
      case 'cube': { const s = dims.side ?? 3; return <mesh><boxGeometry args={[s, s, s]} />{mat}{edge}</mesh> }
      case 'rectangular-prism': {
        const l = dims.length ?? 5; const h = dims.height ?? 2; const w = dims.width ?? 3
        return <mesh><boxGeometry args={[l, h, w]} />{mat}{edge}</mesh>
      }
      case 'triangular-prism': {
        const a = dims.sideA ?? 4; const b = dims.sideB ?? 4; const c = dims.sideC ?? 4; const d = dims.depth ?? 5
        const verts = triangleVerts(a, b, c)
        const shape = new THREE.Shape()
        shape.moveTo(verts[0][0], verts[0][1])
        shape.lineTo(verts[1][0], verts[1][1])
        shape.lineTo(verts[2][0], verts[2][1])
        shape.closePath()
        const geom = new THREE.ExtrudeGeometry(shape, { depth: d, bevelEnabled: false })
        geom.translate(0, 0, -d / 2)
        return <mesh geometry={geom}>{mat}{edge}</mesh>
      }
      case 'cylinder': { const r = dims.radius ?? 2; const h = dims.height ?? 4; return <mesh><cylinderGeometry args={[r, r, h, 48]} />{mat}{edge}</mesh> }
      case 'cone': { const r = dims.radius ?? 2; const h = dims.height ?? 4; return <mesh><coneGeometry args={[r, h, 48]} />{mat}{edge}</mesh> }
      case 'pyramid': { const b = dims.base ?? 3; const h = dims.height ?? 4; return <mesh><coneGeometry args={[b * 0.707, h, 4]} />{mat}{edge}</mesh> }
      case 'sphere': { const r = dims.radius ?? 2; return <mesh><sphereGeometry args={[r, 48, 48]} />{mat}<Edges color={COLORS.edge} linewidth={1.5} threshold={15} /></mesh> }
      case 'regular-prism': {
        const n = dims.sides ?? 6; const r = dims.radius ?? 2; const h = dims.height ?? 4
        const shape = new THREE.Shape()
        for (let i = 0; i < n; i++) {
          const angle = (2 * Math.PI * i) / n - Math.PI / 2
          const x = r * Math.cos(angle)
          const y = r * Math.sin(angle)
          if (i === 0) shape.moveTo(x, y)
          else shape.lineTo(x, y)
        }
        shape.closePath()
        const geom = new THREE.ExtrudeGeometry(shape, { depth: h, bevelEnabled: false })
        geom.translate(0, 0, -h / 2)
        return <mesh geometry={geom}>{mat}{edge}</mesh>
      }
      case 'rectangle': { const w = dims.width ?? 5; const h = dims.height ?? 3; return <mesh><planeGeometry args={[w, h]} />{mat}<Edges color={COLORS.edge} linewidth={1.5} /></mesh> }
      case 'square': { const s = dims.side ?? 4; return <mesh><planeGeometry args={[s, s]} />{mat}<Edges color={COLORS.edge} linewidth={1.5} /></mesh> }
      case 'parallelogram': {
        const b = dims.base ?? 5; const h = dims.height ?? 3; const sk = dims.skew ?? 1.5
        const shape = new THREE.Shape()
        shape.moveTo(-b / 2 + sk, h / 2)
        shape.lineTo(b / 2 + sk, h / 2)
        shape.lineTo(b / 2, -h / 2)
        shape.lineTo(-b / 2, -h / 2)
        shape.closePath()
        return <mesh geometry={new THREE.ShapeGeometry(shape)}>{mat}<Edges color={COLORS.edge} linewidth={1.5} /></mesh>
      }
      case 'trapezoid': {
        const b1 = dims.base1 ?? 6; const b2 = dims.base2 ?? 4; const h = dims.height ?? 3
        const shape = new THREE.Shape()
        shape.moveTo(-b1 / 2, h / 2)
        shape.lineTo(b1 / 2, h / 2)
        shape.lineTo(b2 / 2, -h / 2)
        shape.lineTo(-b2 / 2, -h / 2)
        shape.closePath()
        return <mesh geometry={new THREE.ShapeGeometry(shape)}>{mat}<Edges color={COLORS.edge} linewidth={1.5} /></mesh>
      }
      case 'triangle': {
        const a = dims.base ?? 5; const b = dims.sideB ?? 4; const c = dims.sideC ?? 4
        const verts = triangleVerts(a, b, c)
        const shape = new THREE.Shape()
        shape.moveTo(verts[0][0], verts[0][1])
        shape.lineTo(verts[1][0], verts[1][1])
        shape.lineTo(verts[2][0], verts[2][1])
        shape.closePath()
        return <mesh geometry={new THREE.ShapeGeometry(shape)}>{mat}<Edges color={COLORS.edge} linewidth={1.5} /></mesh>
      }
      case 'circle': {
        const r = dims.radius ?? 2.5
        return <mesh><ringGeometry args={[0, r, 64]} />{mat}<Edges color={COLORS.edge} linewidth={1.5} threshold={15} /></mesh>
      }
      case 'oval': {
        const rx = dims.radiusX ?? 3; const ry = dims.radiusY ?? 2
        return (
          <mesh scale={[1, ry / rx, 1]}>
            <ringGeometry args={[0, rx, 64]} />
            {mat}
            <Edges color={COLORS.edge} linewidth={1.5} threshold={15} />
          </mesh>
        )
      }
      case 'rhombus': {
        const d1 = dims.diag1 ?? 6; const d2 = dims.diag2 ?? 4
        const shape = new THREE.Shape()
        shape.moveTo(0, d2 / 2)
        shape.lineTo(d1 / 2, 0)
        shape.lineTo(0, -d2 / 2)
        shape.lineTo(-d1 / 2, 0)
        shape.closePath()
        return <mesh geometry={new THREE.ShapeGeometry(shape)}>{mat}<Edges color={COLORS.edge} linewidth={1.5} /></mesh>
      }
      case 'kite': {
        const d1 = dims.diag1 ?? 6; const d2 = dims.diag2 ?? 4; const r = dims.topRatio ?? 0.4
        const topLen = d1 * r
        const botLen = d1 * (1 - r)
        const shape = new THREE.Shape()
        shape.moveTo(0, topLen)
        shape.lineTo(d2 / 2, 0)
        shape.lineTo(0, -botLen)
        shape.lineTo(-d2 / 2, 0)
        shape.closePath()
        return <mesh geometry={new THREE.ShapeGeometry(shape)}>{mat}<Edges color={COLORS.edge} linewidth={1.5} /></mesh>
      }
      case 'house': {
        const w = dims.width ?? 5; const wh = dims.wallHeight ?? 3; const rh = dims.roofHeight ?? 2; const d = dims.depth ?? 4
        const roofShape = new THREE.Shape()
        roofShape.moveTo(-w / 2, 0); roofShape.lineTo(w / 2, 0); roofShape.lineTo(0, rh); roofShape.closePath()
        const roofGeom = new THREE.ExtrudeGeometry(roofShape, { depth: d, bevelEnabled: false })
        roofGeom.translate(0, 0, -d / 2)
        return (
          <group>
            <mesh position={[0, -rh / 2, 0]}><boxGeometry args={[w, wh, d]} />{mat}{edge}</mesh>
            <mesh geometry={roofGeom} position={[0, wh / 2, 0]}>
              <meshPhongMaterial color="#e8a0b0" transparent opacity={0.35} side={THREE.DoubleSide} />
            </mesh>
            <lineSegments geometry={new THREE.EdgesGeometry(roofGeom)}>
              <lineBasicMaterial color={COLORS.edge} linewidth={1.5} />
            </lineSegments>
          </group>
        )
      }
      case 'arch': {
        const w = dims.width ?? 4; const rh = dims.rectHeight ?? 3; const d = dims.depth ?? 3; const r = w / 2
        return (
          <group>
            <mesh position={[0, -r / 2, 0]}><boxGeometry args={[w, rh, d]} />{mat}{edge}</mesh>
            <mesh position={[0, rh / 2, 0]}>
              <cylinderGeometry args={[r, r, d, 48, 1, false, 0, Math.PI]} />
              <meshPhongMaterial color="#84b8c9" transparent opacity={0.35} side={THREE.DoubleSide} />
              <Edges color={COLORS.edge} linewidth={1.5} />
            </mesh>
          </group>
        )
      }
      case 'stacked': {
        const bw = dims.bottomW ?? 5; const bh = dims.bottomH ?? 2; const tw = dims.topW ?? 3; const th = dims.topH ?? 2; const d = dims.depth ?? 4
        return (
          <group>
            <mesh position={[0, -bh / 2 - th / 2, 0]}><boxGeometry args={[bw, bh, d]} />{mat}{edge}</mesh>
            <mesh position={[0, th / 2, 0]}>
              <boxGeometry args={[tw, th, d]} />
              <meshPhongMaterial color="#c9a87c" transparent opacity={0.35} side={THREE.DoubleSide} />
              <Edges color={COLORS.edge} linewidth={1.5} />
            </mesh>
          </group>
        )
      }
      default: return null
    }
  }, [id, dims, color])

  return (
    <group position={position}>
      {shapeEl}
      {showLabels && (
        <>
          {edgeLs.map((l, i) => (
            <Text key={`e-${i}`} position={l.pos} fontSize={l.fontSize ?? 0.36} color={l.color}
              anchorX="center" anchorY="middle" outlineWidth={0.1} outlineColor="#FFFDF7"
              renderOrder={999}
              material-depthTest={false}>
              {l.text}
            </Text>
          ))}
          {faceLs.map((l, i) => (
            <Text key={`f-${i}`} position={l.pos} fontSize={l.fontSize ?? 0.32} color={l.color}
              anchorX="center" anchorY="middle" outlineWidth={0.1} outlineColor="#FFFDF7"
              renderOrder={999}
              material-depthTest={false}>
              {l.text}
            </Text>
          ))}
          {volLs.map((l, i) => (
            <Text key={`v-${i}`} position={l.pos} fontSize={l.fontSize ?? 0.36} color={l.color}
              anchorX="center" anchorY="middle" outlineWidth={0.1} outlineColor="#FFFDF7"
              renderOrder={999}
              material-depthTest={false}>
              {l.text}
            </Text>
          ))}
        </>
      )}
    </group>
  )
}

export default function ShapeRenderer() {
  const activeShape = useShapeStore((s) => s.activeShape)
  const dimensions = useShapeStore((s) => s.dimensions)
  const combineMode = useShapeStore((s) => s.combineMode)
  const checkedShapes = useShapeStore((s) => s.checkedShapes)
  const combinedDimensions = useShapeStore((s) => s.combinedDimensions)
  const attachments = useShapeStore((s) => s.attachments)

  const shapesToRender = useMemo(() => {
    if (combineMode && checkedShapes.length > 0) return checkedShapes
    return [activeShape]
  }, [combineMode, checkedShapes, activeShape])

  const layout = useMemo(() => {
    if (!combineMode || shapesToRender.length <= 1) {
      return shapesToRender.map((id) => ({
        id,
        dims: dimensions,
        position: [0, 0, 0] as [number, number, number],
      }))
    }
    const dimMap: Record<string, Record<string, number>> = {}
    for (const id of shapesToRender) {
      dimMap[id] = combinedDimensions[id] ?? dimensions
    }
    return computeCombinedLayout(shapesToRender, attachments, dimMap, dimensions)
  }, [combineMode, shapesToRender, combinedDimensions, attachments, dimensions])

  return (
    <group>
      {layout.map((item, i) => (
        <SingleShape
          key={`${item.id}-${i}`}
          id={item.id}
          dims={item.dims}
          color={SHAPE_COLORS[item.id] ?? COLORS.face}
          position={item.position}
        />
      ))}
    </group>
  )
}
