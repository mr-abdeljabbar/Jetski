import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, MessageCircle, Heart, Share2, Clock, ChevronRight } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';

export const blogPosts = [
  {
    id: 'taghazout-tagine-survival-guide',
    title: 'The Taghazout Tagine Survival Guide',
    excerpt: 'Eating a 3-pound tagine after a jet ski session is an Olympic sport. Here is how to survive it without sinking.',
    date: 'March 24, 2026',
    author: 'Chief Jet Skier',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100',
    category: 'Food & Culture',
    image: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&q=80&w=1000',
    readTime: '4 min read',
    content: `
      <p>So, you've just spent two hours wrestling with the Atlantic waves on a 300-horsepower jet ski. Your arms feel like noodles, and your stomach is screaming for something more substantial than salt water. Enter: **The Taghazout Tagine**.</p>
      
      <h3>1. The Art of the Bread (The "Moroc-Spoon")</h3>
      <p>In Taghazout, we don't use forks. Forks are for people who don't want to get their hands dirty. We use bread. But be careful: using too much bread early on is a rookie mistake. It's like full-throttling a jet ski before you've cleared the harbor. Pace yourself.</p>
      
      <h3>2. The Steam Warning</h3>
      <p>When that clay lid comes off, it's like a thermal vent from the deep ocean. Don't lean in too fast unless you want a Moroccan steam facial. Wait exactly three seconds, let the aroma of cumin and saffron hit you, and then dive in.</p>
      
      <h3>3. The "Jet Ski Rule"</h3>
      <p>Never, ever go back into the water for at least an hour after a Taghazout Tagine. You will be approximately 40% more "heavy" than you were before. Trust us, your jet ski will thank you.</p>
    `
  },
  {
    id: '5-ways-to-look-like-a-pro',
    title: '5 Ways to Look Like a Jet Ski Pro',
    excerpt: 'Even if it is your first time, you do not have to look like a confused penguin. Follow these simple steps.',
    date: 'March 22, 2026',
    author: 'Captain Speed',
    authorAvatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100',
    category: 'Adventure',
    image: 'https://images.unsplash.com/photo-1517176102048-be4a8d01d67d?auto=format&fit=crop&q=80&w=1000',
    readTime: '5 min read',
    content: `...`
  },
  {
    id: 'secret-coves-of-the-atlantic',
    title: 'Secret Coves: The Explorer\'s Manual',
    excerpt: 'Tired of the main beach? We found the coves where even the seagulls don\'t go. Only accessible by water!',
    date: 'March 20, 2026',
    author: 'Sea Explorer',
    authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100',
    category: 'Travel',
    image: 'https://images.unsplash.com/photo-1506929113674-bf55866102ee?auto=format&fit=crop&q=80&w=1000',
    readTime: '6 min read',
    content: `...`
  },
  {
    id: 'perfect-sunset-jetski',
    title: 'Chasing the Perfect Taghazout Sunset',
    excerpt: 'There\'s something about the sky turning coral while you\'re jumping waves that feels like a movie. Here\'s how to capture it.',
    date: 'March 18, 2026',
    author: 'Ocean Lens',
    authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100',
    category: 'Photography',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1000',
    readTime: '3 min read',
  },
  {
    id: 'moroccan-hospitality-waves',
    title: 'Moroccan Hospitality: Tea on the Waves',
    excerpt: 'Yes, we actually managed to brew mint tea on a stationary boat. It\'s a national requirement. Here is how we did it.',
    date: 'March 15, 2026',
    author: 'Cultural Guide',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100',
    category: 'Culture',
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=1000',
    readTime: '7 min read',
  },
  {
    id: 'jetski-safety-for-families',
    title: 'The Ultimate Jet Ski Safety Guide',
    excerpt: 'Fun is only fun if everyone comes back with both flip-flops. Here is our essential safety checklist for all riders.',
    date: 'March 10, 2026',
    author: 'Safety Sam',
    authorAvatar: 'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?auto=format&fit=crop&q=80&w=100',
    category: 'Safety',
    image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&q=80&w=1000',
    readTime: '8 min read',
  }
];

