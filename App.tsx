import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import PayerDirectory from './components/PayerDirectory';
import CertificateUpload from './components/CertificateUpload';
import PayerConnection from './components/PayerConnection';
import CertificateValidator from './components/CertificateValidator';
import TrustFramework from './components/TrustFramework';
import Attestation from './components/Attestation';
import BulkDataExchange from './components/BulkDataExchange';
import Settings from './components/Settings';

import { useAuthStore } from './store/authStore';
import LoginPage from './components/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import RegisterPage from './components/Register';
import CertificateUploadPage from './components/CertificateUpload2';





import { GlobalContext } from './src/components/GlobalContext';

// Mock user for demonstration purposes
const mockUser = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  role: 'admin',
  payerId: '1',
  permissions: ['read:all', 'write:all'],
};

export default function App() {
  const { isAuthenticated, login } = useAuthStore();

  const [globalVariable, setGlobalVariable] = useState<string>('');

  React.useEffect(() => {
    // Auto-login for demonstration
    login(mockUser);
  }, [login]);
  return (
    <GlobalContext.Provider value={{ globalVariable, setGlobalVariable }}>

      <BrowserRouter>

      
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/directory" replace />} />
            <Route path="directory" element={<PayerDirectory />} />
            <Route path="certificates" element={<CertificateUpload />} />
            <Route path="connections" element={<PayerConnection />} />
            <Route path="validate" element={<CertificateValidator />} />
            <Route path="trust-framework" element={<TrustFramework />} />
            <Route path="attestation" element={<Attestation />} />
            <Route path="bulk-data" element={<BulkDataExchange />} />
            <Route path="settings" element={<Settings />} />
            <Route path='bulk-data' element={<ProtectedRoute><BulkDataExchange /></ProtectedRoute>} />
            <Route path="settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          </Route>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/certificate" element={<CertificateUploadPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </BrowserRouter>


    </GlobalContext.Provider>
  );
}