import { useState, useEffect } from 'react';
import { useLocationContext } from '../context/LocationContext';
import { useAuth } from '../context/AuthContext';

const Complaints = () => {
  const { userLocation, address, searchAddress } = useLocationContext();
  const { isAdmin } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [liveAlerts, setLiveAlerts] = useState([]);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isEditingLocation, setIsEditingLocation] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    type: 'Street Light',
    description: '',
    location: '',
    email: '',
    mobile: '',
    urgency: 'medium',
    area: '',
    imageUrl: ''
  });

  const fetchData = async () => {
    try {
      const [compRes, alertRes] = await Promise.all([
        fetch('/api/complaints'),
        fetch('/api/alerts')
      ]);
      if (compRes.ok && alertRes.ok) {
        setComplaints(await compRes.json());
        setLiveAlerts(await alertRes.json());
      }
    } catch (err) {
      console.error("Fetch Data failed", err);
    }
  };

  useEffect(() => {
    // Check for URL parameters for location pre-fill from Map
    const params = new URLSearchParams(window.location.search);
    const lat = params.get('lat');
    const lng = params.get('lng');
    if (lat && lng) {
      setFormData(prev => ({
        ...prev,
        location: `Lat: ${parseFloat(lat).toFixed(4)}, Lng: ${parseFloat(lng).toFixed(4)}`
      }));
      // Optional: Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (address) {
      setFormData(prev => ({ ...prev, location: address }));
    }
  }, [address]);

  const handleStatusUpdate = async (id, newStatus, isAlert = false) => {
    const url = isAlert ? `/api/alerts/${id}` : `/api/complaints/${id}`;

    try {
      const response = await fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        // Immediate update for snappy response
        if (isAlert) {
          setLiveAlerts(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
        } else {
          setComplaints(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
        }
        fetchData(); // Sync with server
      } else {
        console.error("Status update failed");
      }
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const combinedFeed = [
    ...complaints.map(c => ({ ...c, feedType: 'complaint' })),
    ...liveAlerts.map(a => ({
      ...a,
      feedType: 'alert',
      description: a.message,
      name: a.infrastructureName,
      location: 'Sensor Alert'
    }))
  ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  if (isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-bg py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <header className="mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Live Incident Manager</h1>
            <p className="text-gray-500">Monitoring all active urban reports and system alerts.</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {combinedFeed.map((item) => (
              <div key={item.id} className="bg-white dark:bg-dark-card p-8 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-800 flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${item.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                    item.status === 'approved' ? 'bg-blue-600 text-white' :
                      item.status === 'scheduled' ? 'bg-purple-600 text-white' :
                        item.status === 'rejected' ? 'bg-rose-100 text-rose-700' :
                          item.status === 'CRITICAL' ? 'bg-rose-500 text-white' :
                            'bg-emerald-600 text-white'
                    }`}>
                    {item.status}
                  </span>
                  <span className="text-xs text-gray-400">{new Date(item.timestamp).toLocaleTimeString()}</span>
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xl">
                    {item.feedType === 'alert' ? '🚨' : '📋'}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">{item.name || 'Citizen'}</h3>
                    <p className="text-xs text-gray-400 uppercase tracking-widest">{item.type}</p>
                  </div>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 italic flex-1">"{item.description}"</p>

                <div className="text-xs font-bold text-gray-400 mb-4">📍 {item.location}</div>

                {item.imageUrl && (
                  <div className="mb-6 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
                    <img src={item.imageUrl} alt="Incident evidence" className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500" />
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  {(item.status === 'pending' || item.status === 'CRITICAL') && (
                    <div className="grid grid-cols-2 gap-2">
                      <button onClick={() => handleStatusUpdate(item.id, 'approved', item.feedType === 'alert')} className="py-3 bg-emerald-500 text-white rounded-xl text-xs font-bold uppercase hover:bg-emerald-600 transition-colors">Approve</button>
                      <button onClick={() => handleStatusUpdate(item.id, 'rejected', item.feedType === 'alert')} className="py-3 bg-rose-500 text-white rounded-xl text-xs font-bold uppercase hover:bg-rose-600 transition-colors">Reject</button>
                    </div>
                  )}
                  {item.status === 'approved' && (
                    <div className="grid grid-cols-2 gap-2">
                      <button onClick={() => handleStatusUpdate(item.id, 'scheduled', item.feedType === 'alert')} className="py-3 bg-purple-600 text-white rounded-xl text-xs font-bold uppercase hover:bg-purple-700 transition-colors">Schedule</button>
                      <button onClick={() => handleStatusUpdate(item.id, 'resolved', item.feedType === 'alert')} className="py-3 bg-emerald-600 text-white rounded-xl text-xs font-bold uppercase hover:bg-emerald-700 transition-colors">Resolve</button>
                    </div>
                  )}
                  {item.status === 'scheduled' && (
                    <div className="flex flex-col gap-2">
                      <span className="text-center text-xs font-bold text-purple-600 bg-purple-50 py-2 rounded-lg border border-purple-100 uppercase tracking-widest">Maintenance Scheduled</span>
                      <button onClick={() => handleStatusUpdate(item.id, 'resolved', item.feedType === 'alert')} className="w-full py-3 bg-emerald-600 text-white rounded-xl text-xs font-bold uppercase hover:bg-emerald-700 transition-colors">Mark Fixed</button>
                    </div>
                  )}
                  {['resolved', 'rejected'].includes(item.status) && (
                    <div className="text-center py-2 text-xs font-bold text-gray-400 border border-dashed rounded-xl uppercase">Archived</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Citizen View
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg py-12 px-4 transition-colors">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2 uppercase tracking-tighter">Citizen Action Center</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Verified reporting for urban maintenance.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-dark-card p-10 rounded-[48px] border border-white/20 shadow-2xl">
              <form onSubmit={async (e) => {
                e.preventDefault();
                if (!isOtpVerified) return alert('Please verify OTP first');
                try {
                  const res = await fetch('/api/complaints', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...formData, status: 'pending', timestamp: new Date().toISOString() })
                  });
                  if (res.ok) {
                    setFormData({ ...formData, type: 'Street Light', description: '', area: '', urgency: 'medium', imageUrl: '' });
                    setIsOtpVerified(false); setIsOtpSent(false); setOtp('');
                    alert('Incident registered successfully!');
                    fetchData();
                  }
                } catch (err) { alert('Submission failed'); }
              }} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Full Name" required className="bg-gray-50 dark:bg-gray-900/50 p-5 rounded-3xl border border-gray-200 dark:border-gray-800 outline-none focus:ring-2 focus:ring-blue-500" />
                  <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="Email" required className="bg-gray-50 dark:bg-gray-900/50 p-5 rounded-3xl border border-gray-200 dark:border-gray-800 outline-none focus:ring-2 focus:ring-blue-500" />
                </div>

                <div className="space-y-4">
                  <div className="flex gap-3">
                    <input type="tel" value={formData.mobile} onChange={(e) => setFormData({ ...formData, mobile: e.target.value })} placeholder="Mobile Number" required disabled={isOtpVerified} className="flex-1 bg-gray-50 dark:bg-gray-900/50 p-5 rounded-3xl border border-gray-200 dark:border-gray-800 outline-none" />
                    {!isOtpVerified && <button type="button" onClick={() => setIsOtpSent(true)} className="px-8 bg-blue-600 text-white rounded-3xl font-bold uppercase text-xs">{isOtpSent ? 'Resend' : 'Get OTP'}</button>}
                  </div>
                  {isOtpSent && !isOtpVerified && (
                    <div className="p-6 bg-blue-50 dark:bg-blue-900/10 rounded-3xl border border-blue-200 dark:border-blue-800">
                      <p className="text-xs font-bold text-blue-600 mb-4 uppercase tracking-widest text-center">Identity Verification (Demo: 261-105)</p>
                      <div className="flex gap-4">
                        <input
                          type="text"
                          value={otp}
                          onChange={(e) => {
                            let v = e.target.value.replace(/\D/g, '');
                            if (v.length > 3) v = v.slice(0, 3) + '-' + v.slice(3, 6);
                            setOtp(v);
                            setOtpError(false);
                          }}
                          maxLength={7}
                          className={`flex-1 bg-white dark:bg-gray-900 p-5 rounded-2xl text-center text-2xl font-bold border-2 transition-all ${otpError ? 'border-rose-500 bg-rose-50' : 'border-transparent'}`}
                          placeholder="261-105"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (otp.replace('-', '') === "261105") {
                              setIsOtpVerified(true);
                              setOtpError(false);
                            } else {
                              setOtpError(true);
                            }
                          }}
                          className="px-10 bg-emerald-500 text-white rounded-2xl font-bold uppercase text-sm"
                        >
                          Verify
                        </button>
                      </div>
                      {otpError && (
                        <div className="mt-4 flex items-center gap-2 text-rose-600 font-black text-[10px] uppercase tracking-widest animate-pulse justify-center">
                          Invalid verification code. Please check and try again.
                        </div>
                      )}
                    </div>
                  )}
                  {isOtpVerified && (
                    <div className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-200 dark:border-emerald-800">
                      <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-xs font-black text-emerald-600 uppercase tracking-widest">Mobile Identity Verified</span>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-2 px-2">
                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Incident Location</p>
                    <button
                      type="button"
                      onClick={() => setIsEditingLocation(!isEditingLocation)}
                      className="text-[10px] font-bold text-gray-500 hover:text-blue-600 uppercase tracking-widest transition-colors"
                    >
                      {isEditingLocation ? "Cancel Edit" : "Edit Manually"}
                    </button>
                  </div>

                  <div className="p-6 bg-blue-50 dark:bg-blue-900/10 rounded-3xl border border-blue-200 dark:border-blue-800 space-y-4">
                    {isEditingLocation ? (
                      <textarea
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full bg-white dark:bg-gray-900 p-4 rounded-2xl border border-blue-100 dark:border-blue-800 outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        rows={2}
                        placeholder="Enter full address..."
                      />
                    ) : (
                      <p className="text-sm font-bold text-gray-700 dark:text-gray-300">📍 {formData.location || "Detecting live coordinates..."}</p>
                    )}

                    <div className="relative group">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search for another area..."
                          className="flex-1 bg-white dark:bg-gray-900 p-4 rounded-2xl border border-blue-100 dark:border-blue-800 outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                        <button
                          type="button"
                          onClick={async () => {
                            if (!searchQuery) return;
                            setIsSearching(true);
                            const result = await searchAddress(searchQuery);
                            if (result) {
                              setFormData({ ...formData, location: result.address });
                              setSearchQuery('');
                              setIsEditingLocation(false);
                            } else {
                              alert('Location not found');
                            }
                            setIsSearching(false);
                          }}
                          disabled={isSearching}
                          className="px-6 bg-blue-600 text-white rounded-2xl font-bold uppercase text-[10px] disabled:opacity-50"
                        >
                          {isSearching ? '...' : 'Search'}
                        </button>
                      </div>
                      <p className="text-[10px] text-blue-500/60 mt-2 font-medium">Use this to report issues from a different location.</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block ml-2">Infrastructure Type</label>
                  <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="w-full bg-gray-50 dark:bg-gray-900/50 p-5 rounded-3xl border border-gray-200 dark:border-gray-800 outline-none">
                    <option value="Street Light">Street Light</option>
                    <option value="Traffic signal">Traffic signal</option>
                    <option value="Water supply">Water supply</option>
                    <option value="Waste bin">Waste bin</option>
                    <option value="Road">Road</option>
                    <option value="Bridge">Bridge</option>
                    <option value="Park">Park</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block ml-2">Evidence Image</label>
                  <div className="relative group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setFormData({ ...formData, imageUrl: reader.result });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="w-full bg-gray-50 dark:bg-gray-900/50 p-8 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-blue-500/50 hover:bg-blue-50/10 transition-all overflow-hidden relative"
                    >
                      {formData.imageUrl ? (
                        <div className="relative w-full h-32 flex items-center justify-center">
                          <img src={formData.imageUrl} alt="Attached evidence" className="h-full object-contain rounded-xl shadow-lg" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
                            <span className="text-white text-xs font-bold uppercase">Change Image</span>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-2xl flex items-center justify-center text-xl">📸</div>
                          <div className="text-center">
                            <p className="text-sm font-bold text-gray-700 dark:text-gray-300">Click to upload photo evidence</p>
                            <p className="text-xs text-gray-500 mt-1">PNG, JPG or GIF up to 5MB</p>
                          </div>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Incident description..." required rows={4} className="w-full bg-gray-50 dark:bg-gray-900/50 p-5 rounded-3xl border border-gray-200 dark:border-gray-800 outline-none focus:ring-2 focus:ring-blue-500" />

                <button type="submit" disabled={!isOtpVerified} className="w-full py-6 bg-blue-600 text-white rounded-[32px] font-black text-xl shadow-2xl transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-30">SUBMIT INCIDENT REPORT</button>
              </form>
            </div>
          </div>

          <aside className="space-y-8">
            <div className="bg-white dark:bg-dark-card p-8 rounded-[40px] shadow-2xl sticky top-24 border border-gray-100 dark:border-gray-800">
              <h2 className="text-xl font-bold mb-8 uppercase tracking-tighter">Live Incidents</h2>
              <div className="space-y-6 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
                {combinedFeed.map((item) => (
                  <div key={item.id} className="p-5 bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 rounded-3xl">
                    <div className="flex justify-between items-center mb-2">
                      <span className={`text-[10px] font-bold uppercase ${item.status === 'pending' || item.status === 'CRITICAL' ? 'text-rose-600' : 'text-emerald-600'}`}>{item.status}</span>
                      <span className="text-[10px] font-bold text-gray-400">{new Date(item.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <div className="text-xs font-bold text-gray-900 dark:text-white mb-1 uppercase tracking-tight">{item.name || 'Citizen'}</div>
                    <p className="text-[11px] text-gray-500 italic mb-2">"{item.description}"</p>
                    {item.imageUrl && (
                      <div className="mt-3 rounded-xl overflow-hidden h-20 border border-gray-100 dark:border-gray-800">
                        <img src={item.imageUrl} alt="preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Complaints;