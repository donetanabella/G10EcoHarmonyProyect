// server.js
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const app = express();
const port = 3000;  // El puerto en el que correrá el servidor

// Middleware para harcodear el usuario
app.use(express.json());   // Para parsear el body de las peticiones como JSON
app.use(cors());           // Para permitir solicitudes desde otros orígenes (frontend React)

app.use((req, _res, next) => {
  req.user = {
    id: 1,
    name: "Anabella Donet",
    email: "anabella.donet@gmail.com"

  };
  next();
}
);

// Configuración del transporte de correo (en producción, usar credenciales reales)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // Cambia esto por el host SMTP de tu proveedor
  port: 587,
  secure: false, // true para 465, false para otros puertos
  auth: {
    user: "reservas.ecoharmonypark@gmail.com", // usuario SMTP
    pass: "gsjmlknfzjrzflkd", // contraseña SMTP
  },
});

// Función para formatear la fecha
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-AR');
};

// Función para enviar correo de confirmación
const enviarConfirmacion = async (datos, correoUsuario) => {
  try {
    const { fecha, cantidad, visitantes, montoTotal, formaPago } = datos;
    
    // Construir lista de visitantes
    let listaVisitantes = '';
    visitantes.forEach((visitante, index) => {
      listaVisitantes += `${index + 1}. ${visitante.nombre} ${visitante.apellido} - ${visitante.tipoEntrada === 'vip' ? 'VIP' : 'Regular'}\n`;
    });
    
    const metodoPago = formaPago === 'efectivo' 
      ? 'Efectivo (boletería)' 
      : formaPago === 'visa' ? 'Tarjeta Visa' : 'Tarjeta Mastercard';
    
    const fechaFormateada = formatDate(fecha);
    
    // Contenido del correo
    const mailOptions = {
      from: '"EcoHarmony Park" <reservas@ecoharmonypark.com>',
      to: correoUsuario,
      subject: "Confirmación de compra - EcoHarmony Park",
      text: `
        ¡Compra realizada con éxito!
        
        Detalles de la compra:
        
        Para el día: ${fechaFormateada}
        Cantidad de entradas: ${cantidad}
        
        Detalle de los visitantes:
        ${listaVisitantes}
        
        Método de pago: ${metodoPago}
        Total: ${new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(montoTotal)}
        Error al enviar correo: Error: getaddrinfo ENOTFOUND smtp.example.com
    at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:120:26) {
  errno: -3008,
  code: 'EDNS',
  syscall: 'getaddrinfo',
  hostname: 'smtp.example.com',
  command: 'CONN'
}
No se pudo reenviar el correo al administrador.
^C
        Gracias por su compra. ¡Lo esperamos en EcoHarmony Park!
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #c8e6c9; border-radius: 10px; background-color: #f1f8e9;">
          <h2 style="color: #2e7d32; text-align: center;">¡Compra realizada con éxito!</h2>
          <h3 style="color: #33691e;">Detalles de la compra:</h3>
          
          <p><strong>Para el día:</strong> ${fechaFormateada}</p>
          <p><strong>Cantidad de entradas:</strong> ${cantidad}</p>
          
          <p><strong>Detalle de los visitantes:</strong></p>
          <ul>
            ${visitantes.map((v, _i) => `<li>${v.nombre} ${v.apellido} - ${v.tipoEntrada === 'vip' ? 'VIP' : 'Regular'}</li>`).join('')}
          </ul>
          
          <p><strong>Método de pago:</strong> ${metodoPago}</p>
          <p><strong>Total:</strong> ${new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(montoTotal)}</p>
          
          <p style="text-align: center; margin-top: 30px; color: #2e7d32;">¡Gracias por su compra! Lo esperamos en EcoHarmony Park.</p>
        </div>
      `,
    };
    
    // Enviar el correo
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error al enviar correo:", error);
    return false;
  }
};

