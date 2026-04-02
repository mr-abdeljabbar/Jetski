import { useAuthStore } from '../../store';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Users, Calendar, Activity, Star, TrendingUp, HandMetal, ChevronLeft, ChevronRight, Clock, MapPin, X, MessageCircle, CheckSquare, Square, Trash2, Edit3, Plus, Save, CheckCircle2 } from 'lucide-react';
import React, { useEffect, useState, useMemo } from 'react';
import { format, addDays, subDays, isSameDay } from 'date-fns';
import { toast } from 'sonner';

const BookingPill: React.FC<{ booking: any; userRole?: string; onClick: (b: any) => void; onComplete: (e: any, b: any) => void }> = ({ booking, userRole, onClick, onComplete }) => {
  const getColors = () => {
    switch (booking.status) {
      case 'confirmed': return 'bg-sky/20 border-ocean text-ocean';
      case 'pending': return 'bg-sun/20 border-sun text-sunset-dark';
      case 'completed': return 'bg-green-100 border-green-600 text-green-800';
      case 'cancelled': return 'bg-red-100 border-red-500 text-red-800';
      default: return 'bg-gray-100 border-gray-400 text-gray-800';
    }
  };

  const isFinished = booking.status === 'completed';

  return (
    <div 
      onClick={() => onClick(booking)}
      className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-xs font-semibold border-l-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between cursor-pointer hover:scale-[1.02] transition-transform group/pill ${getColors()}`}
    >
      <div className="flex items-center space-x-2 truncate min-w-0">
        <span className="truncate">{booking.fullName}</span>
        {isFinished && <CheckCircle2 className="w-3 h-3 text-green-600 flex-shrink-0" />}
      </div>
      <div className="flex items-center space-x-2 mt-1 sm:mt-0">
        <span className="px-1 py-0.5 rounded bg-white/60 text-[8px] uppercase font-bold whitespace-nowrap hidden sm:inline-block">
          {booking.activity?.title ? booking.activity.title.substring(0, 10) + '...' : 'Jet Ski'}
        </span>
        {booking.status !== 'completed' && userRole === 'ASSISTANT' && (
          <button 
            onClick={(e) => onComplete(e, booking)}
            className="sm:opacity-0 group-hover/pill:opacity-100 p-0.5 bg-white/80 hover:bg-green-500 hover:text-white rounded-full transition-all text-green-600"
            title="Mark as Finished"
          >
            <CheckCircle2 className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
};

export default function DashboardHome() {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'ADMIN';

  const [stats, setStats] = useState({ bookings: 0, activities: 0, reviews: 0 });
  const [bookings, setBookings] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);

  // Todo & Notes state
  const [todos, setTodos] = useState<any[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [note, setNote] = useState<any>(null);
  const [noteContent, setNoteContent] = useState('');
  const [isEditingNote, setIsEditingNote] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchJSON = async (url: string, opts?: any) => {
          try {
            const res = await fetch(url, opts);
            if (!res.ok) return [];
            return await res.json();
          } catch (e) {
            console.error(`Failed to fetch ${url}`, e);
            return [];
          }
        };

        const [bData, aData, rData, tData, nData] = await Promise.all([
          fetchJSON('/api/bookings', { credentials: 'include' }),
          fetchJSON('/api/activities'),
          fetchJSON('/api/reviews'),
          fetchJSON('/api/todos', { credentials: 'include' }),
          fetchJSON('/api/notes', { credentials: 'include' })
        ]);
        
        setBookings(Array.isArray(bData) ? bData : []);
        setTodos(Array.isArray(tData) ? tData : []);
        
        const notes = Array.isArray(nData) ? nData : [];
        if (notes.length > 0) {
          setNote(notes[0]);
          setNoteContent(notes[0].content);
        }
        
        setStats({
          bookings: (Array.isArray(bData) ? bData.length : 0),
          activities: (Array.isArray(aData) ? aData.length : 0),
          reviews: (Array.isArray(rData) ? rData.length : 0),
        });
      } catch (error) {
        console.error('General error fetching data', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  const dailyBookings = useMemo(() => {
    return bookings.filter(b => {
      const dateStr = b.startDate || b.date;
      if (!dateStr) return false;
      let bDate;
      try {
        bDate = new Date(dateStr);
      } catch (e) {
        return false;
      }
      return isSameDay(bDate, selectedDate);
    });
  }, [bookings, selectedDate]);

  const getBookingsForSlot = (hour: number, isHalf: boolean) => {
    return dailyBookings.filter(b => {
      if (!b.time) return false;
      const [h, m] = b.time.split(':').map(Number);
      if (isNaN(h) || isNaN(m)) return false;
      if (h !== hour) return false;
      if (isHalf) return m >= 30;
      else return m < 30;
    });
  };

  const nextDay = () => setSelectedDate(prev => addDays(prev, 1));
  const prevDay = () => setSelectedDate(prev => subDays(prev, 1));
  const today = () => setSelectedDate(new Date());

  const hours = Array.from({ length: 15 }, (_, i) => i + 8); // 8 AM to 10 PM

  // Booking Actions
  const updateBookingStatus = async (id: string, status: string) => {
    if (user?.role !== 'ASSISTANT' && user?.role !== 'ADMIN') {
      toast.error('You do not have permission to mark tasks as finished');
      return;
    }
    try {
      const res = await fetch(`/api/bookings/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setBookings(bookings.map(b => b.id === id ? { ...b, status } : b));
        if (selectedBooking?.id === id) {
          setSelectedBooking({ ...selectedBooking, status });
        }
        toast.success(`Booking ${status}`);
      }
    } catch (e) {
      toast.error('Failed to update status');
    }
  };

  const onCompleteBooking = (e: React.MouseEvent, booking: any) => {
    e.stopPropagation();
    if (user?.role !== 'ASSISTANT' && user?.role !== 'ADMIN') return;
    updateBookingStatus(booking.id, 'completed');
  };

  // Todo Actions
  const addTodo = async () => {
    if (!newTodo.trim() || !isAdmin) return;
    try {
      const res = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ text: newTodo })
      });
      const data = await res.json();
      setTodos([...todos, data]);
      setNewTodo('');
      toast.success('Task added');
    } catch (e) {
      toast.error('Failed to add task');
    }
  };

  const toggleTodo = async (id: string, completed: boolean) => {
    if (user?.role !== 'ASSISTANT') {
      toast.error('Only Assistants can change task status');
      return;
    }
    try {
      await fetch(`/api/todos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ completed: !completed })
      });
      setTodos(todos.map(t => t.id === id ? { ...t, completed: !completed } : t));
    } catch (e) {
      toast.error('Failed to update task');
    }
  };

  const deleteTodo = async (id: string) => {
    if (!isAdmin) return;
    try {
      await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      setTodos(todos.filter(t => t.id !== id));
      toast.success('Task deleted');
    } catch (e) {
      toast.error('Failed to delete task');
    }
  };

  // Note Actions
  const saveNote = async () => {
    if (!isAdmin) return;
    try {
      if (note) {
        await fetch(`/api/notes/${note.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ content: noteContent })
        });
      } else {
        const res = await fetch('/api/notes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ content: noteContent })
        });
        const data = await res.json();
        setNote(data);
      }
      setIsEditingNote(false);
      toast.success('Note saved');
    } catch (e) {
      toast.error('Failed to save note');
    }
  };

  const formatWhatsAppLink = (phone: string) => {
    const formatted = phone.replace(/[^\d+]/g, '');
    return `https://wa.me/${formatted.replace('+', '')}`;
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div className="flex items-center space-x-4 mb-8 pt-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-ocean to-sky flex items-center justify-center text-white shadow-lg shadow-sky/20">
          <HandMetal className="w-7 h-7" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Welcome, {user?.email.split('@')[0]}!</h1>
          <p className="text-gray-500 font-medium text-sm mt-0.5">{user?.role} Dashboard Overview</p>
        </div>
      </div>

      {/* RESTORED STATS BAR */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {/* Total Bookings Card */}
        <Card className="rounded-3xl shadow-sm hover:shadow-md transition-shadow border-0 overflow-hidden relative group bg-white">
          <div className="absolute top-0 right-0 w-24 h-24 bg-sky/5 rounded-bl-full -z-10 transition-transform group-hover:scale-110" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Bookings</CardTitle>
            <div className="w-8 h-8 rounded-xl bg-ocean/10 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-ocean" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-gray-900 mb-1">{stats.bookings}</div>
            <div className="text-[10px] text-green-600 flex items-center font-bold uppercase tracking-wider">
              <TrendingUp className="w-3 h-3 mr-1" /> All-time record
            </div>
          </CardContent>
        </Card>
        
        {/* Active Activities Card */}
        <Card className="rounded-3xl shadow-sm hover:shadow-md transition-shadow border-0 overflow-hidden relative group bg-white">
          <div className="absolute top-0 right-0 w-24 h-24 bg-sun/5 rounded-bl-full -z-10 transition-transform group-hover:scale-110" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Activities</CardTitle>
            <div className="w-8 h-8 rounded-xl bg-sun/10 flex items-center justify-center">
              <Activity className="w-4 h-4 text-sun" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-gray-900 mb-1">{stats.activities}</div>
            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Currently bookable</div>
          </CardContent>
        </Card>

        {/* Total Reviews Card */}
        <Card className="rounded-3xl shadow-sm hover:shadow-md transition-shadow border-0 overflow-hidden relative group bg-white">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-bl-full -z-10 transition-transform group-hover:scale-110" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Client Feedback</CardTitle>
            <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center">
              <Star className="w-4 h-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-gray-900 mb-1">{stats.reviews}</div>
            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Happy customers</div>
          </CardContent>
        </Card>

        {/* System Status Card */}
        <Card className="rounded-3xl shadow-sm hover:shadow-md transition-shadow border-0 overflow-hidden relative group bg-gradient-to-br from-ocean to-sky text-white">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-bl-full -z-0 transition-transform group-hover:scale-110" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
            <CardTitle className="text-[10px] font-black text-sky-100 uppercase tracking-widest">Cloud Status</CardTitle>
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
              <Activity className="w-4 h-4 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-black mb-1">Operational</div>
            <div className="text-[10px] text-sky-100 font-bold uppercase tracking-wider flex items-center">
              <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse mr-2" />
              Service is live
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Grid: Calendar | To-Do & Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-20">
        
        {/* LEFT: CALENDAR SECTION */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between pb-2">
            <h2 className="text-xl font-black text-gray-900 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-sky" />
              Daily Planner
            </h2>
            <div className="flex items-center space-x-1 bg-white rounded-xl p-0.5 shadow-sm border border-gray-100">
              <button onClick={prevDay} className="p-1.5 hover:bg-gray-50 rounded-lg transition-colors text-gray-400">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={today} className="px-3 py-1 text-xs font-bold text-ocean hover:bg-sky/10 rounded-lg transition-colors min-w-[140px]">
                {format(selectedDate, 'EEE, MMM d, yyyy')}
              </button>
              <button onClick={nextDay} className="p-1.5 hover:bg-gray-50 rounded-lg transition-colors text-gray-400">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="border border-gray-200 rounded-[2rem] shadow-sm overflow-hidden bg-white ring-1 ring-black/5">
            {hours.map(hour => {
              const isEvenHour = hour % 2 === 0;
              const bgColor = isEvenHour ? 'bg-orange-50/40' : 'bg-white';
              const displayHour = hour > 12 ? hour - 12 : hour;
              const ampm = hour < 12 || hour === 24 ? 'am' : 'pm';

              const bookings00 = getBookingsForSlot(hour, false);
              const bookings30 = getBookingsForSlot(hour, true);

              return (
                <div key={hour} className={`flex w-full border-b border-gray-100 last:border-b-0 ${bgColor} transition-colors`}>
                   <div className="w-14 sm:w-16 flex-shrink-0 border-r border-gray-100 flex flex-col items-center justify-start pt-2">
                      <span className="text-xl font-black text-gray-800 leading-none">{displayHour}</span>
                      <span className="text-[8px] font-bold text-gray-400 uppercase mt-0.5">{ampm}</span>
                   </div>
                   <div className="flex-1 flex flex-col">
                     <div className="flex min-h-[5rem] border-b border-gray-50 group hover:bg-white/60 transition-colors">
                        <div className="w-8 sm:w-10 flex-shrink-0 border-r border-gray-50 flex items-start justify-center pt-2 text-[8px] font-bold text-gray-300">00</div>
                        <div className="flex-1 p-1 flex flex-col gap-1">
                           {bookings00.map(b => (
                             <BookingPill key={b.id} booking={b} userRole={user?.role} onClick={setSelectedBooking} onComplete={onCompleteBooking} />
                           ))}
                        </div>
                     </div>
                     <div className="flex min-h-[5rem] group hover:bg-white/60 transition-colors">
                        <div className="w-8 sm:w-10 flex-shrink-0 border-r border-gray-50 flex items-start justify-center pt-2 text-[8px] font-bold text-gray-300">30</div>
                        <div className="flex-1 p-1 flex flex-col gap-1">
                           {bookings30.map(b => (
                             <BookingPill key={b.id} booking={b} userRole={user?.role} onClick={setSelectedBooking} onComplete={onCompleteBooking} />
                           ))}
                        </div>
                     </div>
                   </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT: TODO & NOTES SECTION */}
        <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-4">
          
          {/* TO DO LIST */}
          <div className="bg-white rounded-[2rem] border border-gray-200 shadow-sm overflow-hidden ring-1 ring-black/5">
             <div className="bg-orange-100/50 px-6 py-3 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest flex items-center">
                   <CheckSquare className="w-4 h-4 mr-2 text-orange-500" />
                   TO DO LIST
                </h3>
                <span className="bg-white px-2 py-0.5 rounded-full text-[10px] font-black text-orange-500">{todos.filter(t => !t.completed).length} Pending</span>
             </div>
             
             <div className="p-6 space-y-4">
                {isAdmin && (
                  <div className="flex space-x-2">
                     <input 
                        type="text" 
                        value={newTodo}
                        onChange={(e) => setNewTodo(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addTodo()}
                        placeholder="Add a new task..."
                        className="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
                     />
                     <button 
                        onClick={addTodo}
                        className="p-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-all active:scale-95 flex items-center justify-center shadow-lg shadow-orange-500/20"
                     >
                        <Plus className="w-5 h-5" />
                     </button>
                  </div>
                )}

                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                   {todos.length === 0 ? (
                     <div className="text-center py-6 text-gray-400 text-xs italic">No current tasks.</div>
                   ) : (
                     todos.map(t => (
                       <div key={t.id} className="group flex items-center justify-between p-3 rounded-xl border border-gray-50 hover:bg-orange-50/30 transition-all hover:border-orange-100">
                          <div className="flex items-center space-x-3 flex-1 min-w-0">
                             {isAdmin ? (
                                <div className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase shadow-sm transition-all duration-500 ${t.completed ? 'bg-green-500 text-white shadow-green-500/20' : 'bg-gray-100 text-gray-500'}`}>
                                   {t.completed ? 'Finished' : 'Pending'}
                                </div>
                             ) : (
                                <button onClick={() => toggleTodo(t.id, t.completed)} className="flex-shrink-0">
                                   {t.completed ? (
                                     <CheckSquare className="w-5 h-5 text-orange-500" />
                                   ) : (
                                     <Square className="w-5 h-5 text-gray-300 hover:text-orange-300 transition-colors" />
                                   )}
                                </button>
                             )}
                             <span className={`text-sm truncate ${t.completed ? 'text-gray-400 line-through' : 'text-gray-700 font-medium'}`}>
                                {t.text}
                             </span>
                          </div>
                          {isAdmin && (
                            <button 
                               onClick={() => deleteTodo(t.id)}
                               className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-50 text-red-400 hover:text-red-500 rounded-lg transition-all ml-2"
                            >
                               <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                       </div>
                     ))
                   )}
                </div>
             </div>
          </div>

          {/* NOTES */}
          <div className="bg-white rounded-[2rem] border border-gray-200 shadow-sm overflow-hidden ring-1 ring-black/5">
             <div className="bg-orange-100/50 px-6 py-3 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest flex items-center">
                   <Edit3 className="w-4 h-4 mr-2 text-orange-500" />
                   TEAM NOTES
                </h3>
                {isAdmin && (
                  isEditingNote ? (
                    <button onClick={saveNote} className="p-1.5 bg-white shadow-sm rounded-lg text-green-500 hover:text-green-600 transition-colors">
                       <Save className="w-4 h-4" />
                    </button>
                  ) : (
                    <button onClick={() => setIsEditingNote(true)} className="p-1.5 bg-white shadow-sm rounded-lg text-orange-500 hover:text-orange-600 transition-colors">
                       <Edit3 className="w-4 h-4" />
                    </button>
                  )
                )}
             </div>
             
             <div className="p-6">
                {isEditingNote && isAdmin ? (
                  <textarea 
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    className="w-full h-48 bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all resize-none"
                    placeholder="Type instructions for the team..."
                  />
                ) : (
                  <div className="w-full min-h-48 bg-yellow-50/50 rounded-2xl p-4 border border-yellow-100/50 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {noteContent || "No current team notes."}
                  </div>
                )}
             </div>
          </div>

        </div>
      </div>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl border border-sky/10 overflow-hidden relative animate-in zoom-in-95 duration-200">
            <button onClick={() => setSelectedBooking(null)} className="absolute top-6 right-6 p-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-400 transition-colors z-10">
              <X className="w-5 h-5" />
            </button>
            <div className={`h-2 w-full ${selectedBooking.status === 'completed' ? 'bg-green-500' : 'bg-orange-500'}`} />
            <div className="p-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${selectedBooking.status === 'completed' ? 'bg-green-100 text-green-500' : 'bg-orange-100 text-orange-500'}`}>
                   {selectedBooking.status === 'completed' ? <CheckCircle2 className="w-6 h-6" /> : <Calendar className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900 leading-tight">Booking Details</h3>
                  <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mt-0.5">ID: {selectedBooking.id.substring(0, 8)}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-lg font-black text-gray-900">{selectedBooking.fullName}</h4>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      selectedBooking.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {selectedBooking.status}
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4 mr-3 text-orange-400" />
                      <span className="font-bold text-sm tracking-tight">{selectedBooking.time} on {selectedBooking.startDate}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-3 text-orange-400" />
                      <span className="font-bold text-sm tracking-tight">{selectedBooking.activity?.title || 'Activity'}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Users className="w-4 h-4 mr-3 text-orange-400" />
                      <span className="font-bold text-sm tracking-tight">{selectedBooking.persons} {selectedBooking.persons > 1 ? 'Persons' : 'Person'}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <a href={formatWhatsAppLink(selectedBooking.phone)} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center p-3 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-black transition-all shadow-md active:scale-95 text-xs uppercase tracking-wider">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    WhatsApp
                  </a>
                  {selectedBooking.status !== 'completed' && user?.role === 'ASSISTANT' && (
                    <button 
                      onClick={() => updateBookingStatus(selectedBooking.id, 'completed')}
                      className="flex items-center justify-center p-3 bg-ocean hover:bg-sky text-white rounded-2xl font-black transition-all shadow-md active:scale-95 text-xs uppercase tracking-wider"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Finish Task
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
