import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './pages/Homepage';
import Dashboard from './pages/Dashboard';
import Complaints from './pages/Complaints';
import Alerts from './pages/Alerts';
import MapPage from './pages/MapPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { LocationProvider } from './context/LocationContext';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <LocationProvider>
          <Router>
            <div className="min-h-screen bg-white dark:bg-dark-bg transition-colors duration-300 flex flex-col">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Homepage />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/complaints" element={<Complaints />} />
                  <Route path="/alerts" element={<Alerts />} />
                  <Route path="/map" element={<MapPage />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </LocationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;