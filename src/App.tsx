import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { useAuthStore } from "./stores/authStore";

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AuthCallback from "./pages/auth/AuthCallback";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Agents from "./pages/Agents";
import NewAgent from "./pages/agents/NewAgent";
import AgentDetail from "./pages/AgentDetail";
import RunDetail from "./pages/RunDetail";
import Tools from "./pages/Tools";
import Settings from "./pages/Settings";
import Changelog from "./pages/Changelog";
import Roadmap from "./pages/Roadmap";
import Documentation from "./pages/Documentation";
import ApiReference from "./pages/ApiReference";
import Guides from "./pages/Guides";
import Support from "./pages/Support";
import About from "./pages/About";
import Blog from "./pages/Blog";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";

// Components
import ErrorBoundary from "./components/ErrorBoundary";

// Layout
import Sidebar from "./components/layout/Sidebar";
import Topbar from "./components/layout/Topbar";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/auth/login" />;
  
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <ErrorBoundary>
      <Toaster position="top-right" richColors theme="dark" />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
        <Route path="/changelog" element={<Changelog />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/docs" element={<Documentation />} />
        <Route path="/api-reference" element={<ApiReference />} />
        <Route path="/guides" element={<Guides />} />
        <Route path="/support" element={<Support />} />
        <Route path="/about" element={<About />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/agents" element={<ProtectedRoute><Agents /></ProtectedRoute>} />
        <Route path="/agents/new" element={<ProtectedRoute><NewAgent /></ProtectedRoute>} />
        <Route path="/agents/:id" element={<ProtectedRoute><AgentDetail /></ProtectedRoute>} />
        <Route path="/runs/:id" element={<ProtectedRoute><RunDetail /></ProtectedRoute>} />
        <Route path="/tools" element={<ProtectedRoute><Tools /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        
        {/* Default Route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
