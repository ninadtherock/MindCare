import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Progress from './pages/Progress';
import Counsellors from './pages/Counsellors';
import Assessment from './pages/Assessment';
import Login from './pages/Login';
import CounselorEnrollment from './pages/CounselorEnrollment';
import { AuthProvider } from './context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <>
                    <Navbar />
                    <AnimatePresence mode="wait">
                      <Home />
                    </AnimatePresence>
                  </>
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <>
                    <Navbar />
                    <AnimatePresence mode="wait">
                      <Dashboard />
                    </AnimatePresence>
                  </>
                </PrivateRoute>
              }
            />
            <Route
              path="/progress"
              element={
                <PrivateRoute>
                  <>
                    <Navbar />
                    <AnimatePresence mode="wait">
                      <Progress />
                    </AnimatePresence>
                  </>
                </PrivateRoute>
              }
            />
            <Route
              path="/counsellors"
              element={
                <PrivateRoute>
                  <>
                    <Navbar />
                    <AnimatePresence mode="wait">
                      <Counsellors />
                    </AnimatePresence>
                  </>
                </PrivateRoute>
              }
            />
            <Route
              path="/counselor-enrollment"
              element={
                <PrivateRoute>
                  <>
                    <Navbar />
                    <AnimatePresence mode="wait">
                      <CounselorEnrollment />
                    </AnimatePresence>
                  </>
                </PrivateRoute>
              }
            />
            <Route
              path="/assessment"
              element={
                <PrivateRoute>
                  <>
                    <Navbar />
                    <AnimatePresence mode="wait">
                      <Assessment />
                    </AnimatePresence>
                  </>
                </PrivateRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;