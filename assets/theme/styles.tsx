import { mode, StyleFunctionProps } from "@chakra-ui/theme-tools";

export const globalStyles = {
  colors: {
    background: "#e2e2e2",
    linearBackground: {
      100: "#e2e2e2",
      200: "#cccccc",
      300: "#c2c2c2",
    },
    gray: {
      700: "#1f2733",
    },
    teal: {
      500: "rgb(79, 209, 197)",
    },
  },
  styles: {
    global: (props: StyleFunctionProps) => ({
      body: {
        bg: mode("gray.50", "gray.800")(props),
        fontFamily: "Helvetica, sans-serif",
      },
      html: {
        fontFamily: "Helvetica, sans-serif",
      },
    }),
  },
};
