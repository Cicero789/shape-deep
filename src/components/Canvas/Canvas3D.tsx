import { useRef, useCallback, useEffect } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Environment } from '@react-three/drei'
import SceneLighting from './SceneLighting'
import GridFloor from './GridFloor'
import ShapeRenderer from './ShapeRenderer'
import { useShapeStore } from '../../store/useShapeStore'

const SENSITIVITY = 0.005
const ZOOM_SPEED = 0.012

function Trackball() {
  const camera = useThree((s) => s.camera)
  const gl = useThree((s) => s.gl)
  const autoRotate = useShapeStore((s) => s.autoRotate)

  const dragging = useRef(false)
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

  const onDown = useCallback((e: PointerEvent) => {
    dragging.current = true
    setCursor('grabbing')
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }, [setCursor])

  const onMove = useCallback((e: PointerEvent) => {
    if (!dragging.current) return
    const dx = e.movementX
    const dy = e.movementY
    if (Math.abs(dx) < 0.3 && Math.abs(dy) < 0.3) return

    // Camera's screen-space axes in world coordinates — always well-defined
    const camRight = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion).normalize()
    const camUp    = new THREE.Vector3(0, 1, 0).applyQuaternion(camera.quaternion).normalize()

    // Vertical mouse → tilt: drag up = object top comes toward you
    const qV = new THREE.Quaternion().setFromAxisAngle(camRight, dy * SENSITIVITY)
    // Horizontal mouse → spin: drag right = object spins right
    const qH = new THREE.Quaternion().setFromAxisAngle(camUp,    dx * SENSITIVITY)

    // Compose both rotations and apply to camera position
    const delta = new THREE.Quaternion().multiplyQuaternions(qV, qH)
    camera.position.applyQuaternion(delta)
    camera.lookAt(0, 0, 0)
  }, [camera, setCursor])

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

    // Auto-rotate: spin around camera's up axis
    if (autoRotate && !dragging.current) {
      const camUp = new THREE.Vector3(0, 1, 0).applyQuaternion(camera.quaternion).normalize()
      const q = new THREE.Quaternion().setFromAxisAngle(camUp, 0.003)
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
