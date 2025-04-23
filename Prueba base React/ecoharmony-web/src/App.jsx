import React from "react";
import FormularioCompra from "./components/EntradaForm";
import DetalleCompra from "./components/DetalleCompra";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import logo from "./assets/logoEcoHarmony.png"; // Asegúrate de que la ruta sea correcta

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
                width: "100%",
                height: "150px",
                objectFit: "cover",
                display: "block",
                margin: "0",
                padding: "0",
                border: "none", 
                boxShadow: "none" 
              }}
            />
            <FormularioCompra />
          </div>
        } />
        <Route path="/detalle-compra" element={<DetalleCompra />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
