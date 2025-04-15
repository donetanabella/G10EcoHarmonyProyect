import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"; // Podés usar este archivo para estilos globales si querés

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
