import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, Users, ChevronRight, CheckCircle2, Phone } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { toast } from 'sonner';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedActivityId?: string;
}

export default function BookingModal({ isOpen, onClose, preselectedActivityId }: BookingModalProps) {
  const [activities, setActivities] = useState<any[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [selectedDuration, setSelectedDuration] = useState<any>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const { register, handleSubmit, reset, watch, setValue, formState: { isSubmitting } } = useForm();

  const watchActivityId = watch('activityId');

  useEffect(() => {
    if (isOpen) {
      fetch('/api/activities')
        .then(res => res.json())
        .then(data => {
          setActivities(data);
          if (preselectedActivityId) {
            const act = data.find((a: any) => a.id === preselectedActivityId);
            if (act) {
              setSelectedActivity(act);
              setValue('activityId', act.id);
              if (act.durations?.length > 0) {
                setSelectedDuration(act.durations[0]);
              }
            }
          }
        });
    }
  }, [isOpen, preselectedActivityId, setValue]);

  useEffect(() => {
    if (watchActivityId) {
      const act = activities.find(a => a.id === watchActivityId);
      setSelectedActivity(act || null);
      if (act && act.durations?.length > 0) {
        setSelectedDuration(act.durations[0]);
      } else {
        setSelectedDuration(null);
      }
    }
  }, [watchActivityId, activities]);

  const onSubmit = async (data: any) => {
    if (!selectedActivity || !selectedDuration) {
      toast.error('Please select an activity and duration');
      return;
    }

    const bookingData = {
      ...data,
      persons: parseInt(data.persons),
      durationId: selectedDuration.id,
      isMultiDay: data.isMultiDay || false,
      startDate: data.isMultiDay ? data.startDate : data.date,
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

  const waMessage = selectedActivity 
    ? `Hello, I want to book ${selectedActivity.title} for ${watch('persons') || 1} persons.`
    : 'Hello, I want to make a booking.';
  const waUrl = `https://wa.me/212600000000?text=${encodeURIComponent(waMessage)}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-ocean/80 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-heavy overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="flex items-center justify-between p-5 md:p-6 border-b border-ocean/5 shrink-0">
              <h2 className="text-2xl font-bold text-ocean">Book Your Adventure</h2>
              <button 
                onClick={onClose}
                className="w-10 h-10 bg-paper rounded-full flex items-center justify-center text-ocean/40 hover:text-coral hover:bg-coral/10 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 md:p-6 overflow-y-auto custom-scrollbar flex-1">
              {bookingSuccess ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-10"
                >
                  <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-ocean mb-4">Request Sent!</h3>
                  <p className="text-ocean/60 text-sm mb-10 leading-relaxed max-w-md mx-auto">
                    We've received your booking request. To speed up the confirmation, please message us on WhatsApp.
                  </p>
                  <div className="space-y-4 max-w-sm mx-auto">
                    <a 
                      href={waUrl}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-full bg-green-500 text-white py-4 rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-green-600 transition-all shadow-soft"
                    >
                      <Phone className="w-4 h-4 mr-3" />
                      Confirm on WhatsApp
                    </a>
                    <Button variant="ghost" onClick={() => { setBookingSuccess(false); onClose(); }} className="w-full text-ocean/40 hover:text-ocean text-[10px] font-bold uppercase tracking-widest">
                      Close
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-ocean/40 ml-2">Select Activity</label>
                    <select 
                      {...register('activityId', { required: true })} 
                      className="w-full bg-paper border-0 rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-coral transition-all appearance-none cursor-pointer"
                    >
                      <option value="">-- Choose an Activity --</option>
                      {activities.map(act => (
                        <option key={act.id} value={act.id}>{act.title}</option>
                      ))}
                    </select>
                  </div>

                  {selectedActivity && selectedActivity.durations?.length > 0 && (
                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-ocean/40 ml-2">Choose Duration</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {selectedActivity.durations.map((duration: any) => (
                          <button
                            type="button"
                            key={duration.id}
                            onClick={() => setSelectedDuration(duration)}
                            className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                              selectedDuration?.id === duration.id 
                                ? 'border-coral bg-coral/5 text-ocean' 
                                : 'border-ocean/5 hover:border-coral/30 text-ocean/60'
                            }`}
                          >
                            <span className="font-bold text-xs tracking-tight">{duration.durationLabel}</span>
                            <span className="font-bold text-sm">€{duration.price}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-ocean/40 ml-2">Stay Duration</label>
                    <div className="flex p-1 bg-paper rounded-2xl">
                      <button
                        type="button"
                        onClick={() => setValue('isMultiDay', false)}
                        className={`flex-1 py-3 px-4 rounded-xl text-[10px] font-bold uppercase tracking-[0.1em] transition-all ${
                          !watch('isMultiDay') 
                            ? 'bg-white text-coral shadow-soft' 
                            : 'text-ocean/40 hover:text-ocean/60'
                        }`}
                      >
                        Single Day
                      </button>
                      <button
                        type="button"
                        onClick={() => setValue('isMultiDay', true)}
                        className={`flex-1 py-3 px-4 rounded-xl text-[10px] font-bold uppercase tracking-[0.1em] transition-all ${
                          watch('isMultiDay') 
                            ? 'bg-white text-coral shadow-soft' 
                            : 'text-ocean/40 hover:text-ocean/60'
                        }`}
                      >
                        Multiple Days
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-ocean/40 ml-2">Full Name</label>
                      <Input {...register('fullName', { required: true })} placeholder="Your Full Name" className="bg-paper border-0 rounded-2xl py-6 px-6 text-sm focus:ring-2 focus:ring-coral transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-ocean/40 ml-2">WhatsApp Number</label>
                      <Input {...register('phone', { required: true })} placeholder="+212 600 000 000" className="bg-paper border-0 rounded-2xl py-6 px-6 text-sm focus:ring-2 focus:ring-coral transition-all" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all">
                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-ocean/40 ml-2">Persons</label>
                      <Input type="number" min="1" max={selectedActivity?.maxPersons || 10} {...register('persons', { required: true })} defaultValue="1" className="bg-paper border-0 rounded-2xl py-6 px-6 text-sm focus:ring-2 focus:ring-coral transition-all" />
                    </div>
                    
                    {!watch('isMultiDay') ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:contents gap-6">
                        <div className="space-y-2">
                          <label className="block text-[10px] font-bold uppercase tracking-widest text-ocean/40 ml-2">Date</label>
                          <Input type="date" min={new Date().toISOString().split('T')[0]} {...register('date', { required: !watch('isMultiDay') })} className="bg-paper border-0 rounded-2xl py-6 px-6 text-sm focus:ring-2 focus:ring-coral transition-all" />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-[10px] font-bold uppercase tracking-widest text-ocean/40 ml-2">Time</label>
                          <Input type="time" {...register('time', { required: !watch('isMultiDay') })} className="bg-paper border-0 rounded-2xl py-6 px-6 text-sm focus:ring-2 focus:ring-coral transition-all" />
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:contents gap-6">
                        <div className="space-y-2">
                          <label className="block text-[10px] font-bold uppercase tracking-widest text-ocean/40 ml-2">Start Date</label>
                          <Input type="date" min={new Date().toISOString().split('T')[0]} {...register('startDate', { required: watch('isMultiDay') })} className="bg-paper border-0 rounded-2xl py-6 px-6 text-sm focus:ring-2 focus:ring-coral transition-all" />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-[10px] font-bold uppercase tracking-widest text-ocean/40 ml-2">End Date</label>
                          <Input type="date" min={watch('startDate') || new Date().toISOString().split('T')[0]} {...register('endDate', { required: watch('isMultiDay') })} className="bg-paper border-0 rounded-2xl py-6 px-6 text-sm focus:ring-2 focus:ring-coral transition-all" />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-6 border-t border-ocean/5">
                    <Button 
                      type="submit" 
                      disabled={isSubmitting || !selectedActivity || !selectedDuration}
                      className="w-full bg-coral text-white hover:bg-coral/90 transition-all rounded-full py-6 text-xs font-bold uppercase tracking-widest shadow-heavy group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Sending Request...' : (
                        <>
                          Confirm Booking <ChevronRight className="ml-3 w-4 h-4 group-hover:translate-x-2 transition-transform" />
                        </>
                      )}
                    </Button>
                    <p className="text-[10px] text-center text-ocean/40 font-medium mt-4">
                      No payment required now. We will contact you to finalize the booking.
                    </p>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
