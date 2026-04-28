import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from "react-router-dom";
import './App.css'
import Home from './pages/Home'
import Login from './pages/Login';
import OnBoarding from './pages/OnBoarding';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './routes/ProtectedRoute';
import { setupMobileViewport, setupMobileEventListeners, logMobileInfo } from './utils/mobileOptimization';
import { initCameraDebugging } from './utils/cameraHelper';

function App() {
  useEffect(() => {
    // ✅ Initialize mobile optimizations on app load
    setupMobileViewport();
    setupMobileEventListeners();
    logMobileInfo();

    // 📷 Initialize camera debugging
    initCameraDebugging();

    // ✅ Log initial load info
    console.log("🚀 MediLog App initialized for mobile and desktop access");
  }, []);

  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/onboarding' element={<ProtectedRoute ><OnBoarding /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute> <Dashboard /> </ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default App
