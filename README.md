# Smart City Infrastructure Monitor

A real-time smart city infrastructure monitoring platform for proactive maintenance and citizen engagement.

## Features

- Real-time infrastructure monitoring (streetlights, traffic signals, water supply, waste bins)
- WebSocket-based live updates every 3 seconds
- Interactive map with color-coded status markers
- Anomaly detection and alert system
- Citizen complaint submission portal
- Maintenance scheduling interface
- Dashboard with charts and status overview

## Tech Stack

**Frontend:**
- React 18
- Vite
- Tailwind CSS
- Leaflet.js (maps)
- Chart.js (charts)
- Socket.io-client

**Backend:**
- Node.js + Express
- Socket.io (WebSocket)
- In-memory data storage

## Quick Start

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

1. **Clone and setup backend:**
```bash
cd backend
npm install
