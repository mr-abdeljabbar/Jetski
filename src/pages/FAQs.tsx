import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, Shield, Clock, Euro, ClipboardCheck, LifeBuoy, ChevronDown, MessageSquare } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';

const faqData = [
  {
    category: 'Security & Safety',
    icon: Shield,
    items: [
      {
        question: 'Is it safe for beginners to rent a jet ski?',
        answer: 'Absolutely! Most of our clients are first-timers. Before every rental, our certified instructors provide a comprehensive 15-minute safety briefing and training session. We also monitor all riders from our safety boat at all times.'
      },
      {
        question: 'What equipment is provided for safety?',
        answer: 'Safety is our top priority. Every rider is provided with a professional-grade buoyancy aid (life jacket) and a safety kill-switch lanyard. For longer tours or during cooler weather, we also provide wetsuits.'
      },
      {
        question: 'What are the age requirements?',
        answer: 'To drive a jet ski solo, you must be at least 16 years old (with parental consent). Children as young as 7 can ride as passengers when accompanied by an adult. All riders must be in good physical health.'
      }
    ]
  },
  {
    category: 'Rentals & Pricing',
    icon: Euro,
    items: [
      {
        question: 'How long do the rentals last?',
        answer: 'We offer flexible durations starting from a 20-minute discovery session, 30-minute tours, and 1-hour coastal explorations. For the adventurous, we also have 2-hour "Sunset Specials" and multi-day packages.'
      },
      {
        question: 'Do I need a license to rent a jet ski?',
        answer: 'No, you do not need a nautical license! Our activities are "initiation-based" and supervised by certified instructors, which allows you to enjoy the thrill without prior certification.'
      },
      {
        question: 'What is included in the price?',
        answer: 'The price includes the jet ski rental, fuel, all safety equipment (life jacket/wetsuit), professional instruction, and insurance. There are no hidden fees or extra fuel charges.'
      }
    ]
  },
  {
    category: 'Terms & Code of Conduct',
    icon: ClipboardCheck,
    items: [
      {
        question: 'What are the main rules during the rental?',
        answer: 'Respect for other water users is paramount. You must maintain a safe distance (minimum 50m) from other jet skis, swimmers, and boats. Following instructors\' signals and staying within the designated activity zone is mandatory.'
      },
      {
        question: 'What happens if I damage the equipment?',
        answer: 'All clients must sign a waiver before departure. While minor wear and tear are expected, reckless behavior that leads to equipment damage may result in repair charges as outlined in our terms of service.'
      },
      {
        question: 'What is your cancellation policy?',
        answer: 'You can cancel or reschedule your booking free of charge up to 24 hours in advance. For cancellations within 24 hours or "no-shows," a 50% fee may apply. In case of bad weather, we offer a full refund or free rescheduling.'
      }
    ]
  }
];

