// src/pages/ComprarEntradas.jsx
import EntradaForm from "../components/EntradaForm";

export default function ComprarEntradas() {
  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto", backgroundColor: "#f0fff0", borderRadius: "1rem", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
      <h2 style={{ textAlign: "center", color: "#2e7d32" }}>Compra de entradas</h2>
      <EntradaForm />
    </div>
  );
}
