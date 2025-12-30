# INFRASENSE - Smart City Infrastructure Monitor

This guide will help you set up and run the INFRASENSE project locally on your machine.

## Prerequisites

- **Node.js**: You need to have Node.js installed. You can download it from [nodejs.org](https://nodejs.org/).
- **Git**: Ensure Git is installed to clone the repository.

## Quick Start Guide

You need to run the **Backend** and **Frontend** in separate terminals.

### 1. Setup Backend (Terminal 1)

Open a terminal and navigate to the project folder, then to the `backend` directory:

```bash
cd infra-antigravity/backend
npm install
npm start
```

**Success**: You should see:
> `Server running on port 5000`
> `Socket.io initialized`

---

### 2. Setup Frontend (Terminal 2)

Open a **new** terminal window (keep the first one running) and navigate to the `frontend` directory:

```bash
cd infra-antigravity/frontend
npm install
npm run dev
```

**Success**: You should see a command to open localhost, usually:
> `Local: http://localhost:5173/`

### 3. Access the App

Open your browser and verify:
- **Frontend**: [http://localhost:5173/__](http://localhost:5173/)
- **Backend Health**: [http://localhost:5000/api/infrastructure](http://localhost:5000/api/infrastructure) (Should return JSON data)

---

## Troubleshooting

### "Permission Denied" or Exit 126
If you see this error, it means `node_modules` were copied from another machine.
**Fix**: Delete the `node_modules` folder in both `frontend` and `backend`, then run `npm install` again.

### Backend Connection Failed
If the map is empty or status is red:
1. Ensure the Backend terminal is running (Port 5000).
2. Check `frontend/.env` file. For local development, `VITE_BACKEND_URL` should be `http://localhost:5000`.

### Vercel Deployment Note
For Vercel, we use `vercel.json` to route API calls. Locally, Vite proxies these calls or you can connect directly to localhost.
