import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { MapPin, Users, Shield, Package, Calendar, Clock, Phone, ArrowLeft, CheckCircle2, ChevronRight, ChevronLeft, Maximize2, X as CloseIcon, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function ActivityDetails() {
  const { id } = useParams();
  const { t } = useTranslation();
  const [activity, setActivity] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<any>(null);
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/activities/${id}`);
        if (!res.ok) {
          if (res.status === 404) throw new Error('Activity not found');
          throw new Error('Failed to load activity details');
        }
        const data = await res.json();
        setActivity(data);
        if (data.durations?.length > 0) {
          setSelectedDuration(data.durations[0]);
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'An unexpected error occurred');
        toast.error(err.message || 'Could not load activity details');
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
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

  const waMessage = `Hello, I want to book ${activity.title} for ${activity.maxPersons} persons.`;
  const waUrl = `https://wa.me/212600000000?text=${encodeURIComponent(waMessage)}`;

  return (
    <div className="bg-paper min-h-screen pb-32">
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

      {/* Hero Header */}
      <section className="relative h-[60vh] md:h-[70vh] overflow-hidden group">
        <AnimatePresence mode="wait">
          <motion.img 
            key={activeImage}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8 }}
            src={activity.images[activeImage]?.imageUrl || 'https://images.unsplash.com/photo-1520255870062-bd79d3865de7?auto=format&fit=crop&q=80&w=1000'} 
            alt={activity.title} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-ocean/80 via-ocean/20 to-transparent"></div>
        
        {/* Navigation Controls */}
        {activity.images?.length > 1 && (
          <>
            <div className="absolute inset-y-0 left-0 flex items-center pl-6 md:pl-12 lg:pl-20 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={prevImage}
                className="w-14 h-14 glass rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all shadow-soft"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-6 md:pr-12 lg:pr-20 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={nextImage}
                className="w-14 h-14 glass rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all shadow-soft"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
            
            {/* Image Counter */}
            <div className="absolute bottom-32 right-6 md:right-12 lg:right-20 z-20">
              <div className="glass px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest text-white border border-white/20">
                {activeImage + 1} / {activity.images.length}
              </div>
            </div>
          </>
        )}

        {/* Maximize Button */}
        <div className="absolute top-12 right-6 md:right-12 lg:right-20 z-20">
          <button 
            onClick={() => setShowLightbox(true)}
            className="w-14 h-14 glass rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all shadow-soft"
          >
            <Maximize2 className="w-5 h-5" />
          </button>
        </div>
        
        <div className="absolute top-12 left-6 md:left-12 lg:left-20 z-20">
          <Link to="/activities">
            <Button variant="outline" className="glass border-white/20 text-white hover:bg-white/10 rounded-full px-6 py-6 text-xs font-bold uppercase tracking-widest">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Activities
            </Button>
          </Link>
        </div>

        <div className="absolute bottom-16 left-6 md:left-12 lg:left-20 z-20 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <span className="glass px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest text-white border border-white/20">
                {activity.category}
              </span>
              <div className="flex items-center text-sun">
                <MapPin className="w-4 h-4 mr-2" />
                <span className="text-[10px] font-bold uppercase tracking-widest">{activity.location}</span>
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
              {activity.title}
            </h1>
            <div className="flex items-center gap-8 text-white/80 text-sm font-medium">
              <div className="flex items-center"><Users className="w-5 h-5 mr-3 text-coral" /> Up to {activity.maxPersons} Persons</div>
              <div className="flex items-center"><Clock className="w-5 h-5 mr-3 text-coral" /> Multiple Durations</div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 -mt-24 relative z-30">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-white p-10 md:p-16 rounded-[3rem] shadow-soft border border-ocean/5"
            >
              <h2 className="text-3xl font-bold text-ocean mb-8 flex items-center">
                <span className="w-10 h-10 bg-sky/10 rounded-xl flex items-center justify-center mr-4">
                  <Package className="w-5 h-5 text-ocean" />
                </span>
                Experience Overview
              </h2>
              <p className="text-ocean/60 text-lg leading-relaxed mb-12 whitespace-pre-wrap">{activity.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-12 border-t border-ocean/5">
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-ocean flex items-center">
                    <Shield className="w-5 h-5 text-coral mr-3" /> Safety First
                  </h3>
                  <p className="text-ocean/60 text-sm leading-relaxed">{activity.safetyInfo}</p>
                </div>
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-ocean flex items-center">
                    <Package className="w-5 h-5 text-coral mr-3" /> What's Included
                  </h3>
                  <p className="text-ocean/60 text-sm leading-relaxed">{activity.equipmentIncluded}</p>
                </div>
              </div>
            </motion.div>

            {/* Gallery if more than 1 image */}
            {activity.images?.length > 1 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {activity.images.map((img: any, index: number) => (
                  <motion.div 
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    className={`aspect-square rounded-[2rem] overflow-hidden cursor-pointer shadow-soft border-4 transition-all ${activeImage === index ? 'border-coral' : 'border-transparent'}`}
                    onClick={() => setActiveImage(index)}
                  >
                    <img src={img.imageUrl} alt={activity.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-4">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="bg-white p-10 rounded-[3rem] shadow-heavy border border-ocean/5 sticky top-32"
            >
              <h2 className="text-3xl font-bold text-ocean mb-10">Reserve Experience</h2>
              
              <div className="mb-10">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-ocean/40 mb-4 ml-2">Choose Duration</label>
                <div className="grid grid-cols-1 gap-4">
                  {activity.durations?.map((duration: any) => (
                    <button
                      key={duration.id}
                      onClick={() => setSelectedDuration(duration)}
                      className={`group flex items-center justify-between p-6 rounded-2xl border-2 transition-all ${
                        selectedDuration?.id === duration.id 
                          ? 'border-coral bg-coral/5 text-ocean' 
                          : 'border-ocean/5 hover:border-coral/30 text-ocean/60'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 transition-colors ${selectedDuration?.id === duration.id ? 'bg-coral text-white' : 'bg-ocean/5 text-ocean/40'}`}>
                          <Clock className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-sm tracking-tight">{duration.durationLabel}</span>
                      </div>
                      <div className="text-right">
                        <span className="block font-bold text-lg">€{duration.price}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <AnimatePresence mode="wait">
                {bookingSuccess ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="text-center py-10"
                  >
                    <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-bold text-ocean mb-4">Request Sent!</h3>
                    <p className="text-ocean/60 text-sm mb-10 leading-relaxed">We've received your booking request. To speed up the confirmation, please message us on WhatsApp.</p>
                    <div className="space-y-4">
                      <a 
                        href={waUrl}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-full bg-green-500 text-white py-6 rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-green-600 transition-all shadow-soft"
                      >
                        <Phone className="w-4 h-4 mr-3" />
                        Confirm on WhatsApp
                      </a>
                      <Button variant="ghost" onClick={() => setBookingSuccess(false)} className="w-full text-ocean/40 hover:text-ocean text-[10px] font-bold uppercase tracking-widest">
                        Make another booking
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-ocean/40 ml-2">{t('full_name')}</label>
                      <Input {...register('fullName', { required: true })} placeholder="Your Full Name" className="bg-paper border-0 rounded-2xl py-6 px-6 text-sm focus:ring-2 focus:ring-coral transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-ocean/40 ml-2">{t('whatsapp_number')}</label>
                      <Input {...register('phone', { required: true })} placeholder="+212 600 000 000" className="bg-paper border-0 rounded-2xl py-6 px-6 text-sm focus:ring-2 focus:ring-coral transition-all" />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-ocean/40 ml-2">{t('persons')}</label>
                        <Input type="number" min="1" max={activity.maxPersons} {...register('persons', { required: true })} defaultValue="1" className="bg-paper border-0 rounded-2xl py-6 px-6 text-sm focus:ring-2 focus:ring-coral transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-ocean/40 ml-2">{t('date')}</label>
                        <Input type="date" {...register('date', { required: true })} className="bg-paper border-0 rounded-2xl py-6 px-6 text-sm focus:ring-2 focus:ring-coral transition-all" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-ocean/40 ml-2">{t('time')}</label>
                      <Input type="time" {...register('time', { required: true })} className="bg-paper border-0 rounded-2xl py-6 px-6 text-sm focus:ring-2 focus:ring-coral transition-all" />
                    </div>
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full bg-coral text-white hover:bg-coral/90 transition-all rounded-full py-8 text-xs font-bold uppercase tracking-widest shadow-heavy mt-6 group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Sending Request...' : (
                        <>
                          Send Booking Request <ChevronRight className="ml-3 w-4 h-4 group-hover:translate-x-2 transition-transform" />
                        </>
                      )}
                    </Button>
                    <p className="text-[10px] text-center text-ocean/40 font-medium px-6">
                      No payment required now. We will contact you to finalize the booking.
                    </p>
                  </form>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}
