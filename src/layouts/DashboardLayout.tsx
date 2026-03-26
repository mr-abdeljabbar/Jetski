import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store';
import { useEffect } from 'react';
import { LayoutDashboard, Calendar, LogOut, Settings, Mail, Waves } from 'lucide-react';

export default function DashboardLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      navigate('/admin/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  const isActive = (path: string) => location.pathname === path;

  const navItemClass = (path: string) => 
    `flex items-center px-6 py-4 transition-all border-l-4 ${
      isActive(path) 
        ? 'bg-sky/10 border-ocean text-ocean font-bold' 
        : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-ocean hover:border-sky'
    }`;

  const iconClass = (path: string) => 
    `w-5 h-5 mr-3 transition-colors ${
      isActive(path) ? 'text-ocean' : 'text-gray-400 group-hover:text-ocean'
    }`;

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-white shadow-[4px_0_24px_rgba(0,0,0,0.02)] flex flex-col z-10">
        <div className="p-8 pb-6 border-b border-gray-100 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-ocean flex items-center justify-center shadow-md shadow-ocean/20">
            <Waves className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-ocean tracking-tight">Taghazout<span className="text-sky">Jet</span></h2>
            <div className="inline-flex mt-1 items-center px-2.5 py-0.5 rounded-full text-xs font-bold leading-4 bg-sky/10 text-ocean">
              {user.role}
            </div>
          </div>
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
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto w-full">
        <div className="p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
