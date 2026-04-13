// ---------- Department Color Palettes ----------
// 5 roles per palette: primary, secondary, tertiary, light, border
// First 12 sourced from static CSuite dashboard (public/wevend/data.js)
// Remaining 8 are visually distinct additions

export interface ColorPalette {
  primary: string;
  secondary: string;
  tertiary: string;
  light: string;
  border: string;
}

const NEUTRAL_GRAY_PALETTE: ColorPalette = {
  primary: '#64748b',
  secondary: '#94a3b8',
  tertiary: '#cbd5e1',
  light: 'rgba(100,116,139,0.1)',
  border: '#64748b',
};

export const DEPARTMENT_COLOR_PALETTES: ColorPalette[] = [
  // 0 - Green (Accounting)
  { primary: '#2E7D32', secondary: '#66BB6A', tertiary: '#A5D6A7', light: 'rgba(46,125,50,0.1)', border: '#2E7D32' },
  // 1 - Dark Navy (C-Suite)
  { primary: '#1A1A2E', secondary: '#4A4A6A', tertiary: '#8888AA', light: 'rgba(26,26,46,0.1)', border: '#1A1A2E' },
  // 2 - Blue (Engineering)
  { primary: '#1565C0', secondary: '#42A5F5', tertiary: '#90CAF9', light: 'rgba(21,101,192,0.1)', border: '#1565C0' },
  // 3 - Pink (HR)
  { primary: '#AD1457', secondary: '#EC407A', tertiary: '#F48FB1', light: 'rgba(173,20,87,0.1)', border: '#AD1457' },
  // 4 - Teal (IT)
  { primary: '#00838F', secondary: '#26C6DA', tertiary: '#80DEEA', light: 'rgba(0,131,143,0.1)', border: '#00838F' },
  // 5 - Orange (Infrastructure)
  { primary: '#E65100', secondary: '#FF9800', tertiary: '#FFCC80', light: 'rgba(230,81,0,0.1)', border: '#E65100' },
  // 6 - Purple (Marketing)
  { primary: '#6A1B9A', secondary: '#AB47BC', tertiary: '#CE93D8', light: 'rgba(106,27,154,0.1)', border: '#6A1B9A' },
  // 7 - Indigo (Operations)
  { primary: '#283593', secondary: '#5C6BC0', tertiary: '#9FA8DA', light: 'rgba(40,53,147,0.1)', border: '#283593' },
  // 8 - Brown (Product)
  { primary: '#4E342E', secondary: '#8D6E63', tertiary: '#BCAAA4', light: 'rgba(78,52,46,0.1)', border: '#4E342E' },
  // 9 - Red-Orange (Sales Ops)
  { primary: '#BF360C', secondary: '#FF7043', tertiary: '#FFAB91', light: 'rgba(191,54,12,0.1)', border: '#BF360C' },
  // 10 - Dark Teal (Sales primary)
  { primary: '#00695C', secondary: '#26A69A', tertiary: '#80CBC4', light: 'rgba(0,105,92,0.1)', border: '#00695C' },
  // 11 - Amber (Sales secondary)
  { primary: '#F57F17', secondary: '#FDD835', tertiary: '#FFF59D', light: 'rgba(245,127,23,0.1)', border: '#F57F17' },
  // 12 - Cyan
  { primary: '#006064', secondary: '#00ACC1', tertiary: '#80DEEA', light: 'rgba(0,96,100,0.1)', border: '#006064' },
  // 13 - Deep Purple
  { primary: '#4527A0', secondary: '#7E57C2', tertiary: '#B39DDB', light: 'rgba(69,39,160,0.1)', border: '#4527A0' },
  // 14 - Lime
  { primary: '#558B2F', secondary: '#8BC34A', tertiary: '#C5E1A5', light: 'rgba(85,139,47,0.1)', border: '#558B2F' },
  // 15 - Rose
  { primary: '#C62828', secondary: '#EF5350', tertiary: '#EF9A9A', light: 'rgba(198,40,40,0.1)', border: '#C62828' },
  // 16 - Steel Blue
  { primary: '#37474F', secondary: '#78909C', tertiary: '#B0BEC5', light: 'rgba(55,71,79,0.1)', border: '#37474F' },
  // 17 - Gold
  { primary: '#E65100', secondary: '#FB8C00', tertiary: '#FFE0B2', light: 'rgba(230,81,0,0.1)', border: '#E65100' },
  // 18 - Magenta
  { primary: '#880E4F', secondary: '#D81B60', tertiary: '#F48FB1', light: 'rgba(136,14,79,0.1)', border: '#880E4F' },
  // 19 - Forest
  { primary: '#1B5E20', secondary: '#43A047', tertiary: '#A5D6A7', light: 'rgba(27,94,32,0.1)', border: '#1B5E20' },
];

export function getColorPalette(colorIndex: number | null | undefined): ColorPalette {
  if (colorIndex == null || colorIndex < 0 || colorIndex >= DEPARTMENT_COLOR_PALETTES.length) {
    return NEUTRAL_GRAY_PALETTE;
  }
  return DEPARTMENT_COLOR_PALETTES[colorIndex];
}

// ---------- Milestone Stages ----------

export const MILESTONE_STAGES = [
  { stage: 0, name: 'Not Started' },
  { stage: 1, name: 'Implemented' },
  { stage: 2, name: '2 Weeks Stable' },
  { stage: 3, name: 'Dept Head Confirmed' },
] as const;

export const EFFORT_SCORES: Record<string, number> = {
  Low: 3,
  Medium: 2,
  High: 1,
};

export function computeScore(timeSavingsMidpoint: number, effort: string): number {
  return timeSavingsMidpoint * (EFFORT_SCORES[effort] ?? 1);
}
