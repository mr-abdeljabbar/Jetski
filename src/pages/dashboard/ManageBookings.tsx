import { useEffect, useState } from 'react';
import { useAuthStore } from '../../store';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Clock, Trash2, Calendar, Users, MessageCircle, MapPin, CheckCircle, XCircle, Download, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import ConfirmDeleteModal from '../../components/ConfirmDeleteModal';
import { toast } from 'sonner';

export default function ManageBookings() {
  const { user } = useAuthStore();
  const [bookings, setBookings] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 1 });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchBookings = (page = 1) => {
    setLoading(true);
    fetch(`/api/bookings?page=${page}&limit=12`, {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        setBookings(Array.isArray(data.data) ? data.data : []);
        setPagination(data.pagination || { page: 1, total: 0, pages: 1 });
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const confirmDeleteBooking = (id: string) => {
    setBookingToDelete(id);
    setDeleteModalOpen(true);
  };

  const executeDeleteBooking = async () => {
    if (!bookingToDelete) return;
    try {
      const res = await fetch(`/api/bookings/${bookingToDelete}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (res.ok) {
        toast.success('Booking deleted');
        fetchBookings(pagination.page);
      }
    } catch (error) {
      toast.error('Error deleting booking');
    } finally {
      setDeleteModalOpen(false);
      setBookingToDelete(null);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/bookings/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        toast.success(`Booking ${status}`);
        fetchBookings(pagination.page);
      }
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const exportCSV = () => {
    window.open('/api/bookings/export/csv', '_blank');
  };

  const downloadInvoice = (id: string) => {
    window.open(`/api/bookings/${id}/invoice`, '_blank');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-sun/20 text-sunset-dark';
      case 'confirmed': return 'bg-sky/20 text-ocean';
      case 'completed': return 'bg-green-50 text-green-700';
      case 'cancelled': return 'bg-red-50 text-red-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  const getStatusBorder = (status: string) => {
    switch (status) {
      case 'pending': return 'border-t-sun';
      case 'confirmed': return 'border-t-sky';
      case 'completed': return 'border-t-green-400';
      case 'cancelled': return 'border-t-red-400';
      default: return 'border-t-gray-100';
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div className="text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold text-ocean tracking-tight">Bookings</h1>
          <p className="text-ocean/40 text-xs md:text-sm mt-1 uppercase tracking-widest font-bold">Manage customer reservations</p>
        </div>
        <div className="flex gap-4">
          <Button 
            onClick={exportCSV}
            variant="outline"
            className="rounded-full border-ocean/10 text-ocean hover:bg-ocean hover:text-white px-6"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-80 bg-white rounded-[2rem] animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
            {bookings.map((booking) => (
              <Card key={booking.id} className={`rounded-[2rem] shadow-soft hover:shadow-heavy transition-all border-0 overflow-hidden relative border-t-8 ${getStatusBorder(booking.status)} flex flex-col group bg-white`}>
                <div className="absolute top-6 right-6">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>

                <CardHeader className="pb-4 pt-8 px-6 sm:px-8">
                  <CardTitle className="text-xl md:text-2xl font-bold text-ocean">
                    <div className="truncate pr-20">{booking.fullName}</div>
                    <div className="text-[9px] md:text-[10px] text-ocean/30 font-bold uppercase tracking-widest mt-2">
                       #{booking.id.substring(0, 8)}
                    </div>
                  </CardTitle>
                </CardHeader>

                <CardContent className="px-6 sm:px-8 pb-4 space-y-6 flex-grow">
                  <div className="flex flex-col gap-3">
                    <a 
                      href={`https://wa.me/${booking.phone.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center sm:justify-start gap-3 bg-[#25D366]/10 text-[#075E54] hover:bg-[#25D366]/20 py-3 px-5 rounded-2xl transition-colors font-bold text-xs"
                    >
                      <MessageCircle className="w-4 h-4 shrink-0" />
                      <span className="truncate">{booking.phone}</span>
                    </a>
                  </div>

                  <div className="bg-paper/50 rounded-2xl p-5 space-y-4 border border-ocean/5 group-hover:bg-white group-hover:border-ocean/10 transition-colors">
                    <div className="flex items-start text-sm truncate">
                      <MapPin className="w-4 h-4 text-coral mt-0.5 mr-3 shrink-0" />
                      <span className="font-bold text-ocean">{booking.activity?.title}</span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <Calendar className="w-4 h-4 text-coral mr-3 shrink-0" />
                      <span className="font-medium text-ocean/70">
                        {formatDate(booking.startDate)}
                        {booking.isMultiDay && ` → ${formatDate(booking.endDate)}`}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-ocean/5">
                      <div className="flex items-center text-sm text-ocean/70">
                        <Users className="w-4 h-4 text-coral mr-3 shrink-0" />
                        {booking.persons} {booking.persons === 1 ? 'Guest' : 'Guests'}
                      </div>
                      {booking.time && (
                        <div className="flex items-center text-sm text-ocean/70">
                          <Clock className="w-4 h-4 text-coral mr-3 shrink-0" />
                          {booking.time}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>

                <div className="mt-auto border-t border-ocean/5 p-6 bg-paper/30 flex flex-wrap gap-2">
                  {booking.status === 'pending' && (
                    <Button 
                      size="sm" 
                      onClick={() => updateStatus(booking.id, 'confirmed')} 
                      className="bg-ocean text-white hover:bg-ocean-dark rounded-xl flex-1 py-5 font-bold uppercase text-[10px] tracking-widest"
                    >
                      Confirm
                    </Button>
                  )}
                  {booking.status === 'confirmed' && (
                    <Button 
                      size="sm" 
                      onClick={() => updateStatus(booking.id, 'completed')} 
                      className="bg-green-600 text-white hover:bg-green-700 rounded-xl flex-1 py-5 font-bold uppercase text-[10px] tracking-widest"
                    >
                      Complete
                    </Button>
                  )}
                  
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => downloadInvoice(booking.id)}
                    className="border-ocean/10 text-ocean hover:bg-ocean/5 rounded-xl px-4"
                    title="Download Invoice"
                  >
                    <FileText className="w-4 h-4" />
                  </Button>

                  {booking.status !== 'cancelled' && (
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => updateStatus(booking.id, 'cancelled')} 
                      className="text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl px-4"
                    >
                      <XCircle className="w-4 h-4" />
                    </Button>
                  )}
                  
                  {user?.role === 'ADMIN' && (
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => confirmDeleteBooking(booking.id)} 
                      className="text-ocean/20 hover:text-red-600 rounded-xl px-4 ml-auto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-16">
              <Button
                variant="outline"
                disabled={pagination.page === 1}
                onClick={() => fetchBookings(pagination.page - 1)}
                className="rounded-full w-12 h-12 p-0"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <span className="text-sm font-bold text-ocean">
                Page {pagination.page} of {pagination.pages}
              </span>
              <Button
                variant="outline"
                disabled={pagination.page === pagination.pages}
                onClick={() => fetchBookings(pagination.page + 1)}
                className="rounded-full w-12 h-12 p-0"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          )}
        </>
      )}
      
      {!loading && bookings.length === 0 && (
         <div className="text-center py-32 bg-white rounded-[3rem] shadow-soft border border-dashed border-ocean/10 mt-4">
           <Calendar className="w-20 h-20 text-ocean/10 mx-auto mb-8" />
           <p className="text-ocean/40 font-bold uppercase tracking-widest text-sm">No bookings found</p>
         </div>
      )}

      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={executeDeleteBooking}
        title="Delete Booking"
        message="This will permanently remove the booking record. Continue?"
      />
    </div>
  );
}
