# EduPlatform - Plataforma de E-learning

## Descripción del Proyecto

EduPlatform es una plataforma de aprendizaje en línea diseñada para gestionar cursos, estudiantes, instructores, evaluaciones y el seguimiento del progreso académico.

El objetivo del sistema es centralizar la administración de contenidos educativos y facilitar el acceso a la información tanto para estudiantes como para instructores.

La base de datos tendrá un rol fundamental en el almacenamiento y recuperación eficiente de información relacionada con:

* Usuarios del sistema.
* Cursos y contenidos educativos.
* Inscripciones de estudiantes.
* Evaluaciones.
* Resultados y progreso académico.

El proyecto utilizará un enfoque NoSQL orientado a documentos, modelando la información de acuerdo con los patrones de consulta más frecuentes de la aplicación.

---

# Modelo de Datos

## Colección: usuarios

Almacena la información de estudiantes e instructores.

```json
{
  "_id": "usr001",
  "nombre": "Juan Pérez",
  "email": "juan@email.com",
  "rol": "estudiante",
  "fechaRegistro": "2026-08-18"
}
```

### Campos

| Campo         | Tipo   |
| ------------- | ------ |
| _id           | String |
| nombre        | String |
| email         | String |
| rol           | String |
| fechaRegistro | Date   |

---

## Colección: cursos

Contiene la información principal de cada curso junto con sus módulos y lecciones.

```json
{
  "_id": "cur001",
  "titulo": "MongoDB para Principiantes",
  "descripcion": "Curso introductorio a bases de datos NoSQL",
  "categoria": "Bases de Datos",
  "instructorId": "usr010",
  "modulos": [
    {
      "titulo": "Introducción",
      "lecciones": [
        {
          "titulo": "¿Qué es MongoDB?",
          "duracionMin": 20
        },
        {
          "titulo": "Instalación y configuración",
          "duracionMin": 30
        }
      ]
    }
  ]
}
```

### Campos

| Campo        | Tipo      |
| ------------ | --------- |
| _id          | String    |
| titulo       | String    |
| descripcion  | String    |
| categoria    | String    |
| instructorId | Reference |
| modulos      | Array     |

---

## Colección: inscripciones

Relaciona estudiantes con cursos.

```json
{
  "_id": "ins001",
  "estudianteId": "usr001",
  "cursoId": "cur001",
  "fechaInscripcion": "2026-08-18",
  "progreso": 65
}
```

### Campos

| Campo            | Tipo      |
| ---------------- | --------- |
| _id              | String    |
| estudianteId     | Reference |
| cursoId          | Reference |
| fechaInscripcion | Date      |
| progreso         | Number    |

---

## Colección: evaluaciones

Almacena evaluaciones asociadas a cada curso.

```json
{
  "_id": "eva001",
  "cursoId": "cur001",
  "titulo": "Evaluación Final",
  "preguntas": [
    {
      "enunciado": "¿Qué tipo de base de datos es MongoDB?",
      "opciones": [
        "Relacional",
        "NoSQL",
        "Jerárquica"
      ],
      "respuestaCorrecta": "NoSQL"
    }
  ]
}
```

### Campos

| Campo     | Tipo      |
| --------- | --------- |
| _id       | String    |
| cursoId   | Reference |
| titulo    | String    |
| preguntas | Array     |

---

## Colección: resultados

Registra los resultados obtenidos por los estudiantes en las evaluaciones.

```json
{
  "_id": "res001",
  "evaluacionId": "eva001",
  "estudianteId": "usr001",
  "puntaje": 90,
  "fecha": "2026-08-20"
}
```

### Campos

| Campo        | Tipo      |
| ------------ | --------- |
| _id          | String    |
| evaluacionId | Reference |
| estudianteId | Reference |
| puntaje      | Number    |
| fecha        | Date      |

---

# Fundamentación de la Lógica No Relacional

## Uso de Documentos Embebidos

### Módulos y lecciones dentro de cursos

Los módulos y las lecciones se modelaron como documentos embebidos dentro de la colección de cursos debido a que habitualmente son consultados junto con el curso completo.

Cuando un usuario accede a un curso, necesita visualizar toda su estructura académica, por lo que resulta conveniente obtener la información en una sola consulta.

Beneficios:

* Menor cantidad de consultas a la base de datos.
* Mejor rendimiento de lectura.
* Modelo más cercano a la estructura utilizada por la aplicación.

### Preguntas dentro de evaluaciones

Las preguntas fueron embebidas dentro de cada evaluación porque dependen exclusivamente de ella y no poseen utilidad de manera independiente.

Beneficios:

