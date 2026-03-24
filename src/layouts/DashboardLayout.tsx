import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store';
import { useEffect } from 'react';
import { LayoutDashboard, Calendar, LogOut, Settings, Mail } from 'lucide-react';

export default function DashboardLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-ocean">Taghazout Jet</h2>
          <p className="text-sm text-gray-500 mt-1">{user.role} Dashboard</p>
        </div>
        <nav className="mt-6">
          <Link to="/dashboard" className="flex items-center px-6 py-3 text-gray-700 hover:bg-sky/10 hover:text-ocean">
            <LayoutDashboard className="w-5 h-5 mr-3" />
            Dashboard
          </Link>
          <Link to="/dashboard/bookings" className="flex items-center px-6 py-3 text-gray-700 hover:bg-sky/10 hover:text-ocean">
            <Calendar className="w-5 h-5 mr-3" />
            Bookings
          </Link>
          <Link to="/dashboard/messages" className="flex items-center px-6 py-3 text-gray-700 hover:bg-sky/10 hover:text-ocean">
            <Mail className="w-5 h-5 mr-3" />
            Messages
          </Link>
          {user.role === 'ADMIN' && (
            <Link to="/dashboard/activities" className="flex items-center px-6 py-3 text-gray-700 hover:bg-sky/10 hover:text-ocean">
              <Settings className="w-5 h-5 mr-3" />
              Activities
            </Link>
          )}
          <button onClick={() => { logout(); navigate('/login'); }} className="w-full flex items-center px-6 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600">
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}
