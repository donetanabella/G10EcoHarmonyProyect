import {
  actividades,
  reservasExistentes,
  HORA_APERTURA,
  HORA_CIERRE,
} from "./datos-mock.js";

function inscribirAActividad(datos) {
  // 1. Verificar términos y condiciones
  if (!datos.aceptaTerminos) {
    return { exito: false, mensaje: "Debe aceptar los términos y condiciones" };
  }

  // 2. Verificar que la actividad existe
  const actividad = actividades.find((a) => a.nombre === datos.nombreActividad);
  if (!actividad) {
    return { exito: false, mensaje: "La actividad seleccionada no existe" };
  }

  // 3. Verificar cantidad de participantes
  if (datos.cantidadParticipantes !== datos.participantes.length) {
    return {
      exito: false,
      mensaje:
        "La cantidad de participantes no coincide con los datos proporcionados",
    };
  }

  // 4. Verificar horario del parque (abierto/cerrado)
  const hora = parseInt(datos.horario.split(":")[0]);
  if (hora < HORA_APERTURA || hora >= HORA_CIERRE) {
    return {
      exito: false,
      mensaje: "El parque está cerrado en el horario seleccionado",
    };
  }

  // 5. Verificar horario habilitado para la actividad
  if (!actividad.horarios.includes(datos.horario)) {
    return {
      exito: false,
      mensaje: "Horario no habilitado para esta actividad",
    };
  }

  // 6. Verificar cupo disponible
  const reserva = reservasExistentes.find(
    (r) => r.actividad === datos.nombreActividad && r.horario === datos.horario
  );
  const ocupados = reserva ? reserva.participantes : 0;
  const disponibles = actividad.cupoMaximo - ocupados;

  if (disponibles < datos.cantidadParticipantes) {
    return {
      exito: false,
      mensaje: "No hay cupo disponible en el horario seleccionado",
    };
  }

  // 7. Verificar datos de participantes (especialmente talla)
  for (let participante of datos.participantes) {
    // Validar datos básicos
    if (!participante.nombre || !participante.dni || participante.edad <= 0) {
      return {
        exito: false,
        mensaje: "Datos del participante incompletos o inválidos",
      };
    }

    // Validar talla si es requerida
    if (
      actividad.requiereTalla &&
      (!participante.talla || participante.talla.trim() === "")
    ) {
      return {
        exito: false,
        mensaje: "La talla es requerida para esta actividad",
      };
    }
  }

  // Todo OK - inscripción exitosa
  return { exito: true, mensaje: "Inscripción realizada exitosamente" };
}

export { inscribirAActividad };
