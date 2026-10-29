import { useEffect } from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import './App.css';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './routes/ProtectedRoute';
import { setupMobileViewport, setupMobileEventListeners } from './utils/mobileOptimization';
import { initCameraDebugging } from './utils/cameraHelper';

function App() {
  useEffect(() => {
    setupMobileViewport();
    setupMobileEventListeners();
    initCameraDebugging();
  }, []);

  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Login mode="login" />} />
      <Route path='/signup' element={<Login mode="signup" />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default App
