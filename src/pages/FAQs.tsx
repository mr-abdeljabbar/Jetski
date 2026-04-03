import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, Shield, Clock, Euro, ClipboardCheck, LifeBuoy, ChevronDown, MessageSquare } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';

export default function FAQs() {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState(0);
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const faqData = [
    {
      category: t('faq_cat_safety'),
      icon: Shield,
      items: [
        { question: t('faq_safe_q'), answer: t('faq_safe_a') },
        { question: t('faq_equipment_q'), answer: t('faq_equipment_a') },
        { question: t('faq_age_q'), answer: t('faq_age_a') },
      ]
    },
    {
      category: t('faq_cat_pricing'),
      icon: Euro,
      items: [
        { question: t('faq_duration_q'), answer: t('faq_duration_a') },
        { question: t('faq_license_q'), answer: t('faq_license_a') },
        { question: t('faq_price_q'), answer: t('faq_price_a') },
      ]
    },
    {
      category: t('faq_cat_conduct'),
      icon: ClipboardCheck,
      items: [
        { question: t('faq_rules_q'), answer: t('faq_rules_a') },
        { question: t('faq_damage_q'), answer: t('faq_damage_a') },
        { question: t('faq_cancel_q'), answer: t('faq_cancel_a') },
      ]
    }
  ];

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
        title={t('faq_title')}
        subtitle={t('faq_subtitle')}
        category={t('faq_category')}
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
              <h4 className="text-lg font-bold mb-4">{t('faq_still_questions')}</h4>
              <p className="text-white/80 text-sm mb-6 leading-relaxed">{t('faq_still_questions_body')}</p>
              <Link to="/contact">
                <Button className="w-full bg-white text-coral hover:bg-paper transition-all rounded-full py-6 text-[10px] font-bold uppercase tracking-widest shadow-soft">
                  {t('faq_contact_support')}
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
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">{t('faq_cta_title')}</h2>
            <p className="text-sky/60 text-xl mb-12 leading-relaxed">
              {t('faq_cta_body')}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/activities">
                <Button className="bg-coral text-white hover:bg-coral/90 px-12 py-8 rounded-full text-xs font-bold uppercase tracking-widest shadow-soft group transition-all">
                  {t('faq_browse')} <ChevronDown className="ml-3 w-4 h-4 -rotate-90 group-hover:translate-x-2 transition-transform" />
                </Button>
              </Link>
              <a 
                href="https://wa.me/212600000000"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 text-white hover:bg-white/20 px-12 py-8 rounded-full text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center backdrop-blur-md"
              >
                <MessageSquare className="w-4 h-4 mr-3" /> {t('faq_chat')}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
