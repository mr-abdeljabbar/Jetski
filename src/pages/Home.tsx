import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { MapPin, Users, Clock, Star, ArrowRight, Shield, Waves, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import BookingModal from '../components/BookingModal';

export default function Home() {
  const { t } = useTranslation();
  const [activities, setActivities] = useState<any[]>([]);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  useEffect(() => {
    fetch('/api/activities')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setActivities(data.slice(0, 6));
        } else {
          console.error('Activities data is not an array:', data);
          setActivities([]);
        }
      })
      .catch(err => {
        console.error('Error fetching activities:', err);
        setActivities([]);
      });
  }, []);

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8 }
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video 
            autoPlay 
            muted 
            loop 
            playsInline 
            className="w-full h-full object-cover"
          >
            <source src="/hero-video.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-ocean/40 backdrop-blur-[1px]"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-ocean/40 via-transparent to-paper"></div>
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <span className="inline-block text-sun font-bold uppercase tracking-[0.3em] text-xs mb-6 bg-white/10 backdrop-blur-md px-6 py-2 rounded-full border border-white/20">
              Welcome to the Atlantic
            </span>
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 tracking-tight leading-[1.1] text-balance">
              {t('hero_title')}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-2xl mx-auto font-light leading-relaxed text-balance">
              {t('hero_subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Button 
                onClick={() => setIsBookingModalOpen(true)}
                size="lg" 
                className="bg-coral hover:bg-coral/90 text-white text-sm font-bold uppercase tracking-widest px-12 py-8 rounded-full shadow-heavy transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                {t('book_now')}
              </Button>
              <Link to="/contact">
                <Button variant="outline" size="lg" className="border-white/40 text-white hover:bg-white/10 text-sm font-bold uppercase tracking-widest px-12 py-8 rounded-full backdrop-blur-md transition-all">
                  Contact Us
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 text-white/40"
        >
          <div className="w-px h-12 bg-gradient-to-b from-white/40 to-transparent mx-auto"></div>
        </motion.div>
      </section>

      {/* Featured Experiences */}
      <section className="py-40 bg-paper relative">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-12">
            <div className="max-w-2xl">
              <span className="text-coral font-bold uppercase tracking-widest text-xs mb-6 block">Curated Adventures</span>
              <h2 className="text-5xl md:text-7xl font-bold text-ocean leading-tight">
                {t('featured_activities')}
              </h2>
            </div>
            <Link to="/activities" className="group flex items-center text-ocean font-bold uppercase tracking-widest text-xs hover:text-coral transition-colors">
              View All Activities <ArrowRight className="ml-3 w-4 h-4 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          <motion.div 
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-10"
          >
            {activities.map((activity) => (
              <motion.div key={activity.id} variants={fadeIn}>
                <Link to={`/activities/${activity.id}`}>
                  <Card className="group overflow-hidden rounded-[2rem] border-0 shadow-soft hover:shadow-heavy transition-all duration-500 bg-white cursor-pointer">
                    <div className="h-80 overflow-hidden relative">
                      <img 
                        src={activity.images[0]?.imageUrl || 'https://images.unsplash.com/photo-1520255870062-bd79d3865de7?auto=format&fit=crop&q=80&w=1000'} 
                        alt={activity.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ocean/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="absolute top-6 right-6 glass px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest text-ocean">
                        {activity.category}
                      </div>
                    </div>
                    <CardHeader className="pt-6 px-6">
                      <CardTitle className="text-2xl mb-4 group-hover:text-coral transition-colors">{activity.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="px-6 pb-6">
                      <p className="text-ocean/60 mb-8 line-clamp-2 text-sm leading-relaxed">{activity.description}</p>
                      <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-ocean/40 mb-8 border-t border-ocean/5 pt-6">
                        <div className="flex items-center"><Users className="w-4 h-4 mr-2 text-coral" /> {activity.maxPersons} Persons</div>
                        <div className="flex items-center"><MapPin className="w-4 h-4 mr-2 text-coral" /> {activity.location}</div>
                      </div>
                      <Button className="w-full bg-ocean text-white hover:bg-ocean-dark transition-all rounded-full py-6 text-xs font-bold uppercase tracking-widest shadow-soft">
                        Explore Experience
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Split Layout Section */}
      <section className="py-40 bg-ocean text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 skew-x-12 translate-x-1/2"></div>
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-coral font-bold uppercase tracking-widest text-xs mb-6 block">Our Commitment</span>
              <h2 className="text-5xl md:text-6xl font-bold mb-10 leading-tight">Safety & Excellence on the Water</h2>
              <p className="text-sky/60 text-lg leading-relaxed mb-12">
                We pride ourselves on providing the safest and most exhilarating water sports experiences in Morocco. Our certified instructors and premium equipment ensure you have the time of your life.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mr-6 shrink-0">
                    <Shield className="w-6 h-6 text-coral" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-2">Certified Safety</h4>
                    <p className="text-sky/40 text-sm">International safety standards on every trip.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mr-6 shrink-0">
                    <Waves className="w-6 h-6 text-coral" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-2">Premium Gear</h4>
                    <p className="text-sky/40 text-sm">Latest jet skis and high-quality equipment.</p>
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="aspect-square rounded-[3rem] overflow-hidden shadow-heavy rotate-3">
                <img 
                  src="https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=1000" 
                  alt="Jet Ski Action" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-10 -left-10 glass p-8 rounded-[2rem] shadow-heavy hidden md:block -rotate-3">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-sun rounded-full flex items-center justify-center">
                    <Sun className="w-6 h-6 text-ocean" />
                  </div>
                  <div>
                    <p className="text-ocean font-bold text-xl">300+</p>
                    <p className="text-ocean/60 text-xs font-bold uppercase tracking-widest">Sunny Days / Year</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Us - Bento Grid Style */}
      <section className="py-40 bg-paper">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
          <div className="text-center max-w-3xl mx-auto mb-32">
            <span className="text-coral font-bold uppercase tracking-widest text-xs mb-6 block">The Taghazout Difference</span>
            <h2 className="text-5xl md:text-7xl font-bold text-ocean mb-10">{t('why_choose_us')}</h2>
            <p className="text-ocean/60 text-xl">We go above and beyond to make your coastal experience unforgettable.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-8 bg-white p-8 md:p-10 rounded-[3rem] shadow-soft border border-ocean/5 flex flex-col justify-between group hover:shadow-heavy transition-all duration-500">
              <div className="w-16 h-16 bg-sky/10 rounded-2xl flex items-center justify-center mb-12 group-hover:bg-coral group-hover:text-white transition-colors duration-500">
                <Star className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-ocean mb-4">Top Rated Experience</h3>
                <p className="text-ocean/60 text-lg leading-relaxed max-w-xl">
                  With hundreds of 5-star reviews, we are the most trusted water sports provider in the region. Our customers love our attention to detail and friendly service.
                </p>
              </div>
            </div>
            
            <div className="md:col-span-4 bg-coral p-8 md:p-10 rounded-[3rem] shadow-soft text-white flex flex-col justify-between group hover:shadow-heavy transition-all duration-500">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-12 group-hover:bg-white group-hover:text-coral transition-colors duration-500">
                <Clock className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-3xl font-bold mb-4">Flexible Booking</h3>
                <p className="text-white/70 leading-relaxed">
                  Plans change. We offer easy rescheduling and cancellation options for your peace of mind.
                </p>
              </div>
            </div>
            
            <div className="md:col-span-4 bg-ocean p-8 md:p-10 rounded-[3rem] shadow-soft text-white flex flex-col justify-between group hover:shadow-heavy transition-all duration-500">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-12 group-hover:bg-sun group-hover:text-ocean transition-colors duration-500">
                <MapPin className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-3xl font-bold mb-4">Prime Locations</h3>
                <p className="text-sky/40 leading-relaxed">
                  We operate from the most beautiful beaches in Taghazout and Agadir.
                </p>
              </div>
            </div>
            
            <div className="md:col-span-8 bg-sun p-8 md:p-10 rounded-[3rem] shadow-soft text-ocean flex flex-col justify-between group hover:shadow-heavy transition-all duration-500">
              <div className="flex justify-between items-start">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-12 group-hover:bg-ocean group-hover:text-white transition-colors duration-500">
                  <Users className="w-8 h-8" />
                </div>
                <div className="text-6xl font-bold opacity-10 group-hover:opacity-20 transition-opacity">04</div>
              </div>
              <div>
                <h3 className="text-3xl font-bold mb-4">Expert Instructors</h3>
                <p className="text-ocean/70 text-lg leading-relaxed max-w-xl">
                  Our team consists of passionate water sports professionals who are dedicated to your safety and enjoyment. They know the Atlantic better than anyone.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-40 bg-paper">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
          <div className="bg-ocean rounded-[4rem] p-12 md:p-24 text-center relative overflow-hidden shadow-heavy">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative z-10"
            >
              <h2 className="text-5xl md:text-7xl font-bold text-white mb-10 tracking-tight">Ready for your next adventure?</h2>
              <p className="text-sky/60 text-xl mb-16 max-w-2xl mx-auto">
                Book your experience today and create memories that will last a lifetime.
              </p>
              <Button 
                onClick={() => setIsBookingModalOpen(true)}
                size="lg" 
                className="bg-white text-ocean hover:bg-sky hover:text-white text-sm font-bold uppercase tracking-widest px-16 py-8 rounded-full shadow-heavy transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                Book Your Experience
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      <BookingModal 
        isOpen={isBookingModalOpen} 
        onClose={() => setIsBookingModalOpen(false)} 
      />
    </div>
  );
}