* Recuperación completa de la evaluación en una única consulta.
* Menor complejidad de modelado.
* Reducción de operaciones de búsqueda.

---

## Uso de Referencias

### Instructor referenciado desde cursos

Los cursos almacenan únicamente el identificador del instructor mediante el campo `instructorId`.

Motivo:

Un instructor puede estar asociado a múltiples cursos. Si sus datos fueran duplicados en cada curso, cualquier modificación requeriría actualizar numerosos documentos.

Beneficios:

* Evita redundancia de información.
* Mantiene consistencia de datos.
* Simplifica futuras actualizaciones.

### Inscripciones

La relación entre estudiantes y cursos se implementó mediante una colección independiente de inscripciones.

Motivo:

Existe una relación muchos a muchos entre estudiantes y cursos. Un estudiante puede inscribirse en varios cursos y un curso puede contener numerosos estudiantes.

Beneficios:

* Mayor flexibilidad.
* Menor duplicación de datos.
* Escalabilidad para grandes volúmenes de usuarios.

### Resultados de evaluaciones

Los resultados se almacenan en una colección separada.

Motivo:

La cantidad de resultados puede crecer significativamente con el tiempo. Embebirlos dentro de evaluaciones o usuarios generaría documentos demasiado grandes y difíciles de mantener.

Beneficios:

* Mejor escalabilidad.
* Consultas más eficientes.
* Menor crecimiento de documentos principales.

## Pruebas de Consultas (MQL)

> Los scripts completos están en `/scripts/consultas.js`. Los archivos de datos de sembrado están en `/scripts/*.json`.

### Lecturas

**1. Filtrado exacto — cursos por categoría**
```js
db.cursos.find({ categoria: "Bases de Datos" });
```
Resuelve: mostrar el catálogo de cursos filtrado por categoría en la página principal.

![Filtrado exacto — cursos por categoría](EduPlatform/assets/images/1. Filtrado exacto — cursos por categoría.png)

**2. Comparación — estudiantes aprobados**
```js
db.resultados.find({ puntaje: { $gte: 70 } });
```
Resuelve: identificar a los estudiantes que aprobaron una evaluación para emitir su constancia.

![Comparación — estudiantes aprobados](EduPlatform/assets/images/2. Comparación — estudiantes aprobados.png)

**3. Dot notation — búsqueda en lecciones anidadas**
```js
db.cursos.find({ "modulos.lecciones.titulo": "Instalación" });
```
Resuelve: alimentar el buscador interno de contenidos por título de lección.

![Dot notation — búsqueda en lecciones anidadas](EduPlatform/assets/images/3. Dot notation — búsqueda en lecciones anidadas.png)

**4. Proyección — listado liviano de usuarios**
```js
db.usuarios.find({ rol: "estudiante" }, { _id: 0, nombre: 1, email: 1 });
```
Resuelve: exportar nombre y email de estudiantes para una campaña de correo, sin exponer el `_id`.

![Proyección — listado liviano de usuarios](EduPlatform/assets/images/4. Proyección — listado liviano de usuarios.png)

**5. Filtrado de arreglo con `$elemMatch`**
```js
db.evaluaciones.find({ preguntas: { $elemMatch: { respuestaCorrecta: "NoSQL" } } });
```
Resuelve: auditar el banco de preguntas para encontrar evaluaciones con una respuesta correcta específica.

![Filtrado de arreglo con $elemMatch](EduPlatform/assets/images/5. Filtrado de arreglo con $elemMatch.png)

### Actualizaciones y eliminación

**1. `$set` — actualizar y añadir propiedad**
```js
db.cursos.updateOne(
  { _id: "cur001" },
  { $set: { descripcion: "Curso introductorio a MongoDB, actualizado con ejemplos prácticos", certificadoDisponible: true } }
);
```
Resuelve: el instructor mantiene actualizada la descripción del curso y habilita el certificado.

![$set — actualizar y añadir propiedad](EduPlatform/assets/images/6. $set — actualizar y añadir propiedad.png)

**2. `$inc` — incrementar contador**
```js
db.Inscripciones.updateOne(
  { estudianteId: "usr001", cursoId: "cur001" },
  { $inc: { progreso: 10 } }
);
```
Resuelve: reflejar el avance de un estudiante en su curso de forma atómica.

![$inc — incrementar contador](EduPlatform/assets/images/7. $inc — incrementar contador.png)

**3. `deleteOne` — eliminación segura**
```js
db.resultados.deleteOne({ evaluacionId: "eva999", puntaje: 0 });
```
Resuelve: depurar registros de prueba bajo un criterio estricto que no afecta datos reales.

![deleteOne — eliminación segura](EduPlatform/assets/images/3. deleteOne — eliminación segura.png)