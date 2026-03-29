import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Phone, Mail, MapPin, Send, MessageSquare, Clock, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import PageHeader from '../components/ui/PageHeader';

export default function Contact() {
  const { t } = useTranslation();
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const onSubmit = async (data: any) => {
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setIsSubmitted(true);
        toast.success('Your message has been sent!');
        reset();
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to send message');
      }
    } catch (error: any) {
      console.error('Error sending message', error);
      toast.error(error.message || 'Something went wrong. Please try again later.');
    }
  };

  return (
    <div className="bg-paper min-h-screen pb-32">
      <PageHeader
        title={t('contact')}
        subtitle="Have questions about our tours or want to make a special booking? We are here to help."
        category="Get in Touch"
        icon={MessageSquare}
        // backgroundImage="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=1920"
        backgroundImage="https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/bg%20pages/contact%20page.avif"
      />

      {/* Map Section */}
      <section className="pt-24 max-w-7xl mx-auto px-6 lg:px-12">
        <div className="h-[500px] bg-white rounded-[4rem] shadow-soft border border-ocean/5 overflow-hidden relative group">
          <img
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1920"
            alt="Map Location"
            className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white p-8 rounded-[2rem] shadow-heavy border border-ocean/5 text-center max-w-xs">
              <div className="w-12 h-12 bg-coral rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-bold text-ocean mb-2">Taghazout Jet Base</h4>
              <p className="text-ocean/60 text-xs">Main Beach Access, Taghazout 80022, Morocco</p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 mt-24 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
          {/* Contact Info */}
          <div className="lg:col-span-5 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="text-coral font-bold uppercase tracking-widest text-xs mb-4 block">Get in Touch</span>
              <h2 className="text-4xl font-bold text-ocean mb-8 leading-tight">We'd love to hear from you</h2>
              <p className="text-ocean/60 text-lg mb-12 leading-relaxed">
                Whether you're looking for a group event, a private tour, or just have a quick question, our team is ready to assist you.
              </p>
            </motion.div>

            <div className="space-y-6">
              {[
                { icon: Phone, title: 'Phone / WhatsApp', content: '+212 600 000 000', color: 'bg-green-50 text-green-600' },
                { icon: Mail, title: 'Email Address', content: 'contact@taghazoutjet.com', color: 'bg-blue-50 text-blue-600' },
                { icon: MapPin, title: 'Our Location', content: 'Taghazout Beach, Agadir, Morocco', color: 'bg-coral/10 text-coral' },
                { icon: Clock, title: 'Opening Hours', content: 'Daily: 09:00 AM - 07:00 PM', color: 'bg-sun/10 text-ocean' },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="bg-white p-8 rounded-[2rem] shadow-soft border border-ocean/5 flex items-start group hover:shadow-heavy transition-all duration-500"
                >
                  <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center mr-6 shrink-0 group-hover:scale-110 transition-transform duration-500`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-ocean mb-1">{item.title}</h3>
                    <p className="text-ocean/60 font-medium">{item.content}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-white p-10 md:p-16 rounded-[3rem] shadow-heavy border border-ocean/5"
            >
              <AnimatePresence mode="wait">
                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="text-center py-10"
                  >
                    <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-10">
                      <CheckCircle2 className="w-12 h-12" />
                    </div>
                    <h3 className="text-3xl font-bold text-ocean mb-6">Message Received!</h3>
                    <p className="text-ocean/60 text-lg mb-12 leading-relaxed">
                      Thank you for reaching out. Our team will review your message and get back to you within 24 hours.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button variant="outline" onClick={() => setIsSubmitted(false)} className="rounded-full px-10 py-6 text-xs font-bold uppercase tracking-widest border-ocean/10 text-ocean hover:bg-ocean/5">
                        Send Another Message
                      </Button>
                      <a
                        href="https://wa.me/212600000000"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center bg-green-500 text-white px-10 py-6 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-green-600 transition-all shadow-soft"
                      >
                        <MessageSquare className="w-4 h-4 mr-3" />
                        Chat on WhatsApp
                      </a>
                    </div>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label htmlFor="contact-name" className="block text-[10px] font-bold uppercase tracking-widest text-ocean/40 ml-2">{t('full_name')}</label>
                        <Input 
                          id="contact-name"
                          autoComplete="name"
                          {...register('fullName', { required: true })} 
                          placeholder="Your Full Name" 
                          className="bg-paper border-0 rounded-2xl py-6 px-6 text-sm focus:ring-2 focus:ring-coral transition-all" 
                        />
                      </div>
                      <div className="space-y-3">
                        <label htmlFor="contact-phone" className="block text-[10px] font-bold uppercase tracking-widest text-ocean/40 ml-2">{t('whatsapp_number')}</label>
                        <Input 
                          id="contact-phone"
                          autoComplete="tel"
                          {...register('phone', { required: true })} 
                          placeholder="+212 600 000 000" 
                          className="bg-paper border-0 rounded-2xl py-6 px-6 text-sm focus:ring-2 focus:ring-coral transition-all" 
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label htmlFor="contact-subject" className="block text-[10px] font-bold uppercase tracking-widest text-ocean/40 ml-2">Subject</label>
                        <select 
                          id="contact-subject"
                          {...register('subject')} 
                          className="w-full bg-paper border-0 rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-coral transition-all appearance-none cursor-pointer"
                        >
                          <option value="General Inquiry">General Inquiry</option>
                          <option value="Booking Question">Booking Question</option>
                          <option value="Group Event">Group Event</option>
                          <option value="Partnership">Partnership</option>
                        </select>
                      </div>
                      <div className="space-y-3">
                        <label htmlFor="contact-activity" className="block text-[10px] font-bold uppercase tracking-widest text-ocean/40 ml-2">Activity Interest</label>
                        <select 
                          id="contact-activity"
                          {...register('activity')} 
                          className="w-full bg-paper border-0 rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-coral transition-all appearance-none cursor-pointer"
                        >
                          <option value="Jet Ski">Jet Ski</option>
                          <option value="Boat Trip">Boat Trip</option>
                          <option value="Surf Lessons">Surf Lessons</option>
                          <option value="Flyboard">Flyboard</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label htmlFor="contact-message" className="block text-[10px] font-bold uppercase tracking-widest text-ocean/40 ml-2">Your Message</label>
                      <textarea
                        id="contact-message"
                        {...register('message', { required: true })}
                        className="w-full bg-paper border-0 rounded-[2rem] py-6 px-6 text-sm focus:ring-2 focus:ring-coral transition-all min-h-[200px] resize-none"
                        placeholder="How can we help you today?"
                      ></textarea>
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-ocean text-white hover:bg-ocean-dark transition-all rounded-full py-8 text-xs font-bold uppercase tracking-widest shadow-heavy group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Sending Message...' : (
                        <>
                          Send Message <Send className="ml-3 w-4 h-4 group-hover:translate-x-2 group-hover:-translate-y-1 transition-transform" />
                        </>
                      )}
                    </Button>
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
