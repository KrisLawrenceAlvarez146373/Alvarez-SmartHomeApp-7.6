const http = require('http');
const { initializeDatabase, listDevices, recordSensorReading, setDeviceStatus } = require('./database');

const PORT = Number(process.env.PORT || 3001);
const HOST = process.env.HOST || '0.0.0.0';

function send(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PATCH,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end(JSON.stringify(data));
}

function notFound(res) {
  send(res, 404, { error: 'Not found' });
}

function badRequest(res, message) {
  send(res, 400, { error: message });
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', () => {
      if (!body) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });

    req.on('error', reject);
  });
}


async function startServer() {
  await initializeDatabase();

  const server = http.createServer(async (req, res) => {
    if (!req.url) {
      notFound(res);
      return;
    }

    if (req.method === 'OPTIONS') {
      res.writeHead(204, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,PATCH,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      });
      res.end();
      return;
    }

    const requestUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

    try {
      if (req.method === 'GET' && requestUrl.pathname === '/health') {
        send(res, 200, { ok: true, service: 'iot-rest-api', database: 'sqlite' });
        return;
      }

      if (req.method === 'GET' && requestUrl.pathname === '/devices') {
        const devices = await listDevices();
        send(res, 200, devices);
        return;
      }

      if (req.method === 'GET' && requestUrl.pathname === '/sensors') {
        const sensorReading = await recordSensorReading();
        send(res, 200, sensorReading);
        return;
      }

      if (req.method === 'PATCH' && requestUrl.pathname.startsWith('/devices/')) {
        const id = Number(requestUrl.pathname.split('/')[2]);
        if (Number.isNaN(id)) {
          badRequest(res, 'Invalid device id.');
          return;
        }

        const body = await parseBody(req);
        if (typeof body.status !== 'boolean') {
          badRequest(res, 'Expected a boolean status value.');
          return;
        }

        const updatedDevice = await setDeviceStatus(id, body.status);
        if (!updatedDevice) {
          send(res, 404, { error: `Device with ID ${id} not found.` });
          return;
        }

        send(res, 200, updatedDevice);
        return;
      }

      notFound(res);
    } catch (error) {
      send(res, 500, {
        error: 'Server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });

  server.listen(PORT, HOST, () => {
    console.log(`REST API running at http://${HOST}:${PORT}`);
    console.log('Endpoints: GET /health, GET /devices, GET /sensors, PATCH /devices/:id');
  });
}

startServer().catch((error) => {
  console.error('Failed to start REST API:', error);
  process.exit(1);
});
