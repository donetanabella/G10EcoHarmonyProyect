// server.js
const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;  // El puerto en el que correrá el servidor

// Middleware
app.use(express.json());   // Para parsear el body de las peticiones como JSON
app.use(cors());           // Para permitir solicitudes desde otros orígenes (frontend React)

// Endpoint para la compra de entradas
app.post("/api/comprar", (req, res) => {
  const { fecha, cantidad, edades, tipoPase, formaPago } = req.body;

  // Verificar si la cantidad de entradas es válida
  if (cantidad > 10) {
    return res.status(400).json({ error: "La cantidad de entradas no puede ser mayor a 10" });
  }

  // Verificar que la fecha sea válida
  const fechaActual = new Date();
  const fechaVisitante = new Date(fecha);
  if (fechaVisitante < fechaActual) {
    return res.status(400).json({ error: "La fecha de visita debe ser hoy o en el futuro" });
  }

  // Verificar que se haya seleccionado una forma de pago
  if (!formaPago) {
    return res.status(400).json({ error: "Debe seleccionar una forma de pago" });
  }

  // Verificar que el tipo de pase esté presente
  if (!tipoPase) {
    return res.status(400).json({ error: "Debe seleccionar un tipo de pase (VIP o regular)" });
  }

  // Si todo es válido, devolver una respuesta de éxito
  return res.status(200).json({
    mensaje: `Compra realizada con éxito! ${cantidad} entradas para el ${tipoPase} el ${fecha}.`
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
