import { motion } from 'framer-motion';
import { Shield, Eye, Lock, FileText, UserCheck, MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function PrivacyPolicy() {
  const { t } = useTranslation();
  return (
    <div className="bg-paper min-h-screen pb-32 pt-40">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold text-ocean mb-8 tracking-tight">{t('privacy_title')}</h1>
          <p className="text-ocean/60 mb-16 text-lg">{t('privacy_updated')}</p>

          <div className="space-y-16">
            <section>
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-sky/10 rounded-2xl flex items-center justify-center mr-6 text-ocean">
                  <Shield className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-ocean">{t('privacy_intro_title')}</h2>
              </div>
              <div className="prose prose-ocean max-w-none text-ocean/70 leading-relaxed">
                <p>{t('privacy_intro_body')}</p>
              </div>
            </section>

            <section>
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-sun/10 rounded-2xl flex items-center justify-center mr-6 text-sunset-dark">
                  <Eye className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-ocean">{t('privacy_collect_title')}</h2>
              </div>
              <div className="prose prose-ocean max-w-none text-ocean/70 leading-relaxed">
                <p>{t('privacy_collect_body')}</p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li><strong>{t('privacy_collect_contact')}:</strong> {t('privacy_collect_contact_desc')}</li>
                  <li><strong>{t('privacy_collect_booking')}:</strong> {t('privacy_collect_booking_desc')}</li>
                  <li><strong>{t('privacy_collect_comm')}:</strong> {t('privacy_collect_comm_desc')}</li>
                </ul>
              </div>
            </section>

            <section>
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-coral/10 rounded-2xl flex items-center justify-center mr-6 text-coral">
                  <Lock className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-ocean">{t('privacy_use_title')}</h2>
              </div>
              <div className="prose prose-ocean max-w-none text-ocean/70 leading-relaxed">
                <p>{t('privacy_use_body')}</p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li>{t('privacy_use_1')}</li>
                  <li>{t('privacy_use_2')}</li>
                  <li>{t('privacy_use_3')}</li>
                  <li>{t('privacy_use_4')}</li>
                </ul>
              </div>
            </section>

            <section>
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-sky/10 rounded-2xl flex items-center justify-center mr-6 text-ocean">
                  <UserCheck className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-ocean">{t('privacy_security_title')}</h2>
              </div>
              <div className="prose prose-ocean max-w-none text-ocean/70 leading-relaxed">
                <p>{t('privacy_security_body_1')}</p>
                <p className="mt-4">{t('privacy_security_body_2')}</p>
              </div>
            </section>

            <section>
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-sun/10 rounded-2xl flex items-center justify-center mr-6 text-sunset-dark">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-ocean">{t('privacy_contact_title')}</h2>
              </div>
              <div className="prose prose-ocean max-w-none text-ocean/70 leading-relaxed">
                <p>{t('privacy_contact_body')}</p>
                <p className="mt-4 font-bold">Taghazout Jet</p>
                <p>Taghazout Beach, Agadir, Morocco</p>
                <p>WhatsApp: +212 600 000 000</p>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
