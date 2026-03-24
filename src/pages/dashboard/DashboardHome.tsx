import { useAuthStore } from '../../store';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Users, Calendar, Activity, Star } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function DashboardHome() {
  const { user, token } = useAuthStore();
  const [stats, setStats] = useState({ bookings: 0, activities: 0, reviews: 0 });

  useEffect(() => {
    // Fetch basic stats
    const fetchStats = async () => {
      try {
        const [bookingsRes, activitiesRes, reviewsRes] = await Promise.all([
          fetch('/api/bookings', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/activities'),
          fetch('/api/reviews')
        ]);
        
        const bookings = await bookingsRes.json();
        const activities = await activitiesRes.json();
        const reviews = await reviewsRes.json();

        setStats({
          bookings: bookings.length || 0,
          activities: activities.length || 0,
          reviews: reviews.length || 0,
        });
      } catch (error) {
        console.error('Error fetching stats', error);
      }
    };

    fetchStats();
  }, [token]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-ocean mb-8">Welcome back, {user?.email}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="rounded-2xl shadow-sm border-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Bookings</CardTitle>
            <Calendar className="w-4 h-4 text-wave" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.bookings}</div>
          </CardContent>
        </Card>
        
        <Card className="rounded-2xl shadow-sm border-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Active Activities</CardTitle>
            <Activity className="w-4 h-4 text-wave" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activities}</div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm border-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Reviews</CardTitle>
            <Star className="w-4 h-4 text-wave" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.reviews}</div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm border-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">System Status</CardTitle>
            <Users className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Online</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
