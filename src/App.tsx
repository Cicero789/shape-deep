import Sidebar from './components/Sidebar/Sidebar'
import Canvas3D from './components/Canvas/Canvas3D'
import InfoPanel from './components/InfoPanel/InfoPanel'

export default function App() {
  return (
    <div className="h-full w-full flex items-center justify-center p-6" style={{ background: '#F5F3EE' }}>
      <div className="flex h-full w-full max-w-[1680px] rounded-3xl overflow-hidden shadow-[0_2px_60px_rgba(0,50,98,0.08)]"
        style={{ background: '#FFFDF7', border: '1px solid #CFDDEC' }}>
        <Sidebar />
        <Canvas3D />
        <InfoPanel />
      </div>
    </div>
  )
}
