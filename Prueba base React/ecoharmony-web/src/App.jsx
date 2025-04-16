import React from "react";
import FormularioCompra from "./components/EntradaForm";
import DetalleCompra from "./components/DetalleCompra";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import logo from "./assets/logo.png"; // Asegúrate de que la ruta sea correcta

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <div>
            <img
              src={logo}
              alt="EcoHarmony Park Logo"
              style={{
                display: "block",
                margin: "0 auto 1rem auto",
                maxWidth: "180px",
                height: "auto"
              }}
            />
            <h1>🌿 Bienvenido a EcoHarmony Park 🌿</h1>
            <FormularioCompra />
          </div>
        } />
        <Route path="/detalle-compra" element={<DetalleCompra />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