export default function FAQs() {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState(0);
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggleItem = (catIdx: number, itemIdx: number) => {
    const key = `${catIdx}-${itemIdx}`;
    setOpenItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="bg-paper min-h-screen pb-32">
      <PageHeader
        title="Frequently Asked Questions"
        subtitle="Find answers to common questions about safety, pricing, and our booking terms."
        category="Support"
        icon={HelpCircle}
        backgroundImage="/public/activities page.png"
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 -mt-24 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Category Navigation */}
          <div className="lg:col-span-1 space-y-4">
            {faqData.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => setActiveCategory(idx)}
                className={`w-full flex items-center p-6 rounded-2xl transition-all duration-300 border ${
                  activeCategory === idx 
                    ? 'bg-ocean text-white border-ocean shadow-heavy translate-x-2' 
                    : 'bg-white text-ocean/60 border-ocean/5 hover:border-coral/30 hover:bg-coral/5'
                }`}
              >
                <cat.icon className={`w-5 h-5 mr-4 ${activeCategory === idx ? 'text-sun' : 'text-coral'}`} />
                <span className="font-bold text-xs uppercase tracking-widest text-left">{cat.category}</span>
              </button>
            ))}

            <div className="mt-12 p-8 bg-coral rounded-3xl text-white shadow-heavy">
              <h4 className="text-lg font-bold mb-4">Still have questions?</h4>
              <p className="text-white/80 text-sm mb-6 leading-relaxed">Our team is available daily to help you with your adventure.</p>
              <Link to="/contact">
                <Button className="w-full bg-white text-coral hover:bg-paper transition-all rounded-full py-6 text-[10px] font-bold uppercase tracking-widest shadow-soft">
                  Contact Support
                </Button>
              </Link>
            </div>
          </div>

          {/* FAQ Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="flex items-center mb-10">
                <div className="w-12 h-12 bg-sun rounded-2xl flex items-center justify-center mr-6 shadow-soft">
                  {(() => {
                    const Icon = faqData[activeCategory]?.icon;
                    return Icon ? <Icon className="w-6 h-6 text-ocean" /> : null;
                  })()}
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-ocean">{faqData[activeCategory].category}</h2>
                  <p className="text-ocean/40 text-sm font-medium">Important information for your safety and convenience</p>
                </div>
              </div>

              <div className="space-y-4">
                {faqData[activeCategory].items.map((item, i) => {
                  const isOpen = openItems[`${activeCategory}-${i}`];
                  return (
                    <div 
                      key={i}
                      className={`bg-white rounded-[2rem] border transition-all duration-500 overflow-hidden ${
                        isOpen ? 'border-coral/20 shadow-heavy ring-1 ring-coral/5' : 'border-ocean/5 shadow-soft hover:border-coral/20'
                      }`}
                    >
                      <button
                        onClick={() => toggleItem(activeCategory, i)}
                        className="w-full flex items-center justify-between p-8 text-left group"
                      >
                        <span className={`text-lg font-bold transition-colors duration-300 ${isOpen ? 'text-coral' : 'text-ocean group-hover:text-coral'}`}>
                          {item.question}
                        </span>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${isOpen ? 'bg-coral text-white rotate-180' : 'bg-paper text-ocean/40 group-hover:bg-coral/10 group-hover:text-coral'}`}>
                          <ChevronDown className="w-5 h-5" />
                        </div>
                      </button>
                      
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.5, ease: [0.04, 0.62, 0.23, 0.98] }}
                          >
                            <div className="px-8 pb-8">
                              <div className="pt-4 border-t border-ocean/5">
                                <p className="text-ocean/60 text-lg leading-relaxed">
                                  {item.answer}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <section className="mt-32 max-w-7xl mx-auto px-6 md:px-12">
        <div className="bg-ocean rounded-[4rem] p-12 md:p-20 text-center relative overflow-hidden shadow-heavy">
          <div className="absolute top-0 right-0 w-96 h-96 bg-coral/10 rounded-full -mr-48 -mt-48 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-sun/10 rounded-full -ml-48 -mb-48 blur-3xl"></div>
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <LifeBuoy className="w-16 h-16 text-coral mx-auto mb-8 animate-pulse" />
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">Ready for your adventure?</h2>
            <p className="text-sky/60 text-xl mb-12 leading-relaxed">
              Don't wait any longer. Book your jet ski session today and experience the beauty of the Moroccan coast.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/activities">
                <Button className="bg-coral text-white hover:bg-coral/90 px-12 py-8 rounded-full text-xs font-bold uppercase tracking-widest shadow-soft group transition-all">
                  Browse Activities <ChevronDown className="ml-3 w-4 h-4 -rotate-90 group-hover:translate-x-2 transition-transform" />
                </Button>
              </Link>
              <a 
                href="https://wa.me/212600000000"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 text-white hover:bg-white/20 px-12 py-8 rounded-full text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center backdrop-blur-md"
              >
                <MessageSquare className="w-4 h-4 mr-3" /> Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
