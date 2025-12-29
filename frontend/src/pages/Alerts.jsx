import { useEffect, useState } from 'react';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [activeOnly, setActiveOnly] = useState(true);

  useEffect(() => {
    fetch(activeOnly ? '/api/alerts' : '/api/alerts/history')
      .then(res => res.json())
      .then(setAlerts);
  }, [activeOnly]);

  const handleResolveAlert = async (alertId) => {
    // This would be connected to the maintenance API
    alert('Alert resolution would trigger maintenance scheduling');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Alert Management</h1>
        <p className="text-gray-600 dark:text-gray-300">Monitor and manage infrastructure alerts</p>
      </div>

      <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
          <button
            onClick={() => setActiveOnly(true)}
            className={`px-4 py-2 rounded-lg font-semibold ${
              activeOnly
                ? 'bg-red-100 text-red-800'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            Active Alerts ({alerts.filter(a => a.active).length})
          </button>
          <button
            onClick={() => setActiveOnly(false)}
            className={`px-4 py-2 rounded-lg font-semibold ${
              !activeOnly
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            Alert History
          </button>
        </div>
        
        <div className="text-sm text-gray-600 dark:text-gray-300">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      <div className="bg-white dark:bg-dark-card rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Infrastructure</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Message</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-dark-card divide-y divide-gray-200 dark:divide-gray-700">
              {alerts.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    <div className="text-4xl mb-4">✅</div>
                    {activeOnly ? 'No active alerts' : 'No alert history'}
                  </td>
                </tr>
              ) : (
                alerts.map((alert) => (
                  <tr key={alert.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-2 ${
                          alert.active ? 'bg-red-500 animate-pulse' : 'bg-green-500'
                        }`}></div>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          alert.active
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {alert.active ? 'ACTIVE' : 'RESOLVED'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{alert.infrastructureName}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {alert.type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                        <div className="text-gray-900">{alert.message}</div>
                    </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {new Date(alert.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      {alert.active && (
                        <button
                          onClick={() => handleResolveAlert(alert.id)}
                          className="px-4 py-2 bg-smart-blue text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm"
                        >
                          Resolve
                        </button>
                      )}
                      {!alert.active && (
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Resolved: {alert.resolvedAt ? new Date(alert.resolvedAt).toLocaleDateString() : 'Unknown'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Alerts;