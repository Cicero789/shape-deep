import { Grid } from '@react-three/drei'

export default function GridFloor() {
  return (
    <Grid
      position={[0, -5.5, 0]}
      args={[25, 25]}
      cellSize={1}
      cellThickness={0.25}
      cellColor="#d4d1ca"
      sectionSize={5}
      sectionThickness={0.5}
      sectionColor="#b8b4ac"
      fadeDistance={28}
      fadeStrength={1}
      infiniteGrid
    />
  )
}
