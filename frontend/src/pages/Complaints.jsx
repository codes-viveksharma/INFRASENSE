import { useState, useEffect } from 'react';

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    type: 'streetlight',
    description: '',
    location: '',
    email: ''
  });

  useEffect(() => {
    fetch('/api/complaints')
      .then(res => res.json())
      .then(setComplaints);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const complaint = {
      ...formData,
      location: formData.location || 'Not specified',
      timestamp: new Date().toISOString()
    };
    
    const response = await fetch('/api/complaints', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(complaint)
    });
    
    if (response.ok) {
      const newComplaint = await response.json();
      setComplaints([newComplaint, ...complaints]);
      
      // Reset form
      setFormData({
        name: '',
        type: 'streetlight',
        description: '',
        location: '',
        email: ''
      });
      
      alert('Complaint submitted successfully!');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const infrastructureTypes = [
    { value: 'streetlight', label: 'Street Light' },
    { value: 'traffic_signal', label: 'Traffic Signal' },
    { value: 'water_supply', label: 'Water Supply' },
    { value: 'waste_bin', label: 'Waste Bin' },
    { value: 'road', label: 'Road' },
    { value: 'bridge', label: 'Bridge' },
    { value: 'park', label: 'Park' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Citizen Complaints</h1>
          <p className="text-gray-600 dark:text-gray-300">Report infrastructure issues in your area</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Complaint Form */}
        <div className="bg-white dark:bg-dark-card rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-6">Report an Issue</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smart-blue focus:border-transparent"
                placeholder="John Doe"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smart-blue focus:border-transparent"
                placeholder="john@example.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Infrastructure Type *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smart-blue focus:border-transparent"
              >
                {infrastructureTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location Description *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smart-blue focus:border-transparent"
                placeholder="e.g., Near Central Park, 5th Avenue"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Issue Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smart-blue focus:border-transparent"
                placeholder="Describe the issue in detail..."
              />
            </div>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <div className="text-gray-500 dark:text-gray-400">
                <div className="text-3xl mb-2">📸</div>
                <div>Photo Upload (Mock Feature)</div>
                <div className="text-sm text-gray-400 mt-1">
                  Click to upload photo (not functional in demo)
                </div>
              </div>
            </div>
            
            <button
              type="submit"
              className="w-full btn-primary py-3 text-lg"
            >
              Submit Complaint
            </button>
          </form>
        </div>

        {/* Recent Complaints */}
        <div className="bg-white dark:bg-dark-card rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-6">Recent Complaints</h2>
          
            {complaints.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <div className="text-4xl mb-4">📝</div>
              <div>No complaints submitted yet</div>
            </div>
          ) : (
            <div className="space-y-4">
              {complaints.slice(0, 5).map((complaint) => (
                <div key={complaint.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-900">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-900">{complaint.name}</h3>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">
                      {complaint.type.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-3">{complaint.description}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                    <div>📍 {complaint.location}</div>
                    <div>{new Date(complaint.timestamp).toLocaleDateString()}</div>
                  </div>
                  <div className={`mt-2 px-3 py-1 text-xs font-semibold rounded-full inline-block ${
                    complaint.status === 'pending' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : complaint.status === 'resolved'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {complaint.status.toUpperCase()}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <div className="text-4xl mb-4">🏙️</div>
              <h3 className="font-bold text-gray-900 mb-2">Community Impact</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Your reports help us maintain and improve city infrastructure for everyone.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Complaints;