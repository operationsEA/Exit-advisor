// Main theme file - export all theme utilities
export { default as colors } from "./colors";
export { default as typography } from "./typography";
export { default as muiTheme } from "./muiTheme";

// Export combined theme object for easy access
import colors from "./colors";
import typography from "./typography";
import muiTheme from "./muiTheme";

export const theme = {
  colors,
  typography,
  muiTheme,
};

export default theme;
