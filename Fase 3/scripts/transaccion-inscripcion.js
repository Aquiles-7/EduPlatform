// Transacción ACID: inscribir a un estudiante en un curso.
// Dos operaciones que deben ocurrir juntas o no ocurrir:
//   1) insertar la inscripción
//   2) descontar un cupo del curso (solo si quedan cupos)

const dbp = db.getSiblingDB("eduplatform");

function estado(etiqueta, cursoId) {
  const curso = dbp.cursos.findOne({ _id: cursoId });
  print(etiqueta + " -> inscripciones: " + dbp.inscripciones.countDocuments() +
        " | cupos de " + cursoId + ": " + curso.cupos);
}

function inscribir(estudianteId, cursoId) {
  // La sesión agrupa las operaciones de la transacción
  const session = db.getMongo().startSession();
  const sdb = session.getDatabase("eduplatform"); // ¡usar sdb, no dbp, dentro de la transacción!

  session.startTransaction({
    readConcern: { level: "snapshot" },
    writeConcern: { w: "majority" }
  });

  try {
    // Operación 1: crear la inscripción
    sdb.inscripciones.insertOne({
      _id: "ins" + new Date().getTime(),
      estudianteId: estudianteId,
      cursoId: cursoId,
      fechaInscripcion: new Date().toISOString().slice(0, 10),
      progreso: 0
    });

    // Operación 2: descontar cupo, solo si hay disponibles
    const r = sdb.cursos.updateOne(
      { _id: cursoId, cupos: { $gt: 0 } },
      { $inc: { cupos: -1 } }
    );

    // Regla de negocio: sin cupo, se aborta todo (incluida la inscripción ya insertada)
    if (r.modifiedCount !== 1) {
      throw new Error("Sin cupos disponibles en " + cursoId);
    }

    session.commitTransaction();
    print("COMMIT: " + estudianteId + " inscripto en " + cursoId);
  } catch (e) {
    session.abortTransaction(); // rollback completo
    print("ABORT: " + e.message);
  } finally {
    session.endSession();
  }
}

print("=== ESCENARIO 1: éxito (cur006 tiene cupos) ===");
estado("ANTES   ", "cur006");
inscribir("usr003", "cur006");
estado("DESPUÉS ", "cur006");

print("\n=== ESCENARIO 2: fallo provocado (cur007 tiene 0 cupos) ===");
estado("ANTES   ", "cur007");
inscribir("usr003", "cur007");
estado("DESPUÉS ", "cur007");
