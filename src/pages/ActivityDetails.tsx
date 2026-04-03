import { useParams, Link } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { 
  MapPin, Users, Shield, Package, Calendar,
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
import SEOHead from '../components/SEOHead';

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
  const [suggestedActivities, setSuggestedActivities] = useState<any[]>([]);
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
  const [confirmedDates, setConfirmedDates] = useState<Record<string, string[]>>({});
  const [calendarMonth, setCalendarMonth] = useState(new Date());

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
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

  // Fetch confirmed booking dates for this activity (public endpoint)
  useEffect(() => {
    if (!id) return;
    fetch(`/api/activities/${id}/confirmed-dates`)
      .then(r => r.json())
      .then((data: Record<string, string[]>) => setConfirmedDates(data))
      .catch(() => {}); // silently fail — calendar still works without data
  }, [id]);

  // Fetch all activities to suggest another one
  useEffect(() => {
    fetch('/api/activities')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const others = data.filter(a => a.id !== id);
          if (others.length > 0) {
            // Shuffle and pick 2
            const shuffled = others.sort(() => 0.5 - Math.random());
            setSuggestedActivities(shuffled.slice(0, 2));
          }
        }
      })
      .catch(err => console.error('Error fetching suggested activities:', err));
  }, [id]);



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
      <p className="text-ocean/40 font-bold uppercase tracking-widest text-[10px]">{t('details_loading')}</p>
    </div>
  );

  if (error || !activity) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-paper px-6">
      <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-8">
        <AlertCircle className="w-10 h-10" />
      </div>
      <h2 className="text-3xl font-bold text-ocean mb-4">{t('details_error_title')}</h2>
      <p className="text-ocean/60 text-center max-w-md mb-10 leading-relaxed">
        {error || t('details_error_body')}
      </p>
      <Link to="/activities">
        <Button className="bg-ocean text-white hover:bg-ocean-dark rounded-full px-12 py-6 text-xs font-bold uppercase tracking-widest shadow-soft">
          {t('details_back')}
        </Button>
      </Link>
    </div>
  );

  const waMessage = `Hello, I want to book ${activity.title}.`;
  // Using a cleaner Morocco WhatsApp format
  const waUrl = `https://wa.me/212600000000?text=${encodeURIComponent(waMessage)}`;

  return (
    <>
      {activity && (
        <SEOHead 
          title={activity.title}
          description={activity.description.substring(0, 160)}
          image={activity.backgroundImageUrl || activity.images?.[0]?.imageUrl}
        />
      )}
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
      <section className="relative h-[60vh] md:h-[85vh] overflow-hidden bg-ocean">
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
              </div>
              <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-bold text-white mb-10 tracking-tight leading-[0.95] drop-shadow-2xl break-words max-w-full">
                {activity.title}
              </h1>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-20 relative z-50">
        
        {/* Horizontal Booking Bar (Static) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-paper border border-ocean/10 shadow-heavy rounded-[2.5rem] p-5 lg:p-8 mt-12 mb-20"
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
                    <h4 className="text-2xl font-bold text-ocean">{t('details_received')}</h4>
                    <p className="text-ocean/60 text-sm">{t('details_received_body')}</p>
                  </div>
                </div>
                <a 
                  href={waUrl}
                  target="_blank"
                  className="bg-green-500 text-white px-10 py-5 rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-green-600 transition-all shadow-lg flex items-center"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  {t('details_confirm_wa')}
                </a>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col lg:flex-row lg:items-end gap-4 lg:gap-3">

                {/* Plan */}
                <div className="flex-1 min-w-0">
                  <label htmlFor="plan-select" className="block text-[11px] font-bold uppercase tracking-wider text-ocean/40 mb-2 ml-1">{t('details_plan')}</label>
                  <select 
                    id="plan-select"
                    name="plan"
                    onChange={(e) => setSelectedDuration(activity.durations.find((d: any) => d.id === e.target.value))}
                    className="w-full bg-white border border-ocean/10 rounded-2xl min-h-[48px] py-3 px-4 text-sm font-semibold text-ocean focus:ring-2 focus:ring-coral/30 focus:outline-none appearance-none cursor-pointer"
                  >
                    {activity.durations?.map((d: any) => (
                      <option key={d.id} value={d.id}>
                        {d.durationLabel} – €{d.price}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date */}
                <div className="flex-1 min-w-0">
                  <label htmlFor="booking-date" className="block text-[11px] font-bold uppercase tracking-wider text-ocean/40 mb-2 ml-1"><Calendar className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />{t('modal_date')}</label>
                  <Input 
                    id="booking-date"
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    {...register('startDate', { required: true })}
                    className="bg-white border border-ocean/10 rounded-2xl min-h-[48px] py-3 px-3 text-sm font-semibold focus:ring-2 focus:ring-coral/30"
                  />
                </div>

                {/* People — narrow */}
                <div className="w-full lg:w-20 shrink-0">
                  <label htmlFor="booking-persons" className="block text-[11px] font-bold uppercase tracking-wider text-ocean/40 mb-2 ml-1"><Users className="w-3.5 h-3.5 inline mr-1 -mt-0.5" />{t('details_ppl')}</label>
                  <Input 
                    id="booking-persons"
                    type="number" 
                    min="1" 
                    {...register('persons', { required: true })}
                    className="bg-white border border-ocean/10 rounded-2xl min-h-[48px] py-3 px-2 text-sm font-semibold text-center"
                  />
                </div>

                {/* Time — narrow */}
                <div className="w-full lg:w-28 shrink-0">
                  <label htmlFor="booking-time" className="block text-[11px] font-bold uppercase tracking-wider text-ocean/40 mb-2 ml-1"><Clock className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />{t('modal_time')}</label>
                  <Input 
                    id="booking-time"
                    type="time"
                    {...register('time', { required: true })}
                    className="bg-white border border-ocean/10 rounded-2xl min-h-[48px] py-3 px-3 text-sm font-semibold"
                  />
                </div>

                {/* Name */}
                <div className="flex-1 min-w-0">
                  <label htmlFor="booking-name" className="block text-[11px] font-bold uppercase tracking-wider text-ocean/40 mb-2 ml-1">{t('details_name')}</label>
                  <Input 
                    id="booking-name"
                    placeholder={t('modal_full_name_placeholder')}
                    autoComplete="name"
                    {...register('fullName', { required: true })}
                    className="bg-white border border-ocean/10 rounded-2xl min-h-[48px] py-3 px-4 text-sm font-semibold"
                  />
                </div>

                {/* WhatsApp */}
                <div className="flex-1 min-w-0">
                  <label htmlFor="booking-phone" className="block text-[11px] font-bold uppercase tracking-wider text-ocean/40 mb-2 ml-1">WhatsApp</label>
                  <Input 
                    id="booking-phone"
                    placeholder="+212 ..."
                    autoComplete="tel"
                    {...register('phone', { required: true })}
                    className="bg-white border border-ocean/10 rounded-2xl min-h-[48px] py-3 px-4 text-sm font-semibold"
                  />
                </div>

                {/* Total + Reserve */}
                <div className="flex items-center gap-4 shrink-0 pt-1 lg:pt-0 lg:pl-3 lg:border-l border-ocean/10">
                  <div className="text-left lg:text-right">
                    <span className="block text-[9px] font-bold uppercase tracking-[0.2em] text-ocean/40 mb-0.5">{t('details_total')}</span>
                    <span className="text-xl font-black text-ocean">
                      €{(selectedDuration?.price || 0) * (watch('persons') || 1)}
                    </span>
                  </div>
                  <Button 
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-ocean text-white hover:bg-ocean/90 rounded-2xl px-6 py-3 text-[11px] font-bold uppercase tracking-widest transition-all shadow-heavy flex items-center group whitespace-nowrap"
                  >
                    {isSubmitting ? '...' : t('details_reserve')}
                    <ChevronRight className="ml-1.5 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>

              </form>
            )}
          </AnimatePresence>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-16">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-16">
            {/* Experience Main Image */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white overflow-hidden rounded-[2.5rem] md:rounded-[3.5rem] shadow-heavy border border-ocean/5 group relative aspect-[4/3] md:h-[500px]"
            >
              {/* Experience Main Image Container */}
              <div className="relative w-full h-full flex items-center justify-center bg-ocean/5 overflow-hidden">
                {/* Blurred Background Layer for Premium Visuals */}
                <div className="absolute inset-0 z-0">
                  <img 
                    src={activity.images[activeImage]?.imageUrl || activity.backgroundImageUrl || 'https://images.unsplash.com/photo-1520255870062-bd79d3865de7?auto=format&fit=crop&q=80&w=1000'}
                    alt="" 
                    className="w-full h-full object-cover blur-2xl opacity-40 scale-110"
                    referrerPolicy="no-referrer"
                  />
                </div>
                
                {/* Crisp Main Image Layer (Full Visibility) */}
                <img 
                  src={activity.images[activeImage]?.imageUrl || activity.backgroundImageUrl || 'https://images.unsplash.com/photo-1520255870062-bd79d3865de7?auto=format&fit=crop&q=80&w=1000'}
                  alt={activity.title}
                  className="relative z-10 max-w-full max-h-full object-contain transition-transform duration-700 hover:scale-[1.02]"
                  referrerPolicy="no-referrer"
                />
              </div>
              
              {/* Activity Navigation Arrows (Switching between Images) */}
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 lg:pl-6 z-30">
                <button 
                  onClick={(e) => { e.preventDefault(); prevImage(); }}
                  className="w-10 h-10 md:w-12 md:h-12 bg-white/90 rounded-2xl flex items-center justify-center text-ocean hover:bg-ocean hover:text-white transition-all shadow-heavy border border-ocean/5 group/nav"
                >
                  <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 group-hover/nav:-translate-x-1 transition-transform" />
                </button>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 lg:pr-6 z-30">
                <button 
                  onClick={(e) => { e.preventDefault(); nextImage(); }}
                  className="w-10 h-10 md:w-12 md:h-12 bg-white/90 rounded-2xl flex items-center justify-center text-ocean hover:bg-ocean hover:text-white transition-all shadow-heavy border border-ocean/5 group/nav"
                >
                  <ChevronRight className="w-5 h-5 md:w-6 md:h-6 group-hover/nav:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>

            {/* Experience Description */}
            <div className="space-y-10">
              <div className="flex items-end justify-between px-4">
                <div>
                  <h2 className="text-4xl font-bold text-ocean mb-3">{t('details_about')}</h2>
                  <p className="text-ocean/40 text-sm font-bold uppercase tracking-widest">{t('details_about_sub')}</p>
                </div>
                <div className="w-14 h-14 bg-white shadow-soft rounded-2xl flex items-center justify-center text-ocean/20">
                  <Info className="w-6 h-6" />
                </div>
              </div>
              
              <div className="bg-white p-12 rounded-[3.5rem] shadow-heavy border border-ocean/5">
                <p className="text-ocean/70 text-lg leading-loose font-medium">
                  {activity.description}
                </p>
                
                <div className="mt-12 pt-12 border-t border-ocean/5 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mr-4 shrink-0">
                      <Shield className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <h4 className="text-ocean font-bold text-sm mb-1">{t('details_guides')}</h4>
                      <p className="text-ocean/40 text-xs leading-relaxed">{t('details_guides_desc')}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center mr-4 shrink-0">
                      <Package className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                      <h4 className="text-ocean font-bold text-sm mb-1">{t('details_equipment')}</h4>
                      <p className="text-ocean/40 text-xs leading-relaxed">{t('details_equipment_desc')}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommended Adventure Suggestions */}
              {suggestedActivities.length > 0 && (
                <div className="space-y-8">
                  <div className="flex items-center gap-4 px-4 mb-2">
                    <div className="h-[1px] flex-1 bg-ocean/5" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-ocean/30 whitespace-nowrap">{t('details_also_like')}</span>
                    <div className="h-[1px] flex-1 bg-ocean/5" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {suggestedActivities.map((suggestion) => (
                      <motion.div
                        key={suggestion.id}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                      >
                        <Link to={`/activities/${suggestion.id}`} className="block group">
                          <div className="bg-white p-4 rounded-[2rem] shadow-heavy border border-ocean/5 hover:border-coral/20 transition-all duration-500 overflow-hidden relative h-full">
                            <div className="flex flex-col gap-4">
                              <div className="w-full h-32 rounded-2xl overflow-hidden relative shrink-0">
                                <img 
                                  src={suggestion.backgroundImageUrl || 'https://images.unsplash.com/photo-1520255870062-bd79d3865de7?auto=format&fit=crop&q=80&w=400'} 
                                  alt={suggestion.title}
                                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                  referrerPolicy="no-referrer"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-ocean/20 to-transparent" />
                                <div className="absolute top-2 right-2">
                                   <div className="flex items-center bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg text-amber-500 gap-0.5 shadow-sm">
                                      <Star className="w-2.5 h-2.5 fill-current" />
                                      <span className="text-[9px] font-bold">5.0</span>
                                   </div>
                                </div>
                              </div>
                              
                              <div className="flex-1">
                                <div className="mb-1">
                                   <span className="text-coral text-[8px] font-bold uppercase tracking-wider">{suggestion.category}</span>
                                </div>
                                <h3 className="text-base font-bold text-ocean mb-0.5 group-hover:text-coral transition-colors line-clamp-1">{suggestion.title}</h3>
                                <div className="flex items-center justify-between mt-3 pt-3 border-t border-ocean/5">
                                  <div>
                                    <span className="block text-[7px] font-bold uppercase tracking-wider text-ocean/30">{t('details_from')}</span>
                                    <span className="text-sm font-black text-ocean">€{suggestion.durations?.[0]?.price || 25}</span>
                                  </div>
                                  <div className="w-7 h-7 rounded-xl bg-ocean/5 text-ocean flex items-center justify-center group-hover:bg-coral group-hover:text-white transition-all duration-300">
                                    <ChevronRight className="w-4 h-4" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Area: Inclusions & Support */}
          <div className="space-y-10">
            {/* Availability & Hours Card */}
            <div className="bg-white p-10 rounded-[3.5rem] shadow-heavy border border-ocean/5 space-y-8">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center mr-4">
                  <Clock className="w-5 h-5 text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-ocean">{t('details_availability')}</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-ocean/5">
                  <span className="text-ocean/40 text-[10px] font-bold uppercase tracking-wider">{t('details_operating')}</span>
                  <span className="text-ocean font-bold text-sm">{t('details_everyday')}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-ocean/5">
                  <span className="text-ocean/40 text-[10px] font-bold uppercase tracking-wider">{t('details_hours')}</span>
                  <span className="text-ocean font-bold text-sm">08:00 - 19:00</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-ocean/5">
                  <span className="text-ocean/40 text-[10px] font-bold uppercase tracking-wider">{t('details_duration')}</span>
                  <span className="text-ocean font-bold text-sm">{t('details_flexible')}</span>
                </div>
              </div>

              {/* Interactive Calendar Widget */}
              <div className="pt-6">
                <div className="bg-paper rounded-3xl p-5">
                  {/* Calendar Header */}
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-ocean/60">
                      {format(calendarMonth, 'MMMM yyyy')}
                    </span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setCalendarMonth(m => subMonths(m, 1))}
                        className="w-7 h-7 rounded-lg hover:bg-white transition-colors flex items-center justify-center group"
                      >
                        <ChevronLeft className="w-3.5 h-3.5 text-ocean/40 group-hover:text-ocean transition-colors" />
                      </button>
                      <button
                        onClick={() => setCalendarMonth(m => addMonths(m, 1))}
                        className="w-7 h-7 rounded-lg hover:bg-white transition-colors flex items-center justify-center group"
                      >
                        <ChevronRight className="w-3.5 h-3.5 text-ocean/40 group-hover:text-ocean transition-colors" />
                      </button>
                    </div>
                  </div>

                  {/* Day-of-week headers */}
                  <div className="grid grid-cols-7 gap-y-2 gap-x-0.5 text-center mb-1">
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                      <span key={d} className="text-[8px] font-black text-ocean/20 uppercase">{d}</span>
                    ))}
                  </div>

                  {/* Calendar Days */}
                  <div className="grid grid-cols-7 gap-y-1 gap-x-0.5 text-center">
                    {(() => {
                      const monthStart = startOfMonth(calendarMonth);
                      const monthEnd = endOfMonth(calendarMonth);
                      const calStart = startOfWeek(monthStart);
                      const calEnd = endOfWeek(monthEnd);
                      const today = startOfToday();
                      const days = eachDayOfInterval({ start: calStart, end: calEnd });
                      return days.map((day, i) => {
                        const dateStr = format(day, 'yyyy-MM-dd');
                        const isCurrentMonth = isSameMonth(day, calendarMonth);
                        const isToday = isSameDay(day, today);
                        const isPast = isBefore(day, today) && !isToday;
                        const bookedTimes = confirmedDates[dateStr] || [];
                        const isConfirmed = bookedTimes.length > 0;

                        let cellClass = 'text-[10px] font-bold py-1 rounded-lg transition-all ';
                        if (!isCurrentMonth) {
                          cellClass += 'text-ocean/10';
                        } else if (isToday) {
                          cellClass += 'bg-coral text-white shadow-md';
                        } else if (isConfirmed) {
                          cellClass += 'bg-green-100 text-green-700 font-black ring-1 ring-green-300 cursor-help';
                        } else if (isPast) {
                          cellClass += 'text-ocean/15';
                        } else {
                          cellClass += 'text-ocean/60 hover:bg-white';
                        }

                        return (
                          <div 
                            key={i} 
                            className={cellClass}
                            title={isConfirmed ? `Booked at: ${bookedTimes.join(', ')}` : undefined}
                          >
                            {format(day, 'd')}
                          </div>
                        );
                      });
                    })()}
                  </div>

                  {/* Legend */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-ocean/5">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded bg-coral" />
                      <span className="text-[9px] font-bold text-ocean/40 uppercase tracking-wide">{t('details_today')}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded bg-green-100 ring-1 ring-green-300" />
                      <span className="text-[9px] font-bold text-ocean/40 uppercase tracking-wide">{t('details_booked')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Essential Info Card */}
            <div className="bg-white p-10 rounded-[3.5rem] shadow-heavy border border-ocean/5 space-y-12">
              <div className="space-y-8">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-xl bg-coral/10 flex items-center justify-center mr-4">
                    <Shield className="w-5 h-5 text-coral" />
                  </div>
                  <h3 className="text-xl font-bold text-ocean">{t('details_safety')}</h3>
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
                  <h3 className="text-xl font-bold text-ocean">{t('details_included')}</h3>
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
              <h5 className="text-2xl font-bold mb-4 relative z-10">{t('details_questions')}</h5>
              <p className="text-white/60 text-sm mb-8 relative z-10 leading-relaxed">{t('details_questions_body')}</p>
              <a 
                href={waUrl} 
                target="_blank" 
                className="flex items-center justify-center w-full bg-white text-ocean py-6 rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-paper transition-all shadow-heavy"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                {t('details_chat')}
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
    </>
  );
}

