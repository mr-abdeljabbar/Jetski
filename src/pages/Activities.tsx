import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { MapPin, Users, Search, Waves, AlertCircle, Compass, Star, ChevronDown, SlidersHorizontal, X } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import PageHeader from '../components/ui/PageHeader';
import SEOHead from '../components/SEOHead';

export default function Activities() {
  const { t } = useTranslation();
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [priceRange, setPriceRange] = useState<number>(1000);
  const [minPersons, setMinPersons] = useState<number>(0);
  const [minRating, setMinRating] = useState<number>(0);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/activities');
        if (!res.ok) throw new Error('Failed to fetch activities');
        const data = await res.json();
        if (Array.isArray(data)) {
          setActivities(data);
        } else {
          throw new Error('Received invalid data format from server');
        }
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

  const maxPriceInData = useMemo(() => {
    if (activities.length === 0) return 1000;
    return Math.max(...activities.flatMap(a => a.durations.map((d: any) => d.price)));
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

    // Filter by Price
    result = result.filter(a => {
      const minPrice = Math.min(...a.durations.map((d: any) => d.price));
      return minPrice <= priceRange;
    });

    // Filter by Max Persons
    if (minPersons > 0) {
      result = result.filter(a => a.maxPersons >= minPersons);
    }

    // Filter by Rating
    if (minRating > 0) {
      result = result.filter(a => (a.rating || 5) >= minRating);
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
      } else if (sortBy === 'rating') {
        return (b.rating || 5) - (a.rating || 5);
      }
      return 0;
    });

    return result;
  }, [activities, selectedCategory, sortBy, searchQuery, priceRange, minPersons, minRating]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSortBy('name');
    setSearchQuery('');
    setPriceRange(maxPriceInData);
    setMinPersons(0);
    setMinRating(0);
    setShowFilters(false);
  };

  return (
    <>
      <SEOHead 
        title="Activities & Experiences"
        description="Browse our wide range of water sports and coastal activities in Taghazout. From jet skiing to camel rides, find your perfect adventure."
      />
      <div className="bg-paper min-h-screen pb-32">
      <PageHeader
        title={t('activities')}
        subtitle="Experience the thrill of the Atlantic with our curated water sports and coastal adventures."
        category="Ocean Adventures"
        icon={Compass}
        backgroundImage="https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/bg%20pages/activities%20page.avif"
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
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
            {/* Improved Filter Bar */}
            <div className="bg-white p-6 md:p-8 rounded-[3rem] shadow-soft border border-ocean/5 mb-16 -mt-24 relative z-20">
              <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                <div className="relative w-full md:max-w-md">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-ocean/40" />
                  <input
                    type="text"
                    placeholder="Find your adventure..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-paper border-0 rounded-full py-5 pl-14 pr-6 text-sm focus:ring-2 focus:ring-coral transition-all shadow-inner"
                  />
                </div>
                
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className="hidden lg:block relative min-w-[200px]">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full bg-paper border-0 rounded-full py-5 pl-8 pr-12 text-[10px] font-bold uppercase tracking-widest focus:ring-2 focus:ring-coral transition-all shadow-inner appearance-none cursor-pointer"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-ocean/40 pointer-events-none" />
                  </div>
                  
                  <button 
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-3 px-8 py-5 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${showFilters ? 'bg-ocean text-white shadow-heavy' : 'bg-paper text-ocean hover:bg-ocean/5 border border-ocean/5'}`}
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    Filters
                    { (priceRange < maxPriceInData || minPersons > 0 || minRating > 0) && (
                      <span className="w-5 h-5 bg-coral text-white rounded-full flex items-center justify-center text-[10px] animate-pulse">!</span>
                    )}
                  </button>
                </div>
              </div>

              {/* Advanced Filters Panel */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-10 mt-10 border-t border-ocean/5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                      {/* Price Range */}
                      <div className="space-y-6">
                        <div className="flex justify-between items-center">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-ocean/40">Max Price: €{priceRange}</label>
                        </div>
                        <input 
                          type="range" 
                          min="0" 
                          max={maxPriceInData} 
                          value={priceRange} 
                          onChange={(e) => setPriceRange(parseInt(e.target.value))}
                          className="w-full h-1.5 bg-paper rounded-lg appearance-none cursor-pointer accent-coral"
                        />
                        <div className="flex justify-between text-[8px] font-bold text-ocean/20 uppercase tracking-widest">
                          <span>€0</span>
                          <span>€{maxPriceInData}</span>
                        </div>
                      </div>

                      {/* Group Size */}
                      <div className="space-y-6">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-ocean/40">Min Capacity</label>
                        <div className="flex items-center gap-4">
                          {[0, 2, 5, 10].map(n => (
                            <button 
                              key={n}
                              onClick={() => setMinPersons(n)}
                              className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xs font-bold transition-all ${minPersons === n ? 'bg-ocean text-white shadow-soft' : 'bg-paper text-ocean/40 hover:text-ocean'}`}
                            >
                              {n === 0 ? 'Any' : n + '+'}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Rating */}
                      <div className="space-y-6">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-ocean/40">Minimum Rating</label>
                        <div className="flex items-center gap-2">
                          {[1, 2, 3, 4, 5].map(star => (
                            <button 
                              key={star}
                              onClick={() => setMinRating(star)}
                              className="transition-transform hover:scale-125"
                            >
                              <Star className={`w-6 h-6 ${minRating >= star ? 'text-sun fill-sun' : 'text-ocean/10'}`} />
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Sort By */}
                      <div className="space-y-6">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-ocean/40">Sort By</label>
                        <div className="relative">
                          <select 
                            value={sortBy} 
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-full bg-paper border-0 rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-coral transition-all appearance-none cursor-pointer pr-12"
                          >
                            <option value="name">Alphabetical</option>
                            <option value="price-asc">Price: Low to High</option>
                            <option value="price-desc">Price: High to Low</option>
                            <option value="rating">Highest Rated</option>
                          </select>
                          <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-ocean/40 pointer-events-none" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-10 pt-8 border-t border-ocean/5 flex justify-end gap-4">
                      <Button variant="ghost" onClick={resetFilters} className="text-[10px] font-bold uppercase tracking-widest text-ocean/40 hover:text-coral">
                        Reset All
                      </Button>
                      <Button onClick={() => setShowFilters(false)} className="bg-ocean text-white rounded-full px-8 py-4 text-[10px] font-bold uppercase tracking-widest shadow-soft">
                        Apply Filters
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Active Chips */}
            <div className="flex flex-wrap gap-4 mb-16">
              {selectedCategory !== 'all' && (
                <span className="bg-coral/10 text-coral px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center shadow-sm">
                  Category: {selectedCategory}
                  <X className="w-3 h-3 ml-3 cursor-pointer" onClick={() => setSelectedCategory('all')} />
                </span>
              )}
              {minRating > 0 && (
                <span className="bg-sun/10 text-ocean px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center shadow-sm">
                  {minRating}+ Stars
                  <X className="w-3 h-3 ml-3 cursor-pointer" onClick={() => setMinRating(0)} />
                </span>
              )}
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
                    <Link to={`/activities/${activity.id}`}>
                      <Card className="group overflow-hidden rounded-[2.5rem] border-0 shadow-soft hover:shadow-heavy transition-all duration-500 bg-white h-full flex flex-col cursor-pointer">
                        <div className="h-72 overflow-hidden relative">
                          <img 
                            src={activity.images[0]?.imageUrl || 'https://images.unsplash.com/photo-1520255870062-bd79d3865de7?auto=format&fit=crop&q=80&w=1000'} 
                            alt={activity.title} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            referrerPolicy="no-referrer"
                          />
                           <div className="absolute inset-0 bg-gradient-to-t from-ocean/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                           
                           <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest text-ocean shadow-soft">
                            {activity.category}
                          </div>
                          
                          {minPrice > 0 && (
                            <div className="absolute bottom-6 left-6 bg-coral text-white px-6 py-3 rounded-2xl text-xs font-bold shadow-heavy border border-white/20">
                              From €{minPrice}
                            </div>
                          )}
                        </div>
                        <CardHeader className="pt-10 px-10">
                          <CardTitle className="text-3xl mb-4 group-hover:text-coral transition-all duration-300 tracking-tight">{activity.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="px-10 pb-10 flex-1 flex flex-col">
                          <p className="text-ocean/60 mb-10 line-clamp-2 text-sm leading-relaxed flex-1 italic">"{activity.description}"</p>
                          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-ocean/40 mb-10 border-t border-ocean/5 pt-8">
                            <div className="flex items-center"><Users className="w-4 h-4 mr-2.5 text-coral" /> Up to {activity.maxPersons}</div>
                            <div className="flex items-center"><MapPin className="w-4 h-4 mr-2.5 text-coral" /> {activity.location}</div>
                          </div>
                          <Button className="w-full bg-ocean text-white hover:bg-ocean-dark transition-all rounded-full py-8 text-xs font-bold uppercase tracking-widest shadow-heavy group">
                            Explore Experience
                          </Button>
                        </CardContent>
                      </Card>
                    </Link>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>

            {!loading && !error && filteredAndSortedActivities.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-40 bg-white rounded-[4rem] shadow-soft border border-ocean/5"
              >
                <div className="w-24 h-24 bg-paper rounded-full flex items-center justify-center mx-auto mb-10">
                  <Waves className="w-12 h-12 text-ocean/20 animate-pulse" />
                </div>
                <h3 className="text-3xl font-bold text-ocean mb-6">No matching adventures</h3>
                <p className="text-ocean/60 mb-12 max-w-sm mx-auto leading-relaxed">We couldn't find any activities matching your selected filters. Try widening your search or resetting all filters.</p>
                <Button 
                  onClick={resetFilters}
                  className="bg-coral text-white hover:bg-coral/90 rounded-full px-16 py-8 text-xs font-bold uppercase tracking-widest shadow-heavy"
                >
                  Reset All Filters
                </Button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  </>
);
}
