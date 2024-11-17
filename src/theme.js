import { createTheme } from "@mui/material";
// import { COLORS } from './constants/COLORS'



export const theme = createTheme({
    palette: {
        primary: {
          main: '#8EE252',
        },
        secondary: {
          main: '#87F6FF',
        },
        background: {
          default: '#FCFCFC',
        },
        text: {
          primary: '#2F2F2F',
        },
        error: {
          main: '#B6174B',
        },
        warning: {
          main: '#FCAB10',
        },
        info: {
          main: '#C9C9EE',
        },
        success: {
          main: '#4A7856',
        },
      },
//   palette: {
//     primary: {
//       main: COLORS.PRIMARY_MAIN,
//       dark: COLORS.PRIMARY_DARK
//     },
//     text: {
//       primary: COLORS.BLACK,
//     },
//     error: {
//       main: COLORS.RED,
//     },
//   },
  typography: {
    fontFamily: ['"k2d"', "Roboto"].join(","),
    allVariants: {
      fontSize: "2.4rem",
    },
    p:{
      fontSize: "2.4rem"
    },
    h1: {
      fontSize: "4.8rem",
    },
    h2: {
      fontSize: "4rem",
    },
    h3: {
      fontSize: "3.2rem",
    },
    h4: {
      fontSize: "2.8rem",
    },
    h5: {
      fontSize: "2.5rem",
    },
    subtitle1: {
      fontSize: "2rem",
    },
    subtitle2: {
      fontSize: "1.6rem",
    },
    caption: {
      fontSize: "1.2rem",
    },
  },
});
