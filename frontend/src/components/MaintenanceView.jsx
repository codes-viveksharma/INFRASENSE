const MaintenanceView = ({ infrastructure, onScheduleMaintenance }) => {
  const criticalItems = infrastructure.filter(item => item.status === 'red');
  const maintenanceItems = infrastructure.filter(item => item.status === 'yellow');

  return (
    <div className="space-y-8">
      {/* Critical Items */}
      <div className="bg-white dark:bg-dark-card rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 bg-red-50 border-b border-red-100">
          <h2 className="text-xl font-bold text-red-800">Critical Infrastructure Needing Maintenance</h2>
          <p className="text-red-600">Immediate attention required</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Issue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Last Updated</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-dark-card divide-y divide-gray-200 dark:divide-gray-700">
              {criticalItems.length === 0 ? (
                  <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    <div className="text-4xl mb-4">✅</div>
                    No critical infrastructure issues
                  </td>
                </tr>
              ) : (
                criticalItems.map((item) => (
                  <tr key={item.id} className="hover:bg-red-50 dark:hover:bg-gray-900">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{item.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{item.location.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                        {item.type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-red-600 font-medium">{item.anomaly}</div>
                      <div className="text-sm text-gray-500">Value: {item.value.toFixed(1)}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {new Date(item.lastUpdated).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => onScheduleMaintenance(item.id)}
                        className="px-4 py-2 bg-smart-blue text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                      >
                        Schedule Maintenance
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Scheduled Maintenance */}
      <div className="bg-white dark:bg-dark-card rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 bg-yellow-50 border-b border-yellow-100">
          <h2 className="text-xl font-bold text-yellow-800">Scheduled Maintenance</h2>
          <p className="text-yellow-600">Maintenance in progress or scheduled</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Scheduled Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estimated Completion</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-dark-card divide-y divide-gray-200">
              {maintenanceItems.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    <div className="text-4xl mb-4">🔧</div>
                    No scheduled maintenance
                  </td>
                </tr>
              ) : (
                maintenanceItems.map((item) => (
                  <tr key={item.id} className="hover:bg-yellow-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{item.name}</div>
                      <div className="text-sm text-gray-500">{item.location.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        {item.type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2 animate-pulse"></div>
                        <span className="font-medium text-yellow-700">In Progress</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {item.maintenanceScheduled 
                        ? new Date(item.maintenanceScheduled).toLocaleString()
                        : 'Just now'
                      }
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {new Date(Date.now() + 2*60*60*1000).toLocaleTimeString()}
                      </div>
                      <div className="text-xs text-gray-500">~2 hours</div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-dark-card p-6 rounded-xl shadow-lg">
          <div className="text-3xl font-bold text-red-600 mb-2">{criticalItems.length}</div>
          <div className="text-gray-600 dark:text-gray-300">Critical Issues</div>
          <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">Require immediate attention</div>
        </div>
        
        <div className="bg-white dark:bg-dark-card p-6 rounded-xl shadow-lg">
          <div className="text-3xl font-bold text-yellow-600 mb-2">{maintenanceItems.length}</div>
          <div className="text-gray-600 dark:text-gray-300">In Maintenance</div>
          <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">Currently being repaired</div>
        </div>
        
        <div className="bg-white dark:bg-dark-card p-6 rounded-xl shadow-lg">
          <div className="text-3xl font-bold text-smart-blue mb-2">
            {Math.round((maintenanceItems.length / (criticalItems.length + maintenanceItems.length || 1)) * 100)}%
          </div>
          <div className="text-gray-600 dark:text-gray-300">Response Rate</div>
          <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">Issues being addressed</div>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceView;