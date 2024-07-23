import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { baseTheme, ChakraProvider, extendTheme } from "@chakra-ui/react";

// Extend Theme
const colors = {
  dark: {
    primary: "orange",
    secondary: baseTheme.colors.purple[500],
    tertiary: "black",
    danger: "orangered",
    enabled: "orange",
    disabled: baseTheme.colors.gray[100],
    focused: "orange",
    error: baseTheme.colors.purple[500],
    blackish: "#1f1e1e",
    greyish: "#f3f3f3",
    greenish: "#b8ff66",
    orangeish: "#ffcc33",
    blueish: "#3399ff",
    yellowish: "#fffe00",
    redish: "#ff3333",
    purpleish: "#9933ff",
    pinkish: "#ff33ff",
    social_link: "orange",
    outline: "orange",
    item_bg: "zinc",
    text: {
      primary: "#f5f6f7",
      secondary: "#f5f6f7",
      icon_button: "orange",
    },
  },
};

const styles = {
  global: {
    body: {
      color: "dark.text.primary",
    },
  },
};

const configs = {
  initialColorMode: "dark",
};

const theme = extendTheme({ colors, styles, configs });

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>
);
