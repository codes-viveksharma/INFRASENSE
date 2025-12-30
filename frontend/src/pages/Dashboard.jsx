import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import StatusGrid from "../components/StatusGrid";
import Charts from "../components/Charts";
import AlertPanel from "../components/AlertPanel";
import MaintenanceView from "../components/MaintenanceView";
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { isAdmin } = useAuth();
  const [infrastructure, setInfrastructure] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [error, setError] = useState(null);
  const [retrying, setRetrying] = useState(false);
  const [slowServer, setSlowServer] = useState(false);

  const tabs = isAdmin ? ['overview', 'maintenance'] : ['overview'];

  const fetchData = async (isRetry = false) => {
    if (isRetry) setRetrying(true);
    setLoading(true);
    setError(null);
    setSlowServer(false);

    const timeout = (ms) => new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), ms));

    // Timer to detect slow server
    const slowTimer = setTimeout(() => setSlowServer(true), 5000);

    try {
      // Use the production API URL from vercel.json if possible, or relative for proxy
      const fetchWithTimeout = async (url) => {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), 20000); // 20s timeout
        try {
          const response = await fetch(url, { signal: controller.signal });
          clearTimeout(id);
          return response;
        } catch (e) {
          clearTimeout(id);
          throw e;
        }
      };

      const [infraRes, alertRes, complaintRes] = await Promise.all([
        fetchWithTimeout('/api/infrastructure'),
        fetchWithTimeout('/api/alerts'),
        fetchWithTimeout('/api/complaints')
      ]);

      const [infraData, alertData, complaintData] = await Promise.all([
        infraRes.json(),
        alertRes.json(),
        complaintRes.json()
      ]);

      setInfrastructure(infraData);
      setAlerts(alertData);
      setComplaints(complaintData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError(error.message === 'timeout' ? 'Server is taking too long to respond. It might be waking up.' : 'Failed to load dashboard data.');
      setLoading(false);
    } finally {
      clearTimeout(slowTimer);
      if (isRetry) setRetrying(false);
    }
  };

  useEffect(() => {
    fetchData();

    // In production (Vercel), we should use the Render URL directly for WebSockets
    const backendUrl = window.location.hostname === 'localhost'
      ? 'http://localhost:3001'
      : 'https://infrasense-qday.onrender.com';

    const socket = io(backendUrl);

    socket.on('initialData', (data) => {
      if (data.infrastructure) setInfrastructure(data.infrastructure);
      if (data.alerts) setAlerts(data.alerts);
    });

    socket.on('infrastructureUpdate', (data) => {
      setInfrastructure(data);
    });

    socket.on('alertsUpdate', (data) => {
      setAlerts(data);
    });

    return () => socket.disconnect();
  }, []);

  const handleScheduleMaintenance = async (id) => {
    const response = await fetch(`/api/maintenance/${id}`, {
      method: 'POST'
    });

    if (response.ok) {
      setInfrastructure(prev => prev.map(item =>
        item.id === id ? { ...item, status: 'yellow', maintenanceScheduled: new Date() } : item
      ));
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-dark-bg transition-colors duration-500">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-purple-500/20 border-b-purple-500 rounded-full animate-spin-reverse"></div>
          </div>
        </div>
        <div className="mt-8 text-2xl font-black text-gray-900 dark:text-white tracking-tighter">
          {slowServer ? "WAKING UP SERVER..." : "INITIALIZING SYSTEMS..."}
        </div>
        <p className="mt-4 text-gray-500 dark:text-gray-400 font-medium px-4 text-center max-w-md leading-relaxed">
          {slowServer
            ? "This dashboard is hosted on a high-efficiency free tier. If it hasn't been accessed recently, it might take 30-50 seconds to wake up. We appreciate your patience!"
            : "Connecting to the city's real-time infrastructure grid..."}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-4xl mb-4">⚠️</div>
        <div className="text-xl font-bold text-red-600 mb-2">Connection Issue</div>
        <p className="text-gray-600 dark:text-gray-400 mb-6 px-4 text-center">{error}</p>
        <button
          onClick={() => fetchData(true)}
          disabled={retrying}
          className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:scale-105 transition-all disabled:opacity-50"
        >
          {retrying ? "Retrying..." : "Try Again"}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-4">
          INFRA SENSE Dashboard
          {isAdmin && <span className="text-[10px] bg-red-500 text-white px-3 py-1 rounded-full font-black uppercase tracking-widest">Admin Access</span>}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">Real-time monitoring of city infrastructure</p>
      </div>

      {/* Tabs */}
      <div className="mb-8 border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 font-medium text-sm transition-all ${activeTab === tab
                ? 'border-smart-blue text-smart-blue border-b-2 font-bold'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent'
                }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      <AlertPanel alerts={alerts} />

      {activeTab === 'overview' && (
        <>
          <StatusGrid infrastructure={infrastructure} />
          <Charts infrastructure={infrastructure} />
        </>
      )}


      {activeTab === 'maintenance' && isAdmin && (
        <MaintenanceView
          infrastructure={infrastructure}
          onScheduleMaintenance={handleScheduleMaintenance}
        />
      )}
    </div>
  );
};

export default Dashboard;