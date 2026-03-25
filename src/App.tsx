import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { Toaster } from 'sonner';
import ScrollToTop from './components/ScrollToTop';
import './i18n';

// Layouts
const PublicLayout = lazy(() => import('./layouts/PublicLayout'));
const DashboardLayout = lazy(() => import('./layouts/DashboardLayout'));

// Public Pages
const Home = lazy(() => import('./pages/Home'));
const Activities = lazy(() => import('./pages/Activities'));
const ActivityDetails = lazy(() => import('./pages/ActivityDetails'));
const Contact = lazy(() => import('./pages/Contact'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfUse = lazy(() => import('./pages/TermsOfUse'));
const FAQs = lazy(() => import('./pages/FAQs'));

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
      <ScrollToTop />
      <Toaster position="top-center" richColors />
      <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="activities" element={<Activities />} />
            <Route path="activities/:id" element={<ActivityDetails />} />
            <Route path="contact" element={<Contact />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="blog" element={<Blog />} />
            <Route path="blog/:id" element={<BlogPost />} />
            <Route path="privacy-policy" element={<PrivacyPolicy />} />
            <Route path="terms-of-use" element={<TermsOfUse />} />
            <Route path="faqs" element={<FAQs />} />
          </Route>

          {/* Auth Route (Hidden) */}
          <Route path="/admin/login" element={<Login />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<DashboardLayout />}>
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

