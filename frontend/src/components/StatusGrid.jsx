const StatusGrid = ({ infrastructure }) => {
  const getStatusCount = (status) => {
    return infrastructure.filter(item => item.status === status).length;
  };

  const statusTypes = [
    { type: 'streetlight', label: 'Street Lights', icon: '💡' },
    { type: 'traffic_signal', label: 'Traffic Signals', icon: '🚦' },
    { type: 'water_supply', label: 'Water Supply', icon: '💧' },
    { type: 'waste_bin', label: 'Waste Bins', icon: '🗑️' }
  ];

  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-dark-card p-6 rounded-xl shadow-lg">
          <div className="text-3xl font-bold text-green-600 mb-2">{getStatusCount('green')}</div>
          <div className="text-gray-600 dark:text-gray-300">Healthy Systems</div>
          <div className="mt-2 h-2 bg-green-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-500" 
              style={{ width: `${(getStatusCount('green') / infrastructure.length) * 100}%` }}
            />
          </div>
        </div>
        
        <div className="bg-white dark:bg-dark-card p-6 rounded-xl shadow-lg">
          <div className="text-3xl font-bold text-yellow-600 mb-2">{getStatusCount('yellow')}</div>
          <div className="text-gray-600 dark:text-gray-300">Under Maintenance</div>
          <div className="mt-2 h-2 bg-yellow-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-yellow-500" 
              style={{ width: `${(getStatusCount('yellow') / infrastructure.length) * 100}%` }}
            />
          </div>
        </div>
        
        <div className="bg-white dark:bg-dark-card p-6 rounded-xl shadow-lg">
          <div className="text-3xl font-bold text-red-600 mb-2">{getStatusCount('red')}</div>
          <div className="text-gray-600 dark:text-gray-300">Critical Alerts</div>
          <div className="mt-2 h-2 bg-red-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-red-500" 
              style={{ width: `${(getStatusCount('red') / infrastructure.length) * 100}%` }}
            />
          </div>
        </div>
        
        <div className="bg-white dark:bg-dark-card p-6 rounded-xl shadow-lg">
          <div className="text-3xl font-bold text-smart-blue mb-2">{infrastructure.length}</div>
          <div className="text-gray-600 dark:text-gray-300">Total Sensors</div>
          <div className="mt-2 h-2 bg-blue-200 rounded-full" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statusTypes.map(({ type, label, icon }) => {
          const items = infrastructure.filter(item => item.type === type);
          const healthy = items.filter(item => item.status === 'green').length;
          
          return (
            <div key={type} className="bg-white dark:bg-dark-card p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="text-2xl">{icon}</div>
                <span className="text-gray-600 dark:text-gray-300">{items.length} units</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{label}</h3>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {healthy} / {items.length} operational
              </div>
              <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500" 
                  style={{ width: `${(healthy / items.length) * 100}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Infrastructure List */}
      <div className="bg-white dark:bg-dark-card rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold">Infrastructure Status</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Last Updated</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-dark-card divide-y divide-gray-200 dark:divide-gray-700">
              {infrastructure.slice(0, 10).map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{item.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {item.type.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {item.location.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{item.value.toFixed(1)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`status-badge status-${item.status}`}>
                      {item.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(item.lastUpdated).toLocaleTimeString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StatusGrid;