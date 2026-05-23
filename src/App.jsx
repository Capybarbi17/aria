import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { DemoProvider } from './contexts/DemoContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import DemoTour from './components/demo/DemoTour'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import ProgrammeNewPage from './pages/ProgrammeNewPage'
import ProgrammeFolderPage from './pages/ProgrammeFolderPage'
import ApplicationDetailPage from './pages/ApplicationDetailPage'
import PublicApplyPage from './pages/PublicApplyPage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <DemoProvider>
          <DemoTour />
          <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/apply/:slug" element={<PublicApplyPage />} />

          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/programmes/new" element={<ProgrammeNewPage />} />
            <Route path="/programmes/:id" element={<ProgrammeFolderPage />} />
            <Route
              path="/programmes/:id/applications/:appId"
              element={<ApplicationDetailPage />}
            />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </DemoProvider>
      </BrowserRouter>
    </AuthProvider>
  )
}
