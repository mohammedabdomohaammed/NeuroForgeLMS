// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// Student/Candidate Pages
import Dashboard from './pages/Dashboard';
import Problems from './pages/Problems';
import ProblemDetail from './pages/ProblemDetail';
import AIInterview from './pages/AIInterview';
import Profile from './pages/Profile';

// Admin Core Pages
import AdminLogin from './pages/admin/AdminLogin'; // Make sure you created this from previous step
import AdminDashboard from './pages/admin/AdminDashboard';
import CreateProblem from './pages/admin/CreateProblem';
import UserDatabase from './pages/admin/UserDatabase'; // NEW
import SystemAnalytics from './pages/admin/SystemAnalytics'; // NEW
import PlatformSettings from './pages/admin/PlatformSettings'; // NEW

// Logic & Layouts
import { useAuth } from './hooks/useAuth';
import AdminRoute from './components/layout/AdminRoute'; // Make sure you created this

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* === PUBLIC ROUTES === */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:userId/:token" element={<ResetPassword />} />
        
        {/* === ADMIN ENTRY (Separate Door) === */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* === STUDENT ROUTES (Protected) === */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/problems" element={<ProtectedRoute><Problems /></ProtectedRoute>} />
        <Route path="/problems/:id" element={<ProtectedRoute><ProblemDetail /></ProtectedRoute>} />
        <Route path="/tutor" element={<ProtectedRoute><AIInterview /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        {/* === ADMIN CORE (Strictly Guarded) === */}
        {/* 1. Control Center */}
        <Route 
          path="/admin" 
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } 
        />
        {/* 2. Problem Management */}
        <Route 
          path="/admin/create-problem" 
          element={
            <AdminRoute>
              <CreateProblem />
            </AdminRoute>
          } 
        />
        {/* 3. User Database (Fixed Redirect Issue) */}
        <Route 
          path="/admin/users" 
          element={
            <AdminRoute>
              <UserDatabase />
            </AdminRoute>
          } 
        />
        {/* 4. System Analytics (Fixed Redirect Issue) */}
        <Route 
          path="/admin/analytics" 
          element={
            <AdminRoute>
              <SystemAnalytics />
            </AdminRoute>
          } 
        />
        {/* 5. Platform Settings (Fixed Redirect Issue) */}
        <Route 
          path="/admin/settings" 
          element={
            <AdminRoute>
              <PlatformSettings />
            </AdminRoute>
          } 
        />

        {/* Catch-All */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;