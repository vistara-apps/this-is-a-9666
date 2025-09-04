import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { AdGenerationProvider } from './contexts/AdGenerationContext'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import GenerationPage from './pages/GenerationPage'
import AnalyticsPage from './pages/AnalyticsPage'
import Sidebar from './components/Sidebar'
import Header from './components/Header'

function AppContent() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return <LoginPage />
  }

  return (
    <div className="min-h-screen bg-bg flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/generate" element={<GenerationPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AdGenerationProvider>
        <AppContent />
      </AdGenerationProvider>
    </AuthProvider>
  )
}

export default App