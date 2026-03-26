import { useEffect, useState } from 'react';
import { useAuthStore } from '../../store';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Clock, Trash2, Calendar, Users, MessageCircle, MapPin, CheckCircle, XCircle } from 'lucide-react';
import ConfirmDeleteModal from '../../components/ConfirmDeleteModal';

export default function ManageBookings() {
  const { token, user } = useAuthStore();
  const [bookings, setBookings] = useState<any[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState<string | null>(null);

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

  const confirmDeleteBooking = (id: string) => {
    setBookingToDelete(id);
    setDeleteModalOpen(true);
  };

  const executeDeleteBooking = async () => {
    if (!bookingToDelete) return;
    try {
      const res = await fetch(`/api/bookings/${bookingToDelete}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchBookings();
    } catch (error) {
      console.error('Error deleting booking', error);
    } finally {
      setDeleteModalOpen(false);
      setBookingToDelete(null);
    }
  };

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
      case 'pending': return 'bg-sun text-sunset-dark';
      case 'confirmed': return 'bg-sky text-ocean';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBorder = (status: string) => {
    switch (status) {
      case 'pending': return 'border-t-sun';
      case 'confirmed': return 'border-t-sky';
      case 'completed': return 'border-t-green-400';
      case 'cancelled': return 'border-t-red-400';
      default: return 'border-t-gray-200';
    }
  };

  const formatWhatsAppLink = (phone: string) => {
    const formatted = phone.replace(/[^\d+]/g, '');
    return `https://wa.me/${formatted.replace('+', '')}`;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-ocean">Manage Bookings</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {bookings.map((booking) => (
          <Card key={booking.id} className={`rounded-3xl shadow-sm hover:shadow-lg transition-all border-0 overflow-hidden relative border-t-8 ${getStatusBorder(booking.status)} flex flex-col`}>
            {/* Status Badge */}
            <div className="absolute top-4 right-4">
              <span className={`px-3 py-1 rounded-full text-xs font-bold inline-block shadow-sm ${getStatusColor(booking.status)}`}>
                {booking.status.toUpperCase()}
              </span>
            </div>

            <CardHeader className="pb-3 pt-6 pr-24">
              <CardTitle className="text-xl font-bold text-ocean">
                <div className="truncate" title={booking.fullName}>{booking.fullName}</div>
                <div className="text-xs text-gray-400 font-normal mt-1">
                   ID: {booking.id.substring(0, 8)}...
                </div>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-5 flex-grow">
              
              {/* WhatsApp Button */}
              <a 
                href={formatWhatsAppLink(booking.phone)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 rounded-xl p-3 transition-colors group"
                title="Chat on WhatsApp"
              >
                <div className="bg-green-500 rounded-full p-1.5 group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-sm tracking-wide">{booking.phone}</span>
              </a>

              {/* Booking Details */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-4 border border-gray-100">
                <div className="flex items-start text-sm text-gray-700">
                  <MapPin className="w-4 h-4 text-ocean/60 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="font-medium line-clamp-2">{booking.activity?.title || 'Unknown Activity'}</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-700">
                  <Calendar className="w-4 h-4 text-ocean/60 mr-3 flex-shrink-0" />
                  <span className="font-medium">
                    {booking.isMultiDay 
                      ? `${booking.startDate} to ${booking.endDate}`
                      : `${booking.startDate || booking.date}`
                    }
                  </span>
                </div>

                {!booking.isMultiDay && booking.time && (
                  <div className="flex items-center text-sm text-gray-700">
                    <Clock className="w-4 h-4 text-ocean/60 mr-3 flex-shrink-0" />
                    <span className="font-medium">{booking.time}</span>
                  </div>
                )}

                <div className="flex items-center text-sm text-gray-700">
                  <Users className="w-4 h-4 text-ocean/60 mr-3 flex-shrink-0" />
                  <span className="font-medium">{booking.persons} {booking.persons > 1 ? 'Persons' : 'Person'}</span>
                </div>
              </div>
            </CardContent>

            <div className="mt-auto border-t border-gray-100 p-4 bg-gray-50/50 flex flex-wrap gap-2 justify-end">
              {booking.status === 'pending' && (
                <Button size="sm" onClick={() => updateStatus(booking.id, 'confirmed')} className="bg-ocean hover:bg-ocean-dark text-white rounded-xl flex-1">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Confirm
                </Button>
              )}
              {booking.status === 'confirmed' && (
                <Button size="sm" onClick={() => updateStatus(booking.id, 'completed')} className="bg-green-600 hover:bg-green-700 text-white rounded-xl flex-1">
                  Complete
                </Button>
              )}
              {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                <Button size="sm" variant="outline" onClick={() => updateStatus(booking.id, 'cancelled')} className="text-red-600 border-red-200 hover:bg-red-50 rounded-xl flex-none">
                  <XCircle className="w-4 h-4 mr-1" />
                  Cancel
                </Button>
              )}
              {user?.role === 'ADMIN' && (
                <Button size="sm" variant="outline" onClick={() => confirmDeleteBooking(booking.id)} className="text-gray-400 border-gray-200 hover:text-red-600 hover:bg-red-50 rounded-xl flex-none">
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
      
      {bookings.length === 0 && (
         <div className="text-center py-16 bg-white rounded-3xl shadow-sm border border-dashed border-gray-200 mt-4">
           <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
           <p className="text-gray-500 text-lg">No bookings available.</p>
         </div>
      )}

      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={executeDeleteBooking}
        title="Delete Booking"
        message="Are you sure you want to delete this booking? This action cannot be reversed."
      />
    </div>
  );
}
