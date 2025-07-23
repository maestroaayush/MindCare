import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register';
import About from './pages/About Us/About';
import Contact from './pages/Contact';
import ExploreResources from './pages/ExploreResources';
import LearnMore from './pages/LearnMore';
import DashboardLayout from './components/DashboardLayout';
import Services from './pages/Services';
import DashboardHome from './pages/dashboard/DashboardHome';
import Profile from './pages/dashboard/Profile';
import Sessions from './pages/dashboard/Sessions';
import Resources from './pages/dashboard/Resources';
import AdminPanel from './components/Admin/AdminPanel';
import Navbar from './components/Navbar/Navbar';
import PrivateRoute from './components/PrivateRoute';
import AuthWrapper from './components/AuthWrapper';

// Component to conditionally render navbar
const ConditionalNavbar = () => {
  const location = useLocation();
  
  // Hide navbar on dashboard and admin routes
  const hiddenRoutes = ['/dashboard', '/admin'];
  const shouldHideNavbar = hiddenRoutes.some(route => location.pathname.startsWith(route));
  
  return !shouldHideNavbar ? <Navbar /> : null;
};

function App() {
  return (
    <BrowserRouter>
      <AuthWrapper>
        <ConditionalNavbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/services" element={<Services />} />
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/resources" element={<ExploreResources />} />
          <Route path="/learn-more" element={<LearnMore />} />

          {/* Dashboard Layout with Nested Routes */}
          <Route path="/dashboard" element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
            <Route index element={<DashboardHome />} />
            <Route path="profile" element={<Profile />} />
            <Route path="sessions" element={<Sessions />} />
            <Route path="resources" element={<Resources />} />
          </Route>

          {/* Admin Panel Route */}
          <Route path="/admin" element={<PrivateRoute requiredRole="admin"><AdminPanel /></PrivateRoute>} />
        </Routes>
      </AuthWrapper>
    </BrowserRouter>
  );
}

export default App;
