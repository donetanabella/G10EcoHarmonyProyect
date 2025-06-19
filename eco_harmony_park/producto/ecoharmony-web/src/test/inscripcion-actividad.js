// EcoHarmony Park - Sistema de Inscripción a Actividades
// Implementación simple con TDD

// Datos hardcodeados de actividades disponibles
const actividades = [
  {
    nombre: "Tirolesa",
    requiereTalla: true,
    cupoMaximo: 10,
    horarios: ["09:00", "11:00", "14:00", "16:00"],
  },
  {
    nombre: "Safari",
    requiereTalla: false,
    cupoMaximo: 20,
    horarios: ["08:00", "10:00", "13:00", "15:00", "17:00"],
  },
  {
    nombre: "Palestra",
    requiereTalla: true,
    cupoMaximo: 8,
    horarios: ["09:30", "11:30", "14:30", "16:30"],
  },
  {
    nombre: "Jardinería",
    requiereTalla: false,
    cupoMaximo: 15,
    horarios: ["08:30", "10:30", "13:30", "15:30"],
  },
];

// Reservas existentes (simuladas)
const reservasExistentes = [
  { actividad: "Tirolesa", horario: "09:00", participantes: 8 },
  { actividad: "Safari", horario: "10:00", participantes: 15 },
  { actividad: "Palestra", horario: "09:30", participantes: 8 }, // Sin cupo disponible
];

// Horario del parque
const HORA_APERTURA = 8;
const HORA_CIERRE = 18;

/**
 * Función principal para inscribirse a una actividad
 */
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

module.exports = { inscribirAActividad };
