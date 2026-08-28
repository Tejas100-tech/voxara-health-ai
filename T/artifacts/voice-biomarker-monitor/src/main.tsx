import { createRoot } from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "./lib/theme";
import { AyushModeProvider } from "./lib/ayush-mode";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <AyushModeProvider>
      <App />
    </AyushModeProvider>
  </ThemeProvider>
);
