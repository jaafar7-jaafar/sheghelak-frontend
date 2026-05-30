import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './theme/ThemeContext';
import { AuthProvider } from './modules/auth/AuthContext';
import { RequireAuth, RequireAdmin, RedirectIfAuth } from './routes/guards';
import { ToastProvider } from './components/ui/Toast';
import ScrollToTop from './components/ScrollToTop';
import BackToTop from './components/ui/BackToTop';

const LandingPage           = lazy(() => import('./pages/public/LandingPage'));
const PathsPage        = lazy(() => import('./pages/public/PathsPage'));
const LoginPage             = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage          = lazy(() => import('./pages/auth/RegisterPage'));
const ResetPasswordPage     = lazy(() => import('./pages/auth/ResetPasswordPage'));
const UserDashboard         = lazy(() => import('./pages/user/UserDashboard'));
const PathPage              = lazy(() => import('./pages/user/PathPage'));
const TasksPage             = lazy(() => import('./pages/user/TasksPage'));
const AnnouncementsPage     = lazy(() => import('./pages/user/AnnouncementsPage'));
const SubmissionsPage       = lazy(() => import('./pages/user/SubmissionsPage'));
const SettingsPage          = lazy(() => import('./pages/user/SettingsPage'));
const AdminDashboard        = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminUsersPage        = lazy(() => import('./pages/admin/AdminUsersPage'));
const AdminPathsPage        = lazy(() => import('./pages/admin/AdminPathsPage'));
const AdminTasksPage        = lazy(() => import('./pages/admin/AdminTasksPage'));
const AdminAnnouncementsPage = lazy(() => import('./pages/admin/AdminAnnouncementsPage'));
const AdminSubmissionsPage  = lazy(() => import('./pages/admin/AdminSubmissionsPage'));
const AdminEmailsPage       = lazy(() => import('./pages/admin/AdminEmailsPage'));
const AdminSettingsPage     = lazy(() => import('./pages/admin/AdminSettingsPage'));
const NotFound              = lazy(() => import('./pages/NotFound'));

function PageLoader() {
  return (
    <div className="min-h-screen bg-background dark:bg-slate-900 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <span className="text-white font-bold text-sm">S</span>
        </div>
        <div className="flex gap-1">
          {[0, 1, 2].map(i => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
        <BrowserRouter>
          <ScrollToTop />
          <BackToTop />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/paths" element={<PathsPage />} />
              <Route path="/login" element={<RedirectIfAuth><LoginPage /></RedirectIfAuth>} />
              <Route path="/register" element={<RedirectIfAuth><RegisterPage /></RedirectIfAuth>} />
              <Route path="/reset-password" element={<RedirectIfAuth><ResetPasswordPage /></RedirectIfAuth>} />
              <Route path="/dashboard" element={<RequireAuth><UserDashboard /></RequireAuth>} />
              <Route path="/dashboard/path" element={<RequireAuth><PathPage /></RequireAuth>} />
              <Route path="/dashboard/tasks" element={<RequireAuth><TasksPage /></RequireAuth>} />
              <Route path="/dashboard/announcements" element={<RequireAuth><AnnouncementsPage /></RequireAuth>} />
              <Route path="/dashboard/submissions" element={<RequireAuth><SubmissionsPage /></RequireAuth>} />
              <Route path="/dashboard/settings" element={<RequireAuth><SettingsPage /></RequireAuth>} />
              <Route path="/admin" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
              <Route path="/admin/users" element={<RequireAdmin><AdminUsersPage /></RequireAdmin>} />
              <Route path="/admin/paths" element={<RequireAdmin><AdminPathsPage /></RequireAdmin>} />
              <Route path="/admin/tasks" element={<RequireAdmin><AdminTasksPage /></RequireAdmin>} />
              <Route path="/admin/announcements" element={<RequireAdmin><AdminAnnouncementsPage /></RequireAdmin>} />
              <Route path="/admin/submissions" element={<RequireAdmin><AdminSubmissionsPage /></RequireAdmin>} />
              <Route path="/admin/emails"      element={<RequireAdmin><AdminEmailsPage /></RequireAdmin>} />
              <Route path="/admin/settings"    element={<RequireAdmin><AdminSettingsPage /></RequireAdmin>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
