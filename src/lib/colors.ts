// UC Berkeley Collegiate Color Palette
export const BERKELEY = {
  blue:       '#003262',  // Berkeley Blue — primary
  gold:       '#FDB515',  // California Gold — accent
  pacific:    '#3B7EA1',  // Pacific Blue — secondary
  wellman:    '#002856',  // Wellman Blue — darkest
  sather:     '#005A8B',  // Sather Gate Blue
  teal:       '#00A598',  // Berkeley Teal
  medalist:   '#C4820E',  // Medalist Gold — warm
  soybean:    '#D9661F',  // Soybean Orange — warm accent
  lightBlue:  '#CFDDEC',  // Light blue tint
  cream:      '#FFFDF7',  // Warm white
  stone:      '#F5F3EE',  // Light stone
  sand:       '#EDE8DD',  // Warm sand
}

export const COLORS = {
  face:        BERKELEY.pacific,
  faceOpacity: 0.30,
  edge:        BERKELEY.blue,
  edgeWidth:   1.5,
  label:       BERKELEY.blue,
  labelDim:    BERKELEY.sather,
  labelArea:   BERKELEY.teal,
  labelVolume: BERKELEY.medalist,
  grid:        '#e0dcd4',
  gridCenter:  '#c8c4b8',
  background:  BERKELEY.cream,
  accent:      BERKELEY.blue,
  gold:        BERKELEY.gold,
  success:     BERKELEY.teal,
  warning:     BERKELEY.medalist,
}

// Shape face colors — blues for 3D, golds for 2D, warm tones for combined
export const SHAPE_COLORS: Record<string, string> = {
  cube:                '#4A90B8',
  'rectangular-prism': '#5B9EC8',
  'triangular-prism':  '#3B7EA1',
  'regular-prism':     '#5098C0',
  cylinder:            '#3D8BAE',
  cone:                '#6098B8',
  pyramid:             '#5588A8',
  sphere:              '#4890B4',
  rectangle:           '#E8C55A',
  square:              '#F0CD60',
  parallelogram:       '#DDB840',
  trapezoid:           '#E5C050',
  triangle:            '#F5D068',
  circle:              '#EDCA58',
  oval:                '#E8C868',
  rhombus:             '#E0C048',
  kite:                '#F0D870',
  house:               '#C4820E',
  arch:                '#D9661F',
  stacked:             '#B87810',
}
