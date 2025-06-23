// Tests para el sistema de inscripción simple
const { inscribirAActividad } = require("./inscripcion-actividad");

describe("Sistema de Inscripción - EcoHarmony Park", () => {
  // CASOS EXITOSOS
  test("Inscripción exitosa para Tirolesa con talla", () => {
    const datos = {
      nombreActividad: "Tirolesa",
      horario: "11:00",
      cantidadParticipantes: 2,
      participantes: [
        { nombre: "Juan", dni: "12345678", edad: 25, talla: "M" },
        { nombre: "María", dni: "87654321", edad: 30, talla: "S" },
      ],
      aceptaTerminos: true,
    };

    const resultado = inscribirAActividad(datos);

    expect(resultado.exito).toBe(true);
    expect(resultado.mensaje).toBe("Inscripción realizada exitosamente");
  });

  test("Inscripción exitosa para Safari sin talla", () => {
    const datos = {
      nombreActividad: "Safari",
      horario: "15:00",
      cantidadParticipantes: 1,
      participantes: [{ nombre: "Ana", dni: "11111111", edad: 28 }],
      aceptaTerminos: true,
    };

    const resultado = inscribirAActividad(datos);

    expect(resultado.exito).toBe(true);
    expect(resultado.mensaje).toBe("Inscripción realizada exitosamente");
  });

  // CASOS DE ERROR
  test("Error: No acepta términos", () => {
    const datos = {
      nombreActividad: "Safari",
      horario: "15:00",
      cantidadParticipantes: 1,
      participantes: [{ nombre: "Pedro", dni: "12345678", edad: 30 }],
      aceptaTerminos: false,
    };

    const resultado = inscribirAActividad(datos);

    expect(resultado.exito).toBe(false);
    expect(resultado.mensaje).toBe("Debe aceptar los términos y condiciones");
  });

  test("Error: Actividad no existe", () => {
    const datos = {
      nombreActividad: "Bungee",
      horario: "10:00",
      cantidadParticipantes: 1,
      participantes: [{ nombre: "Luis", dni: "12345678", edad: 25 }],
      aceptaTerminos: true,
    };

    const resultado = inscribirAActividad(datos);

    expect(resultado.exito).toBe(false);
    expect(resultado.mensaje).toBe("La actividad seleccionada no existe");
  });

  test("Error: Cantidad de participantes no coincide", () => {
    const datos = {
      nombreActividad: "Safari",
      horario: "13:00",
      cantidadParticipantes: 2,
      participantes: [{ nombre: "Carlos", dni: "12345678", edad: 35 }],
      aceptaTerminos: true,
    };

    const resultado = inscribirAActividad(datos);

    expect(resultado.exito).toBe(false);
    expect(resultado.mensaje).toBe(
      "La cantidad de participantes no coincide con los datos proporcionados"
    );
  });

  test("Error: Parque cerrado", () => {
    const datos = {
      nombreActividad: "Safari",
      horario: "19:00", // Después de las 18:00
      cantidadParticipantes: 1,
      participantes: [{ nombre: "Elena", dni: "12345678", edad: 32 }],
      aceptaTerminos: true,
    };

    const resultado = inscribirAActividad(datos);

    expect(resultado.exito).toBe(false);
    expect(resultado.mensaje).toBe(
      "El parque está cerrado en el horario seleccionado"
    );
  });

  test("Error: Horario no habilitado", () => {
    const datos = {
      nombreActividad: "Safari",
      horario: "12:00", // No está en los horarios disponibles
      cantidadParticipantes: 1,
      participantes: [{ nombre: "Roberto", dni: "12345678", edad: 40 }],
      aceptaTerminos: true,
    };

    const resultado = inscribirAActividad(datos);

    expect(resultado.exito).toBe(false);
    expect(resultado.mensaje).toBe("Horario no habilitado para esta actividad");
  });

  test("Error: Sin cupo disponible", () => {
    const datos = {
      nombreActividad: "Palestra",
      horario: "09:30", // Ya está lleno (8/8)
      cantidadParticipantes: 1,
      participantes: [
        { nombre: "Laura", dni: "12345678", edad: 27, talla: "M" },
      ],
      aceptaTerminos: true,
    };

    const resultado = inscribirAActividad(datos);

    expect(resultado.exito).toBe(false);
    expect(resultado.mensaje).toBe(
      "No hay cupo disponible en el horario seleccionado"
    );
  });

  test("Error: Talla requerida pero no proporcionada", () => {
    const datos = {
      nombreActividad: "Tirolesa", // Requiere talla
      horario: "14:00",
      cantidadParticipantes: 1,
      participantes: [{ nombre: "Diego", dni: "12345678", edad: 29 }], // Sin talla
      aceptaTerminos: true,
    };

    const resultado = inscribirAActividad(datos);

    expect(resultado.exito).toBe(false);
    expect(resultado.mensaje).toBe("La talla es requerida para esta actividad");
  });

  test("Error: Datos de participante inválidos", () => {
    const datos = {
      nombreActividad: "Safari",
      horario: "13:00",
      cantidadParticipantes: 1,
      participantes: [{ nombre: "", dni: "12345678", edad: 25 }], // Nombre vacío
      aceptaTerminos: true,
    };

    const resultado = inscribirAActividad(datos);

    expect(resultado.exito).toBe(false);
    expect(resultado.mensaje).toBe(
      "Datos del participante incompletos o inválidos"
    );
  });
});
