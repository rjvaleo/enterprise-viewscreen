import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import * as THREE from 'three';

interface GameState {
    speed: number;
    setSpeed: (val: number) => void;
    trailLength: number;
    setTrailLength: (val: number) => void;
    starCount: number;
    setStarCount: (val: number) => void;
    steering: THREE.Vector2;
}

const GameContext = createContext<GameState | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
    const [speed, setSpeed] = useState(1.2);
    const [trailLength, setTrailLength] = useState(50.0);
    const [starCount, setStarCount] = useState(2000); // Default to half max
    const [steering, setSteering] = useState(new THREE.Vector2(0, 0));

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            setSteering(prev => {
                const step = 0.5; // Steering sensitivity
                const next = prev.clone();
                switch (e.key) {
                    case 'ArrowUp': next.y += step; break;
                    case 'ArrowDown': next.y -= step; break;
                    case 'ArrowLeft': next.x -= step; break;
                    case 'ArrowRight': next.x += step; break;
                }
                // Clamp steering
                next.x = Math.max(-10, Math.min(10, next.x));
                next.y = Math.max(-10, Math.min(10, next.y));
                return next;
            });
        };

        // For simplicity, let's just update a Ref accessible via context or sticking to Flux pattern?
        // Let's stick to this simple state for now, but optimize later if jerky.
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        }
    }, []);

    // We'll use a Ref for steering to avoid re-rendering everything on every keypress if possible,
    // but Context updates trigger re-renders.
    // Optimization: Create a MutableRefObject in Context designed for reading in useFrame.

    return (
        <GameContext.Provider value={{ speed, setSpeed, trailLength, setTrailLength, starCount, setStarCount, steering }}>
            {children}
        </GameContext.Provider>
    );
};

export const useGame = () => {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
};
