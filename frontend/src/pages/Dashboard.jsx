import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import MapView from "../components/MapView";
import StatusGrid from "../components/StatusGrid";
import Charts from "../components/Charts";
import AlertPanel from "../components/AlertPanel";
import MaintenanceView from "../components/MaintenanceView";

const Dashboard = () => {
  const [infrastructure, setInfrastructure] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Fetch initial data
    fetch('/api/infrastructure')
      .then(res => res.json())
      .then(data => {
        setInfrastructure(data);
        setLoading(false);
      });

    fetch('/api/alerts')
      .then(res => res.json())
      .then(setAlerts);

    // WebSocket connection
    const socket = io('http://localhost:3001');

    socket.on('initialData', (data) => {
      setInfrastructure(data.infrastructure);
      setAlerts(data.alerts);
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Smart City Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-300">Real-time monitoring of city infrastructure</p>
      </div>

      {/* Tabs */}
      <div className="mb-8 border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {['overview', 'map', 'maintenance'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 font-medium text-sm ${
                activeTab === tab
                  ? 'border-b-2 border-smart-blue text-smart-blue'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Alert Panel */}
      <AlertPanel alerts={alerts} />

      {/* Content based on active tab */}
      {activeTab === 'overview' && (
        <>
          <StatusGrid infrastructure={infrastructure} />
          <Charts infrastructure={infrastructure} />
        </>
      )}

      {activeTab === 'map' && (
        <div className="bg-white dark:bg-dark-card rounded-xl shadow-lg p-4 mb-8">
          <h2 className="text-xl font-bold mb-4">Infrastructure Map</h2>
          <MapView infrastructure={infrastructure} />
        </div>
      )}

      {activeTab === 'maintenance' && (
        <MaintenanceView
          infrastructure={infrastructure}
          onScheduleMaintenance={handleScheduleMaintenance}
        />
      )}
    </div>
  );
};

export default Dashboard;