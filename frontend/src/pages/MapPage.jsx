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
                    const infraData = await infraRes.json();
                    const complaintData = await complaintRes.json();

                    if (Array.isArray(infraData)) setInfrastructure(infraData);
                    else console.error("Infrastructure data is not an array:", infraData);

                    if (Array.isArray(complaintData)) setComplaints(complaintData);
                    else console.error("Complaint data is not an array:", complaintData);
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
