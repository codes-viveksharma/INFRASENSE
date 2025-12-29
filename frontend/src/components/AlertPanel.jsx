const AlertPanel = ({ alerts }) => {
  if (alerts.length === 0) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-8">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600">✓</span>
            </div>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800">All systems operational</h3>
            <p className="text-sm text-green-700 mt-1">No critical alerts at this time.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center animate-pulse">
              <span className="text-red-600">⚠</span>
            </div>
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-bold text-red-800">Critical Alerts ({alerts.length})</h3>
            <p className="text-red-700">Immediate attention required</p>
          </div>
        </div>
        <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-semibold rounded-full">
          {alerts.length} Active
        </span>
      </div>
      
      <div className="mt-4 space-y-3">
        {alerts.slice(0, 3).map((alert) => (
          <div key={alert.id} className="bg-white dark:bg-dark-card rounded-lg p-4 border border-red-100">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-gray-900">{alert.infrastructureName}</h4>
                <p className="text-gray-600 dark:text-gray-300">{alert.message}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {new Date(alert.timestamp).toLocaleString()}
                </p>
              </div>
              <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded">
                CRITICAL
              </span>
            </div>
          </div>
        ))}
        
        {alerts.length > 3 && (
          <div className="text-center">
            <span className="text-sm text-red-700">
              +{alerts.length - 3} more alerts
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertPanel;