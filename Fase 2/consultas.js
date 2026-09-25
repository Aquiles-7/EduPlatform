// ============================================================
// EduPlatform - Fase 2: Consultas CRUD (MQL)
// Ejecutar en mongosh conectado a la base de datos "EduPlatform"
//   use EduPlatform
// ============================================================

// ------------------------------------------------------------
// PASO 3: CONSULTAS DE LECTURA (READ)
// ------------------------------------------------------------

// 1) Filtrado básico por coincidencia exacta
// Negocio: obtener todos los cursos de la categoría "Bases de Datos"
// para mostrarlos en la sección de catálogo filtrado por categoría.
db.cursos.find({
  categoria: "Bases de Datos" // coincidencia exacta de string
});

// 2) Operadores de comparación sobre campo numérico
// Negocio: identificar a los estudiantes que aprobaron una evaluación
// (puntaje mayor o igual a 70) para poder emitirles la constancia.
db.resultados.find({
  puntaje: { $gte: 70 } // $gte = mayor o igual a 70
});

// 3) Acceso a propiedades anidadas con dot notation
// Negocio: buscar cursos que contengan una lección específica dentro
// de sus módulos, útil para el buscador interno de contenidos.
db.cursos.find({
  "modulos.lecciones.titulo": "Instalación" // dot notation sobre arreglo anidado
});

// 4) Proyección de campos específica (excluyendo _id)
// Negocio: generar un listado liviano de usuarios (solo nombre y email)
// para exportar a una campaña de correo, sin exponer el _id interno.
db.usuarios.find(
  { rol: "estudiante" },
  { _id: 0, nombre: 1, email: 1 } // se excluye _id explícitamente
);

// 5) Filtrado de elementos dentro de un arreglo ($elemMatch)
// Negocio: encontrar evaluaciones que tengan al menos una pregunta
// cuya respuesta correcta sea "NoSQL", para auditar el banco de preguntas.
db.evaluaciones.find({
  preguntas: {
    $elemMatch: { respuestaCorrecta: "NoSQL" } // exige que UN MISMO elemento del arreglo cumpla la condición
  }
});

// ------------------------------------------------------------
// PASO 4: ACTUALIZACIONES ATÓMICAS (UPDATE) Y ELIMINACIÓN (DELETE)
// ------------------------------------------------------------

// 1) $set: modifica un campo simple y añade una nueva propiedad
// Negocio: el instructor actualiza la descripción del curso "cur001"
// y marca que ahora ofrece certificado.
db.cursos.updateOne(
  { _id: "cur001" },
  {
    $set: {
      descripcion: "Curso introductorio a MongoDB, actualizado con ejemplos prácticos", // modifica campo existente
      certificadoDisponible: true // añade nueva propiedad
    }
  }
);

// 2) $inc: incrementa/decrementa un contador numérico de forma atómica
// Negocio: el estudiante "usr001" avanza en su curso "cur001";
// se incrementa su progreso en 10 puntos porcentuales.
db.Inscripciones.updateOne(
  { estudianteId: "usr001", cursoId: "cur001" },
  { $inc: { progreso: 10 } } // suma 10 al valor actual de progreso
);

// 3) Eliminación segura con criterio de filtrado estricto
// Negocio: se depuran resultados de prueba con puntaje 0 asociados
// a una evaluación específica (datos de testing, no de alumnos reales).
db.resultados.deleteOne({
  evaluacionId: "eva999", // criterio estricto: evaluación de prueba que no existe en producción
  puntaje: 0
});
