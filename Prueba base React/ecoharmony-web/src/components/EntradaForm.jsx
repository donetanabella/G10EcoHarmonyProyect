import { useState } from "react";
import { comprarEntradas } from "../services/api";
import "../styles/estiloParque.css";
import "../styles/EntradaForm.css";

export default function EntradaForm() {
  const [form, setForm] = useState({
    fecha: "",
    cantidad: 1,
    edades: [""],
    tipoPase: "regular",
    formaPago: "",
  });

  const [mensaje, setMensaje] = useState("");

  const handleChange = (e, index = null) => {
    const { name, value } = e.target;
    if (name === "edad") {
      const nuevasEdades = [...form.edades];
      nuevasEdades[index] = value;
      setForm({ ...form, edades: nuevasEdades });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleCantidadChange = (e) => {
    const nuevaCantidad = parseInt(e.target.value, 10);
    if (nuevaCantidad <= 10) {
      setForm({
        ...form,
        cantidad: nuevaCantidad,
        edades: Array(nuevaCantidad).fill(""),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await comprarEntradas(form);
      setMensaje(res.data.mensaje);
    } catch (err) {
      setMensaje(err.response?.data?.error || "Error al comprar entradas.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2>🎟️ Comprar Entradas</h2>

      <label>📅 Fecha de visita:</label>
      <input
        type="date"
        name="fecha"
        value={form.fecha}
        onChange={handleChange}
        required
      />

      <label>👨‍👩‍👧‍👦 Cantidad de entradas (máx 10):</label>
      <input
        type="number"
        name="cantidad"
        value={form.cantidad}
        onChange={handleCantidadChange}
        min={1}
        max={10}
        required
      />

      {form.edades.map((edad, index) => (
        <div key={index}>
          <label>🎂 Edad visitante #{index + 1}:</label>
          <input
            type="number"
            name="edad"
            value={edad}
            onChange={(e) => handleChange(e, index)}
            required
          />
        </div>
      ))}

      <label>🎫 Tipo de pase:</label>
      <select name="tipoPase" value={form.tipoPase} onChange={handleChange}>
        <option value="regular">Regular</option>
        <option value="vip">VIP</option>
      </select>

      <label>💳 Forma de pago:</label>
      <select name="formaPago" value={form.formaPago} onChange={handleChange} required>
        <option value="">Seleccionar</option>
        <option value="efectivo">Efectivo (boletería)</option>
        <option value="tarjeta">Tarjeta (Mercado Pago)</option>
      </select>

      <button type="submit">✅ Confirmar compra</button>

      {mensaje && <p>{mensaje}</p>}
    </form>
  );
}
