import { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useGame } from '../GameContext'

const STAR_COUNT = 4000;
const Z_DEPTH = 1000;

const WarpStarShader = {
    uniforms: {
        uTime: { value: 0 },
        uSpeed: { value: 0 },
        uTrailLength: { value: 10 },
        uOffset: { value: new THREE.Vector2(0, 0) } // Accumulate steering here
    },
    vertexShader: `
        uniform float uTime;
        uniform float uSpeed;
        uniform float uTrailLength;
        uniform vec2 uOffset; // Steering Input (Direct, not accumulated)
        
        varying float vZ;
        varying float vLocalZ;

        void main() {
            vec3 instancePos = vec3(instanceMatrix[3][0], instanceMatrix[3][1], instanceMatrix[3][2]);
            
            // Dimensions
            float width = 1600.0; 
            float height = 1200.0;
            float depth = 1000.0;
            
            // 1. Z Streaming (Standard infinite loop)
            float speed = 50.0 * uSpeed; 
            float zStart = instancePos.z; 
            float movingZ = mod(zStart + uTime * speed, depth) - depth * 0.9;
            
            // 2. CURVED PATH DISPLACEMENT
            // Instead of moving the whole universe, we bend the stars based on how far away they are.
            // Stars far away (negative movingZ) get shifted more by steering input.
            // This creates the illusion of the tunnel bending.
            
            // Distance factor: 0.0 at camera, 1.0 at max depth (approx)
            float distFactor = abs(movingZ) / 1000.0;
            // Non-linear bend for better feel (squared)
            float bendFactor = distFactor * distFactor; 
            
            float xPos = instancePos.x + (uOffset.x * 400.0 * bendFactor);
            float yPos = instancePos.y + (uOffset.y * 300.0 * bendFactor);
            
            // 3. STRETCHING
            float stretch = max(1.0, uSpeed * uTrailLength);
            
            vec4 pos = vec4(position, 1.0);
            vLocalZ = (position.z / 0.15) + 0.5;
            
            if (pos.z < 0.0) {
                pos.z *= stretch;
            }
            
            // Reconstruct world position
            vec4 finalPos = vec4(xPos, yPos, movingZ, 1.0);
            finalPos.xyz += pos.xyz;
            
            gl_Position = projectionMatrix * viewMatrix * finalPos;
            
            vZ = movingZ;
        }
    `,
    fragmentShader: `
        uniform float uTime;
        uniform float uSpeed;
        
        varying float vZ;
        varying float vLocalZ;
        
        vec3 hslToRgb(float h, float s, float l) {
            vec3 c = vec3(h);
            vec3 rgb = clamp(abs(mod(c * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
            return l + s * (rgb - 0.5) * (1.0 - abs(2.0 * l - 1.0));
        }

        void main() {
            float hue = fract(uTime * 2.0 + vZ * 0.01);
            float saturation = 1.0; 
            float lightness = 0.5; 
            vec3 rainbow = hslToRgb(hue, saturation, lightness);
            
            float whiteMix = smoothstep(0.6, 0.9, vLocalZ);
            vec3 color = mix(rainbow, vec3(1.0), whiteMix);
            
            // Fade out
            float alpha = 1.0;
            if (vZ < -800.0) alpha *= smoothstep(-900.0, -800.0, vZ);
            if (vZ > 50.0) alpha *= smoothstep(100.0, 50.0, vZ);

            gl_FragColor = vec4(color, alpha);
        }
    `
}

const WarpField = () => {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const { speed, trailLength, starCount, steering } = useGame();
    const { camera } = useThree();

    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uSpeed: { value: speed },
        uTrailLength: { value: trailLength },
        uOffset: { value: new THREE.Vector2(0, 0) }
    }), []);

    // Generate static attribute data
    const [offsetZArray, initialPositions] = useMemo(() => {
        const offsets = new Float32Array(STAR_COUNT);
        const positions = [];
        const tempObj = new THREE.Object3D();

        for (let i = 0; i < STAR_COUNT; i++) {
            offsets[i] = Math.random() * Z_DEPTH;

            // Standard box again (no wrapping needed visually in X/Y generation)
            const x = (Math.random() - 0.5) * 800; // Original width
            const y = (Math.random() - 0.5) * 600;
            const z = (Math.random() - 0.5) * Z_DEPTH;

            tempObj.position.set(x, y, z);
            tempObj.updateMatrix();
            positions.push(tempObj.matrix.clone());
        }
        return [offsets, positions];
    }, []);

    useEffect(() => {
        if (meshRef.current) {
            initialPositions.forEach((mat, i) => {
                meshRef.current?.setMatrixAt(i, mat);
            });
            meshRef.current.instanceMatrix.needsUpdate = true;
        }
    }, [initialPositions]);

    useFrame((state, delta) => {
        uniforms.uTime.value = state.clock.elapsedTime;
        uniforms.uSpeed.value = THREE.MathUtils.lerp(uniforms.uSpeed.value, speed, delta * 2.0);
        uniforms.uTrailLength.value = THREE.MathUtils.lerp(uniforms.uTrailLength.value, trailLength, delta * 2.0);

        // STEERING LOGIC UPDATE
        // Pass steering directly to shader for bending
        // We smooth it slightly for feel
        uniforms.uOffset.value.lerp(steering, delta * 2.0);

        // Optional: Slight Banking Camera Rotation for effect
        // Just a little tilt to sell the g-forces
        const maxBank = 0.1; // modest bank
        camera.rotation.z = THREE.MathUtils.lerp(camera.rotation.z, -steering.x * 0.1 * maxBank, delta * 2.0);
    });

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, STAR_COUNT]} count={starCount}>
            <boxGeometry args={[0.15, 0.15, 0.15]}>
                <instancedBufferAttribute
                    attach="attributes-aOffsetZ"
                    args={[offsetZArray, 1]}
                />
            </boxGeometry>
            <shaderMaterial
                attach="material"
                args={[WarpStarShader]}
                uniforms={uniforms}
                transparent
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </instancedMesh>
    )
}

export default WarpField
