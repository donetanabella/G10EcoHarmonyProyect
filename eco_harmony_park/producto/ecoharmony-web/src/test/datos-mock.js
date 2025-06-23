/**
 * Datos mockeados para el sistema de inscripción de EcoHarmony Park
 * Este archivo contiene la información simulada de actividades, reservas y configuración del parque
 */

export const actividades = [
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

export const reservasExistentes = [
  { actividad: "Tirolesa", horario: "09:00", participantes: 8 },
  { actividad: "Safari", horario: "10:00", participantes: 15 },
  { actividad: "Palestra", horario: "09:30", participantes: 8 }, // Sin cupo disponible
];

export const HORA_APERTURA = 8;
export const HORA_CIERRE = 18;
