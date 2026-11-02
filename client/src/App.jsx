import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Web3Provider } from './context/Web3Context';
import Layout from './components/layout/Layout';

// Pages
import LandingPage from './pages/LandingPage';
import Marketplace from './pages/buyer/Marketplace';
import Portfolio from './pages/buyer/Portfolio';
import FarmerDashboard from './pages/farmer/FarmerDashboard';
import PlotRegistration from './pages/farmer/PlotRegistration';
import MrvStudio from './pages/admin/MrvStudio';
import LoginPage from './pages/LoginPage';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Web3Provider>
          <Layout>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/login" element={<LoginPage />} />

              {/* Farmer Portal */}
              <Route path="/farmer" element={<FarmerDashboard />} />
              <Route path="/farmer/register" element={<PlotRegistration />} />

              {/* Admin MRV Studio */}
              <Route path="/admin" element={<MrvStudio />} />
              <Route path="/admin/mrv" element={<MrvStudio />} />

              {/* Buyer Portfolio */}
              <Route path="/buyer/portfolio" element={<Portfolio />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </Web3Provider>
      </AuthProvider>
    </Router>
  );
}
