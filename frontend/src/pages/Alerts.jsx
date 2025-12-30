import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Alerts = () => {
  const { isAdmin } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const fetchWithTimeout = async (url) => {
          const controller = new AbortController();
          const id = setTimeout(() => controller.abort(), 15000);
          try {
            const response = await fetch(url, { signal: controller.signal });
            clearTimeout(id);
            return response;
          } catch (e) {
            clearTimeout(id);
            throw e;
          }
        };

        const [alertRes, compRes] = await Promise.all([
          fetchWithTimeout('/api/alerts/history'),
          fetchWithTimeout('/api/complaints')
        ]);

        const alerts = await alertRes.json();
        const complaints = await compRes.json();

        // Merge everything that qualifies as "Resolved" or "Archived"
        const merged = [
          ...alerts.filter(a => !['pending', 'CRITICAL', 'approved'].includes(a.status)).map(a => ({ ...a, type: 'ALERT', source: 'SENSOR' })),
          ...complaints.filter(c => !['pending', 'CRITICAL', 'approved'].includes(c.status)).map(c => ({
            ...c,
            message: c.description,
            infrastructureName: c.name || 'Citizen Report',
            type: c.type.toUpperCase(),
            source: 'CITIZEN'
          }))
        ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        setItems(merged);
      } catch (err) {
        console.error("Historical fetch failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading && items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-dark-bg transition-colors">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
        <div className="mt-4 text-gray-500 font-bold uppercase tracking-widest text-xs">Fetching Archives...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2 uppercase tracking-tighter">
          {isAdmin ? "Resolved Chronicles" : "Infrastructure Alerts"}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">The archive of all city incidents and their final outcomes.</p>
      </div>

      <div className="bg-white dark:bg-dark-card rounded-[40px] shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-gray-900/50 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <th className="px-10 py-6">Identity</th>
                <th className="px-6 py-6">Asset / Type</th>
                <th className="px-6 py-6">Resolution Summary</th>
                <th className="px-6 py-6">Timeline</th>
                <th className="px-10 py-6 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {items.length === 0 && !loading ? (
                <tr>
                  <td colSpan="5" className="px-10 py-24 text-center text-gray-400 font-black uppercase tracking-widest opacity-20">Archive Empty</td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/5 transition-colors">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-3">
                        <span className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs ${item.source === 'SENSOR' ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-600'}`}>
                          {item.source === 'SENSOR' ? '📡' : '👤'}
                        </span>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.source}</span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="font-bold text-gray-900 dark:text-white uppercase text-xs">{item.infrastructureName}</div>
                      <div className="text-[10px] text-gray-400 font-medium uppercase">{item.type}</div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="text-xs font-medium text-gray-600 dark:text-gray-300 italic max-w-xs truncate">"{item.message}"</div>
                    </td>
                    <td className="px-6 py-6 text-[10px] font-bold text-gray-400 uppercase">
                      {new Date(item.timestamp).toLocaleDateString()}
                    </td>
                    <td className="px-10 py-6 text-right">
                      <span className={`px-3 py-1 text-[10px] font-black rounded-lg uppercase ${item.status === 'rejected' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                        {item.status || 'RESOLVED'}
                      </span>
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