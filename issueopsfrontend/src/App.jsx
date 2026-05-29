import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { WorkspaceProvider } from './context/WorkspaceContext';
import { SocketProvider } from './context/SocketContext';

import Landing         from './pages/Landing';
import { Login, Register } from './pages/Auth';
import Dashboard       from './pages/Dashboard';
import Workspaces      from './pages/Workspaces';
import WorkspaceDetail from './pages/WorkspaceDetail';
import Projects        from './pages/Projects';
import ProjectDetail   from './pages/ProjectDetail';
import Issues          from './pages/Issues';
import IssueDetail     from './pages/IssueDetail';
import Kanban          from './pages/Kanban';
import Notifications   from './pages/Notifications';
import Analytics       from './pages/Analytics';
import AutomationRules from './pages/AutomationRules';
import Webhooks        from './pages/Webhooks';
import Settings        from './pages/Settings';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 1000 * 30 } },
});

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
    </div>
  );
  return user ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/"         element={<Landing />} />
      <Route path="/login"    element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected */}
      <Route path="/dashboard"              element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/workspaces"             element={<ProtectedRoute><Workspaces /></ProtectedRoute>} />
      <Route path="/workspaces/:id"         element={<ProtectedRoute><WorkspaceDetail /></ProtectedRoute>} />
      <Route path="/projects"               element={<ProtectedRoute><Projects /></ProtectedRoute>} />
      <Route path="/projects/:id"           element={<ProtectedRoute><ProjectDetail /></ProtectedRoute>} />
      <Route path="/issues"                 element={<ProtectedRoute><Issues /></ProtectedRoute>} />
      <Route path="/issues/:id"             element={<ProtectedRoute><IssueDetail /></ProtectedRoute>} />
      <Route path="/kanban"                 element={<ProtectedRoute><Kanban /></ProtectedRoute>} />
      <Route path="/notifications"          element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
      <Route path="/analytics"              element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
      <Route path="/automation"             element={<ProtectedRoute><AutomationRules /></ProtectedRoute>} />
      <Route path="/webhooks"               element={<ProtectedRoute><Webhooks /></ProtectedRoute>} />
      <Route path="/settings"              element={<ProtectedRoute><Settings /></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <WorkspaceProvider>
          <SocketProvider>
            <BrowserRouter>
              <AppRoutes />
              <Toaster
                position="bottom-right"
                toastOptions={{ style: { fontSize: '13px', borderRadius: '10px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' } }}
              />
            </BrowserRouter>
          </SocketProvider>
        </WorkspaceProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
