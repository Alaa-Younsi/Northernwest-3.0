import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { KeyboardModel } from './KeyboardModel';
import { MagneticBase } from './MagneticBase';

function SpinningKeyboard() {
  const groupRef = useRef<THREE.Group>(null);
  const { gl } = useThree();
  const isDragging = useRef(false);
  const prevX = useRef(0);
  const velocity = useRef(0);

  useEffect(() => {
    const canvas = gl.domElement;

    const onDown = (e: PointerEvent) => {
      isDragging.current = true;
      prevX.current = e.clientX;
      velocity.current = 0;
      canvas.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!isDragging.current) return;
      velocity.current = (e.clientX - prevX.current) * 0.009;
      prevX.current = e.clientX;
    };
    const onUp = (e: PointerEvent) => {
      isDragging.current = false;
      try { canvas.releasePointerCapture(e.pointerId); } catch (_) { /* ignore */ }
    };

    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerup', onUp);
    canvas.addEventListener('pointerleave', onUp);
    return () => {
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointerleave', onUp);
    };
  }, [gl]);

  useFrame((_, delta) => {
    const g = groupRef.current;
    if (!g) return;
    if (!isDragging.current) {
      g.rotation.y += 0.45 * delta;
    }
    g.rotation.y += velocity.current;
    velocity.current *= 0.93;
  });

  return (
    <group ref={groupRef} position={[0, 0.3, 0]}>
      <KeyboardModel />
    </group>
  );
}

function Scene({ frameloop }: { frameloop: 'always' | 'never' }) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 2.6, 4.0], fov: 56 }}
      gl={{ antialias: true, alpha: true }}
      frameloop={frameloop}
      style={{ background: 'transparent' }}
      onCreated={({ gl }) => {
        gl.setClearColor(new THREE.Color(0, 0, 0), 0);
      }}
    >
      <ambientLight intensity={3} />
      <directionalLight position={[2, 5, 4]} intensity={5} color="#ffffff" />
      <directionalLight position={[-2, 2, -1]} intensity={2} color="#ffffff" />
      <pointLight position={[0, 2, 3]} intensity={5} color="#ffffff" decay={2} />

      <SpinningKeyboard />
      <MagneticBase y={-1.0} />
    </Canvas>
  );
}

export default function FloatingKeyboard3D({
  frameloop = 'always',
}: {
  frameloop?: 'always' | 'never';
}) {
  return <Scene frameloop={frameloop} />;
}
