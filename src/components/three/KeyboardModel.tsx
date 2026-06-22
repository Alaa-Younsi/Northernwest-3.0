import { useMemo } from 'react';
import {
  KEYBOARD_ROWS,
  TOTAL_UNITS,
  UNIT,
  KEY_GAP,
  KEY_HEIGHT,
  ROW_DEPTH,
  ROW_GAP,
  CASE_PADDING_X,
  CASE_PADDING_Z,
} from './keyboardLayout';

interface KeyPos { x: number; z: number; w: number; d: number; special: boolean; spacebar: boolean }

function buildLayout() {
  const rows = KEYBOARD_ROWS.length;
  const totalDepth = rows * ROW_DEPTH + (rows - 1) * ROW_GAP;
  const totalWidth = TOTAL_UNITS * UNIT + (TOTAL_UNITS - 1) * KEY_GAP;
  const keys: KeyPos[] = [];
  for (let r = 0; r < rows; r++) {
    const rowZ = totalDepth / 2 - r * (ROW_DEPTH + ROW_GAP) - ROW_DEPTH / 2;
    let curX = -totalWidth / 2;
    for (const key of KEYBOARD_ROWS[r]) {
      const keyW = key.size * UNIT + (key.size - 1) * KEY_GAP;
      keys.push({ x: curX + keyW / 2, z: rowZ, w: keyW, d: ROW_DEPTH, special: key.special, spacebar: key.size >= 6 });
      curX += keyW + KEY_GAP;
    }
  }
  return { keys, totalWidth, totalDepth };
}

export function KeyboardModel() {
  const { keys, totalWidth, totalDepth } = useMemo(buildLayout, []);
  const caseW = totalWidth + CASE_PADDING_X * 2;
  const caseD = totalDepth + CASE_PADDING_Z * 2;
  const caseH = 0.11;
  const capH = KEY_HEIGHT;
  const capY = caseH / 2 + capH / 2;

  return (
    <group rotation={[0.35, 0, 0]}>
      {/* Case */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[caseW, caseH, caseD]} />
        <meshStandardMaterial color="#111111" roughness={0.35} metalness={0.6} />
      </mesh>

      {/* Red LED strip */}
      <mesh position={[0, -caseH / 2, caseD / 2 - 0.005]}>
        <boxGeometry args={[caseW * 0.72, 0.008, 0.007]} />
        <meshStandardMaterial color="#FF0000" emissive="#FF0000" emissiveIntensity={10} roughness={1} metalness={0} />
      </mesh>

      {/* Keycaps */}
      {keys.map((k, i) => (
        <mesh key={i} position={[k.x, capY, k.z]}>
          <boxGeometry args={[k.w - KEY_GAP * 0.5, capH, k.d - KEY_GAP * 0.5]} />
          <meshStandardMaterial
            color={k.spacebar ? '#707070' : k.special ? '#303030' : '#858585'}
            roughness={0.25}
            metalness={0.1}
          />
        </mesh>
      ))}
    </group>
  );
}
