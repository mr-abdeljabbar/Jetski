import { motion } from 'framer-motion';
import { FileText, AlertTriangle, ShieldCheck, Scale, HelpCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function TermsOfUse() {
  const { t } = useTranslation();
  return (
    <div className="bg-paper min-h-screen pb-32 pt-40">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold text-ocean mb-8 tracking-tight">{t('terms_title')}</h1>
          <p className="text-ocean/60 mb-16 text-lg">{t('terms_updated')}</p>

          <div className="space-y-16">
            <section>
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-sky/10 rounded-2xl flex items-center justify-center mr-6 text-ocean">
                  <FileText className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-ocean">{t('terms_agreement_title')}</h2>
              </div>
              <div className="prose prose-ocean max-w-none text-ocean/70 leading-relaxed">
                <p>{t('terms_agreement_body')}</p>
              </div>
            </section>

            <section>
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-coral/10 rounded-2xl flex items-center justify-center mr-6 text-coral">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-ocean">{t('terms_booking_title')}</h2>
              </div>
              <div className="prose prose-ocean max-w-none text-ocean/70 leading-relaxed">
                <p>{t('terms_booking_body')}</p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li><strong>{t('terms_booking_cancel')}:</strong> {t('terms_booking_cancel_desc')}</li>
                  <li><strong>{t('terms_booking_weather')}:</strong> {t('terms_booking_weather_desc')}</li>
                  <li><strong>{t('terms_booking_payment')}:</strong> {t('terms_booking_payment_desc')}</li>
                </ul>
              </div>
            </section>

            <section>
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-sun/10 rounded-2xl flex items-center justify-center mr-6 text-sunset-dark">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-ocean">{t('terms_safety_title')}</h2>
              </div>
              <div className="prose prose-ocean max-w-none text-ocean/70 leading-relaxed">
                <p>{t('terms_safety_body')}</p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li>{t('terms_safety_1')}</li>
                  <li>{t('terms_safety_2')}</li>
                  <li>{t('terms_safety_3')}</li>
                  <li>{t('terms_safety_4')}</li>
                </ul>
              </div>
            </section>

            <section>
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-sky/10 rounded-2xl flex items-center justify-center mr-6 text-ocean">
                  <Scale className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-ocean">{t('terms_liability_title')}</h2>
              </div>
              <div className="prose prose-ocean max-w-none text-ocean/70 leading-relaxed">
                <p>{t('terms_liability_body')}</p>
              </div>
            </section>

            <section>
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-sun/10 rounded-2xl flex items-center justify-center mr-6 text-sunset-dark">
                  <HelpCircle className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-ocean">{t('terms_law_title')}</h2>
              </div>
              <div className="prose prose-ocean max-w-none text-ocean/70 leading-relaxed">
                <p>{t('terms_law_body')}</p>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
