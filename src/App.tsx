import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { Toaster } from 'sonner';
import './i18n';

// Layouts
const PublicLayout = lazy(() => import('./layouts/PublicLayout'));
const DashboardLayout = lazy(() => import('./layouts/DashboardLayout'));

// Public Pages
const Home = lazy(() => import('./pages/Home'));
const Activities = lazy(() => import('./pages/Activities'));
const ActivityDetails = lazy(() => import('./pages/ActivityDetails'));
const Contact = lazy(() => import('./pages/Contact'));

// Auth
const Login = lazy(() => import('./pages/auth/Login'));

// Dashboard Pages
const DashboardHome = lazy(() => import('./pages/dashboard/DashboardHome'));
const ManageActivities = lazy(() => import('./pages/dashboard/ManageActivities'));
const ManageBookings = lazy(() => import('./pages/dashboard/ManageBookings'));
const ManageMessages = lazy(() => import('./pages/dashboard/ManageMessages'));

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" richColors />
      <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="activities" element={<Activities />} />
            <Route path="activities/:id" element={<ActivityDetails />} />
            <Route path="contact" element={<Contact />} />
          </Route>

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />

          {/* Dashboard Routes */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="activities" element={<ManageActivities />} />
            <Route path="bookings" element={<ManageBookings />} />
            <Route path="messages" element={<ManageMessages />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

