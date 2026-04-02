import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store';
import { useEffect, useState } from 'react';
import { LayoutDashboard, Calendar, LogOut, Settings, Mail, Menu, X, Waves } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DashboardLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/admin/login');
    }
  }, [user, navigate]);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  if (!user) return null;

  const isActive = (path: string) => location.pathname === path;

  const navItemClass = (path: string) =>
    `flex items-center px-6 py-4 transition-all border-l-4 ${isActive(path)
      ? 'bg-sky/10 border-ocean text-ocean font-bold'
      : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-ocean hover:border-sky'
    }`;

  const iconClass = (path: string) =>
    `w-5 h-5 mr-3 transition-colors ${isActive(path) ? 'text-ocean' : 'text-gray-400 group-hover:text-ocean'
    }`;

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white">
      <div className="p-8 pb-6 border-b border-gray-100 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img
            src="/logo.png"
            alt="Taghazout Jet"
            className="h-14 lg:h-20 w-auto"
          />
        </Link>
        <button 
          onClick={() => setIsSidebarOpen(false)}
          className="lg:hidden p-2 text-gray-400 hover:text-ocean transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <nav className="flex-1 py-6 space-y-1 overflow-y-auto">
        <Link to="/admin" className={`group ${navItemClass('/admin')}`}>
          <LayoutDashboard className={iconClass('/admin')} />
          Overview
        </Link>
        <Link to="/admin/bookings" className={`group ${navItemClass('/admin/bookings')}`}>
          <Calendar className={iconClass('/admin/bookings')} />
          Bookings
        </Link>
        <Link to="/admin/messages" className={`group ${navItemClass('/admin/messages')}`}>
          <Mail className={iconClass('/admin/messages')} />
          Messages
        </Link>
        {user.role === 'ADMIN' && (
          <Link to="/admin/activities" className={`group ${navItemClass('/admin/activities')}`}>
            <Settings className={iconClass('/admin/activities')} />
            Activities
          </Link>
        )}
      </nav>

      <div className="p-4 border-t border-gray-100 mt-auto">
        <button
          onClick={() => { logout(); navigate('/admin/login'); }}
          className="w-full flex items-center justify-center px-4 py-3 text-red-600 font-semibold bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
        >
          <LogOut className="w-5 h-5 mr-2" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 bg-white shadow-[4px_0_24px_rgba(0,0,0,0.02)] flex-col z-20 shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-ocean/40 backdrop-blur-sm z-30 lg:hidden"
            />
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-white shadow-2xl z-40 lg:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 shrink-0 z-10">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-gray-500 hover:text-ocean transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <Link to="/" className="flex items-center">
            <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
          </Link>
          <div className="w-10" /> {/* Spacer for centering */}
        </header>

        <main className="flex-1 overflow-y-auto w-full relative">
          <div className="p-4 sm:p-8 max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
