import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, MessageCircle, Heart, Share2 } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';

export const blogPosts = [
  {
    id: 'taghazout-tagine-survival-guide',
    title: 'The Taghazout Tagine Survival Guide',
    excerpt: 'Eating a 3-pound tagine after a jet ski session is an Olympic sport. Here is how to survive it without sinking.',
    date: 'March 24, 2026',
    author: 'Chief Jet Skier',
    category: 'Food & Culture',
    image: '/images/blog/blog_tagine_funny_1774464717623.png',
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
    excerpt: 'Even if it is your first time, you do not have to look like a confused penguin. Follow these simple (and funny) steps.',
    date: 'March 22, 2026',
    author: 'Captain Speed',
    category: 'Tips',
    image: '/images/blog/blog_jetski_tips_1774464735948.png',
    readTime: '5 min read',
    content: `
      <p>We see you. You're standing on the dock, wondering if you're supposed to sit or stand, and if you'll actually fly off the back like a cartoon character. Don't worry, we've got you.</p>
      
      <h3>1. The "Cool Lean"</h3>
      <p>When you turn, don't just turn the handlebars. Lean your whole body like you're in a Moto-GP race. It does 10% for the steering and 90% for the "wow" factor from the people on the beach.</p>
      
      <h3>2. Sunglasses Management</h3>
      <p>If you lose your sunglasses in the first five minutes, you're officially a tourist. If you keep them on through a 50mph wake jump? You're a legend. Bring a strap, or prepare to donate to the Atlantic Sunglasses Collection.</p>
      
      <h3>3. The Hair Flip</h3>
      <p>When you come back to shore, take off your helmet/life jacket and do a slow-motion hair flip. Even if your hair is a salty mess, the confidence is what sells it.</p>
    `
  },
  {
    id: 'secret-coves-of-the-atlantic',
    title: 'Secret Coves: The Explorer\'s Manual',
    excerpt: 'Tired of the main beach? We found the coves where even the seagulls don\'t go. Only accessible by water!',
    date: 'March 20, 2026',
    author: 'Sea Explorer',
    category: 'Travel',
    image: '/images/blog/blog_hidden_beach_1774464751966.png',
    readTime: '6 min read',
    content: `
      <p>Taghazout is famous for Anchor Point, but have you seen the "Blue Lagoon of the North"? Hint: No, because there's no road to it. This is why we have jet skis.</p>
      
      <h3>Discovery #1: The Golden Cave</h3>
      <p>About 15km north of our base, there's a cliffside that looks like nothing. But wait for low tide, and a secret sandy entrance appears. It's the perfect spot for a private picnic—just don't forget the mint tea.</p>
      
      <h3>Discovery #2: The Dolphin Playground</h3>
      <p>If you head straight out toward the horizon for about 10 minutes, there's a deep-water trench where the local dolphins love to race. They are faster than you. Don't feel bad about it.</p>
    `
  }
];

export default function Blog() {
  return (
    <div className="bg-paper min-h-screen pb-32">
      <PageHeader
        title="Ocean Stories"
        subtitle="Funny insights, secret locations, and the best Moroccan food tips from the people who live on the waves."
        category="The Atlantic Chronicles"
        icon={MessageCircle}
        // backgroundImage="https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=1920"
        backgroundImage="https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/bg%20pages/blog%20page.avif"
      />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {blogPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-[2.5rem] overflow-hidden shadow-soft hover:shadow-heavy transition-all duration-500 group flex flex-col h-full"
            >
              <Link to={`/blog/${post.id}`} className="block relative overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-72 object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-6 left-6">
                  <span className="bg-white/90 backdrop-blur-sm text-ocean px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-soft">
                    {post.category}
                  </span>
                </div>
              </Link>

              <div className="p-10 flex-1 flex flex-col">
                <div className="flex items-center text-ocean/40 text-[10px] font-bold uppercase tracking-widest mb-4 space-x-6">
                  <div className="flex items-center">
                    <Calendar className="w-3 h-3 mr-2" />
                    {post.date}
                  </div>
                  <div className="flex items-center">
                    <User className="w-3 h-3 mr-2" />
                    {post.author}
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-ocean mb-4 group-hover:text-coral transition-colors flex-1">
                  <Link to={`/blog/${post.id}`}>{post.title}</Link>
                </h2>

                <p className="text-ocean/60 text-sm leading-relaxed mb-8">
                  {post.excerpt}
                </p>

                <div className="pt-8 border-t border-ocean/5 flex items-center justify-between">
                  <Link
                    to={`/blog/${post.id}`}
                    className="flex items-center text-xs font-bold uppercase tracking-widest text-ocean hover:text-coral transition-colors"
                  >
                    Read Story
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                  <div className="flex space-x-4 text-ocean/20">
                    <Heart className="w-4 h-4 hover:text-coral transition-colors cursor-pointer" />
                    <Share2 className="w-4 h-4 hover:text-ocean transition-colors cursor-pointer" />
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}
