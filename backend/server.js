const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage
let infrastructure = [];
let alerts = [];
let complaints = [];

// Generate initial infrastructure data
const generateInitialData = () => {
  const infrastructureTypes = ['streetlight', 'traffic_signal', 'water_supply', 'waste_bin'];
  const locations = [
    { lat: 40.7128, lng: -74.0060, name: "Times Square" },
    { lat: 40.7580, lng: -73.9855, name: "Central Park" },
    { lat: 40.7505, lng: -73.9934, name: "Penn Station" },
    { lat: 40.7549, lng: -73.9840, name: "Grand Central" },
    { lat: 40.7614, lng: -73.9776, name: "Rockefeller Center" },
    { lat: 40.7061, lng: -74.0088, name: "Wall Street" },
    { lat: 40.6892, lng: -74.0445, name: "Statue of Liberty" },
    { lat: 40.7831, lng: -73.9712, name: "Upper East Side" }
  ];

  return locations.map((loc, index) => {
    const type = infrastructureTypes[index % infrastructureTypes.length];
    const id = uuidv4();
    
    // Different value ranges based on type
    let value, status;
    switch(type) {
      case 'streetlight':
        value = Math.floor(Math.random() * 500) + 200; // 200-700 lumens
        break;
      case 'traffic_signal':
        value = Math.random() > 0.5 ? 1 : 0; // 0 or 1 for status
        break;
      case 'water_supply':
        value = Math.floor(Math.random() * 100) + 20; // 20-120 PSI
        break;
      case 'waste_bin':
        value = Math.floor(Math.random() * 100); // 0-100% full
        break;
    }
    
    // Initial status
    status = Math.random() > 0.9 ? 'red' : Math.random() > 0.7 ? 'yellow' : 'green';
    
    return {
      id,
      type,
      name: `${loc.name} ${type.replace('_', ' ').toUpperCase()}`,
      location: loc,
      value,
      status,
      lastUpdated: new Date(),
      anomaly: status === 'red' ? 'High voltage detected' : null
    };
  });
};

// Initialize data
infrastructure = generateInitialData();

// Anomaly detection logic
const checkAnomaly = (infra) => {
  let anomaly = null;
  
  switch(infra.type) {
    case 'streetlight':
      if (infra.value > 650) anomaly = 'High voltage detected';
      else if (infra.value < 220) anomaly = 'Low voltage detected';
      break;
    case 'traffic_signal':
      if (infra.value !== 1 && infra.value !== 0) anomaly = 'Signal malfunction';
      break;
    case 'water_supply':
      if (infra.value > 110) anomaly = 'High pressure warning';
      else if (infra.value < 30) anomaly = 'Low pressure warning';
      break;
    case 'waste_bin':
      if (infra.value > 90) anomaly = 'Bin almost full';
      break;
  }
  
  return anomaly;
};

// Update infrastructure data
const updateInfrastructure = () => {
  infrastructure.forEach(infra => {
    // Random value change
    const change = (Math.random() - 0.5) * 20;
    infra.value = Math.max(0, infra.value + change);
    
    // Check for anomalies
    const anomaly = checkAnomaly(infra);
    
    // Update status based on anomaly
    if (anomaly) {
      infra.status = 'red';
      infra.anomaly = anomaly;
      
      // Generate alert if new anomaly
      const existingAlert = alerts.find(a => a.infrastructureId === infra.id && a.active);
      if (!existingAlert) {
        const alert = {
          id: uuidv4(),
          infrastructureId: infra.id,
          infrastructureName: infra.name,
          type: infra.type,
          message: anomaly,
          timestamp: new Date(),
          active: true
        };
        alerts.unshift(alert); // Add to beginning
      }
    } else {
      infra.status = 'green';
      infra.anomaly = null;
    }
    
    infra.lastUpdated = new Date();
  });
};

// REST API Routes
app.get('/api/infrastructure', (req, res) => {
  res.json(infrastructure);
});

app.get('/api/alerts', (req, res) => {
  res.json(alerts.filter(alert => alert.active));
});

app.get('/api/alerts/history', (req, res) => {
  res.json(alerts);
});

app.post('/api/complaints', (req, res) => {
  const complaint = {
    id: uuidv4(),
    ...req.body,
    timestamp: new Date(),
    status: 'pending'
  };
  complaints.unshift(complaint);
  res.json(complaint);
});

app.get('/api/complaints', (req, res) => {
  res.json(complaints);
});

app.post('/api/maintenance/:id', (req, res) => {
  const { id } = req.params;
  const infrastructureItem = infrastructure.find(item => item.id === id);
  
  if (infrastructureItem) {
    infrastructureItem.status = 'yellow';
    infrastructureItem.maintenanceScheduled = new Date();
    
    // Deactivate related alerts
    alerts.forEach(alert => {
      if (alert.infrastructureId === id && alert.active) {
        alert.active = false;
        alert.resolvedAt = new Date();
      }
    });
    
    res.json({ success: true, message: 'Maintenance scheduled' });
  } else {
    res.status(404).json({ error: 'Infrastructure not found' });
  }
});

// WebSocket connection
io.on('connection', (socket) => {
  console.log('New client connected');
  
  // Send initial data
  socket.emit('initialData', {
    infrastructure,
    alerts: alerts.filter(alert => alert.active)
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Start data simulation
setInterval(() => {
  updateInfrastructure();
  io.emit('infrastructureUpdate', infrastructure);
  io.emit('alertsUpdate', alerts.filter(alert => alert.active));
}, 3000); // Update every 3 seconds

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});