const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PATCH"]
  }
});

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173"
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Storage
let infrastructure = [];
let alerts = [];
let otps = {};

// Initial mock complaints as requested (but I will remove the ones the user doesn't want in the next turn if needed)
// Actually, user said "remove the old complaints which are from code" in Step 306.
let complaints = [];

const generateInitialData = () => {
  const infrastructureTypes = ['streetlight', 'traffic_signal', 'water_supply', 'waste_bin'];
  const locations = [
    { lat: 40.7128, lng: -74.0060, name: "Times Square" },
    { lat: 40.7580, lng: -73.9855, name: "Central Park" },
    { lat: 40.7505, lng: -73.9934, name: "Penn Station" },
    { lat: 40.7549, lng: -73.9840, name: "Grand Central" },
    { lat: 40.7061, lng: -74.0088, name: "Wall Street" }
  ];

  return locations.map((loc, index) => ({
    id: uuidv4(),
    type: infrastructureTypes[index % infrastructureTypes.length],
    name: `${loc.name} ${infrastructureTypes[index % infrastructureTypes.length].replace('_', ' ').toUpperCase()}`,
    location: loc,
    value: Math.floor(Math.random() * 100),
    status: 'green',
    lastUpdated: new Date()
  }));
};

infrastructure = generateInitialData();

const updateInfrastructure = () => {
  infrastructure.forEach(infra => {
    infra.value = Math.max(0, infra.value + (Math.random() - 0.5) * 5);
    if (Math.random() > 0.98) {
      infra.status = 'red';
      infra.anomaly = 'System Anomaly';
      const existing = alerts.find(a => a.infrastructureId === infra.id && a.active);
      if (!existing) {
        alerts.unshift({
          id: uuidv4(),
          infrastructureId: infra.id,
          infrastructureName: infra.name,
          type: infra.type,
          message: `Critical alert on ${infra.name}`,
          timestamp: new Date(),
          active: true,
          status: 'CRITICAL'
        });
      }
    }
  });
};

app.get('/api/infrastructure', (req, res) => res.json(infrastructure));
app.get('/api/alerts', (req, res) => res.json(alerts.filter(a => a.active)));
app.get('/api/alerts/history', (req, res) => res.json(alerts));
app.get('/api/complaints', (req, res) => res.json(complaints));

app.post('/api/otp/generate', (req, res) => {
  otps[req.body.mobile] = "261105";
  res.json({ success: true });
});

app.post('/api/complaints', (req, res) => {
  const c = { id: uuidv4(), ...req.body, timestamp: new Date(), status: 'pending' };
  complaints.unshift(c);
  res.json(c);
});

app.patch('/api/complaints/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const complaint = complaints.find(c => c.id === id);
  if (complaint) {
    complaint.status = status;
    res.json(complaint);
  } else {
    res.status(404).json({ error: 'Complaint not found' });
  }
});

app.patch('/api/alerts/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const alert = alerts.find(a => a.id === id);
  if (alert) {
    alert.status = status;
    alert.active = !['resolved', 'rejected'].includes(status);
    if (!alert.active) {
      alert.resolvedAt = new Date();
    }
    res.json(alert);
  } else {
    res.status(404).json({ error: 'Alert not found' });
  }
});

setInterval(() => {
  updateInfrastructure();
  io.emit('infrastructureUpdate', infrastructure);
}, 3000);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Backend Active: ${PORT}`));