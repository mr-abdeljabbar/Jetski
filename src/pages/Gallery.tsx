import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, X, ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

const CDN_IMAGES = {
  HORSE: [
    'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/gallery/horse/horse%201.webp',
    'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/gallery/horse/horse%202.webp',
    'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/gallery/horse/horse%203.webp',
    'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/gallery/horse/horse%204.webp',
    'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/gallery/horse/horse%205.webp',
    'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/gallery/horse/horse%206.webp',
    'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/gallery/horse/horse%207.avif',
    'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/gallery/horse/horse%208.webp',
  ],
  QUAD: [
    'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/gallery/quad/quad%201.webp',
    'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/gallery/quad/quad%202.webp',
    'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/gallery/quad/quad%203.webp',
    'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/gallery/quad/quad%204.webp',
    'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/gallery/quad/quad%205.webp',
    'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/gallery/quad/quad%206.webp',
  ],
  JETSKI: [
    'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/gallery/jetski/jetski%201.webp',
    'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/gallery/jetski/jetski%202.webp',
    'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/gallery/jetski/jetski%203.avif',
    'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/gallery/jetski/jetski%204.webp',
    'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/gallery/jetski/jetski%205.webp',
    'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/gallery/jetski/jetski%206.webp',
    'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/gallery/jetski/jetski%207.webp',
    'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/gallery/jetski/jetski%208.webp',
    'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/gallery/jetski/jetski%209.webp',
  ],
  MOTOBIKE: [
    'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/gallery/motobike/motobike%201.webp',
    'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/gallery/motobike/motobike%202.webp',
    'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/gallery/motobike/motobike%203.webp',
    'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/gallery/motobike/motobike%204.webp',
    'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/gallery/motobike/motobike%205.webp',
  ],
  BIKE: [
    'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/gallery/bike/bike%201.webp',
    'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/gallery/bike/bike%202.webp',
    'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/gallery/bike/bike%203.webp',
    'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/gallery/bike/bike%204.webp',
    'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/gallery/bike/bike%205.webp',
  ],
  SCOOTER: [
    'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/gallery/scooter/scooter%201.avif',
    'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/gallery/scooter/scooter%202.avif',
  ],
  TROTTINETTE: [
    'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/gallery/trottinette/trottinette%206.avif',
    'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/gallery/trottinette/trottinette%207.avif',
  ],
  SURFBOARD: [
    'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/gallery/surfboard/surfboard%201.avif',
    'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/gallery/surfboard/surfboard%202.webp',
    'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/gallery/surfboard/surfboard%203.webp',
    'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/gallery/surfboard/surfboard%204.avif',
    'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/gallery/surfboard/surfboard%205.webp',
  ],
  PEDALO: [
    'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/gallery/pedalo/pedalo%201.webp',
    'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/gallery/pedalo/pedalo%202.webp',
    'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/gallery/pedalo/pedalo%203.webp',
  ],
  CAMEL: [
    'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/gallery/camel/camel%201.webp',
    'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/gallery/camel/camel%202.webp',
    'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/gallery/camel/camel%203.webp',
    'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/gallery/camel/camel%204.avif',
    'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/gallery/camel/camel%205.avif',
    'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/gallery/camel/camel%206.webp',
    'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/gallery/camel/camel%207.webp',
  ],
  FOOTER: 'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/gallery/jetski/facebook-moment.png'
};

const FOOTER_RELEVANT_MOMENT = CDN_IMAGES.FOOTER;