// Modificación al endpoint de compra
app.post("/api/comprar", async (req, res) => {
  console.log("Datos recibidos en el servidor:", req.body);
  const { fecha, cantidad, visitantes, formaPago, montoTotal } = req.body;

  // Validación completa de datos recibidos
  if (!fecha || !cantidad || !Array.isArray(visitantes) || visitantes.length === 0 || !formaPago || !req.user.email) {
    console.log("Campos requeridos faltantes:", {
      fecha: !!fecha,
      cantidad: !!cantidad,
      visitantesArray: Array.isArray(visitantes),
      visitantesLength: visitantes?.length,
      formaPago: !!formaPago,
      email: !!req.user.email,
      
    });
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  // Verificar si la cantidad de entradas es válida
  if (cantidad > 10) {
    return res.status(400).json({ error: "La cantidad de entradas no puede ser mayor a 10" });
  }

  try {
    // Verificar formato de fecha
    console.log("Fecha recibida:", fecha);
    
    // Convertir la fecha a objeto Date
    const fechaActual = new Date();
    let fechaVisitante;
    
    try {
      const [year, month, day] = fecha.split('-').map(Number);
      fechaVisitante = new Date(year, month - 1, day); // Esto crea la fecha en horario local
      // Verificar si la fecha es válida
      if (isNaN(fechaVisitante.getTime())) {
        console.error("Fecha inválida:", fecha);
        return res.status(400).json({ error: "Formato de fecha inválido" });
      }
    } catch (error) {
      console.error("Error al procesar la fecha:", error);
      return res.status(400).json({ error: "Error al procesar la fecha" });
    }
    
    console.log("Fecha visitante (objeto Date):", fechaVisitante);
    console.log("Día de la semana:", fechaVisitante.getDay());
    
    // Restablecer la hora a 00:00:00 para comparar solo fechas
    const fechaActualSinHora = new Date(fechaActual.setHours(0, 0, 0, 0));
    const fechaVisitanteSinHora = new Date(fechaVisitante.setHours(0, 0, 0, 0));
    
    if (fechaVisitanteSinHora < fechaActualSinHora) {
      return res.status(400).json({ error: "La fecha de visita debe ser hoy o en el futuro" });
    }
    
    // Verificar que no sea martes o jueves (días cerrados)
    const diaSemana = fechaVisitante.getDay();
    if (diaSemana === 2 || diaSemana === 4) {
      return res.status(400).json({ error: "Martes y Jueves el parque permanecerá cerrado" });
    }
    
    // Verificar límite de 6 meses
    const seisMesesDespues = new Date();
    seisMesesDespues.setMonth(fechaActual.getMonth() + 6);
    if (fechaVisitante > seisMesesDespues) {
      return res.status(400).json({ error: "Las reservas solo pueden hacerse con hasta 6 meses de anticipación" });
    }

    // Validar montoTotal (debe ser un número)
    if (typeof montoTotal !== 'number' && isNaN(parseFloat(montoTotal))) {
      console.error("Monto total inválido:", montoTotal);
      return res.status(400).json({ error: "El monto total debe ser un valor numérico" });
    }

    // Si es pago con tarjeta, simulamos procesamiento
    if (formaPago !== "efectivo") {
      console.log("Procesando pago con tarjeta...");
    }
    
    // Simular envío de correo (en ambiente de desarrollo)
    console.log(`Se enviaría correo a: ${req.user.email}`);
    try {

      // Reenviar datos al correo específico
      const reenviado = await enviarConfirmacion(req.body, req.user.email);
      if (!reenviado) {
        console.warn("No se pudo reenviar el correo al administrador.");
      }
      } catch (error) {
      console.error("Error en el servidor:", error);
      return res.status(500).json({ error: "Error al procesar la compra. Por favor intente nuevamente." });
    }
    
    // Generar mensaje de respuesta según método de pago
    let mensaje;
    if (formaPago === "efectivo") {
      mensaje = "Usted reservó su entrada con éxito. Para confirmar la compra, debe abonar en la boletería del parque";
    } else {
      mensaje = "¡Compra realizada con éxito! Se ha enviado un correo de confirmación.";
    }
    
    // Si todo es válido, devolver una respuesta de éxito
    return res.status(200).json({
      mensaje,
      detalles: {
        fecha: fechaVisitante.toLocaleDateString('es-AR'),
        cantidad,
        visitantes,
        formaPago,
        montoTotal: typeof montoTotal === 'number' ? montoTotal : parseFloat(montoTotal)
      }
    });
  } catch (error) {
    console.error("Error en el servidor:", error);
    return res.status(500).json({ error: "Error al procesar la compra. Por favor intente nuevamente." });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
