import { useState, useEffect } from 'react';
import MapView from "../components/MapView";

const MapPage = () => {
    const [infrastructure, setInfrastructure] = useState([]);
    const [complaints, setComplaints] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [infraRes, complaintRes] = await Promise.all([
                    fetch('/api/infrastructure'),
                    fetch('/api/complaints')
                ]);

                if (infraRes.ok && complaintRes.ok) {
                    setInfrastructure(await infraRes.json());
                    setComplaints(await complaintRes.json());
                }
            } catch (error) {
                console.error('Error fetching map data:', error);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col h-[calc(100vh-64px)]">
            <MapView infrastructure={infrastructure} complaints={complaints} fullScreen={true} />
        </div>
    );
};

export default MapPage;
