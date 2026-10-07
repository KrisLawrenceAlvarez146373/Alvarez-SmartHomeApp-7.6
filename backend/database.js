const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');
const initSqlJs = require('sql.js');

const DB_FILE = path.join(__dirname, 'app.db');
const SCHEMA_FILE = path.join(__dirname, 'schema.sql');
const SQL_JS_DIR = path.dirname(require.resolve('sql.js/dist/sql-wasm.js'));

const seedDevices = [
  {
    name: 'Living Room Light',
    type: 'Smart Light',
    icon: 'bulb-outline',
    status: 1,
  },
  {
    name: 'Bedroom Fan',
    type: 'Smart Fan',
    icon: 'sync-outline',
    status: 0,
  },
  {
    name: 'Front Door Lock',
    type: 'Smart Lock',
    icon: 'lock-closed-outline',
    status: 1,
  },
];

let sqlModulePromise;
let databasePromise;

function toDevice(row) {
  return {
    id: Number(row.id),
    name: row.name,
    type: row.type,
    icon: row.icon,
    status: Number(row.status) === 1,
  };
}

function toSensorSnapshot(row) {
  return {
    id: Number(row.id),
    temperature: Number(row.temperature),
    humidity: Number(row.humidity),
    lightLevel: Number(row.light_level),
    deviceId: Number(row.device_id),
    recordedAt: row.recorded_at,
  };
}

function queryAll(db, sql, params = []) {
  const statement = db.prepare(sql);
  statement.bind(params);
  const rows = [];

  while (statement.step()) {
    rows.push(statement.getAsObject());
  }

  statement.free();
  return rows;
}

function queryOne(db, sql, params = []) {
  return queryAll(db, sql, params)[0] || null;
}

function run(db, sql, params = []) {
  db.run(sql, params);
}

function nextSensorValues(previousRow) {
  const previousTemperature = previousRow ? Number(previousRow.temperature) : 28;
  const previousHumidity = previousRow ? Number(previousRow.humidity) : 65;
  const previousLightLevel = previousRow ? Number(previousRow.light_level) : 720;

  return {
    temperature: Math.round((previousTemperature + (Math.random() * 1.4 - 0.7)) * 10) / 10,
    humidity: Math.max(0, Math.min(100, Math.round(previousHumidity + Math.round(Math.random() * 4 - 2)))),
    lightLevel: Math.max(0, Math.round(previousLightLevel + Math.round(Math.random() * 30 - 15))),
  };
}

async function getSqlModule() {
  if (!sqlModulePromise) {
    sqlModulePromise = initSqlJs({
      locateFile: (fileName) => path.join(SQL_JS_DIR, fileName),
    });
  }

  return sqlModulePromise;
}

async function persistDatabase(db) {
  await fsp.writeFile(DB_FILE, Buffer.from(db.export()));
}

async function initializeDatabase() {
  if (databasePromise) {
    return databasePromise;
  }

  databasePromise = (async () => {
    const SQL = await getSqlModule();
    const databaseBytes = fs.existsSync(DB_FILE) ? await fsp.readFile(DB_FILE) : null;
    const db = databaseBytes ? new SQL.Database(databaseBytes) : new SQL.Database();

    const schema = await fsp.readFile(SCHEMA_FILE, 'utf8');
    db.exec(schema);

    const deviceCount = queryOne(db, 'SELECT COUNT(*) AS count FROM devices;');
    if (!deviceCount || Number(deviceCount.count) === 0) {
      seedDevices.forEach((device) => {
        run(
          db,
          'INSERT INTO devices (name, type, icon, status) VALUES (?, ?, ?, ?);',
          [device.name, device.type, device.icon, device.status]
        );
      });
    }

    const sensorCount = queryOne(db, 'SELECT COUNT(*) AS count FROM sensors;');
    if (!sensorCount || Number(sensorCount.count) === 0) {
      const seedTimestamp = new Date().toISOString();
      run(
        db,
        'INSERT INTO sensors (temperature, humidity, light_level, device_id, recorded_at) VALUES (?, ?, ?, ?, ?);',
        [28, 65, 720, 1, seedTimestamp]
      );
    }

    await persistDatabase(db);
    return db;
  })();

  return databasePromise;
}

async function listDevices() {
  const db = await initializeDatabase();
  return queryAll(db, 'SELECT id, name, type, icon, status FROM devices ORDER BY id ASC;').map(toDevice);
}

async function setDeviceStatus(id, status) {
  const db = await initializeDatabase();
  const existing = queryOne(db, 'SELECT id, name, type, icon, status FROM devices WHERE id = ?;', [id]);

  if (!existing) {
    return null;
  }

  run(db, 'UPDATE devices SET status = ? WHERE id = ?;', [status ? 1 : 0, id]);
  await persistDatabase(db);

  return toDevice({ ...existing, status: status ? 1 : 0 });
}

async function recordSensorReading() {
  const db = await initializeDatabase();
  const previousReading = queryOne(
    db,
    'SELECT id, temperature, humidity, light_level, device_id, recorded_at FROM sensors ORDER BY id DESC LIMIT 1;'
  );
  const nextValues = nextSensorValues(previousReading);
  const deviceId = previousReading ? Number(previousReading.device_id) : 1;
  const recordedAt = new Date().toISOString();

  run(
    db,
    'INSERT INTO sensors (temperature, humidity, light_level, device_id, recorded_at) VALUES (?, ?, ?, ?, ?);',
    [nextValues.temperature, nextValues.humidity, nextValues.lightLevel, deviceId, recordedAt]
  );

  await persistDatabase(db);

  const latestReading = queryOne(
    db,
    'SELECT id, temperature, humidity, light_level, device_id, recorded_at FROM sensors ORDER BY id DESC LIMIT 1;'
  );

  return latestReading ? toSensorSnapshot(latestReading) : null;
}

module.exports = {
  initializeDatabase,
  listDevices,
  setDeviceStatus,
  recordSensorReading,
};