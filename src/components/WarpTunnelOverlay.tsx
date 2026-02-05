const WarpTunnelOverlay = () => {
    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            background: 'radial-gradient(circle, transparent 50%, rgba(0,0,50,0.5) 90%, black 100%)',
            boxShadow: 'inset 0 0 100px rgba(0,0,0,0.9)'
        }}></div>
    )
}

export default WarpTunnelOverlay
