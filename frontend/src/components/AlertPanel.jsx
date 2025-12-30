import { useState } from 'react';

const AlertPanel = ({ alerts }) => {
  const [showAll, setShowAll] = useState(false);
  const displayedAlerts = showAll ? alerts : alerts.slice(0, 3);

  if (alerts.length === 0) {
    return (
      <div className="glass border-emerald-500/20 rounded-[32px] p-8 mb-12 flex items-center gap-6">
        <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-3xl">
          ✅
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">All Systems Nominal</h3>
          <p className="text-gray-500 dark:text-gray-400">No infrastructure anomalies detected across the city grid.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass border-rose-500/20 rounded-[40px] p-6 sm:p-10 mb-12 shadow-2xl shadow-rose-500/10 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl -mr-32 -mt-32" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 relative z-10">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-rose-500/20 rounded-[28px] flex items-center justify-center text-4xl animate-pulse">
            🚨
          </div>
          <div>
            <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Active Anomalies</h3>
            <p className="text-rose-600 dark:text-rose-400 font-bold uppercase text-xs tracking-widest mt-1">Immediate intervention required</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 rounded-2xl border border-rose-100 dark:border-rose-900 shadow-xl">
          <span className="w-3 h-3 bg-rose-500 rounded-full animate-ping" />
          <span className="text-lg font-black text-gray-900 dark:text-white">{alerts.length} CRITICAL</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        {displayedAlerts.map((alert) => (
          <div key={alert.id} className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-3xl p-6 border border-white dark:border-gray-800 hover:shadow-xl transition-all group">
            <div className="flex justify-between items-start mb-4">
              <span className="px-3 py-1 bg-rose-500 text-white text-[10px] font-black rounded-lg uppercase shadow-lg shadow-rose-500/20">
                Critical
              </span>
              <span className="text-[10px] font-bold text-gray-400">
                {new Date(alert.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <h4 className="text-lg font-black text-gray-900 dark:text-white mb-2 group-hover:text-rose-500 transition-colors">
              {alert.infrastructureName}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed italic border-l-2 border-rose-500/30 pl-4">
              "{alert.message}"
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between relative z-10">
        <div className="text-gray-400 font-bold text-xs uppercase tracking-widest">
          Showing {displayedAlerts.length} of {alerts.length} active alerts
        </div>
        {alerts.length > 3 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-6 py-2 bg-rose-500 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/20"
          >
            {showAll ? 'Show Less' : 'See All Alerts'}
          </button>
        )}
      </div>
    </div>
  );
};

export default AlertPanel;