import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { MapPin, Users, Filter, ArrowUpDown, Search, Waves, AlertCircle } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function Activities() {
  const { t } = useTranslation();
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/activities');
        if (!res.ok) throw new Error('Failed to fetch activities');
        const data = await res.json();
        setActivities(data);
      } catch (err) {
        console.error(err);
        setError('Could not load activities. Please try again later.');
        toast.error('Connection error: Unable to load activities.');
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const categories = useMemo(() => {
    const cats = activities.map(a => a.category);
    return ['all', ...new Set(cats)];
  }, [activities]);

  const filteredAndSortedActivities = useMemo(() => {
    let result = [...activities];

    // Search
    if (searchQuery) {
      result = result.filter(a => 
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter(a => a.category === selectedCategory);
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'name') {
        return a.title.localeCompare(b.title);
      } else if (sortBy === 'price-asc') {
        const minA = Math.min(...a.durations.map((d: any) => d.price));
        const minB = Math.min(...b.durations.map((d: any) => d.price));
        return minA - minB;
      } else if (sortBy === 'price-desc') {
        const minA = Math.min(...a.durations.map((d: any) => d.price));
        const minB = Math.min(...b.durations.map((d: any) => d.price));
        return minB - minA;
      }
      return 0;
    });

    return result;
  }, [activities, selectedCategory, sortBy, searchQuery]);

  return (
    <div className="bg-paper min-h-screen pb-32">
      {/* Header */}
      <section className="relative h-[45vh] flex items-center justify-center overflow-hidden mb-24">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=1920" 
            alt="Ocean Activities" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-ocean/60 backdrop-blur-sm"></div>
        </div>
        <div className="relative z-10 text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
              {t('activities')}
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto font-light">
              Experience the thrill of the Atlantic with our curated water sports and coastal adventures.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-coral border-t-transparent rounded-full mb-8"
            />
            <p className="text-ocean/40 font-bold uppercase tracking-widest text-[10px]">Loading Adventures...</p>
          </div>
        ) : error ? (
          <div className="text-center py-40 bg-white rounded-[3rem] shadow-soft border border-ocean/5">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-8">
              <AlertCircle className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-ocean mb-4">Something went wrong</h3>
            <p className="text-ocean/60 mb-10 max-w-md mx-auto">{error}</p>
            <Button 
              onClick={() => window.location.reload()}
              className="bg-ocean text-white hover:bg-ocean-dark rounded-full px-12 py-6 text-xs font-bold uppercase tracking-widest shadow-soft"
            >
              Try Again
            </Button>
          </div>
        ) : (
          <>
            {/* Filters & Search */}
        <div className="bg-white p-10 md:p-12 rounded-[3rem] shadow-soft border border-ocean/5 mb-24 -mt-32 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-4">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-ocean/40 mb-3 ml-2">Search Activities</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ocean/40" />
                <input 
                  type="text"
                  placeholder="Search by name or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-paper border-0 rounded-2xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-coral transition-all"
                />
              </div>
            </div>

            <div className="lg:col-span-4">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-ocean/40 mb-3 ml-2">Filter by Category</label>
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
                      selectedCategory === cat 
                        ? 'bg-coral text-white shadow-soft scale-105' 
                        : 'bg-paper text-ocean/60 hover:bg-ocean/5'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-4">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-ocean/40 mb-3 ml-2">Sort By</label>
              <div className="flex items-center gap-2 bg-paper rounded-2xl p-1">
                <button 
                  onClick={() => setSortBy('name')}
                  className={`flex-1 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${sortBy === 'name' ? 'bg-white text-ocean shadow-soft' : 'text-ocean/40 hover:text-ocean'}`}
                >
                  Name
                </button>
                <button 
                  onClick={() => setSortBy('price-asc')}
                  className={`flex-1 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${sortBy === 'price-asc' ? 'bg-white text-ocean shadow-soft' : 'text-ocean/40 hover:text-ocean'}`}
                >
                  Price ↑
                </button>
                <button 
                  onClick={() => setSortBy('price-desc')}
                  className={`flex-1 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${sortBy === 'price-desc' ? 'bg-white text-ocean shadow-soft' : 'text-ocean/40 hover:text-ocean'}`}
                >
                  Price ↓
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Activities Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
        >
          <AnimatePresence mode="popLayout">
            {filteredAndSortedActivities.map((activity) => {
              const minPrice = activity.durations?.length > 0 
                ? Math.min(...activity.durations.map((d: any) => d.price)) 
                : 0;

              return (
                <motion.div
                  layout
                  key={activity.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                >
                  <Card className="group overflow-hidden rounded-[2rem] border-0 shadow-soft hover:shadow-heavy transition-all duration-500 bg-white h-full flex flex-col">
                    <div className="h-72 overflow-hidden relative">
                      <img 
                        src={activity.images[0]?.imageUrl || 'https://images.unsplash.com/photo-1520255870062-bd79d3865de7?auto=format&fit=crop&q=80&w=1000'} 
                        alt={activity.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ocean/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="absolute top-6 right-6 glass px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest text-ocean">
                        {activity.category}
                      </div>
                      {minPrice > 0 && (
                        <div className="absolute bottom-6 left-6 bg-coral text-white px-5 py-2 rounded-full text-xs font-bold shadow-heavy">
                          From €{minPrice}
                        </div>
                      )}
                    </div>
                    <CardHeader className="pt-8 px-8">
                      <CardTitle className="text-2xl mb-4 group-hover:text-coral transition-colors">{activity.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="px-8 pb-8 flex-1 flex flex-col">
                      <p className="text-ocean/60 mb-8 line-clamp-2 text-sm leading-relaxed flex-1">{activity.description}</p>
                      <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-ocean/40 mb-8 border-t border-ocean/5 pt-6">
                        <div className="flex items-center"><Users className="w-4 h-4 mr-2 text-coral" /> {activity.maxPersons} Persons</div>
                        <div className="flex items-center"><MapPin className="w-4 h-4 mr-2 text-coral" /> {activity.location}</div>
                      </div>
                      <Link to={`/activities/${activity.id}`}>
                        <Button className="w-full bg-ocean text-white hover:bg-ocean-dark transition-all rounded-full py-6 text-xs font-bold uppercase tracking-widest shadow-soft">
                          Explore Experience
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {!loading && !error && filteredAndSortedActivities.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-32 bg-white rounded-[3rem] shadow-soft border border-ocean/5"
          >
            <div className="w-20 h-20 bg-paper rounded-full flex items-center justify-center mx-auto mb-8">
              <Waves className="w-10 h-10 text-ocean/20" />
            </div>
            <h3 className="text-2xl font-bold text-ocean mb-4">No activities found</h3>
            <p className="text-ocean/60 mb-10 max-w-md mx-auto">We couldn't find any activities matching your current filters. Try adjusting your search or category.</p>
            <Button 
              onClick={() => { setSelectedCategory('all'); setSortBy('name'); setSearchQuery(''); }}
              className="bg-coral text-white hover:bg-coral/90 rounded-full px-12 py-6 text-xs font-bold uppercase tracking-widest shadow-soft"
            >
              Reset All Filters
            </Button>
          </motion.div>
        )}
          </>
        )}
      </div>
    </div>
  );
}
