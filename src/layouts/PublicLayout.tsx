import { Outlet, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, Globe, Phone, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BookingModal from '../components/BookingModal';

export default function PublicLayout() {
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const navLinks = [
    { name: t('home'), path: '/' },
    { name: t('activities'), path: '/activities' },
    { name: t('contact'), path: '/contact' },
  ];

  return (
    <div className="min-h-screen flex flex-col selection:bg-ocean/10 selection:text-ocean">
      {/* Navbar */}
      <header 
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled ? 'glass py-3 shadow-soft' : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
          <div className="flex justify-between items-center">
            <Link 
              to="/" 
              className={`text-2xl font-bold tracking-tight transition-colors duration-300 ${
                scrolled ? 'text-ocean' : 'text-ocean'
              }`}
            >
              Taghazout<span className="text-coral">Jet</span>
            </Link>
            
            {/* Desktop Menu */}
            <nav className="hidden md:flex items-center space-x-10">
              {navLinks.map((link) => (
                <Link 
                  key={link.path}
                  to={link.path} 
                  className={`text-sm font-semibold uppercase tracking-widest transition-all duration-300 hover:text-coral ${
                    location.pathname === link.path ? 'text-coral' : 'text-ocean/80'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              
              {/* Language Switcher */}
              <div className="relative group">
                <button className="flex items-center text-sm font-semibold uppercase tracking-widest text-ocean/80 hover:text-coral transition-colors">
                  <Globe className="w-4 h-4 mr-2" />
                  {i18n.language.toUpperCase()}
                </button>
                <div className="absolute right-0 mt-4 w-40 glass rounded-2xl shadow-heavy py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  {['en', 'fr', 'ar', 'es'].map((lng) => (
                    <button 
                      key={lng}
                      onClick={() => changeLanguage(lng)} 
                      className="block px-6 py-2 text-xs font-bold uppercase tracking-widest text-ocean hover:text-coral w-full text-left transition-colors"
                    >
                      {lng === 'en' ? 'English' : lng === 'fr' ? 'Français' : lng === 'ar' ? 'العربية' : 'Español'}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => setIsBookingModalOpen(true)}
                className="bg-ocean text-white text-xs font-bold uppercase tracking-widest px-8 py-3 rounded-full hover:bg-ocean-dark transition-all duration-300 shadow-soft hover:shadow-heavy active:scale-95 cursor-pointer"
              >
                Book Now
              </button>
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)} 
                className="text-ocean p-2 focus:outline-none"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden absolute top-full left-0 w-full glass border-t border-ocean/5 shadow-heavy overflow-hidden"
            >
              <div className="px-6 py-8 space-y-6">
                {navLinks.map((link) => (
                  <Link 
                    key={link.path}
                    to={link.path} 
                    className={`block text-lg font-bold uppercase tracking-widest transition-colors ${
                      location.pathname === link.path ? 'text-coral' : 'text-ocean'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="pt-6 border-t border-ocean/5 flex justify-between items-center">
                  <div className="flex space-x-4">
                    {['en', 'fr', 'ar', 'es'].map((lng) => (
                      <button 
                        key={lng}
                        onClick={() => changeLanguage(lng)} 
                        className={`text-xs font-bold uppercase tracking-widest ${
                          i18n.language === lng ? 'text-coral' : 'text-ocean/60'
                        }`}
                      >
                        {lng}
                      </button>
                    ))}
                  </div>
                  <button 
                    onClick={() => {
                      setIsBookingModalOpen(true);
                      setIsMenuOpen(false);
                    }}
                    className="bg-ocean text-white text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-full"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-0">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-ocean text-white pt-32 pb-16 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-coral via-sun to-sky opacity-30"></div>
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-20">
            <div className="md:col-span-5">
              <Link to="/" className="text-3xl font-bold tracking-tight mb-8 block">
                Taghazout<span className="text-coral">Jet</span>
              </Link>
              <p className="text-sky/60 text-lg leading-relaxed max-w-md mb-8">
                Experience the thrill of the Atlantic. We provide premium water sports experiences in the heart of Taghazout, Morocco.
              </p>
              <div className="flex space-x-6">
                <a href="#" className="text-sky/40 hover:text-coral transition-colors"><Instagram className="w-6 h-6" /></a>
                <a href="#" className="text-sky/40 hover:text-coral transition-colors"><Facebook className="w-6 h-6" /></a>
                <a href="#" className="text-sky/40 hover:text-coral transition-colors"><Twitter className="w-6 h-6" /></a>
              </div>
            </div>
            
            <div className="md:col-span-3">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-coral mb-8">Explore</h3>
              <ul className="space-y-4">
                <li><Link to="/" className="text-sky/80 hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/activities" className="text-sky/80 hover:text-white transition-colors">Activities</Link></li>
                <li><Link to="/contact" className="text-sky/80 hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link to="/login" className="text-sky/40 hover:text-white transition-colors text-sm">Admin Access</Link></li>
              </ul>
            </div>
            
            <div className="md:col-span-4">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-coral mb-8">Contact</h3>
              <ul className="space-y-6">
                <li className="flex items-start">
                  <Phone className="w-5 h-5 mr-4 text-coral shrink-0" />
                  <span className="text-sky/80">+212 600 000 000</span>
                </li>
                <li className="flex items-start">
                  <MapPin className="w-5 h-5 mr-4 text-coral shrink-0" />
                  <span className="text-sky/80">Taghazout Beach, Agadir, Morocco</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-sky/40 text-sm uppercase tracking-widest font-bold">
              &copy; {new Date().getFullYear()} Taghazout Jet. All rights reserved.
            </p>
            <div className="flex space-x-8 text-sky/40 text-xs font-bold uppercase tracking-widest">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <motion.a 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        href="https://wa.me/212600000000" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 bg-coral text-white p-5 rounded-full shadow-heavy hover:bg-coral/90 transition-all z-50 flex items-center justify-center group"
      >
        <Phone className="w-6 h-6" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-3 transition-all duration-500 whitespace-nowrap font-bold uppercase tracking-widest text-xs">
          Chat with us
        </span>
      </motion.a>

      <BookingModal 
        isOpen={isBookingModalOpen} 
        onClose={() => setIsBookingModalOpen(false)} 
      />
    </div>
  );
}
