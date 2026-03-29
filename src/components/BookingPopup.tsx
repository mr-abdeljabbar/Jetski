import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, X, Clock } from 'lucide-react';

// Rotating visitor first names to feel realistic
const VISITOR_NAMES = [
  'Sarah', 'Mohammed', 'Emma', 'Youssef', 'Chloe', 'Karim',
  'Lucas', 'Fatima', 'James', 'Amira', 'Lena', 'Omar',
  'Sofia', 'Adam', 'Marie', 'Hassan', 'Julia', 'Amine',
  'Nina', 'David', 'Valeria', 'Nour', 'Tom', 'Layla',
];

// Visitor origins for social proof
const COUNTRIES = [
  '🇫🇷 France', '🇬🇧 UK', '🇩🇪 Germany', '🇳🇱 Netherlands',
  '🇪🇸 Spain', '🇮🇹 Italy', '🇲🇦 Morocco', '🇨🇦 Canada',
  '🇺🇸 USA', '🇸🇪 Sweden', '🇵🇱 Poland', '🇧🇪 Belgium',
];

// Approximate "time ago" strings
const TIME_AGO = [
  'just now', '2 min ago', '5 min ago', '8 min ago',
  '12 min ago', '15 min ago', '20 min ago', '30 min ago',
];

interface Notification {
  name: string;
  country: string;
  activity: string;
  emoji: string;
  timeAgo: string;
}

const ACTIVITY_EMOJIS: Record<string, string> = {
  'jetski': '🏄',
  'jet ski': '🏄',
  'horse': '🐴',
  'camel': '🐪',
  'surf': '🏊',
  'quad': '🏕️',
  'bike': '🚴',
  'scooter': '🛵',
  'pedalo': '⛵',
  'trottinette': '🛴',
  'moto': '🏍️',
};

function getEmoji(activityTitle: string): string {
  const lower = activityTitle.toLowerCase();
  for (const [key, emoji] of Object.entries(ACTIVITY_EMOJIS)) {
    if (lower.includes(key)) return emoji;
  }
  return '🌊';
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// SHOW_DURATION: how long the popup stays visible (ms)
const SHOW_DURATION = 5000;
// MIN/MAX pause between popups (ms)
const MIN_PAUSE = 60_000;
const MAX_PAUSE = 120_000;

export default function BookingPopup() {
  const [activities, setActivities] = useState<string[]>([]);
  const [current, setCurrent] = useState<Notification | null>(null);
  const [visible, setVisible] = useState(false);

  // Fetch activity titles once
  useEffect(() => {
    fetch('/api/activities')
      .then(r => r.json())
      .then((data: { title: string }[]) => {
        if (Array.isArray(data)) {
          setActivities(data.map((a: { title: string }) => a.title).filter((t): t is string => Boolean(t)));
        }
      })
      .catch(() => {});
  }, []);

  const generateNotification = useCallback((): Notification => {
    const activityList = activities.length > 0 ? activities : [
      'Jetski rentals', 'Horse riding', 'Camels Riding',
      'Quad biking', 'Surfboard rentals', 'Scooter rentals',
    ];
    const activity = pick(activityList);
    return {
      name: pick(VISITOR_NAMES),
      country: pick(COUNTRIES),
      activity,
      emoji: getEmoji(activity),
      timeAgo: pick(TIME_AGO),
    };
  }, [activities]);

  useEffect(() => {
    if (activities.length === 0) return; // wait for activities to load

    let showTimer: ReturnType<typeof setTimeout>;
    let hideTimer: ReturnType<typeof setTimeout>;

    const scheduleNext = (delay: number) => {
      showTimer = setTimeout(() => {
        setCurrent(generateNotification());
        setVisible(true);

        hideTimer = setTimeout(() => {
          setVisible(false);
          // Schedule the next popup after a random pause
          const pause = MIN_PAUSE + Math.random() * (MAX_PAUSE - MIN_PAUSE);
          scheduleNext(pause);
        }, SHOW_DURATION);
      }, delay);
    };

    // First popup: show after 8 seconds
    scheduleNext(8_000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [activities, generateNotification]);

  const dismiss = () => setVisible(false);

  return (
    <AnimatePresence>
      {visible && current && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          className="fixed bottom-6 left-4 sm:left-6 z-[200] max-w-[320px] w-[calc(100vw-2rem)] sm:w-[320px]"
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
                {current.emoji}
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
                  <span className="text-coral">{current.name}</span> from{' '}
                  <span>{current.country}</span>
                </p>
                <p className="text-xs text-ocean/50 font-medium mt-0.5 truncate">
                  booked <span className="text-ocean/70 font-semibold">{current.activity}</span>
                </p>
                <div className="flex items-center gap-1 mt-2 text-ocean/30">
                  <Clock className="w-3 h-3" />
                  <span className="text-[10px] font-bold">{current.timeAgo}</span>
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
