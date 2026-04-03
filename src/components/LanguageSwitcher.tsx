import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Check } from 'lucide-react';

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧', short: 'EN' },
  { code: 'fr', label: 'Français', flag: '🇫🇷', short: 'FR' },
  { code: 'es', label: 'Español', flag: '🇪🇸', short: 'ES' },
] as const;

type LangCode = typeof LANGUAGES[number]['code'];

interface Props {
  variant?: 'dropdown' | 'pills';
  className?: string;
}

export default function LanguageSwitcher({ variant = 'dropdown', className = '' }: Props) {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = LANGUAGES.find(l => l.code === i18n.language) ?? LANGUAGES[0];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const change = (code: LangCode) => {
    i18n.changeLanguage(code);
    setOpen(false);
  };

  if (variant === 'pills') {
    return (
      <div className={`flex flex-wrap gap-3 ${className}`}>
        {LANGUAGES.map(lang => (
          <button
            key={lang.code}
            onClick={() => change(lang.code)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold 
              uppercase tracking-wider border transition-all duration-200
              ${i18n.language === lang.code
                ? 'bg-ocean text-white border-ocean shadow-soft'
                : 'bg-white text-ocean border-ocean/10 hover:border-ocean/40 hover:bg-ocean/5'
              }
            `}
          >
            <span className="text-base leading-none">{lang.flag}</span>
            <span>{lang.short}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        onClick={() => setOpen(v => !v)}
        className="
          flex items-center gap-2 text-[13px] font-semibold uppercase tracking-wider 
          text-ocean/80 hover:text-coral transition-colors duration-200 focus:outline-none
        "
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <Globe className="w-4 h-4 shrink-0" />
        <span className="text-base leading-none">{current.flag}</span>
        <span>{current.short}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="listbox"
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="
              absolute right-0 mt-3 w-48 bg-white/95 backdrop-blur-md 
              rounded-2xl shadow-heavy border border-ocean/8 py-2 z-50 overflow-hidden
            "
          >
            {LANGUAGES.map(lang => (
              <button
                key={lang.code}
                role="option"
                aria-selected={i18n.language === lang.code}
                onClick={() => change(lang.code)}
                className={`
                  flex items-center justify-between w-full px-5 py-3 
                  text-sm font-semibold transition-colors duration-150
                  ${i18n.language === lang.code
                    ? 'bg-ocean/5 text-coral'
                    : 'text-ocean hover:bg-ocean/5 hover:text-coral'
                  }
                `}
              >
                <span className="flex items-center gap-3">
                  <span className="text-lg leading-none">{lang.flag}</span>
                  <span className="tracking-wide">{lang.label}</span>
                </span>
                {i18n.language === lang.code && (
                  <Check className="w-4 h-4 text-coral shrink-0" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
