import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Oauth2 from './component/Oauth2';
import AuthCallback from './component/OAuthCallback';
import { Services } from './component/services.jsx';
import { ServiceTemplate } from './component/Service_page/ServiceTemplate.jsx';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Oauth2 />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/services" element={<ProtectedRoute><Services /></ProtectedRoute>} />
          <Route path="/:serviceName" element={<ProtectedRoute><ServiceTemplate /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;