import { Outlet, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, Globe, Phone, MapPin, Instagram, Facebook, Twitter, ChevronRight } from 'lucide-react';
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
    { name: t('activities'), path: '/activities' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Blog', path: '/blog' },
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
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex-1">
              <Link 
                to="/" 
                className={`text-2xl font-bold tracking-tight transition-colors duration-300 ${
                  scrolled ? 'text-ocean' : 'text-ocean'
                }`}
              >
                Taghazout<span className="text-coral">Jet</span>
              </Link>
            </div>
            
            {/* Desktop Menu - Centered */}
            <nav className="hidden md:flex items-center justify-center space-x-10 px-4">
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
            </nav>
            
            {/* Right Actions */}
            <div className="hidden md:flex flex-1 justify-end items-center space-x-8">
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
            </div>

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
      <footer className="bg-ocean text-white pt-24 pb-16 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-coral via-sun to-sky opacity-30"></div>
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] transform rotate-180">
          <svg className="relative block w-[calc(100%+1.3px)] h-[50px] fill-paper" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 mb-16">
            {/* Brand Section */}
            <div className="lg:col-span-4 space-y-8">
              <Link to="/" className="text-3xl font-bold tracking-tight inline-block group">
                Taghazout<span className="text-coral group-hover:text-sun transition-colors">Jet</span>
              </Link>
              <p className="text-sky/60 text-lg leading-relaxed max-w-sm">
                Experience the thrill of the Atlantic. We provide premium water sports experiences in the heart of Taghazout, Morocco.
              </p>
              <div className="flex space-x-4">
                {[
                  { icon: Instagram, href: '#', color: 'hover:bg-pink-500' },
                  { icon: Facebook, href: '#', color: 'hover:bg-blue-600' },
                  { icon: Twitter, href: '#', color: 'hover:bg-sky-500' }
                ].map((social, i) => (
                  <a 
                    key={i} 
                    href={social.href} 
                    className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-sky/40 hover:text-white ${social.color} transition-all duration-500 shadow-soft`}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
            
            {/* Quick Links */}
            <div className="lg:col-span-2">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-coral mb-10">Explore</h3>
              <ul className="space-y-4">
                {[
                  { name: 'Activities', path: '/activities' },
                  { name: 'Gallery', path: '/gallery' },
                  { name: 'Blog', path: '/blog' },
                  { name: 'Location', path: '/contact' }
                ].map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className="text-sky/60 hover:text-white transition-colors flex items-center group text-sm font-medium">
                      <ChevronRight className="w-3 h-3 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all text-coral" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Links */}
            <div className="lg:col-span-2">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-coral mb-10">Support</h3>
              <ul className="space-y-4">
                {[
                  { name: 'Contact Us', path: '/contact' },
                  { name: 'Privacy Policy', path: '/privacy-policy' },
                  { name: 'Terms of Use', path: '/terms-of-use' },
                  { name: 'FAQs', path: '/faqs' }
                ].map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className="text-sky/60 hover:text-white transition-colors flex items-center group text-sm font-medium">
                      <ChevronRight className="w-3 h-3 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all text-coral" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Newsletter Section */}
            <div className="lg:col-span-4">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-coral mb-10">Stay Updated</h3>
              <p className="text-sky/60 text-sm mb-8 leading-relaxed">
                Join our community and get the latest updates on weather conditions and exclusive offers.
              </p>
              <form className="relative group">
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-sm text-white placeholder:text-sky/20 focus:outline-none focus:ring-2 focus:ring-coral transition-all"
                />
                <button 
                  type="submit"
                  className="absolute right-2 top-2 bottom-2 bg-coral text-white px-6 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-sun transition-all shadow-soft"
                >
                  Join
                </button>
              </form>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/5 flex flex-col lg:flex-row justify-between items-center gap-10">
            <div className="flex flex-col items-center lg:items-start gap-3">
              <p className="text-sky/40 text-[10px] uppercase tracking-widest font-bold">
                &copy; {new Date().getFullYear()} Taghazout Jet. All rights reserved.
              </p>
              <p className="text-sky/20 text-[9px] font-bold uppercase tracking-[0.3em]">
                Developed with pride by <a href="https://abdeljabar.com" target="_blank" rel="noopener noreferrer" className="text-coral/60 hover:text-coral transition-colors">Abdeljabar.com</a>
              </p>
            </div>
            
            <div className="flex items-center gap-10">
              <div className="flex items-center text-sky/40 group cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mr-4 group-hover:bg-coral transition-all">
                  <Phone className="w-4 h-4 text-coral group-hover:text-white transition-colors" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5">Contact</p>
                  <p className="text-xs font-bold text-sky/60">+212 600 000 000</p>
                </div>
              </div>
              <div className="flex items-center text-sky/40 group cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mr-4 group-hover:bg-coral transition-all">
                  <MapPin className="w-4 h-4 text-coral group-hover:text-white transition-colors" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5">Location</p>
                  <p className="text-xs font-bold text-sky/60">Taghazout, Morocco</p>
                </div>
              </div>
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
