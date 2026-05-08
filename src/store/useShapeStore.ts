import { create } from 'zustand'
import type { CalcMode } from '../types/shapes'
import { allShapes } from '../shapes/registry'

export type AttachFace = 'top' | 'bottom' | 'left' | 'right' | 'front' | 'back'

interface ShapeState {
  activeShape: string
  dimensions: Record<string, number>
  mode: CalcMode
  showLabels: boolean
  autoRotate: boolean
  combineMode: boolean
  checkedShapes: string[]
  combinedDimensions: Record<string, Record<string, number>>
  editingShapeId: string
  attachments: Record<string, AttachFace>
  setActiveShape: (id: string, defaults: Record<string, number>) => void
  setDimension: (key: string, value: number) => void
  setDimensions: (dims: Record<string, number>) => void
  setMode: (mode: CalcMode) => void
  toggleLabels: () => void
  toggleAutoRotate: () => void
  toggleCombineMode: () => void
  toggleCheckedShape: (id: string) => void
  selectEditingShape: (id: string) => void
  setAttachment: (shapeId: string, face: AttachFace) => void
  setCombinedDimension: (shapeId: string, key: string, value: number) => void
  remix: () => void
}

function randomDefaults(id: string): Record<string, number> {
  const shape = allShapes.find((s) => s.id === id)
  const dims: Record<string, number> = {}
  if (!shape) return dims
  for (const p of shape.params) {
    const spread = p.max - p.min
    const val = p.min + Math.random() * spread
    dims[p.key] = p.step >= 1 ? Math.round(val) : Math.round(val * 10) / 10
  }
  return dims
}

const ALL_FACES: AttachFace[] = ['top', 'bottom', 'left', 'right', 'front', 'back']

export const useShapeStore = create<ShapeState>((set, get) => ({
  activeShape: 'cube',
  dimensions: { side: 3 },
  mode: 'surface-area',
  showLabels: true,
  autoRotate: true,
  combineMode: false,
  checkedShapes: [],
  combinedDimensions: {},
  editingShapeId: 'cube',
  attachments: {},

  setActiveShape: (id, defaults) =>
    set((s) => ({
      activeShape: id,
      dimensions: s.combineMode
        ? (s.combinedDimensions[id] ?? defaults)
        : defaults,
      editingShapeId: s.combineMode ? id : s.editingShapeId,
    })),

  setDimension: (key, value) =>
    set((s) => {
      if (s.combineMode) {
        const ed = s.combinedDimensions[s.editingShapeId] ?? { ...s.dimensions }
        const updated = { ...ed, [key]: value }
        return {
          dimensions: updated,
          combinedDimensions: { ...s.combinedDimensions, [s.editingShapeId]: updated },
        }
      }
      return { dimensions: { ...s.dimensions, [key]: value } }
    }),

  setDimensions: (dims) => set({ dimensions: dims }),
  setMode: (mode) => set({ mode }),
  toggleLabels: () => set((s) => ({ showLabels: !s.showLabels })),
  toggleAutoRotate: () => set((s) => ({ autoRotate: !s.autoRotate })),

  toggleCombineMode: () =>
    set((s) => {
      const entering = !s.combineMode
      if (entering) {
        const cd: Record<string, Record<string, number>> = {}
        cd[s.activeShape] = { ...s.dimensions }
        return {
          combineMode: true,
          checkedShapes: [s.activeShape],
          combinedDimensions: cd,
          editingShapeId: s.activeShape,
          attachments: {},
        }
      }
      return {
        combineMode: false,
        checkedShapes: [],
        combinedDimensions: {},
        attachments: {},
        dimensions: s.combinedDimensions[s.activeShape] ?? s.dimensions,
      }
    }),

  toggleCheckedShape: (id) =>
    set((s) => {
      const isChecked = s.checkedShapes.includes(id)
      if (!isChecked && s.checkedShapes.length >= 2) return {} // limit to 2 shapes
      const checked = isChecked
        ? s.checkedShapes.filter((x) => x !== id)
        : [...s.checkedShapes, id]
      const cd = { ...s.combinedDimensions }
      const att = { ...s.attachments }
      if (!isChecked && !cd[id]) {
        cd[id] = randomDefaults(id)
      }
      if (isChecked) {
        delete cd[id]
        delete att[id]
      }
      if (!isChecked && checked.length > 1) {
        att[id] = 'top'
      }
      const editingId = checked.includes(s.editingShapeId) ? s.editingShapeId : checked[0] ?? s.activeShape
      const dims = cd[editingId] ?? s.dimensions
      return {
        checkedShapes: checked,
        combinedDimensions: cd,
        attachments: att,
        editingShapeId: editingId,
        dimensions: dims,
      }
    }),

  selectEditingShape: (id) =>
    set((s) => {
      const cd = s.combinedDimensions
      const dims = cd[id] ?? s.dimensions
      return { editingShapeId: id, activeShape: id, dimensions: dims }
    }),

  setAttachment: (shapeId, face) =>
    set((s) => ({
      attachments: { ...s.attachments, [shapeId]: face },
    })),

  setCombinedDimension: (shapeId, key, value) =>
    set((s) => {
      const shapeDims = { ...(s.combinedDimensions[shapeId] ?? {}) }
      shapeDims[key] = value
      const updated = { ...s.combinedDimensions, [shapeId]: shapeDims }
      return {
        combinedDimensions: updated,
        dimensions: s.editingShapeId === shapeId ? shapeDims : s.dimensions,
      }
    }),

  remix: () => {
    const s = get()
    if (s.combineMode && s.checkedShapes.length > 0) {
      const cd: Record<string, Record<string, number>> = {}
      const att: Record<string, AttachFace> = {}
      for (let i = 0; i < s.checkedShapes.length; i++) {
        const id = s.checkedShapes[i]
        cd[id] = randomDefaults(id)
        if (i > 0) {
          att[id] = ALL_FACES[Math.floor(Math.random() * ALL_FACES.length)]
        }
      }
      const newEditing = s.checkedShapes[Math.floor(Math.random() * s.checkedShapes.length)] ?? s.checkedShapes[0]
      set({
        combinedDimensions: cd,
        attachments: att,
        editingShapeId: newEditing,
        activeShape: newEditing,
        dimensions: cd[newEditing] ?? s.dimensions,
      })
    } else {
      const newDims: Record<string, number> = {}
      for (const [key, val] of Object.entries(s.dimensions)) {
        const range = val * 0.6
        let newVal = Math.round((val + (Math.random() - 0.5) * range) * 10) / 10
        newVal = Math.max(0.5, Math.min(10, newVal))
        newDims[key] = newVal
      }
      const nonCombined = allShapes.filter((sh) => sh.id !== s.activeShape && sh.category !== 'combined')
      const altShape = nonCombined[Math.floor(Math.random() * nonCombined.length)]
      if (Math.random() > 0.5 && altShape) {
        set({ activeShape: altShape.id, dimensions: randomDefaults(altShape.id) })
      } else {
        set({ dimensions: newDims })
      }
    }
  },
}))
