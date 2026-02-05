import { Canvas } from '@react-three/fiber'
import WarpField from './WarpField'
import WarpTunnelOverlay from './WarpTunnelOverlay'

const ViewScreen = () => {
    return (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
                <color attach="background" args={['#000']} />
                <ambientLight intensity={0.5} />
                <WarpField />
            </Canvas>
            <WarpTunnelOverlay />
        </div>
    )
}

export default ViewScreen
