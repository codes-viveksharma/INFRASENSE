import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { useEffect, useState } from 'react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Charts = ({ infrastructure }) => {
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    // Group infrastructure by type
    const groupedData = {};
    
    infrastructure.forEach(item => {
      if (!groupedData[item.type]) {
        groupedData[item.type] = [];
      }
      groupedData[item.type].push({
        value: item.value,
        time: new Date(item.lastUpdated).toLocaleTimeString(),
        status: item.status
      });
    });

    // Prepare chart data
    const datasets = Object.entries(groupedData).map(([type, data], index) => {
      const colors = {
        streetlight: '#3B82F6',
        traffic_signal: '#10B981',
        water_supply: '#8B5CF6',
        waste_bin: '#F59E0B'
      };
      
      return {
        label: type.replace('_', ' ').toUpperCase(),
        data: data.map(d => d.value),
        borderColor: colors[type] || '#6B7280',
        backgroundColor: `${colors[type] || '#6B7280'}20`,
        tension: 0.4
      };
    });

    setChartData({
      labels: groupedData.streetlight?.map(d => d.time) || [],
      datasets
    });
  }, [infrastructure]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Infrastructure Sensor Values Over Time'
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: 'Sensor Value'
        }
      }
    },
    animation: {
      duration: 1000
    }
  };

  // Status distribution chart
  const statusCounts = infrastructure.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {});

  const statusData = {
    labels: ['Healthy', 'Maintenance', 'Critical'],
    datasets: [{
      data: [statusCounts.green || 0, statusCounts.yellow || 0, statusCounts.red || 0],
      backgroundColor: [
        '#10B981',
        '#F59E0B',
        '#EF4444'
      ],
      borderWidth: 1
    }]
  };

  return (
    <div className="mt-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-dark-card rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-6">Sensor Trends</h2>
          {chartData.datasets ? (
            <Line data={chartData} options={options} />
          ) : (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">Loading chart data...</div>
          )}
        </div>
        
        <div className="bg-white dark:bg-dark-card rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-6">Status Distribution</h2>
          <div className="flex items-center justify-center h-64">
            <div className="relative w-48 h-48">
              {['green', 'yellow', 'red'].map((status, i) => {
                const count = statusCounts[status] || 0;
                const total = infrastructure.length;
                const percentage = total > 0 ? (count / total) * 100 : 0;
                const colors = {
                  green: '#10B981',
                  yellow: '#F59E0B',
                  red: '#EF4444'
                };
                
                return (
                  <div key={status} className="flex items-center mb-4">
                    <div 
                      className="w-4 h-4 rounded mr-3"
                      style={{ backgroundColor: colors[status] }}
                    />
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="font-medium capitalize">{status}</span>
                        <span className="text-gray-600 dark:text-gray-300">{count} ({percentage.toFixed(1)}%)</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full"
                          style={{ 
                            width: `${percentage}%`,
                            backgroundColor: colors[status]
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Charts;