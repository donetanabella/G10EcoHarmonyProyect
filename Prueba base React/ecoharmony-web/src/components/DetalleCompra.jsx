import React, { useEffect, useState } from "react";

function obtenerRangoEtario(edad) {
  const n = parseInt(edad, 10);
  if (n < 10) return "Niño";
  if (n >= 65) return "Adulto Mayor";
  return "Adulto";
}

export default function DetalleCompra() {
  const [compra, setCompra] = useState(null);

  useEffect(() => {
    const datos = localStorage.getItem("detalleCompra");
    if (datos) {
      setCompra(JSON.parse(datos));
    }
  }, []);

  if (!compra) {
    return <div style={{ padding: 40, textAlign: "center" }}>No hay datos de compra para mostrar.</div>;
  }

  return (
    <div className="confirmation-details" style={{ maxWidth: 600, margin: "2rem auto" }}>
      <h3>Detalles de la compra</h3>
      <p><strong>Código de la compra:</strong> {compra.id}</p>
      <p><strong>Fecha de visita:</strong> {compra.fecha}</p>
      <p><strong>Cantidad de entradas:</strong> {compra.cantidad}</p>
      <p><strong>Visitantes:</strong></p>
      <ul>
        {compra.visitantes.map((v, i) => (
          <li key={i}>
            {v.nombre} {v.apellido} - {v.tipoEntrada === "vip" ? "VIP" : "Regular"} - <b>{obtenerRangoEtario(v.edad)}</b>
          </li>
        ))}
      </ul>
      <p><strong>Método de pago:</strong> {compra.formaPago}</p>
      <p><strong>Estado de la compra:</strong> {compra.estado}</p>
      <p><strong>Total:</strong> {compra.montoTotal}</p>
    </div>
  );
}