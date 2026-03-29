import { Outlet, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, Globe, Phone, MapPin, Instagram, Facebook, Twitter, ChevronRight, Mail } from 'lucide-react';
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

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

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
          scrolled
            ? 'glass py-2 sm:py-3 shadow-soft'
            : 'lg:bg-transparent bg-white/90 backdrop-blur-xl py-4 sm:py-6 lg:shadow-none shadow-soft'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-20">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center">
                <img
                  src="/logo.png"
                  alt="Taghazout Jet"
                  className={`h-12 sm:h-14 lg:h-16 w-auto transition-all duration-300`}
                />
              </Link>
            </div>

            {/* Desktop Menu - Centered (visible at lg and above) */}
            <nav className="hidden lg:flex items-center justify-center gap-8 xl:gap-10 px-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-[13px] font-semibold uppercase tracking-wider transition-all duration-300 hover:text-coral ${location.pathname === link.path ? 'text-coral' : 'text-ocean/80'
                    }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Right Actions (visible at lg and above) */}
            <div className="hidden lg:flex items-center gap-6">
              {/* Language Switcher */}
              <div className="relative group">
                <button className="flex items-center text-[13px] font-semibold uppercase tracking-wider text-ocean/80 hover:text-coral transition-colors">
                  <Globe className="w-4 h-4 mr-1.5" />
                  {i18n.language.toUpperCase()}
                </button>
                <div className="absolute right-0 mt-4 w-40 glass rounded-2xl shadow-heavy py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  {['en', 'fr', 'ar', 'es'].map((lng) => (
                    <button
                      key={lng}
                      onClick={() => changeLanguage(lng)}
                      className="block px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-ocean hover:text-coral w-full text-left transition-colors"
                    >
                      {lng === 'en' ? 'English' : lng === 'fr' ? 'Français' : lng === 'ar' ? 'العربية' : 'Español'}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setIsBookingModalOpen(true)}
                className="bg-coral text-white text-xs font-bold uppercase tracking-wider px-7 py-3 rounded-full hover:bg-coral/90 transition-all duration-300 shadow-soft hover:shadow-heavy active:scale-95 cursor-pointer"
              >
                Book Now
              </button>
            </div>

            {/* Mobile / Tablet menu button (visible below lg) */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-ocean p-2 focus:outline-none transition-transform active:scale-90"
                aria-label="Toggle menu"
              >
                <Menu className="h-7 w-7 sm:h-8 sm:w-8" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile / Tablet Menu - Slide-over Overlay (outside header to avoid backdrop-filter stacking context) */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-ocean/30 backdrop-blur-lg z-[60]"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="fixed inset-y-0 right-0 w-full sm:w-[380px] md:w-[420px] bg-paper shadow-2xl z-[70] flex flex-col overflow-y-auto"
            >
              {/* Menu Header */}
              <div className="flex justify-between items-center px-6 sm:px-8 py-6 sm:py-8 border-b border-ocean/5">
                <img src="/logo.png" alt="Taghazout Jet" className="h-10 sm:h-12 w-auto" />
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 text-ocean hover:bg-ocean/5 rounded-full transition-colors"
                  aria-label="Close menu"
                >
                  <X className="h-7 w-7 sm:h-8 sm:w-8" />
                </button>
              </div>

              {/* Nav Links */}
              <nav className="flex-1 flex flex-col justify-center px-8 sm:px-10 py-8 space-y-6 sm:space-y-8">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.08 }}
                  >
                    <Link
                      to={link.path}
                      className={`block text-2xl sm:text-3xl font-bold uppercase tracking-wide transition-colors ${location.pathname === link.path ? 'text-coral' : 'text-ocean hover:text-coral'
                        }`}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Bottom Actions */}
              <div className="px-8 sm:px-10 py-8 sm:py-10 space-y-8 border-t border-ocean/5">
                {/* Language Selector */}
                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-ocean/40">Language</p>
                  <div className="flex flex-wrap gap-3">
                    {['en', 'fr', 'ar', 'es'].map((lng) => (
                      <button
                        key={lng}
                        onClick={() => changeLanguage(lng)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${i18n.language === lng
                          ? 'bg-ocean text-white border-ocean'
                          : 'bg-white text-ocean border-ocean/10 hover:border-ocean'
                          }`}
                      >
                        {lng === 'en' ? 'EN' : lng === 'fr' ? 'FR' : lng === 'ar' ? 'AR' : 'ES'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => {
                    setIsBookingModalOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="w-full bg-coral text-white text-sm font-bold uppercase tracking-wider py-5 rounded-2xl shadow-heavy hover:bg-coral/90 active:scale-[0.98] transition-all"
                >
                  Book Your Experience
                </button>

                {/* Social Links */}
                <div className="flex justify-center gap-4 pt-2">
                  {[
                    { icon: Instagram, href: 'https://instagram.com/taghazoutjet' },
                    { icon: Facebook, href: 'https://facebook.com/taghazoutjet' },
                    { icon: Twitter, href: '#' },
                  ].map((social, i) => (
                    <a key={i} href={social.href} target="_blank" rel="noopener noreferrer" className="p-3 bg-ocean/5 rounded-xl text-ocean/40 hover:text-coral hover:bg-coral/5 transition-all">
                      <social.icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-grow pt-0">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="relative bg-ocean-dark text-white pt-24 pb-12 overflow-hidden">
        {/* Decorative Wave Divider */}
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] transform rotate-180">
          <svg className="relative block w-[calc(100%+1.3px)] h-[60px] fill-paper" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
          </svg>
        </div>

        {/* Background Subtle Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-ocean/5 to-ocean/10 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 relative z-10">
          {/* Main Footer Content */}
          <div className="flex flex-col items-center text-center mb-20">
            <Link to="/" className="mb-8 group block">
              <img
                src="/logo.png"
                alt="Taghazout Jet"
                className="h-28 w-auto transform transition-transform duration-500 group-hover:scale-105"
              />
            </Link>
            <p className="text-sky/60 text-lg leading-relaxed max-w-2xl mx-auto mb-10">
              Experience the unmatched thrill of the Atlantic. From high-speed jet skiing to peaceful horse rides at sunset, we provide premium water sports and land experiences in the heart of Taghazout, Morocco.
            </p>
            <div className="flex justify-center space-x-6">
              {[
                { icon: Instagram, href: 'https://instagram.com/taghazoutjet', label: 'Instagram' },
                { icon: Facebook, href: 'https://facebook.com/taghazoutjet', label: 'Facebook' },
                { icon: Twitter, href: '#', label: 'Twitter' }
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  aria-label={social.label}
                  className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 hover:border-coral transition-all duration-300 group shadow-lg"
                >
                  <social.icon className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-20 border-b border-white/5">
            {/* Explore Links */}
            <div className="space-y-8 text-center md:text-left">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-coral">Explore</h3>
              <ul className="space-y-4">
                {[
                  { name: 'Activities', path: '/activities' },
                  { name: 'Gallery', path: '/gallery' },
                  { name: 'Special Offers', path: '/blog' },
                  { name: 'Our Location', path: '/contact' }
                ].map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className="text-sky/40 hover:text-white transition-colors flex items-center justify-center md:justify-start group text-sm font-bold uppercase tracking-widest">
                      <span className="w-1.5 h-1.5 rounded-full bg-coral mr-3 opacity-0 group-hover:opacity-100 transition-all hidden md:block"></span>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Links */}
            <div className="space-y-8 text-center md:text-left">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-coral">Support</h3>
              <ul className="space-y-4">
                {[
                  { name: 'Contact Us', path: '/contact' },
                  { name: 'Privacy Policy', path: '/privacy-policy' },
                  { name: 'Terms of Use', path: '/terms-of-use' },
                  { name: 'Common FAQs', path: '/faqs' }
                ].map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className="text-sky/40 hover:text-white transition-colors flex items-center justify-center md:justify-start group text-sm font-bold uppercase tracking-widest">
                      <span className="w-1.5 h-1.5 rounded-full bg-coral mr-3 opacity-0 group-hover:opacity-100 transition-all hidden md:block"></span>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div className="md:col-span-2 lg:col-span-2 space-y-10">
              <div className="glass p-8 md:p-10 rounded-3xl border border-white/10 shadow-2xl text-center md:text-left">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-coral mb-8">Join Our Newsletter</h3>
                <p className="text-sky/60 text-sm mb-8 leading-relaxed max-w-md mx-auto md:mx-0">
                  Join our community and get the latest updates on weather conditions and exclusive seasonal offers.
                </p>
                <form className="relative group flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-sky/20 transition-colors group-focus-within:text-coral" />
                    <input
                      type="email"
                      placeholder="Email Address"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-sm text-white placeholder:text-sky/20 focus:outline-none focus:ring-2 focus:ring-coral transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-coral text-white px-8 py-4 sm:py-0 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-sun transition-all shadow-xl active:scale-95 whitespace-nowrap"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-12 flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex flex-col items-center md:items-start gap-6">
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-4">
                 <div className="px-4 py-3 bg-white/5 rounded-xl flex items-center gap-3 border border-white/10 group cursor-pointer hover:bg-white/10 transition-colors">
                    <MapPin className="w-4 h-4 text-coral" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-sky/60">Taghazout, Morocco</span>
                 </div>
                 <div className="px-4 py-3 bg-white/5 rounded-xl flex items-center gap-3 border border-white/10 group cursor-pointer hover:bg-white/10 transition-colors">
                    <Phone className="w-4 h-4 text-coral" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-sky/60">+212 600 000 000</span>
                 </div>
              </div>
              <p className="text-sky/20 text-[10px] uppercase tracking-[0.3em] font-bold text-center md:text-left">
                &copy; {new Date().getFullYear()} Taghazout Jet. Managed with excellence.
              </p>
            </div>
            
            <div className="text-right flex flex-col items-center md:items-end gap-2">
              <div className="flex items-center gap-2 text-sky/30 text-[9px] font-black uppercase tracking-[0.2em]">
                <span>Crafted by</span>
                <a 
                  href="https://abdeljabar.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-coral/60 hover:text-coral transition-all hover:tracking-[0.3em] duration-300 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5"
                >
                  Abdeljabar.com
                </a>
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
