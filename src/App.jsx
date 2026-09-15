import { Navigate, Route, Routes } from 'react-router-dom';
import { ChildProvider } from './context/ChildContext';
import { isAuthed, isOnboarded } from './utils/session';
import AppShell from './components/layout/AppShell';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ChildCreation from './pages/onboarding/ChildCreation';
import SelectDisorder from './pages/onboarding/SelectDisorder';
import Dashboard from './pages/Dashboard';
import ActivityHistory from './pages/ActivityHistory';
import Results from './pages/Results';
import GuidedPractice from './pages/GuidedPractice';
import ChildProfile from './pages/ChildProfile';
import Settings from './pages/Settings';

function RequireAuth({ children }) {
  if (!isAuthed()) return <Navigate to="/login" replace />;
  return children;
}

function RequireOnboarded({ children }) {
  if (!isAuthed()) return <Navigate to="/login" replace />;
  if (!isOnboarded()) return <Navigate to="/onboarding/child" replace />;
  return children;
}

function RootRedirect() {
  if (!isAuthed()) return <Navigate to="/login" replace />;
  if (!isOnboarded()) return <Navigate to="/onboarding/child" replace />;
  return <Navigate to="/dashboard" replace />;
}

export default function App() {
  return (
    <ChildProvider>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/onboarding/child"
          element={
            <RequireAuth>
              <ChildCreation />
            </RequireAuth>
          }
        />
        <Route
          path="/onboarding/disorder"
          element={
            <RequireAuth>
              <SelectDisorder />
            </RequireAuth>
          }
        />

        <Route
          element={
            <RequireOnboarded>
              <AppShell />
            </RequireOnboarded>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/history" element={<ActivityHistory />} />
          <Route path="/results" element={<Results />} />
          <Route path="/results/:sessionId" element={<Results />} />
          <Route path="/practice" element={<GuidedPractice />} />
          <Route path="/profile" element={<ChildProfile />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ChildProvider>
  );
}
