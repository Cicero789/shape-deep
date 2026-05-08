import { useRef, useCallback, useEffect } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Environment } from '@react-three/drei'
import SceneLighting from './SceneLighting'
import GridFloor from './GridFloor'
import ShapeRenderer from './ShapeRenderer'
import { useShapeStore } from '../../store/useShapeStore'

const ZOOM_SPEED = 0.012

/*
 * Project a screen point onto a virtual unit sphere.
 * Points inside the unit circle → hemisphere surface (z > 0).
 * Points outside → rim (z = 0).
 */
function screenToSphere(
  sx: number, sy: number, w: number, h: number,
): THREE.Vector3 {
  const nx =  (2 * sx) / w - 1
  const ny = -(2 * sy) / h + 1
  const r2 = nx * nx + ny * ny
  if (r2 <= 1) {
    return new THREE.Vector3(nx, ny, Math.sqrt(1 - r2))
  }
  const inv = 1 / Math.sqrt(r2)
  return new THREE.Vector3(nx * inv, ny * inv, 0)
}

function Trackball() {
  const camera = useThree((s) => s.camera)
  const gl = useThree((s) => s.gl)
  const autoRotate = useShapeStore((s) => s.autoRotate)

  const dragging = useRef(false)
  // The point on the virtual sphere where the user "grabbed"
  const grabPoint = useRef(new THREE.Vector3(0, 0, 1))
  // Cumulative orbit — the total rotation applied since the grab started
  const dist = useRef(12)
  const targetDist = useRef(12)

  useEffect(() => {
    camera.position.set(0, 5, dist.current)
    camera.lookAt(0, 0, 0)
    gl.domElement.style.cursor = 'grab'
  }, [camera, gl])

  const setCursor = useCallback((c: string) => {
    gl.domElement.style.cursor = c
  }, [gl])

  const getRect = useCallback(() => gl.domElement.getBoundingClientRect(), [gl])

  const onDown = useCallback((e: PointerEvent) => {
    dragging.current = true
    setCursor('grabbing')
    const r = getRect()
    grabPoint.current.copy(
      screenToSphere(e.clientX - r.left, e.clientY - r.top, r.width, r.height),
    )
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }, [setCursor, getRect])

  const onMove = useCallback((e: PointerEvent) => {
    if (!dragging.current) return
    const r = getRect()
    const curr = screenToSphere(e.clientX - r.left, e.clientY - r.top, r.width, r.height)

    // Quaternion that rotates grab → curr on the sphere.
    // curr→grab so the object follows the mouse (not reversed).
    const q = new THREE.Quaternion().setFromUnitVectors(curr, grabPoint.current)

    // Rotate camera around origin
    camera.position.applyQuaternion(q)
    camera.lookAt(0, 0, 0)

    // The current point becomes the grab for the next frame
    grabPoint.current.copy(curr)
  }, [camera, getRect])

  const onUp = useCallback(() => {
    dragging.current = false
    setCursor('grab')
  }, [setCursor])

  const onWheel = useCallback((e: WheelEvent) => {
    e.preventDefault()
    targetDist.current = Math.max(3, Math.min(30, targetDist.current + e.deltaY * ZOOM_SPEED))
  }, [])

  useEffect(() => {
    const el = gl.domElement
    el.addEventListener('pointerdown', onDown)
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerup', onUp)
    el.addEventListener('pointerleave', onUp)
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      el.removeEventListener('pointerdown', onDown)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerup', onUp)
      el.removeEventListener('pointerleave', onUp)
      el.removeEventListener('wheel', onWheel)
    }
  }, [gl, onDown, onMove, onUp, onWheel])

  useFrame(() => {
    // Smooth zoom
    dist.current += (targetDist.current - dist.current) * 0.15
    const dir = camera.position.clone().normalize()
    camera.position.lerp(dir.multiplyScalar(dist.current), 0.15)
    camera.lookAt(0, 0, 0)

    // Auto-rotate: simulate a tiny horizontal nudge on the sphere
    if (autoRotate && !dragging.current) {
      const r = getRect()
      const cx = r.width / 2
      const cy = r.height / 2
      const p0 = screenToSphere(cx, cy, r.width, r.height)
      const p1 = screenToSphere(cx + 1, cy, r.width, r.height)
      const q = new THREE.Quaternion().setFromUnitVectors(p0, p1)
      camera.position.applyQuaternion(q)
      camera.lookAt(0, 0, 0)
    }
  })

  return null
}

export default function Canvas3D() {
  const combineMode = useShapeStore((s) => s.combineMode)

  return (
    <div className="flex-1" style={{ background: '#FFFDF7' }}>
      <Canvas
        camera={{ position: combineMode ? [0, 6, 14] : [0, 5, 12], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'linear-gradient(180deg, #FFFDF7 0%, #F5F3EE 100%)' }}
      >
        <Trackball />
        <SceneLighting />
        <GridFloor />
        <ShapeRenderer />
        <Environment preset="apartment" />
      </Canvas>
    </div>
  )
}
