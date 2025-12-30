import { Link } from 'react-router-dom';
import { useLocationContext } from '../context/LocationContext';
import { useAuth } from '../context/AuthContext';

const Homepage = () => {
  const { userLocation } = useLocationContext();
  const { isAdmin } = useAuth();

  const features = [
    {
      title: "Real-Time Monitoring",
      description: "Track the pulse of the city with live sensor data and predictive analytics.",
      icon: (
        <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      bg: "bg-blue-50 dark:bg-blue-900/20"
    },
    {
      title: "Fix It Fast",
      description: "Found an issue? Report it instantly and track the resolution in real-time.",
      icon: (
        <svg className="w-12 h-12 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      bg: "bg-purple-50 dark:bg-purple-900/20"
    },
    {
      title: "SENSE Alerts",
      description: "Stay informed about critical infrastructure events and maintenance schedules.",
      icon: (
        <svg className="w-12 h-12 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ),
      bg: "bg-pink-50 dark:bg-pink-900/20"
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg transition-colors duration-500 selection:bg-blue-500/30">
      {/* Background Shapes */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px] animate-blob" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-[120px] animate-blob animation-delay-2000" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-indigo-500/5 rounded-full blur-[100px] animate-blob animation-delay-4000" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-44 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center space-x-3 px-6 py-2.5 rounded-full bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 text-blue-600 dark:text-blue-400 text-sm font-black mb-10 shadow-xl animate-fade-in-up uppercase tracking-widest">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
              </span>
              <span>Next-Gen City Governance</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-gray-900 dark:text-white leading-[0.95] mb-6 sm:mb-10 tracking-tighter animate-fade-in-up animation-delay-150">
              <span className="text-blue-600">Monitor.</span> <br className="sm:hidden" /> <span className="text-purple-600">Predict.</span> <br className="sm:hidden" /> <span className="text-emerald-500">Prevent.</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-500 dark:text-gray-400 mb-16 max-w-3xl mx-auto font-medium leading-relaxed animate-fade-in-up animation-delay-300">
              Harness the power of real-time IoT diagnostics and citizen-led reporting
              to build a city that breathes, reacts, and fixes itself.
            </p>

            <div className="flex flex-col sm:flex-row gap-8 justify-center animate-fade-in-up animation-delay-450">
              <Link to="/dashboard" className="group relative px-12 py-6 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-[32px] font-black text-xl shadow-2xl hover:scale-105 transition-all overflow-hidden flex items-center justify-center">
                <span className="relative z-10 flex items-center gap-3">
                  Launch Dashboard
                  <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <Link to="/complaints" className="px-12 py-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-100 dark:border-gray-700/50 rounded-[32px] font-black text-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-black/50">
                {isAdmin ? "See All Complaints" : "Report Incident"}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4"><hr className="border-gray-200 dark:border-gray-800" /></div>

      <div className="max-w-7xl mx-auto px-4"><hr className="border-gray-200 dark:border-gray-800" /></div>

      <div className="max-w-7xl mx-auto px-4"><hr className="border-gray-200 dark:border-gray-800" /></div>

      <div className="max-w-7xl mx-auto px-4"><hr className="border-gray-200 dark:border-gray-800" /></div>

      {/* Metrics Section */}
      <section className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Active Nodes", value: "84.2k", color: "text-blue-600" },
              { label: "Response Time", value: "< 10m", color: "text-emerald-500" },
              { label: "Reliability", value: "99.98%", color: "text-purple-600" },
              { label: "Data Flow", value: "4.2 TB/d", color: "text-amber-500" }
            ].map((stat, i) => (
              <div key={i} className="text-center p-8 glass rounded-[40px] border border-white/20">
                <div className={`text-4xl md:text-5xl font-black mb-2 ${stat.color} tracking-tighter`}>{stat.value}</div>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4"><hr className="border-gray-200 dark:border-gray-800" /></div>

      <div className="max-w-7xl mx-auto px-4"><hr className="border-gray-200 dark:border-gray-800" /></div>

      <div className="max-w-7xl mx-auto px-4"><hr className="border-gray-200 dark:border-gray-800" /></div>

      {/* Features Grid */}
      <section className="py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white leading-none mb-6">INTELLIGENT <br />INFRASTRUCTURE</h2>
              <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">Unified management for the modern city. From waste management to energy grids, everything is under your control.</p>
            </div>
            <Link to="/alerts" className="px-8 py-4 bg-gray-100 dark:bg-gray-800 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">View All Systems</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <div key={index} className="group bg-white dark:bg-dark-card p-8 sm:p-12 rounded-[40px] sm:rounded-[56px] shadow-sm hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] transition-all duration-700 border border-gray-100 dark:border-gray-800 relative overflow-hidden">
                <div className={`w-24 h-24 ${feature.bg} rounded-[32px] flex items-center justify-center mb-10 group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 shadow-lg`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mb-4 sm:mb-6 tracking-tight">{feature.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-base sm:text-lg font-medium">{feature.description}</p>

                <div className="mt-6 sm:mt-10 flex items-center text-blue-600 dark:text-blue-400 font-black text-xs uppercase tracking-widest gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all sm:translate-y-4 sm:group-hover:translate-y-0">
                  Learn More
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4"><hr className="border-gray-200 dark:border-gray-800" /></div>

      <div className="max-w-7xl mx-auto px-4"><hr className="border-gray-200 dark:border-gray-800" /></div>

      <div className="max-w-7xl mx-auto px-4"><hr className="border-gray-200 dark:border-gray-800" /></div>

      {/* Live Status Card */}
      <section className="py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-900 dark:bg-white rounded-[48px] sm:rounded-[72px] p-8 md:p-24 relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
              <div>
                <div className="text-blue-500 font-black text-sm uppercase tracking-[0.3em] mb-8">System Pulse</div>
                <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-white dark:text-gray-900 mb-6 sm:mb-10 leading-[0.95]">
                  VIGILANT. <br /> ALWAYS.
                </h2>
                <p className="text-gray-400 dark:text-gray-500 text-xl mb-12 font-medium leading-relaxed">
                  Decentralized sensor networks monitoring every bridge, light, and grid.
                  When an anomaly strikes, our AI neutralizes it before it impacts citizens.
                </p>
                <div className="flex gap-12">
                  <div>
                    <div className="text-4xl font-black text-white dark:text-gray-900 mb-2">99.8%</div>
                    <div className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Efficiency</div>
                  </div>
                  <div>
                    <div className="text-4xl font-black text-white dark:text-gray-900 mb-2">2.4k</div>
                    <div className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Self-Heals / Day</div>
                  </div>
                </div>
              </div>

              <div className="glass p-10 rounded-[48px] border border-white/10 dark:border-black/5 shadow-2xl">
                <div className="flex items-center justify-between mb-10">
                  <span className="text-gray-900 dark:text-white font-black text-xs uppercase tracking-widest">City Grid Optimization</span>
                  <div className="flex gap-1">
                    {[1, 2, 3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" style={{ animationDelay: `${i * 200}ms` }} />)}
                  </div>
                </div>
                <div className="space-y-6">
                  {['Grid Sector 7: Optimized', 'Bridge Sensors: Active', 'Water Purifier #42: Normal'].map((text, i) => (
                    <div key={i} className="flex gap-5 p-6 rounded-3xl bg-white/10 dark:bg-black/10 border border-white/10 dark:border-black/5 group hover:bg-white/20 dark:hover:bg-black/20 transition-all cursor-crosshair">
                      <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-lg">
                        {['⚡', '🌉', '💧'][i]}
                      </div>
                      <div>
                        <div className="text-gray-900 dark:text-white font-black text-sm tracking-tight">{text}</div>
                        <div className="text-gray-500 text-[10px] font-bold uppercase mt-1">Status Nominal • Dec 2025</div>
                      </div>
                    </div>
                  ))}
                </div>
                <Link
                  to="/dashboard"
                  className="w-full mt-12 py-6 bg-blue-600 text-white rounded-[32px] font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-blue-500/20 active:scale-95 flex items-center justify-center"
                >
                  Access Master Control
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4"><hr className="border-gray-200 dark:border-gray-800" /></div>

      <div className="max-w-7xl mx-auto px-4"><hr className="border-gray-200 dark:border-gray-800" /></div>

      <div className="max-w-7xl mx-auto px-4"><hr className="border-gray-200 dark:border-gray-800" /></div>

      {/* Footer CTA */}
      <footer className="py-44 relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center bg-gray-50 dark:bg-gray-900/40 rounded-[80px] py-32 border border-gray-100 dark:border-gray-800">
          <h2 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white mb-10 tracking-tighter">JOIN THE <br /> REVOLUTION</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-14 max-w-2xl mx-auto text-xl font-medium leading-relaxed">
            Every report you submit, every status you check, contributes to the
            intelligence of our shared home. Start today.
          </p>
          <div className="flex justify-center gap-6">
            {isAdmin ? (
              <Link to="/dashboard" className="px-12 py-6 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-[32px] font-black text-lg hover:shadow-2xl hover:-translate-y-1 transition-all">
                Access Dashboard
              </Link>
            ) : (
              <Link to="/complaints" className="px-12 py-6 bg-blue-600 text-white rounded-[32px] font-black text-lg hover:shadow-2xl hover:shadow-blue-500/40 hover:-translate-y-1 transition-all">
                Register a Complaint
              </Link>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;