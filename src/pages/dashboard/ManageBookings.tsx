import { useEffect, useState } from 'react';
import { useAuthStore } from '../../store';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

export default function ManageBookings() {
  const { token } = useAuthStore();
  const [bookings, setBookings] = useState<any[]>([]);

  const fetchBookings = () => {
    fetch('/api/bookings', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setBookings(data));
  };

  useEffect(() => {
    fetchBookings();
  }, [token]);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/bookings/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
    fetchBookings();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-sun/20 text-sunset-dark';
      case 'confirmed': return 'bg-sky/20 text-ocean';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-ocean mb-8">Manage Bookings</h1>
      
      <Card className="rounded-2xl shadow-sm border-0">
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3">Customer</th>
                  <th className="px-6 py-3">Activity</th>
                  <th className="px-6 py-3">Date & Time</th>
                  <th className="px-6 py-3">Persons</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      <div>{booking.fullName}</div>
                      <div className="text-xs text-gray-500">{booking.phone}</div>
                    </td>
                    <td className="px-6 py-4">{booking.activity?.title}</td>
                    <td className="px-6 py-4">
                      <div>{booking.date}</div>
                      <div className="text-xs text-gray-500">{booking.time}</div>
                    </td>
                    <td className="px-6 py-4">{booking.persons}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex space-x-2">
                      {booking.status === 'pending' && (
                        <Button size="sm" onClick={() => updateStatus(booking.id, 'confirmed')} className="bg-ocean hover:bg-ocean-dark text-white">
                          Confirm
                        </Button>
                      )}
                      {booking.status === 'confirmed' && (
                        <Button size="sm" onClick={() => updateStatus(booking.id, 'completed')} className="bg-green-600 hover:bg-green-700 text-white">
                          Complete
                        </Button>
                      )}
                      {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                        <Button size="sm" variant="outline" onClick={() => updateStatus(booking.id, 'cancelled')} className="text-red-600 border-red-200 hover:bg-red-50">
                          Cancel
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
