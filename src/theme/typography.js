"use client";

// Centralized typography configuration
export const typography = {
  // Font families - Professional & Modern
  fontFamily: {
    // Primary font for headings - Bold and distinctive
    heading:
      "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    // Body font - Highly readable and clean
    body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    // Monospace for code snippets
    mono: "'Fira Code', 'Courier New', monospace",
  },

  // Font sizes with semantic names
  fontSize: {
    xs: "0.75rem", // 12px
    sm: "0.875rem", // 14px
    base: "1rem", // 16px
    lg: "1.125rem", // 18px
    xl: "1.25rem", // 20px
    "2xl": "1.5rem", // 24px
    "3xl": "1.875rem", // 30px
    "4xl": "2.25rem", // 36px
    "5xl": "3rem", // 48px
    "6xl": "3.75rem", // 60px
  },

  // Font weights
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },

  // Line heights for better readability
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },

  // Letter spacing
  letterSpacing: {
    tight: "-0.02em",
    normal: "0em",
    wide: "0.025em",
    wider: "0.05em",
    widest: "0.1em",
  },

  // Text styles - Pre-configured combinations
  styles: {
    h1: {
      fontSize: "3rem", // 48px
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: "-0.02em",
      fontFamily: "'Poppins', sans-serif",
    },
    h2: {
      fontSize: "2.25rem", // 36px
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: "-0.02em",
      fontFamily: "'Poppins', sans-serif",
    },
    h3: {
      fontSize: "1.875rem", // 30px
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: "-0.01em",
      fontFamily: "'Poppins', sans-serif",
    },
    h4: {
      fontSize: "1.5rem", // 24px
      fontWeight: 600,
      lineHeight: 1.4,
      fontFamily: "'Poppins', sans-serif",
    },
    h5: {
      fontSize: "1.25rem", // 20px
      fontWeight: 500,
      lineHeight: 1.4,
      fontFamily: "'Poppins', sans-serif",
    },
    h6: {
      fontSize: "1rem", // 16px
      fontWeight: 500,
      lineHeight: 1.5,
      fontFamily: "'Poppins', sans-serif",
    },
    body1: {
      fontSize: "1rem", // 16px
      fontWeight: 400,
      lineHeight: 1.5,
      fontFamily: "'Inter', sans-serif",
    },
    body2: {
      fontSize: "0.875rem", // 14px
      fontWeight: 400,
      lineHeight: 1.5,
      fontFamily: "'Inter', sans-serif",
    },
    caption: {
      fontSize: "0.75rem", // 12px
      fontWeight: 400,
      lineHeight: 1.5,
      fontFamily: "'Inter', sans-serif",
    },
    button: {
      fontSize: "0.875rem", // 14px
      fontWeight: 600,
      lineHeight: 1.5,
      letterSpacing: "0.025em",
      fontFamily: "'Inter', sans-serif",
    },
  },
};

export default typography;
