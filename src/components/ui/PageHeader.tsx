import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  category?: string;
  icon?: LucideIcon;
  backgroundImage?: string;
}

export default function PageHeader({ 
  title, 
  subtitle, 
  category, 
  icon: Icon,
  backgroundImage = "https://images.unsplash.com/photo-1558604446-0b1d30f40212?auto=format&fit=crop&q=80&w=1920"
}: PageHeaderProps) {
  return (
    <header className="relative h-[60vh] flex items-center justify-center overflow-hidden mb-20 pt-20">
      {/* Background with requested element structure */}
      <div className="absolute inset-0 z-0">
        <img 
          src={backgroundImage} 
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-ocean/60 backdrop-blur-sm"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-paper"></div>
      </div>

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center px-6 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-xs font-bold uppercase tracking-[0.3em] mb-8"
        >
          {Icon && <Icon className="w-4 h-4 mr-4 text-sun" />}
          {category || 'Travel Memories'}
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-6xl md:text-8xl font-bold text-white tracking-tight mb-8 drop-shadow-2xl"
        >
          {title}
        </motion.h1>
        
        {subtitle && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </header>
  );
}
