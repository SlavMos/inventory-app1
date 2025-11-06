import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import axios from "axios";
import "./index.css";
import App from "./App.jsx";

// Глобальная настройка базового URL API для продакшена (Render)
axios.defaults.baseURL = import.meta.env.VITE_API_URL || "";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
