export interface KeyDef {
  size: number; // width in keyboard units (1u = base key)
  special: boolean;
}

// 60% keyboard layout — 5 rows, 15u total width each
export const KEYBOARD_ROWS: KeyDef[][] = [
  // Number row
  [
    { size: 1, special: false }, { size: 1, special: false }, { size: 1, special: false },
    { size: 1, special: false }, { size: 1, special: false }, { size: 1, special: false },
    { size: 1, special: false }, { size: 1, special: false }, { size: 1, special: false },
    { size: 1, special: false }, { size: 1, special: false }, { size: 1, special: false },
    { size: 1, special: false }, { size: 2, special: true },
  ],
  // QWERTY row
  [
    { size: 1.5, special: true },
    { size: 1, special: false }, { size: 1, special: false }, { size: 1, special: false },
    { size: 1, special: false }, { size: 1, special: false }, { size: 1, special: false },
    { size: 1, special: false }, { size: 1, special: false }, { size: 1, special: false },
    { size: 1, special: false }, { size: 1, special: false }, { size: 1, special: false },
    { size: 1.5, special: false },
  ],
  // Home row
  [
    { size: 1.75, special: true },
    { size: 1, special: false }, { size: 1, special: false }, { size: 1, special: false },
    { size: 1, special: false }, { size: 1, special: false }, { size: 1, special: false },
    { size: 1, special: false }, { size: 1, special: false }, { size: 1, special: false },
    { size: 1, special: false }, { size: 1, special: false },
    { size: 2.25, special: true },
  ],
  // Shift row
  [
    { size: 2.25, special: true },
    { size: 1, special: false }, { size: 1, special: false }, { size: 1, special: false },
    { size: 1, special: false }, { size: 1, special: false }, { size: 1, special: false },
    { size: 1, special: false }, { size: 1, special: false }, { size: 1, special: false },
    { size: 1, special: false }, { size: 2.75, special: true },
  ],
  // Bottom row
  [
    { size: 1.5, special: true },
    { size: 1.25, special: true },
    { size: 1.25, special: true },
    { size: 7, special: false }, // spacebar
    { size: 1.25, special: true },
    { size: 1.25, special: true },
    { size: 1.5, special: true },
  ],
];

export const TOTAL_UNITS = 15;
export const UNIT = 0.24;
export const KEY_GAP = 0.014;
export const KEY_HEIGHT = 0.06;
export const ROW_DEPTH = 0.23;
export const ROW_GAP = 0.014;
export const CASE_PADDING_X = 0.09;
export const CASE_PADDING_Z = 0.09;
