import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { css, Global } from "@emotion/react";

const globalStyle = css`
  * {
    font-family: "Noto Sans JP", serif;
  }

  body {
    margin: 0;
  }
`;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Global styles={globalStyle} />
    <App />
  </StrictMode>
);
