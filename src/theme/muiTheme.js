"use client";

import { createTheme } from "@mui/material/styles";
import colors from "./colors";
import typography from "./typography";

// Create Material-UI Theme
const muiTheme = createTheme({
  palette: {
    primary: {
      main: colors.primary[500],
      light: colors.primary[300],
      dark: colors.primary[700],
      contrastText: "#ffffff",
    },
    secondary: {
      main: colors.secondary[500],
      light: colors.secondary[300],
      dark: colors.secondary[700],
      contrastText: "#ffffff",
    },
    success: {
      main: colors.success[500],
      light: colors.success[300],
      dark: colors.success[700],
      contrastText: "#ffffff",
    },
    warning: {
      main: colors.warning[500],
      light: colors.warning[300],
      dark: colors.warning[700],
      contrastText: "#ffffff",
    },
    error: {
      main: colors.error[500],
      light: colors.error[300],
      dark: colors.error[700],
      contrastText: "#ffffff",
    },
    background: {
      default: colors.neutral[50],
      paper: "#ffffff",
    },
    text: {
      primary: colors.neutral[900],
      secondary: colors.neutral[700],
      disabled: colors.neutral[400],
    },
    divider: colors.neutral[200],
  },

  typography: {
    fontFamily: typography.fontFamily.body,
    h1: {
      fontFamily: typography.fontFamily.heading,
      fontSize: "3rem",
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: "-0.02em",
      marginBottom: "1rem",
    },
    h2: {
      fontFamily: typography.fontFamily.heading,
      fontSize: "2.25rem",
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: "-0.02em",
      marginBottom: "0.875rem",
    },
    h3: {
      fontFamily: typography.fontFamily.heading,
      fontSize: "1.875rem",
      fontWeight: 600,
      lineHeight: 1.3,
      marginBottom: "0.75rem",
    },
    h4: {
      fontFamily: typography.fontFamily.heading,
      fontSize: "1.5rem",
      fontWeight: 600,
      lineHeight: 1.4,
      marginBottom: "0.75rem",
    },
    h5: {
      fontFamily: typography.fontFamily.heading,
      fontSize: "1.25rem",
      fontWeight: 500,
      lineHeight: 1.4,
      marginBottom: "0.625rem",
    },
    h6: {
      fontFamily: typography.fontFamily.heading,
      fontSize: "1rem",
      fontWeight: 500,
      lineHeight: 1.5,
      marginBottom: "0.5rem",
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.5,
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.5,
    },
    button: {
      fontSize: "0.875rem",
      fontWeight: 600,
      letterSpacing: "0.025em",
      textTransform: "none",
    },
    caption: {
      fontSize: "0.75rem",
      lineHeight: 1.5,
    },
  },

  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: "0.5rem",
          fontWeight: 600,
          textTransform: "none",
          padding: "0.625rem 1.25rem",
          transition: "all 0.3s ease",
        },
        contained: {
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
          "&:hover": {
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.12)",
            transform: "translateY(-1px)",
          },
        },
        outlined: {
          borderWidth: "2px",
          "&:hover": {
            borderWidth: "2px",
            backgroundColor: "rgba(8, 132, 255, 0.04)",
          },
        },
        sizeSmall: {
          padding: "0.5rem 1rem",
        },
        sizeLarge: {
          padding: "0.875rem 2rem",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "0.75rem",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
          border: `1px solid ${colors.neutral[200]}`,
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
            transform: "translateY(-2px)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "0.75rem",
          backgroundImage: "none",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: "0.5rem",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: colors.neutral[300],
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: colors.neutral[400],
          },
          "& input:focus": {
            boxShadow: "none",
          },
          "& textarea:focus": {
            boxShadow: "none",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: "0.375rem",
          fontWeight: 500,
        },
      },
    },
  },

  shape: {
    borderRadius: 8,
  },

  spacing: 8,

  breakpoints: {
    values: {
      xs: 0,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
    },
  },
});

export default muiTheme;
