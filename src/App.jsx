import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import './App.css';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './routes/ProtectedRoute';
import MedilogLoader from './components/MedilogLoader';
import { setupMobileViewport, setupMobileEventListeners } from './utils/mobileOptimization';
import { initCameraDebugging } from './utils/cameraHelper';

function App() {
  const [showStartupLoader, setShowStartupLoader] = useState(
    () => window.location.pathname === "/"
  );

  useEffect(() => {
    setupMobileViewport();
    setupMobileEventListeners();
    initCameraDebugging();
  }, []);

  useEffect(() => {
    if (!showStartupLoader) return undefined;

    const timerId = window.setTimeout(() => {
      setShowStartupLoader(false);
    }, 2000);

    return () => window.clearTimeout(timerId);
  }, [showStartupLoader]);

  return (
    <Routes>
      <Route
        path="/"
        element={
          showStartupLoader ? <MedilogLoader startup /> : <Home />
        }
      />
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
