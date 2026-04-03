import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, X, Clock } from 'lucide-react';

interface RecentBooking {
  activityTitle: string;
  persons: number;
  createdAt: string; // ISO string
}

const ACTIVITY_EMOJIS: Record<string, string> = {
  'jetski': '🏄',
  'horse': '🐴',
  'camel': '🐪',
  'surfboard': '🏊',
  'quad': '🏕️',
  'bike': '🚴',
  'scooter': '🛵',
  'pedalo': '⛵',
  'trottinette': '🛴',
  'motobike': '🏍️',
};

function getEmoji(activityTitle: string): string {
  const lower = activityTitle.toLowerCase();
  for (const [key, emoji] of Object.entries(ACTIVITY_EMOJIS)) {
    if (lower.includes(key)) return emoji;
  }
  return '✨';
}

function formatTimeAgo(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return 'recently';
}

// SHOW_DURATION: how long the popup stays visible (ms)
const SHOW_DURATION = 5000;
// Fixed pause between popups (ms)
const PAUSE_DURATION = 60_000;
const INITIAL_DELAY = 60_000;

export default function BookingPopup() {
  const [queue, setQueue] = useState<RecentBooking[]>([]);
  const [current, setCurrent] = useState<RecentBooking | null>(null);
  const [visible, setVisible] = useState(false);
  const [queueIndex, setQueueIndex] = useState(0);

  // Fetch recent confirmed bookings
  useEffect(() => {
    fetch('/api/bookings/recent-public')
      .then(r => r.ok ? r.json() : [])
      .then((data: RecentBooking[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setQueue(data);
        }
      })
      .catch(() => { });
  }, []);

  useEffect(() => {
    if (queue.length === 0) return;

    let showTimer: ReturnType<typeof setTimeout>;
    let hideTimer: ReturnType<typeof setTimeout>;

    const scheduleNext = (delay: number) => {
      showTimer = setTimeout(() => {
        const booking = queue[queueIndex % queue.length];
        setCurrent(booking);
        setVisible(true);
        setQueueIndex(i => i + 1);

        hideTimer = setTimeout(() => {
          setVisible(false);
          // Schedule the next popup after exactly 1 minute
          scheduleNext(PAUSE_DURATION);
        }, SHOW_DURATION);
      }, delay);
    };

    // First popup: show after 1 minute
    scheduleNext(INITIAL_DELAY);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [queue, queueIndex]);

  const dismiss = () => setVisible(false);

  if (!current) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          className="fixed bottom-6 left-4 sm:left-6 z-[200] max-w-[320px] w-[calc(100vw-2rem)]"
        >
          <div className="bg-white rounded-2xl shadow-2xl border border-ocean/8 overflow-hidden">
            {/* Progress bar */}
            <motion.div
              className="h-[3px] bg-coral origin-left"
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: SHOW_DURATION / 1000, ease: 'linear' }}
            />

            <div className="p-4 flex items-start gap-3">
              {/* Activity emoji bubble */}
              <div className="w-11 h-11 rounded-xl bg-ocean/5 flex items-center justify-center text-xl shrink-0">
                {getEmoji(current.activityTitle)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />
                  <span className="text-[10px] font-black uppercase tracking-wider text-green-600">
                    New Booking
                  </span>
                </div>
                <p className="text-sm font-bold text-ocean leading-snug">
                  Someone just booked <span className="text-coral">{current.activityTitle}</span>
                </p>
                <p className="text-xs text-ocean/50 font-medium mt-0.5">
                  {current.persons} {current.persons === 1 ? 'person' : 'people'}
                </p>
                <div className="flex items-center gap-1 mt-2 text-ocean/30">
                  <Clock className="w-3 h-3" />
                  <span className="text-[10px] font-bold">
                    {formatTimeAgo(current.createdAt)}
                  </span>
                </div>
              </div>

              {/* Close button */}
              <button
                onClick={dismiss}
                className="text-ocean/20 hover:text-ocean/50 transition-colors p-1 -mr-1 -mt-1 shrink-0"
                aria-label="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
