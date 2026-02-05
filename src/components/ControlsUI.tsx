import { useGame } from '../GameContext';

const ControlsUI = () => {
    const { speed, setSpeed, trailLength, setTrailLength, starCount, setStarCount } = useGame();

    return (
        <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <div className="control-group">
                <label style={{ display: 'block', marginBottom: '5px', color: '#ffcc00' }}>WARP SPEED: {speed.toFixed(1)}</label>
                <input
                    type="range"
                    min="0"
                    max="5.0"
                    step="0.1"
                    value={speed}
                    onChange={(e) => setSpeed(parseFloat(e.target.value))}
                    style={{ width: '200px' }}
                />
            </div>
            <div className="control-group">
                <label style={{ display: 'block', marginBottom: '5px', color: '#ffcc00' }}>TRAIL LENGTH: {trailLength}</label>
                <input
                    type="range"
                    min="1"
                    max="100"
                    step="1"
                    value={trailLength}
                    onChange={(e) => setTrailLength(parseFloat(e.target.value))}
                    style={{ width: '200px' }}
                />
            </div>
            <div className="control-group">
                <label style={{ display: 'block', marginBottom: '5px', color: '#ffcc00' }}>STARS: {starCount}</label>
                <input
                    type="range"
                    min="100"
                    max="4000"
                    step="100"
                    value={starCount}
                    onChange={(e) => setStarCount(parseFloat(e.target.value))}
                    style={{ width: '200px' }}
                />
            </div>
            <div className="control-group">
                <div style={{ color: '#3366ff', border: '1px solid #3366ff', padding: '5px 10px' }}>
                    STEERING: ARROW KEYS
                </div>
            </div>
        </div>
    )
}

export default ControlsUI
