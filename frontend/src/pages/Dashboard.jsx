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
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = isAdmin ? ['overview', 'maintenance'] : ['overview'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [infraRes, alertRes, complaintRes] = await Promise.all([
          fetch('/api/infrastructure'),
          fetch('/api/alerts'),
          fetch('/api/complaints')
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
        setLoading(false);
      }
    };

    fetchData();

    const socket = io(import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001');

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