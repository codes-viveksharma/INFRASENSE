import { Link } from 'react-router-dom';

const Homepage = () => {
  const features = [
    {
      title: "Real-Time Monitoring",
      description: "Track infrastructure health with live data from thousands of sensors across the city.",
      icon: "📡",
      color: "blue"
    },
    {
      title: "Predictive Maintenance",
      description: "AI-powered predictions to prevent failures before they happen.",
      icon: "🤖",
      color: "green"
    },
    {
      title: "Citizen Complaints",
      description: "Direct feedback system for residents to report issues instantly.",
      icon: "👥",
      color: "purple"
    }
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-green-50" />
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '30px'
        }} />
      </div>

      {/* User-provided photo background (place file at frontend/public/images/smartcity.jpg) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-center bg-cover transition-opacity duration-500"
             style={{
               backgroundImage: "url('/images/smartcity.jpg')",
             }}
             aria-hidden
        />
        {/* subtle overlay so content remains readable */}
        <div className="absolute inset-0 bg-white/60 dark:bg-black/50 transition-colors duration-500" />
      </div>

      {/* Decorative inline SVGs: skyline and infrastructure icons */}
      <div className="absolute inset-0 pointer-events-none">
        <svg className="w-full h-full opacity-30 dark:opacity-20 transition-opacity duration-500" viewBox="0 0 1440 300" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <g fill="none" fillRule="evenodd">
            <rect width="1440" height="300" fill="transparent" />
            <g transform="translate(0,80)" fill="#1F2937" fillOpacity="0.06">
              <rect x="20" y="60" width="80" height="80" rx="4" />
              <rect x="120" y="20" width="50" height="120" rx="3" />
              <rect x="190" y="40" width="36" height="100" rx="3" />
              <rect x="240" y="0" width="120" height="160" rx="4" />
              <rect x="380" y="30" width="90" height="130" rx="4" />
              <rect x="520" y="10" width="140" height="150" rx="4" />
              <rect x="700" y="50" width="60" height="110" rx="3" />
              <rect x="780" y="30" width="120" height="130" rx="4" />
              <rect x="940" y="0" width="200" height="160" rx="4" />
              <rect x="1160" y="40" width="80" height="100" rx="4" />
            </g>
          </g>
        </svg>

        {/* Small infrastructure icons (sensor, tower) */}
        <svg className="absolute left-8 top-24 w-36 h-36 opacity-80 dark:opacity-60 transform-gpu animate-fade-in" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <g fill="none" fillRule="evenodd">
            <circle cx="32" cy="32" r="30" fill="#06B6D4" fillOpacity="0.06" />
            <path d="M32 16v32" stroke="#06B6D4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M20 28c4-6 20-6 24 0" stroke="#06B6D4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="32" cy="44" r="4" fill="#06B6D4" />
          </g>
        </svg>

        <svg className="absolute right-12 bottom-20 w-48 h-48 opacity-70 dark:opacity-50 transform-gpu animate-fade-in delay-150" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <g fill="none" fillRule="evenodd">
            <rect x="8" y="20" width="48" height="28" rx="3" fill="#4F46E5" fillOpacity="0.06" />
            <path d="M20 20v-6a6 6 0 0112 0v6" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" />
            <circle cx="24" cy="34" r="2" fill="#4F46E5" />
            <circle cx="40" cy="34" r="2" fill="#4F46E5" />
          </g>
        </svg>
      </div>

      <div className="relative">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
            Monitor. <span className="text-smart-blue">Predict.</span> Prevent.
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto">
            A real-time smart city infrastructure monitoring platform for proactive maintenance and citizen engagement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <Link to="/dashboard" className="btn-primary text-lg">
              Get Started
            </Link>
            <a href="#features" className="btn-secondary text-lg">
              View Demo
            </a>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white dark:bg-dark-card rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-5xl mb-6">{feature.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-smart-blue text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold mb-2">24/7</div>
                <div className="text-blue-100">Monitoring</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">99.8%</div>
                <div className="text-blue-100">Uptime</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">&lt;5s</div>
                <div className="text-blue-100">Alert Response</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">10k+</div>
                <div className="text-blue-100">Sensors</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;