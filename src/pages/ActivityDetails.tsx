import { useParams, Link } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { 
  MapPin, Users, Shield, Package,
  Clock, Phone, ArrowLeft, CheckCircle2, ChevronRight, 
  ChevronLeft, Maximize2, X as CloseIcon, AlertCircle,
  Star, Heart, Share2, Info, Check, MessageSquare
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { 
  format, addMonths, subMonths, startOfMonth, 
  endOfMonth, startOfWeek, endOfWeek, isSameMonth, 
  isSameDay, eachDayOfInterval, isBefore, 
  startOfToday 
} from 'date-fns';

interface BookingFormValues {
  isMultiDay: boolean;
  persons: number;
  startDate: string;
  endDate: string;
  time: string;
  fullName: string;
  phone: string;
}

export default function ActivityDetails() {
  const { id } = useParams();
  const { t } = useTranslation();
  const [activity, setActivity] = useState<any>(null);
  const [allActivities, setAllActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<any>(null);
  const { register, handleSubmit, reset, watch, setValue, formState: { isSubmitting } } = useForm<BookingFormValues>({
    defaultValues: {
      isMultiDay: false,
      persons: 1,
      startDate: format(new Date(), 'yyyy-MM-dd'),
      endDate: '',
      time: '10:00',
      fullName: '',
      phone: ''
    }
  });
  
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);
  const isMultiDay = watch('isMultiDay');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch current activity
        const activityRes = await fetch(`/api/activities/${id}`);
        if (!activityRes.ok) {
          if (activityRes.status === 404) throw new Error('Activity not found');
          throw new Error('Failed to load activity details');
        }
        const activityData = await activityRes.json();
        setActivity(activityData);
        if (activityData.durations?.length > 0) {
          setSelectedDuration(activityData.durations[0]);
        }

        // Fetch all activities for navigation
        const allRes = await fetch('/api/activities');
        if (allRes.ok) {
          const allData = await allRes.json();
          setAllActivities(allData);
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'An unexpected error occurred');
        toast.error(err.message || 'Could not load activity details');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const { prevId, nextId } = useMemo(() => {
    if (allActivities.length <= 1) return { prevId: null, nextId: null };
    const currentIndex = allActivities.findIndex(a => a.id === id);
    if (currentIndex === -1) return { prevId: null, nextId: null };
    
    const prevIndex = (currentIndex - 1 + allActivities.length) % allActivities.length;
    const nextIndex = (currentIndex + 1) % allActivities.length;
    
    return {
      prevId: allActivities[prevIndex].id,
      nextId: allActivities[nextIndex].id
    };
  }, [allActivities, id]);

  const nextImage = () => {
    if (!activity?.images) return;
    setActiveImage((prev) => (prev + 1) % activity.images.length);
  };

  const prevImage = () => {
    if (!activity?.images) return;
    setActiveImage((prev) => (prev - 1 + activity.images.length) % activity.images.length);
  };

  const onSubmit = async (data: any) => {
    const bookingData = {
      ...data,
      activityId: id,
      persons: parseInt(data.persons),
      durationId: selectedDuration?.id,
      isMultiDay: data.isMultiDay || false,
      startDate: data.startDate,
      endDate: data.isMultiDay ? data.endDate : null,
    };

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });
      if (res.ok) {
        setBookingSuccess(true);
        toast.success('Booking request sent successfully!');
        reset();
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to submit booking');
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Something went wrong. Please try again.');
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-paper">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-16 h-16 border-4 border-coral border-t-transparent rounded-full mb-8"
      />
      <p className="text-ocean/40 font-bold uppercase tracking-widest text-[10px]">Loading Experience...</p>
    </div>
  );

  if (error || !activity) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-paper px-6">
      <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-8">
        <AlertCircle className="w-10 h-10" />
      </div>
      <h2 className="text-3xl font-bold text-ocean mb-4">Oops! Something went wrong</h2>
      <p className="text-ocean/60 text-center max-w-md mb-10 leading-relaxed">
        {error || "We couldn't find the activity you're looking for."}
      </p>
      <Link to="/activities">
        <Button className="bg-ocean text-white hover:bg-ocean-dark rounded-full px-12 py-6 text-xs font-bold uppercase tracking-widest shadow-soft">
          Back to Activities
        </Button>
      </Link>
    </div>
  );

  const waMessage = `Hello, I want to book ${activity.title}.`;
  // Using a cleaner Morocco WhatsApp format
  const waUrl = `https://wa.me/212600000000?text=${encodeURIComponent(waMessage)}`;

  return (
    <div className="bg-paper min-h-screen pb-32 selection:bg-coral/20">
      {/* Lightbox */}
      <AnimatePresence>
        {showLightbox && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-ocean/95 backdrop-blur-xl flex items-center justify-center p-6 md:p-12"
          >
            <button 
              onClick={() => setShowLightbox(false)}
              className="absolute top-8 right-8 w-14 h-14 glass rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all z-[110]"
            >
              <CloseIcon className="w-6 h-6" />
            </button>

            <div className="relative w-full max-w-6xl aspect-video md:aspect-auto md:h-[80vh] rounded-[3rem] overflow-hidden shadow-heavy group">
              <AnimatePresence mode="wait">
                <motion.img 
                  key={activeImage}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  src={activity.images[activeImage]?.imageUrl} 
                  alt={activity.title} 
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </AnimatePresence>

              {activity.images?.length > 1 && (
                <>
                  <button 
                    onClick={(e) => { e.stopPropagation(); prevImage(); }}
                    className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 glass rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); nextImage(); }}
                    className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 glass rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails in Lightbox */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-4 overflow-x-auto max-w-full px-6 pb-4 no-scrollbar">
              {activity.images.map((img: any, index: number) => (
                <button 
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`w-16 h-16 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${activeImage === index ? 'border-coral scale-110 shadow-lg' : 'border-white/20 opacity-50 hover:opacity-100'}`}
                >
                  <img src={img.imageUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative h-[70vh] md:h-[85vh] overflow-hidden bg-ocean">
        {/* Background Image Layer */}
        <div className="absolute inset-0 z-0">
          <img 
            src={activity.backgroundImageUrl || activity.images[0]?.imageUrl || 'https://images.unsplash.com/photo-1520255870062-bd79d3865de7?auto=format&fit=crop&q=80&w=1000'} 
            alt={activity.title} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        
        {/* Overlays */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-ocean via-ocean/40 to-transparent z-20"></div>
        <div className="absolute inset-0 bg-ocean/20 z-20"></div>
        
        {/* Top Navigation */}
        <div className="absolute top-10 inset-x-0 px-6 md:px-12 lg:px-20 flex justify-between items-center z-50">
          <Link to="/activities">
            <button className="glass flex items-center px-6 py-4 rounded-full text-white text-xs font-bold uppercase tracking-widest hover:bg-white/20 transition-all shadow-lg backdrop-blur-md">
              <ArrowLeft className="w-4 h-4 mr-2.5" /> {t('back')}
            </button>
          </Link>
          <div className="flex gap-4">
            <button className="glass w-12 h-12 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all shadow-lg">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="glass w-12 h-12 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all shadow-lg">
              <Heart className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Hero Content */}
        <div className="absolute bottom-24 inset-x-0 px-6 md:px-12 lg:px-20 z-20">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-4 mb-8">
                <span className="bg-coral text-white px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] shadow-lg">
                  {activity.category}
                </span>
                <div className="flex items-center text-white/90 glass px-4 py-2 rounded-full border border-white/10">
                  <Star className="w-3.5 h-3.5 mr-2 text-sun fill-sun" />
                  <span className="text-[10px] font-bold uppercase tracking-widest leading-none">{activity.rating || '5.0'} Experience</span>
                </div>
              </div>
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-white mb-10 tracking-tight leading-[0.9] drop-shadow-2xl">
                {activity.title}
              </h1>
            </motion.div>
          </div>
        </div>
        
        {/* Navigation Arrows (Between Activities) */}
        {nextId && (
          <div className="absolute bottom-24 right-20 hidden lg:flex gap-4 z-30">
            <Link to={`/activities/${prevId}`}>
              <button className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-ocean transition-all">
                <ChevronLeft className="w-6 h-6" />
              </button>
            </Link>
            <Link to={`/activities/${nextId}`}>
              <button className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-ocean transition-all">
                <ChevronRight className="w-6 h-6" />
              </button>
            </Link>
          </div>
        )}
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 relative z-50">
        
        {/* Horizontal Booking Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/95 backdrop-blur-2xl border border-ocean/10 shadow-heavy rounded-[2.5rem] p-4 lg:p-6 sticky top-6 z-[60] -mt-24 lg:-mt-28 mb-16"
        >
          <AnimatePresence mode="wait">
            {bookingSuccess ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col md:flex-row items-center justify-between gap-6 py-4 px-6"
              >
                <div className="flex items-center">
                  <div className="w-14 h-14 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center mr-6">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-ocean">Booking Received!</h4>
                    <p className="text-ocean/60 text-sm">We'll confirm via WhatsApp shortly.</p>
                  </div>
                </div>
                <a 
                  href={waUrl}
                  target="_blank"
                  className="bg-green-500 text-white px-10 py-5 rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-green-600 transition-all shadow-lg flex items-center"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Confirm on WhatsApp
                </a>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col lg:flex-row items-stretch lg:items-center gap-6 lg:gap-10">
                {/* Plan Selection */}
                <div className="flex-1 min-w-[200px]">
                  <label htmlFor="plan-select" className="block text-[9px] font-bold uppercase tracking-[0.2em] text-ocean/40 mb-3 ml-2">Choose Plan</label>
                  <select 
                    id="plan-select"
                    name="plan"
                    onChange={(e) => setSelectedDuration(activity.durations.find((d: any) => d.id === e.target.value))}
                    className="w-full bg-paper border-0 rounded-2xl py-4 px-6 text-sm font-bold text-ocean focus:ring-2 focus:ring-coral/20 appearance-none cursor-pointer"
                  >
                    {activity.durations?.map((d: any) => (
                      <option key={d.id} value={d.id}>
                        {d.durationLabel} - €{d.price}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date Selection */}
                <div className="flex-1 min-w-[180px] relative">
                  <label htmlFor="booking-date" className="block text-[9px] font-bold uppercase tracking-[0.2em] text-ocean/40 mb-3 ml-2">Select Date</label>
                  <div className="relative group">
                    <CheckCircle2 className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-ocean/20 group-hover:text-coral transition-colors" />
                    <Input 
                      id="booking-date"
                      type="date"
                      {...register('startDate', { required: true })}
                      className="pl-14 bg-paper border-0 rounded-2xl py-4 font-bold text-sm focus:ring-2 focus:ring-coral/20"
                    />
                  </div>
                </div>

                {/* Persons & Time */}
                <div className="flex items-center gap-4">
                  <div className="w-20">
                    <label htmlFor="booking-persons" className="block text-[9px] font-bold uppercase tracking-[0.2em] text-ocean/40 mb-3 ml-2">People</label>
                    <Input 
                      id="booking-persons"
                      type="number" 
                      min="1" 
                      {...register('persons', { required: true })}
                      className="bg-paper border-0 rounded-2xl py-4 text-center font-bold text-sm"
                    />
                  </div>
                  <div className="w-28">
                    <label htmlFor="booking-time" className="block text-[9px] font-bold uppercase tracking-[0.2em] text-ocean/40 mb-3 ml-2">Time</label>
                    <Input 
                      id="booking-time"
                      type="time"
                      {...register('time', { required: true })}
                      className="bg-paper border-0 rounded-2xl py-4 text-center font-bold text-sm"
                    />
                  </div>
                </div>

                {/* Contact Info (Name & Phone) */}
                <div className="flex flex-col md:flex-row items-center gap-4 flex-1">
                  <div className="w-full">
                    <label htmlFor="booking-name" className="block text-[9px] font-bold uppercase tracking-[0.2em] text-ocean/40 mb-3 ml-2">Your Name</label>
                    <Input 
                      id="booking-name"
                      placeholder="Name"
                      autoComplete="name"
                      {...register('fullName', { required: true })}
                      className="bg-paper border-0 rounded-2xl py-4 font-bold text-sm"
                    />
                  </div>
                  <div className="w-full">
                    <label htmlFor="booking-phone" className="block text-[9px] font-bold uppercase tracking-[0.2em] text-ocean/40 mb-3 ml-2">WhatsApp</label>
                    <Input 
                      id="booking-phone"
                      placeholder="+212 ..."
                      autoComplete="tel"
                      {...register('phone', { required: true })}
                      className="bg-paper border-0 rounded-2xl py-4 font-bold text-sm"
                    />
                  </div>
                </div>

                {/* Summary & Action */}
                <div className="flex items-center gap-6 lg:pl-10 lg:border-l border-ocean/5">
                  <div className="text-right whitespace-nowrap">
                    <span className="block text-[9px] font-bold uppercase tracking-[0.2em] text-ocean/40 mb-1">Total</span>
                    <span className="text-2xl font-black text-ocean">
                      €{(selectedDuration?.price || 0) * (watch('persons') || 1)}
                    </span>
                  </div>
                  <Button 
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-ocean text-white hover:bg-ocean/90 rounded-2xl px-8 py-5 text-xs font-bold uppercase tracking-widest transition-all shadow-heavy flex items-center group"
                  >
                    {isSubmitting ? '...' : 'Reserve'}
                    <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </form>
            )}
          </AnimatePresence>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-16">
            {/* Experience Main Image */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white overflow-hidden rounded-[3.5rem] shadow-heavy border border-ocean/5 group relative h-[500px]"
            >
              <img 
                src={activity.images[0]?.imageUrl || activity.backgroundImageUrl || 'https://images.unsplash.com/photo-1520255870062-bd79d3865de7?auto=format&fit=crop&q=80&w=1000'}
                alt={activity.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ocean/60 via-transparent to-transparent"></div>
            </motion.div>

            {/* Visual Gallery */}
            <div className="space-y-10">
              <div className="flex items-end justify-between px-4">
                <div>
                  <h2 className="text-4xl font-bold text-ocean mb-3">Capturing Moments</h2>
                  <p className="text-ocean/40 text-sm font-bold uppercase tracking-widest">Visual glimpses of the adventure</p>
                </div>
                <button 
                  onClick={() => setShowLightbox(true)}
                  className="w-14 h-14 bg-white shadow-soft rounded-2xl flex items-center justify-center hover:bg-ocean hover:text-white transition-all"
                >
                  <Maximize2 className="w-6 h-6" />
                </button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {activity.images.map((img: any, i: number) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -8 }}
                    onClick={() => { setActiveImage(i); setShowLightbox(true); }}
                    className={`aspect-square rounded-[2.5rem] overflow-hidden cursor-pointer shadow-soft border-4 transition-all ${activeImage === i ? 'border-coral scale-105 z-10' : 'border-white hover:border-ocean/10'}`}
                  >
                    <img src={img.imageUrl} alt="" className="w-full h-full object-cover" />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Area: Inclusions & Support */}
          <div className="space-y-10">
            {/* Essential Info Card */}
            <div className="bg-white p-10 rounded-[3.5rem] shadow-heavy border border-ocean/5 space-y-12">
              <div className="space-y-8">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-xl bg-coral/10 flex items-center justify-center mr-4">
                    <Shield className="w-5 h-5 text-coral" />
                  </div>
                  <h3 className="text-xl font-bold text-ocean">Safety</h3>
                </div>
                <ul className="space-y-4">
                  {activity.safetyInfo && activity.safetyInfo.split('\n').map((item: string, i: number) => (
                    <li key={i} className="flex items-start text-ocean/60 text-sm">
                      <Check className="w-4 h-4 mr-3 text-coral shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-8 pt-8 border-t border-ocean/5">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-xl bg-sun/10 flex items-center justify-center mr-4">
                    <Package className="w-5 h-5 text-sun" />
                  </div>
                  <h3 className="text-xl font-bold text-ocean">Included</h3>
                </div>
                <ul className="space-y-4">
                  {activity.equipmentIncluded && activity.equipmentIncluded.split('\n').map((item: string, i: number) => (
                    <li key={i} className="flex items-start text-ocean/60 text-sm">
                      <CheckCircle2 className="w-4 h-4 mr-3 text-sun shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Quick Contact Card */}
            <div className="bg-ocean rounded-[3rem] p-10 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-[5rem] translate-x-10 -translate-y-10"></div>
              <h5 className="text-2xl font-bold mb-4 relative z-10">Questions?</h5>
              <p className="text-white/60 text-sm mb-8 relative z-10 leading-relaxed">Our team is ready to assist you via WhatsApp anytime.</p>
              <a 
                href={waUrl} 
                target="_blank" 
                className="flex items-center justify-center w-full bg-white text-ocean py-6 rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-paper transition-all shadow-heavy"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Chat with Assistant
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Floating WhatsApp Action (Mobile Only) */}
      <div className="fixed bottom-8 right-8 z-[60] lg:hidden">
        <a 
          href={waUrl}
          target="_blank"
          className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center shadow-heavy hover:scale-110 active:scale-95 transition-all"
        >
          <MessageSquare className="w-6 h-6" />
        </a>
      </div>
    </div>
  );
}

