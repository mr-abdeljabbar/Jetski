import { motion } from 'framer-motion';
import { Shield, Eye, Lock, FileText, UserCheck, MessageCircle } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="bg-paper min-h-screen pb-32 pt-40">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold text-ocean mb-8 tracking-tight">Privacy Policy</h1>
          <p className="text-ocean/60 mb-16 text-lg">Last updated: March 25, 2026</p>

          <div className="space-y-16">
            <section>
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-sky/10 rounded-2xl flex items-center justify-center mr-6 text-ocean">
                  <Shield className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-ocean">Introduction</h2>
              </div>
              <div className="prose prose-ocean max-w-none text-ocean/70 leading-relaxed">
                <p>Welcome to Taghazout Jet. We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, and safeguard your data when you visit our website and use our booking services.</p>
              </div>
            </section>

            <section>
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-sun/10 rounded-2xl flex items-center justify-center mr-6 text-sunset-dark">
                  <Eye className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-ocean">Information We Collect</h2>
              </div>
              <div className="prose prose-ocean max-w-none text-ocean/70 leading-relaxed">
                <p>We collect personal information that you provide to us voluntarily when you make a booking or contact us. This includes:</p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li><strong>Contact Information:</strong> Name, WhatsApp number, and email address.</li>
                  <li><strong>Booking Details:</strong> Activity type, date, time, and number of persons.</li>
                  <li><strong>Communication:</strong> Any messages or inquiries sent through our contact form.</li>
                </ul>
              </div>
            </section>

            <section>
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-coral/10 rounded-2xl flex items-center justify-center mr-6 text-coral">
                  <Lock className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-ocean">How We Use Your Information</h2>
              </div>
              <div className="prose prose-ocean max-w-none text-ocean/70 leading-relaxed">
                <p>We use the information we collect to:</p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li>Process and manage your booking requests.</li>
                  <li>Communicate with you regarding your reservation via WhatsApp or phone.</li>
                  <li>Improve our services and customer experience.</li>
                  <li>Comply with legal obligations and safety regulations.</li>
                </ul>
              </div>
            </section>

            <section>
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-sky/10 rounded-2xl flex items-center justify-center mr-6 text-ocean">
                  <UserCheck className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-ocean">Data Sharing and Security</h2>
              </div>
              <div className="prose prose-ocean max-w-none text-ocean/70 leading-relaxed">
                <p>We do not sell or rent your personal information to third parties. Your data is stored securely in our private database and is only accessible by authorized staff to manage your bookings.</p>
                <p className="mt-4">We implement a variety of security measures to maintain the safety of your personal information when you enter, submit, or access your booking details.</p>
              </div>
            </section>

            <section>
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-sun/10 rounded-2xl flex items-center justify-center mr-6 text-sunset-dark">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-ocean">Contact Us</h2>
              </div>
              <div className="prose prose-ocean max-w-none text-ocean/70 leading-relaxed">
                <p>If you have any questions about this Privacy Policy or our data practices, please contact us at:</p>
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
