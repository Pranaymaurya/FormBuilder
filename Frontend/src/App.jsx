import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import DashboardPage from './pages/DashboardPage'
import CreateFormPage from './pages/CreateFormPage'
import EditFormPage from './pages/EditFormPage'
import FillFormPage from './pages/FillFormPage'
import ResponsesPage from './pages/ResponsesPage'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
        <Route path="/forms/create" element={
          <ProtectedRoute>
            <CreateFormPage />
          </ProtectedRoute>
        } />
        <Route path="/forms/:id/edit" element={
          <ProtectedRoute>
            <EditFormPage />
          </ProtectedRoute>
        } />
        <Route path="/forms/:id/responses" element={
          <ProtectedRoute>
            <ResponsesPage />
          </ProtectedRoute>
        } />
        <Route path="/forms/:id/fill" element={<FillFormPage />} />
      </Routes>
    </div>
  )
}

export default App
