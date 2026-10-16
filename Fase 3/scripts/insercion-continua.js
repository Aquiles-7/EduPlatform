const col = db.getSiblingDB("eduplatform").failover_test;
let i = 0;
while (true) {
  try {
    col.insertOne({ n: i, ts: new Date() }, { writeConcern: { w: 1 } });
    print(new Date().toISOString() + " OK " + i);
  } catch (e) {
    print(new Date().toISOString() + " ERROR " + i + ": " + e.message);
  }
  i++;
  sleep(500);
}
