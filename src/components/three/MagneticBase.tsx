export function MagneticBase({ y }: { y: number }) {
  return (
    <group position={[0, y, 0]}>
      {/* Platform disc */}
      <mesh>
        <cylinderGeometry args={[1.1, 1.25, 0.05, 48]} />
        <meshStandardMaterial color="#181818" roughness={0.45} metalness={0.6} />
      </mesh>

      {/* Single red ring — meshBasicMaterial ignores lighting so it stays pure red */}
      <mesh position={[0, 0.028, 0]}>
        <torusGeometry args={[1.0, 0.018, 16, 80]} />
        <meshBasicMaterial color="#FF0000" />
      </mesh>

      {/* Magnetic field glow lights */}
      <pointLight color="#FF0000" intensity={10} distance={3.5} decay={2} position={[0, 1.0, 0]} />
      <pointLight color="#FF2200" intensity={4} distance={4} decay={2} position={[0, 0.2, 0]} />
    </group>
  );
}
