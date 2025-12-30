import { useState, useEffect } from 'react';
import MapView from "../components/MapView";

const MapPage = () => {
    const [infrastructure, setInfrastructure] = useState([]);
    const [complaints, setComplaints] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
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

            const [infraRes, complaintRes] = await Promise.all([
                fetchWithTimeout('/api/infrastructure'),
                fetchWithTimeout('/api/complaints')
            ]);

            if (infraRes.ok && complaintRes.ok) {
                const infraData = await infraRes.json();
                const complaintData = await complaintRes.json();

                if (Array.isArray(infraData)) setInfrastructure(infraData);
                if (Array.isArray(complaintData)) setComplaints(complaintData);
                setError(null);
            }
        } catch (error) {
            console.error('Error fetching map data:', error);
            if (infrastructure.length === 0) {
                setError('Failed to load map data. Server might be waking up.');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 10000); // 10s interval is enough
        return () => clearInterval(interval);
    }, []);

    if (loading && infrastructure.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-white">
                <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                <div className="mt-4 text-gray-500 font-bold uppercase tracking-widest text-xs">Initializing Map...</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-white relative">
            {error && !infrastructure.length && (
                <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[1000] bg-red-50 text-red-600 px-6 py-3 rounded-2xl border border-red-100 shadow-xl font-bold flex items-center gap-3">
                    <span>⚠️</span> {error}
                </div>
            )}
            <MapView infrastructure={infrastructure} complaints={complaints} fullScreen={true} />
        </div>
    );
};

export default MapPage;