const CATEGORY_TITLES = {
  JETSKI: ['WAVE RACER', 'ATLANTIC CHARGE', 'AQUA ADRENALINE', 'JET SKI SAFARI', 'OCEAN BLOSSOM'],
  HORSE: ['SUNSET RIDE', 'BEACHSIDE CANTER', 'OCEAN SHORE GALLOP', 'EQUESTRIAN SPIRIT', 'COASTAL FREEDOM'],
  QUAD: ['DUNE CONQUERER', 'OFF-ROAD BLAST', 'DESERT EXPLORER', 'QUAD SQUAD', 'SAND SAFARI'],
  CAMEL: ['TREK THROUGH THE SANDS', 'DESERT CARAVAN', 'SAHARA JOURNEY', 'CAMEL SUNRISE', 'VINTAGE VOYAGE'],
  MOTOBIKE: ['MOTO CROSS VIBES', 'DIRT TRACK KING', 'TRAIL EXPLORER', 'MOUNTAIN GEAR', 'TWO-WHEEL THRILL'],
  BIKE: ['ECO MOUNTAIN BIKING', 'COASTAL CYCLING', 'ATLAS FOOTHILLS', 'BICYCLE ADVENTURE', 'TOWN EXPLORE'],
  SCOOTER: ['VILLAGE CRUISE', 'VESPA VIBES', 'STREET EXPLORER', 'COASTAL MOTO', 'LOCAL RHYTHM'],
  TROTTINETTE: ['E-SCOOT RIDE', 'MODERN MOBILITY', 'CALM COASTAL GLIDE', 'URBAN EXPLORE', 'FUN ON WHEELS'],
  SURFBOARD: ['RIDE THE WAVE', 'OCEAN GEAR', 'PRO SURF SETUP', 'CATCH THE SWELL', 'BLUE HORIZON'],
  PEDALO: ['FAMILY AQUA FUN', 'LAKE SIDE CRUISE', 'RELAXED DRIFT', 'PEDAL POWER', 'OCEAN FLOAT'],
};

const categories = ['ALL', 'JETSKI', 'QUAD', 'CAMEL', 'HORSE', 'MOTOBIKE', 'BIKE', 'SCOOTER', 'SURFBOARD', 'PEDALO', 'TROTTINETTE'];

