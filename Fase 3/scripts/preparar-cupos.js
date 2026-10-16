const d = db.getSiblingDB("eduplatform");
d.cursos.updateMany({}, { $set: { cupos: 5 } });
const r = d.cursos.updateOne({ _id: "cur007" }, { $set: { cupos: 0 } });
print("cursos con cupo: " + d.cursos.countDocuments({ cupos: 5 }));
print("cur007 sin cupo (modificados: " + r.modifiedCount + ")");
