// types
import { PaletteThemeProps } from 'types/theme';
import { PalettesProps } from '@ant-design/colors';
import { PaletteColorOptions } from '@mui/material/styles';
import { ThemeMode } from 'types/config';

// SnipKlip default — ink + teal (matches landing)
// Accent: #63c7bd · Main: #0d7377 · Ink: #0A1628
const TEAL_LIGHT = [
  '#eef7f6', // lighter
  '#c9ebe6', // 100
  '#9ad9d3', // 200
  '#63c7bd', // light
  '#3aafa6', // 400
  '#0d7377', // main
  '#0a5f62', // dark
  '#084a4c', // 700
  '#0A1628', // darker (ink)
  '#071018' // 900
];

const TEAL_DARK = [
  '#122426', // lighter
  '#163336', // 100
  '#1a4548', // 200
  '#1f5c5f', // light
  '#2a7a7d', // 400
  '#63c7bd', // main (brighter on dark UI)
  '#4fb5ab', // dark
  '#3a9a92', // 700
  '#2a7a74', // darker
  '#c9ebe6' // 900
];

// ==============================|| PRESET THEME - DEFAULT (SNIPKLIP TEAL) ||============================== //

const Default = (colors: PalettesProps, mode: ThemeMode = 'light'): PaletteThemeProps => {
  const { red, gold, cyan, green, grey } = colors;
  const greyColors: PaletteColorOptions = {
    0: grey[0],
    50: grey[1],
    100: grey[2],
    200: grey[3],
    300: grey[4],
    400: grey[5],
    500: grey[6],
    600: grey[7],
    700: grey[8],
    800: grey[9],
    900: grey[10],
    A50: grey[15],
    A100: grey[11],
    A200: grey[12],
    A400: grey[13],
    A700: grey[14],
    A800: grey[16]
  };
  const contrastText = '#fff';
  const primaryColors = mode === 'dark' ? TEAL_DARK : TEAL_LIGHT;

  let errorColors = [red[0], red[2], red[4], red[7], red[9]];
  let warningColors = [gold[0], gold[3], gold[5], gold[7], gold[9]];
  let infoColors = [cyan[0], cyan[3], cyan[5], cyan[7], cyan[9]];
  let successColors = [green[0], green[3], green[5], green[7], green[9]];

  if (mode === 'dark') {
    errorColors = ['#321d1d', '#7d2e28', '#d13c31', '#e66859', '#f8baaf'];
    warningColors = ['#342c1a', '#836611', '#dda705', '#e9bf28', '#f8e577'];
    infoColors = ['#1a2628', '#11595f', '#058e98', '#1ea6aa', '#64cfcb'];
    successColors = ['#1a2721', '#115c36', '#05934c', '#1da65d', '#61ca8b'];
  }

  return {
    primary: {
      lighter: primaryColors[0],
      100: primaryColors[1],
      200: primaryColors[2],
      light: primaryColors[3],
      400: primaryColors[4],
      main: primaryColors[5],
      dark: primaryColors[6],
      700: primaryColors[7],
      darker: primaryColors[8],
      900: primaryColors[9],
      contrastText
    },
    secondary: {
      lighter: greyColors[100],
      100: greyColors[100],
      200: greyColors[200],
      light: greyColors[300],
      400: greyColors[400],
      main: greyColors[500]!,
      600: greyColors[600],
      dark: greyColors[700],
      800: greyColors[800],
      darker: greyColors[900],
      A100: greyColors[0],
      A200: greyColors.A400,
      A300: greyColors.A700,
      contrastText: greyColors[0]
    },
    error: {
      lighter: errorColors[0],
      light: errorColors[1],
      main: errorColors[2],
      dark: errorColors[3],
      darker: errorColors[4],
      contrastText
    },
    warning: {
      lighter: warningColors[0],
      light: warningColors[1],
      main: warningColors[2],
      dark: warningColors[3],
      darker: warningColors[4],
      contrastText: greyColors[100]
    },
    info: {
      lighter: infoColors[0],
      light: infoColors[1],
      main: infoColors[2],
      dark: infoColors[3],
      darker: infoColors[4],
      contrastText
    },
    success: {
      lighter: successColors[0],
      light: successColors[1],
      main: successColors[2],
      dark: successColors[3],
      darker: successColors[4],
      contrastText
    },
    grey: greyColors
  };
};

export default Default;