export default function Gallery() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [lightbox, setLightbox] = useState<number | null>(null);

  const galleryItems = React.useMemo(() => {
    const items: any[] = [];
    const usedUrls = new Set<string>();
    let idCounter = 1;

    // Process all categories and their unique images
    Object.entries(CDN_IMAGES).forEach(([category, pool]) => {
      if (category === 'FOOTER') return;
      if (Array.isArray(pool)) {
        pool.forEach((src) => {
          // Strictly prevent repeats
          if (usedUrls.has(src)) return;
          usedUrls.add(src);

          const spans = [1, 2, 3];
          const randomSpan = spans[Math.floor(Math.random() * spans.length)];
          const titles = CATEGORY_TITLES[category as keyof typeof CATEGORY_TITLES] || ['ADVENTURE MOMENT'];
          
          items.push({
            id: idCounter.toString().padStart(2, '0'),
            src,
            category,
            span: randomSpan,
            title: titles[Math.floor(Math.random() * titles.length)],
            description: 'A curated moment of adventure from the shores.',
            date: `${Math.floor(Math.random() * 12 + 1).toString().padStart(2, '0')} / 24`
          });
          idCounter++;
        });
      }
    });

    // Shuffle the items for varied distribution on every refresh
    return items.sort(() => Math.random() - 0.5);
  }, []);

  const heroImage = React.useMemo(() => {
    const pool = CDN_IMAGES.JETSKI;
    return pool[Math.floor(Math.random() * pool.length)];
  }, []);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    
    try {
      const response = await fetch('https://formspree.io/f/xzdkenyb', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        setIsSubscribed(true);
        setEmail('');
      }
    } catch (error) {
      console.error('Newsletter submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = activeFilter === 'ALL'
    ? galleryItems
    : galleryItems.filter(item => item.category === activeFilter);

  const openLightbox = useCallback((idx: number) => setLightbox(idx), []);
  const closeLightbox = useCallback(() => setLightbox(null), []);
  const nextImage = useCallback(() => {
    if (lightbox !== null) setLightbox((lightbox + 1) % filtered.length);
  }, [lightbox, filtered.length]);
  const prevImage = useCallback(() => {
    if (lightbox !== null) setLightbox((lightbox - 1 + filtered.length) % filtered.length);
  }, [lightbox, filtered.length]);

  return (
    <div className="bg-paper min-h-screen text-ink font-sans selection:bg-coral selection:text-white">

      {/* ─── Hero Section ─── */}
      <section className="px-6 md:px-10 lg:px-16 pt-20 md:pt-36 pb-16">
        {/* Overline */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-coral">{t('gallery_overline')}</span>
        </motion.div>

        {/* Title */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-6xl sm:text-7xl md:text-[7rem] lg:text-[8.5rem] font-bold tracking-tighter leading-[0.85] flex flex-col"
          >
            <span className="uppercase">{t('gallery_title_1')}</span>
            <span className="font-serif italic lowercase text-ink/70">{t('gallery_title_2')}</span>
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-[10px] font-medium tracking-[0.25em] text-ink/35 w-full md:w-64 text-left md:text-right uppercase leading-relaxed mt-4 md:mt-0"
          >
            {t('gallery_subtitle')}
          </motion.div>
        </div>

        {/* Hero Featured Image */}
        <motion.div
          initial={{ scale: 0.97, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full aspect-[21/9] overflow-hidden mb-12 shadow-heavy cursor-pointer group"
          onClick={() => openLightbox(0)}
        >
          <img
            src={heroImage}
            alt="Featured — Sunset Jet Ski Safari"
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-[1.2s] ease-out"
          />
        </motion.div>

        {/* ─── Filter / Nav Bar ─── */}
        <div className="flex flex-col md:flex-row justify-between items-center py-6 border-y border-ink/8 mb-20 gap-8">
          <div className="flex items-center gap-1 overflow-x-auto pb-4 md:pb-0 w-full md:w-auto scrollbar-hide no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-4 py-2 text-[10px] font-bold uppercase tracking-[0.25em] transition-all duration-300 rounded-full whitespace-nowrap flex-shrink-0 ${
                  activeFilter === cat
                    ? 'bg-ink text-paper'
                    : 'text-ink/40 hover:text-ink hover:bg-ink/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-ink/25">
            {filtered.length} {filtered.length === 1 ? t('gallery_project') : t('gallery_projects')}
          </div>
        </div>

        {/* ─── Gallery Grid ─── */}
        <div
          id="archive-grid"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-10 lg:gap-12 grid-flow-dense"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((item, idx) => (
              <motion.div
                key={item.src}
                layout
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.6, delay: (idx % 4) * 0.1 }}
                className={`group cursor-pointer relative ${
                  item.span === 2 ? 'sm:col-span-2' : 
                  item.span === 3 ? 'sm:col-span-2 lg:col-span-3' : 
                  'col-span-1'
                }`}
                onClick={() => openLightbox(idx)}
              >
                <div className={`overflow-hidden relative shadow-heavy transition-all duration-700 bg-ink/5 ${
                  item.span >= 2 ? 'aspect-video' : 'aspect-square sm:aspect-auto sm:h-full min-h-[300px]'
                }`}>
                  <img
                    src={item.src}
                    alt={item.title}
                    className="w-full h-full object-cover transform scale-[1.01] group-hover:scale-105 group-hover:blur-[2px] transition-all duration-[1s] ease-out"
                  />
                  
                  {/* Glassmorphic Overlay Design */}
                  <div className="absolute inset-0 bg-ink/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden">
                    <div className="absolute inset-x-0 bottom-0 p-8 transform translate-y-10 group-hover:translate-y-0 transition-transform duration-700">
                      <div className="glass-dark border-t border-white/10 p-6 backdrop-blur-md rounded-tr-[2rem]">
                        <div className="flex justify-between items-end gap-4 overflow-hidden">
                          <div className="max-w-[70%]">
                            <motion.span className="block text-[8px] font-black uppercase tracking-[0.4em] text-coral mb-3">
                              {item.category}
                            </motion.span>
                            <h3 className="text-xl md:text-2xl font-bold uppercase tracking-tight text-white leading-none">
                              {item.title}
                            </h3>
                          </div>
                          <div className="text-right">
                             <div className="text-2xl font-serif italic text-white/50 tracking-tighter">
                               {item.date}
                             </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="mt-32 border-t border-ink/8 pt-12" id="index-section">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {galleryItems.slice(0, 6).map((item) => (
              <div 
                key={item.id} 
                onClick={() => {
                  setActiveFilter(item.category);
                  const gridEl = document.getElementById('archive-grid');
                  if (gridEl) {
                    gridEl.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="flex items-baseline gap-4 group cursor-pointer py-3 border-b border-ink/5 hover:border-coral/30 transition-colors"
              >
                <span className="text-[10px] font-bold text-ink/20 tracking-widest">{item.id}.</span>
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-ink/50 group-hover:text-coral transition-colors truncate">
                  {item.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Memories Section ─── */}
      <section className="bg-ink text-paper py-28 md:py-40 px-6 md:px-10 lg:px-16 mt-20">
        <div className="max-w-screen-xl mx-auto flex flex-col lg:flex-row justify-between items-start lg:items-center gap-16">
          <div className="max-w-2xl">
            <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.88] uppercase mb-12">
              {t('gallery_memories_1')}{' '}
              <br className="hidden sm:block" />
              {t('gallery_memories_2')}{' '}
              <span className="font-serif italic lowercase tracking-normal text-coral">{t('gallery_memories_3')}</span>
              <br />
              {t('gallery_memories_4')}
            </h2>

            <AnimatePresence mode="wait">
              {!isSubscribed ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <p className="text-[10px] font-bold uppercase tracking-[0.4em] mb-8 text-paper/30 leading-relaxed">
                    {t('gallery_newsletter_1')}<br />
                    {t('gallery_newsletter_2')}
                  </p>

                  <form
                    onSubmit={handleNewsletterSubmit}
                    className="flex items-center gap-4 border-b border-paper/15 pb-4 max-w-sm group focus-within:border-coral transition-colors duration-300"
                  >
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder={t('gallery_email_placeholder')}
                      className="bg-transparent text-paper placeholder:text-paper/15 text-sm focus:outline-none w-full"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="text-paper/30 hover:text-coral group-focus-within:text-coral transition-colors disabled:opacity-50"
                    >
                      {isSubmitting ? '...' : <ArrowRight className="w-5 h-5" />}
                    </button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="text-coral font-serif italic text-3xl">{t('gallery_thank_you')}</div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-paper/50">
                    {t('gallery_subscribed')}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="hidden lg:block w-80 aspect-[480/793] -rotate-[5deg] grayscale hover:grayscale-0 transition-all duration-700 shadow-heavy relative z-10">
            <img src={FOOTER_RELEVANT_MOMENT} className="w-full h-full object-cover" alt="Memory" />
          </div>
        </div>
      </section>


      {/* ─── Lightbox ─── */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center"
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-ink/95 backdrop-blur-xl" onClick={closeLightbox} />

            {/* Image Container */}
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="relative z-10 max-w-5xl w-full mx-6 md:mx-12"
            >
              <img
                src={filtered[lightbox].src}
                alt={filtered[lightbox].title}
                className="w-full max-h-[80vh] object-contain"
              />

              {/* Caption */}
              <div className="flex justify-between items-center mt-6 px-2">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-paper/90 mb-1">
                    {filtered[lightbox].title}
                  </h3>
                  <p className="text-[10px] text-paper/30 tracking-wider uppercase">
                    {filtered[lightbox].description}
                  </p>
                </div>
                <span className="text-2xl font-serif italic text-paper/50">
                  {filtered[lightbox].date}
                </span>
              </div>
            </motion.div>

            {/* Controls */}
            <button
              onClick={closeLightbox}
              className="absolute top-8 right-8 z-20 w-12 h-12 bg-white/5 hover:bg-coral text-paper rounded-full flex items-center justify-center transition-all"
            >
              <X className="w-5 h-5" />
            </button>
            <button
              onClick={prevImage}
              className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/5 hover:bg-white/15 text-paper rounded-full flex items-center justify-center transition-all"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/5 hover:bg-white/15 text-paper rounded-full flex items-center justify-center transition-all"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Counter */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-[0.3em] text-paper/25">
              {lightbox + 1} / {filtered.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
