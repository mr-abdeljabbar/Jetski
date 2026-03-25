import { motion } from 'framer-motion';
import { FileText, AlertTriangle, ShieldCheck, Scale, HelpCircle } from 'lucide-react';

export default function TermsOfUse() {
  return (
    <div className="bg-paper min-h-screen pb-32 pt-40">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold text-ocean mb-8 tracking-tight">Terms of Use</h1>
          <p className="text-ocean/60 mb-16 text-lg">Last updated: March 25, 2026</p>

          <div className="space-y-16">
            <section>
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-sky/10 rounded-2xl flex items-center justify-center mr-6 text-ocean">
                  <FileText className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-ocean">Agreement to Terms</h2>
              </div>
              <div className="prose prose-ocean max-w-none text-ocean/70 leading-relaxed">
                <p>By accessing our website and making a booking, you agree to be bound by these Terms of Use. If you do not agree with any part of these terms, you are prohibited from using our services.</p>
              </div>
            </section>

            <section>
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-coral/10 rounded-2xl flex items-center justify-center mr-6 text-coral">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-ocean">Booking & Cancellation</h2>
              </div>
              <div className="prose prose-ocean max-w-none text-ocean/70 leading-relaxed">
                <p>All bookings made through the website are considered "requests" until confirmed by Taghazout Jet via WhatsApp or phone.</p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li><strong>Cancellations:</strong> Please notify us at least 24 hours in advance if you need to cancel or reschedule.</li>
                  <li><strong>Weather Conditions:</strong> We reserve the right to cancel or reschedule any activity due to unsafe weather or sea conditions.</li>
                  <li><strong>Payments:</strong> Payment terms will be discussed during the confirmation process.</li>
                </ul>
              </div>
            </section>

            <section>
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-sun/10 rounded-2xl flex items-center justify-center mr-6 text-sunset-dark">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-ocean">Safety & Conduct</h2>
              </div>
              <div className="prose prose-ocean max-w-none text-ocean/70 leading-relaxed">
                <p>Your safety is our priority. By participating in our activities, you agree to:</p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li>Follow all safety instructions provided by our certified instructors.</li>
                  <li>Wear provided safety equipment (life jackets, etc.) at all times.</li>
                  <li>Refrain from using our equipment under the influence of alcohol or drugs.</li>
                  <li>Accept full responsibility for any damage caused to equipment through negligence.</li>
                </ul>
              </div>
            </section>

            <section>
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-sky/10 rounded-2xl flex items-center justify-center mr-6 text-ocean">
                  <Scale className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-ocean">Liability</h2>
              </div>
              <div className="prose prose-ocean max-w-none text-ocean/70 leading-relaxed">
                <p>Taghazout Jet and its staff are not liable for any personal injury, loss, or damage to personal property sustained during activities, except where such liability cannot be excluded under Moroccan law. Participants engage in water sports at their own risk.</p>
              </div>
            </section>

            <section>
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-sun/10 rounded-2xl flex items-center justify-center mr-6 text-sunset-dark">
                  <HelpCircle className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-ocean">Governing Law</h2>
              </div>
              <div className="prose prose-ocean max-w-none text-ocean/70 leading-relaxed">
                <p>These terms are governed by and construed in accordance with the laws of the Kingdom of Morocco. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in Agadir, Morocco.</p>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
