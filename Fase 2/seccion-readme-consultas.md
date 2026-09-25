## Pruebas de Consultas (MQL)

> Los scripts completos están en `/scripts/consultas.js`. Los archivos de datos de sembrado están en `/scripts/*.json`.

### Lecturas

**1. Filtrado exacto — cursos por categoría**
```js
db.cursos.find({ categoria: "Bases de Datos" });
```
Resuelve: mostrar el catálogo de cursos filtrado por categoría en la página principal.
*(Insertar aquí captura de Mongosh/Compass)*

**2. Comparación — estudiantes aprobados**
```js
db.resultados.find({ puntaje: { $gte: 70 } });
```
Resuelve: identificar a los estudiantes que aprobaron una evaluación para emitir su constancia.
*(Insertar aquí captura de Mongosh/Compass)*

**3. Dot notation — búsqueda en lecciones anidadas**
```js
db.cursos.find({ "modulos.lecciones.titulo": "Instalación" });
```
Resuelve: alimentar el buscador interno de contenidos por título de lección.
*(Insertar aquí captura de Mongosh/Compass)*

**4. Proyección — listado liviano de usuarios**
```js
db.usuarios.find({ rol: "estudiante" }, { _id: 0, nombre: 1, email: 1 });
```
Resuelve: exportar nombre y email de estudiantes para una campaña de correo, sin exponer el `_id`.
*(Insertar aquí captura de Mongosh/Compass)*

**5. Filtrado de arreglo con `$elemMatch`**
```js
db.evaluaciones.find({ preguntas: { $elemMatch: { respuestaCorrecta: "NoSQL" } } });
```
Resuelve: auditar el banco de preguntas para encontrar evaluaciones con una respuesta correcta específica.
*(Insertar aquí captura de Mongosh/Compass)*

### Actualizaciones y eliminación

**1. `$set` — actualizar y añadir propiedad**
```js
db.cursos.updateOne(
  { _id: "cur001" },
  { $set: { descripcion: "Curso introductorio a MongoDB, actualizado con ejemplos prácticos", certificadoDisponible: true } }
);
```
Resuelve: el instructor mantiene actualizada la descripción del curso y habilita el certificado.
*(Insertar aquí captura de Mongosh/Compass)*

**2. `$inc` — incrementar contador**
```js
db.Inscripciones.updateOne(
  { estudianteId: "usr001", cursoId: "cur001" },
  { $inc: { progreso: 10 } }
);
```
Resuelve: reflejar el avance de un estudiante en su curso de forma atómica.
*(Insertar aquí captura de Mongosh/Compass)*

**3. `deleteOne` — eliminación segura**
```js
db.resultados.deleteOne({ evaluacionId: "eva999", puntaje: 0 });
```
Resuelve: depurar registros de prueba bajo un criterio estricto que no afecta datos reales.
*(Insertar aquí captura de Mongosh/Compass)*
