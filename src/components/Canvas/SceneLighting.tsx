export default function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[8, 12, 8]} intensity={0.8} castShadow />
      <directionalLight position={[-4, 4, -6]} intensity={0.2} />
      <spotLight position={[0, 12, 0]} angle={0.4} penumbra={0.6} intensity={0.4} color="#e8e4dc" />
      <pointLight position={[5, 3, 5]} intensity={0.15} color="#d4c8b8" />
    </>
  )
}