export default function Blog() {
  const featuredPost = blogPosts[0];
  const otherFeatured = blogPosts.slice(1, 4);
  const recentPosts = blogPosts.slice(0, 3); // Re-use for grid demo as in image

  return (
    <div className="bg-paper min-h-screen pb-32">
      <PageHeader
        title="Atlantica Tales"
        subtitle="Exploring the secrets of the Moroccan coast, one wave at a time."
        category="Ocean Stories"
        icon={MessageCircle}
        backgroundImage="https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/bg%20pages/blog%20page.avif"
      />

      <div className="max-w-7xl mx-auto px-6">
        {/* Top Featured Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-24">
          {/* Main Featured Card */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 relative h-[500px] md:h-[600px] rounded-[3rem] overflow-hidden group shadow-heavy"
          >
            <img 
              src={featuredPost.image} 
              alt={featuredPost.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ocean/90 via-ocean/20 to-transparent" />
            
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
              <span className="inline-block bg-white/10 backdrop-blur-md text-white border border-white/20 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
                {featuredPost.category}
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                {featuredPost.title}
              </h2>
              <Link 
                to={`/blog/${featuredPost.id}`}
                className="inline-flex items-center text-white/80 hover:text-coral transition-colors text-xs font-bold uppercase tracking-[0.2em]"
              >
                Discover Story
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
          </motion.div>

          {/* Sidebar: Other featured posts */}
          <div className="flex flex-col">
            <h3 className="text-sm font-black uppercase tracking-[0.25em] text-ocean/40 mb-8 px-2">Other Featured Posts</h3>
            <div className="space-y-8 flex-1">
              {otherFeatured.map((post, idx) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * idx }}
                >
                  <Link to={`/blog/${post.id}`} className="flex items-center gap-6 group">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 shadow-soft">
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform group-hover:scale-110"
                      />
                    </div>
                    <div className="flex-1">
                      <span className="text-[9px] font-bold text-coral uppercase tracking-wider mb-1 block">{post.category}</span>
                      <h4 className="text-base font-bold text-ocean leading-tight group-hover:text-coral transition-colors line-clamp-2">
                        {post.title}
                      </h4>
                    </div>
                  </Link>
                  {idx < otherFeatured.length - 1 && (
                    <div className="h-[1px] bg-ocean/5 mt-8" />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Posts Section */}
        <div className="mb-12 flex items-end justify-between px-2">
          <div>
            <span className="text-coral text-[10px] font-black uppercase tracking-[0.3em] block mb-2">Our Journal</span>
            <h3 className="text-4xl font-black text-ocean">Recent Posts</h3>
          </div>
          <Link 
            to="/blog" 
            className="hidden md:flex items-center gap-2 bg-white border border-ocean/5 px-6 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-ocean hover:bg-ocean hover:text-white transition-all shadow-soft"
          >
            All Stories
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {recentPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-[2.5rem] overflow-hidden shadow-soft hover:shadow-heavy transition-all duration-500 group flex flex-col h-full border border-ocean/5"
            >
              <Link to={`/blog/${post.id}`} className="block relative overflow-hidden h-64 mx-4 mt-4 rounded-3xl">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/95 backdrop-blur-sm text-ocean px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest shadow-soft border border-ocean/5">
                    {post.category}
                  </span>
                </div>
              </Link>

              <div className="p-8 flex-1 flex flex-col pt-6">
                <Link to={`/blog/${post.id}`} className="block">
                  <h2 className="text-xl font-bold text-ocean mb-3 group-hover:text-coral transition-colors leading-tight">
                    {post.title}
                  </h2>
                </Link>

                <p className="text-ocean/50 text-xs font-medium leading-relaxed mb-8 line-clamp-3">
                  {post.excerpt}
                </p>

                <div className="mt-auto pt-6 border-t border-ocean/5 flex items-center justify-between">
                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <img 
                      src={post.authorAvatar} 
                      alt={post.author}
                      className="w-10 h-10 rounded-full object-cover border-2 border-paper"
                    />
                    <div>
                      <span className="block text-[11px] font-bold text-ocean">{post.author}</span>
                      <span className="block text-[9px] font-medium text-ocean/40 tracking-wider uppercase">{post.readTime}</span>
                    </div>
                  </div>
                  
                  <Link
                    to={`/blog/${post.id}`}
                    className="w-10 h-10 rounded-2xl bg-ocean/5 text-ocean flex items-center justify-center group-hover:bg-coral group-hover:text-white transition-all shadow-sm"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}
