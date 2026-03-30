import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, MessageCircle, Heart, Share2, Clock, ChevronRight } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';

export const blogPosts = [
  {
    id: 'top-5-water-sports-taghazout',
    title: 'Top 5 Water Sports to Try in Taghazout, Morocco (2025 Guide)',
    excerpt: 'Looking for the best water sports in Taghazout? From jet skiing to paddleboarding, discover the top activities on Morocco\'s Atlantic coast — and book your adventure today.',
    date: 'March 30, 2026',
    author: 'Taghazout Jet Team',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100',
    category: 'Water Sports',
    image: 'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/blog%20post%20images/Top%205%20Water%20Sports%20to%20Try%20in%20Taghazout.avif',
    readTime: '5 min read',
    content: `
      <p>Taghazout has long been known as Morocco's surf capital — but what many visitors don't realise is that this small fishing village on the Atlantic coast offers so much more than waves. Whether you're travelling with family, friends, or a partner, the warm waters off Taghazout's coast are packed with exciting water sports waiting to be explored.</p>

      <p>Here are the top 5 water sports you absolutely must try on your next trip to Taghazout.</p>

      <h3>1. Jet Skiing — Pure Atlantic Thrills</h3>
      <p>There's nothing quite like the rush of riding a jet ski across the open Atlantic Ocean. Taghazout's coastline, with its mix of calm bays and dramatic cliffs, makes for a breathtaking backdrop. Whether you're a first-timer or an experienced rider, guided jet ski sessions are available for all levels. Speed along the shoreline, explore hidden coves, and feel the sea spray on your face.</p>
      <p>Most sessions last between 30 minutes and an hour, and safety equipment is always provided. Expect to see sea birds diving alongside you and, if you're lucky, a dolphin or two in the distance.</p>

      <h3>2. Boat Trips — Explore the Coast Like a Local</h3>
      <p>Renting a boat in Taghazout opens up a completely different perspective of this beautiful stretch of coastline. Cruise past the famous surf spots, discover sea caves that are only accessible from the water, and drift into secluded beaches where the crowds never reach. Sunset boat trips are particularly popular — there's nothing more magical than watching the Moroccan sun sink into the Atlantic from the deck of a boat.</p>

      <h3>3. Paddleboarding — Calm, Relaxing & Scenic</h3>
      <p>Stand-up paddleboarding (SUP) is perfect for those who prefer something a little more relaxed. Taghazout's sheltered bays offer calm, clear waters that are ideal for beginners. Glide along the surface, peer down at the sandy seabed, and enjoy panoramic views of the village and its iconic headland. It's also excellent exercise — core muscles will thank you the next day.</p>

      <h3>4. Kayaking — Coastal Exploration at Your Own Pace</h3>
      <p>Kayaking lets you explore at your own rhythm. Paddle along the rugged coastline, duck into sea caves, and stop at small beaches inaccessible by land. Taghazout's relatively calm waters between the surf breaks make it safe and enjoyable for families and solo travellers alike. Guided kayak tours often include snorkelling stops where the water is crystal clear.</p>

      <h3>5. Snorkelling — Morocco's Underwater World</h3>
      <p>The Atlantic waters around Taghazout are rich in marine life. Bright fish dart around the rocky reefs, octopus hide in crevices, and sea urchins cling to the stones below. A mask, snorkel, and fins are all you need to discover this underrated underwater world. Many boat trips include a snorkelling stop as part of the experience.</p>

      <div class="mt-8 p-6 bg-ocean/5 rounded-2xl border border-ocean/10">
        <h4 class="text-ocean font-bold mb-4 italic">Tips Before You Go</h4>
        <ul class="space-y-2 text-sm text-ocean/70">
          <li>• <strong>Book in advance</strong> during summer months (July–August) — sessions fill up fast.</li>
          <li>• <strong>Wear sunscreen</strong> — the Atlantic breeze is deceiving and burns are common.</li>
          <li>• <strong>Morning sessions</strong> offer calmer seas; afternoons can get windier.</li>
          <li>• <strong>Always use a reputable operator</strong> with safety-certified equipment.</li>
        </ul>
      </div>
    `
  },
  {
    id: 'ultimate-taghazout-travel-guide-2025',
    title: 'The Ultimate Taghazout Travel Guide (2025): Everything You Need to Know',
    excerpt: 'Planning a trip to Taghazout, Morocco? Our complete 2025 travel guide covers the best beaches, activities, where to eat, when to visit, and how to get there.',
    date: 'March 28, 2026',
    author: 'Taghazout Jet Team',
    authorAvatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100',
    category: 'Travel Guide',
    image: 'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/blog%20post%20images/The%20Ultimate%20Taghazout%20Travel%20Guide.avif',
    readTime: '8 min read',
    content: `
      <p>Nestled on Morocco's Atlantic coast, just 20 kilometres north of Agadir, Taghazout is one of North Africa's most charming beach destinations. Once a quiet fishing village, it has evolved into a laid-back surf town that attracts travellers from across Europe and beyond — yet it has somehow managed to keep its authentic character intact.</p>

      <p>Whether you're a surfer chasing swells, a couple seeking a romantic coastal escape, or a family looking for sun, sea, and adventure, Taghazout delivers. This guide covers everything you need to plan the perfect trip.</p>

      <h3>Where is Taghazout?</h3>
      <p>Taghazout sits on Morocco's Souss-Massa coast, approximately 20 km north of Agadir. The nearest airport is Agadir–Al Massira International Airport (AGA), which receives regular flights from the UK, France, Germany, and other European countries. From the airport, Taghazout is a 30–40 minute drive.</p>

      <h3>When to Go</h3>
      <p>Taghazout enjoys a warm, semi-arid climate with sunshine almost year-round. The best time for water sports and beach activities is from April to October, when sea temperatures are warmest and the weather is most reliable. Surfers tend to prefer the October–March window, when Atlantic swells are at their strongest.</p>

      <h3>Top Beaches</h3>
      <ul>
        <li><strong>Taghazout Beach:</strong> The main beach stretches south from the village headland. It's wide, sandy, and rarely overcrowded. Great for swimming and paddleboarding.</li>
        <li><strong>Anchor Point:</strong> Famous worldwide for its legendary right-hand wave, Anchor Point is also a great spot to watch surfers from the cliff above.</li>
        <li><strong>Panorama Point:</strong> A quieter beach backed by cliffs — stunning for sunset watching and excellent for snorkelling around the rocks.</li>
      </ul>

      <h3>Things to Do</h3>
      <ul>
        <li>Rent a jet ski and explore the coastline at speed.</li>
        <li>Join a sunset boat trip along the cliffs.</li>
        <li>Try stand-up paddleboarding in the calm morning waters.</li>
        <li>Explore the village souk for fresh argan oil and local crafts.</li>
        <li>Visit Paradise Valley — a stunning gorge just 40 minutes inland.</li>
        <li>Take a surf lesson with one of the many local schools.</li>
      </ul>

      <h3>Where to Eat</h3>
      <p>Taghazout's small village centre is dotted with rooftop cafés and simple restaurants serving fresh tagine, grilled fish, and Moroccan mint tea. For fresh fish, head to the small port area early in the morning — local fishermen come in with the catch of the day. Many visitors pick up fresh fruit from the roadside stalls along the coast road for a healthy beach snack.</p>

      <h3>Getting Around</h3>
      <p>Most of Taghazout is walkable — the village is compact and best explored on foot. Grand taxis run regularly between Taghazout and Agadir for a few dirhams. For exploring further afield, hiring a car or joining a day tour is recommended.</p>

      <div class="mt-8 p-6 bg-ocean/5 rounded-2xl border border-ocean/10">
        <h4 class="text-ocean font-bold mb-4">Practical Tips</h4>
        <ul class="space-y-2 text-sm text-ocean/70">
          <li>• The local currency is the <strong>Moroccan Dirham (MAD)</strong>. Cash is king in smaller shops.</li>
          <li>• <strong>Dress modestly</strong> when not on the beach — Taghazout is a Muslim village.</li>
          <li>• <strong>Book water sports ahead</strong> in July/August — slots fill up fast.</li>
          <li>• <strong>Tap water is not safe</strong> to drink — always use bottled water.</li>
        </ul>
      </div>
    `
  },
  {
    id: 'jet-ski-rental-taghazout-guide',
    title: 'Jet Ski Rental in Taghazout: Everything You Need to Know Before You Book',
    excerpt: 'Thinking about renting a jet ski in Taghazout? Find out what to expect, safety rules, best spots, and how to get the best deal on your Atlantic adventure.',
    date: 'March 25, 2026',
    author: 'Taghazout Jet Team',
    authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100',
    category: 'Jet Ski',
    image: 'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/blog%20post%20images/Jet%20Ski%20Rental%20in%20Taghazout.avif',
    readTime: '6 min read',
    content: `
      <p>Riding a jet ski along Morocco's Atlantic coast is one of those experiences that stays with you long after you've dried off. The combination of dramatic cliffs, open ocean, and warm Moroccan sunshine makes Taghazout one of the most spectacular settings in the world to get behind the handlebars of a personal watercraft.</p>

      <p>But before you book, here's everything you need to know to have the best — and safest — jet ski experience in Taghazout.</p>

      <h3>What to Expect from a Jet Ski Session</h3>
      <p>Most jet ski sessions in Taghazout last between 30 minutes and 1 hour. You'll typically launch from the beach or a small dock, and a guide will accompany first-timers to show them the ropes. Once you're comfortable, you'll cruise along the coastline, exploring areas that are inaccessible by foot or car. It's common to spot dolphins, seabirds, and even sea turtles on longer excursions.</p>

      <h3>Do I Need Experience?</h3>
      <p>Not at all. Most operators cater to complete beginners. You'll receive a short briefing on the controls, safety signals, and the route before heading out. The jet skis are automatic — no special licence is required for recreational use in Moroccan coastal waters when supervised by a certified guide.</p>

      <h3>Safety First</h3>
      <ul>
        <li><strong>Life jackets are mandatory</strong> and must be worn at all times.</li>
        <li>Always follow the guide's route and speed instructions.</li>
        <li>Stay at least 200 metres from active surf zones and swim areas.</li>
        <li>Avoid operating the jet ski if you are pregnant or have back problems.</li>
        <li>Minimum age is typically 16 years old to ride solo; younger children can ride as passengers.</li>
      </ul>

      <h3>Best Time of Day to Rent</h3>
      <p>Morning sessions (8am–11am) offer the calmest sea conditions, making them ideal for beginners and families. The Atlantic winds tend to pick up in the afternoon, which can make the ride bumpier — exciting for thrill-seekers but less comfortable for novices. Sunset sessions are also available and offer an incredibly scenic experience.</p>

      <h3>What to Wear and Bring</h3>
      <ul>
        <li>A swimsuit or wetsuit (wetsuits recommended Oct–Mar).</li>
        <li>Water shoes or sandals that can get wet.</li>
        <li><strong>Sunglasses with a strap</strong> — you will lose them otherwise.</li>
        <li>Waterproof sunscreen applied before the session.</li>
      </ul>
    `
  },
  {
    id: 'best-time-to-visit-taghazout-monthly-guide',
    title: 'Best Time to Visit Taghazout: A Month-by-Month Guide',
    excerpt: 'Not sure when to visit Taghazout? Our month-by-month guide breaks down the weather, water conditions, crowds, and best activities for every season in Morocco.',
    date: 'March 22, 2026',
    author: 'Taghazout Jet Team',
    authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100',
    category: 'Best Season',
    image: 'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/blog%20post%20images/Best%20Time%20to%20Visit%20Taghazout.avif',
    readTime: '7 min read',
    content: `
      <p>One of the great things about Taghazout is that it's a year-round destination. Unlike many beach resorts, Morocco's Atlantic coast enjoys mild temperatures even in winter — making Taghazout viable for a sunny escape in January just as much as in August. However, depending on what you're looking for, some months are definitely better than others.</p>

      <h3>Spring (March – May) — Excellent All-Round</h3>
      <p>Spring is arguably the best time to visit Taghazout. Temperatures are warm but not scorching (22–26°C), the sea is calm and inviting, and the tourist crowds haven't yet arrived. Water sports conditions are excellent — jet skiing, paddleboarding, and boat trips are all comfortable.</p>

      <h3>Summer (June – August) — Peak Season</h3>
      <p>Summer brings warm sea temperatures (around 21–23°C) and long days of sunshine. This is peak season — families and tourists flock to Taghazout in large numbers. Expect busier beaches and higher prices. Water sports are at their most popular, and booking in advance is essential.</p>

      <h3>Autumn (September – November) — Hidden Gem Season</h3>
      <p>September and October are arguably the most underrated months. The heat softens, the summer crowds thin out, and the sea is still warm from months of sunshine. October also marks the start of the surf season, meaning you'll find surfers from around the world.</p>

      <h3>Winter (December – February) — For Surfers & Budget Travellers</h3>
      <p>Winter in Taghazout is mild by European standards — temperatures rarely drop below 16–18°C during the day. The big Atlantic swells make this the prime surf season. Non-surfers will find fewer crowds and significantly lower prices on accommodation and activities.</p>

      <div class="mt-8 p-6 bg-ocean/5 rounded-2xl border border-ocean/10">
        <h4 class="text-ocean font-bold mb-4 text-center">Quick Reference</h4>
        <div class="grid grid-cols-2 gap-4 text-xs font-semibold uppercase tracking-wider">
          <div class="p-3 bg-white rounded-xl shadow-sm">Best for families:<br/><span class="text-coral">June - August</span></div>
          <div class="p-3 bg-white rounded-xl shadow-sm">Best for value:<br/><span class="text-coral">Mar - Apr, Oct - Nov</span></div>
          <div class="p-3 bg-white rounded-xl shadow-sm">Best for surfers:<br/><span class="text-coral">Oct - March</span></div>
          <div class="p-3 bg-white rounded-xl shadow-sm">Best for water sports:<br/><span class="text-coral">April - October</span></div>
        </div>
      </div>
    `
  },
  {
    id: 'beyond-surfing-7-exciting-things-to-do-taghazout',
    title: 'Beyond Surfing: 7 Exciting Things to Do in Taghazout',
    excerpt: 'Taghazout isn\'t just for surfers. Discover 7 thrilling things to do in Taghazout, Morocco — from jet skiing and boat trips to sea caves and dolphin watching.',
    date: 'March 20, 2026',
    author: 'Taghazout Jet Team',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100',
    category: 'Activities',
    image: 'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/blog%20post%20images/Beyond%20Surfing%207%20Exciting%20Things%20to%20Do%20in%20Taghazout.avif',
    readTime: '6 min read',
    content: `
      <p>Ask anyone about Taghazout and they'll mention surfing. And yes — this small Moroccan village is world-famous for its waves. But what if you're not a surfer? Or what if you want to try something different on your third or fourth visit? The good news is that Taghazout has plenty to offer beyond the surf.</p>

      <h3>1. Rent a Jet Ski on the Atlantic</h3>
      <p>Strap on a life jacket and hit the throttle. Jet skiing in Taghazout is an absolute rush — and the coastline scenery is stunning. speed along the cliffs, explore hidden coves, and feel the sea spray on your face.</p>

      <h3>2. Take a Private Boat Trip</h3>
      <p>Renting a boat for a few hours is one of the best ways to see Taghazout from a completely new angle. Cruise past the famous surf breaks and anchor in a hidden cove for a swim.</p>

      <h3>3. Paddleboard in a Calm Bay</h3>
      <p>Stand-up paddleboarding is easy to learn and deeply satisfying. The sheltered areas near the beach are perfect for beginners — calm, clear, and scenic. A great option for couples and families with older children.</p>

      <h3>4. Go Dolphin Watching</h3>
      <p>The waters off Taghazout are home to schools of common dolphins. watching dolphins leap and play in the bow waves is genuinely magical.</p>

      <h3>5. Hike to Paradise Valley</h3>
      <p>About 40 kilometres inland from Taghazout, Paradise Valley is a series of stunning natural rock pools surrounded by palm trees and dramatic cliffs.</p>

      <h3>6. Explore the Village and Local Souk</h3>
      <p>Taghazout's compact village centre is a pleasure to wander. Small shops sell argan oil, Moroccan ceramics, and local crafts.</p>

      <h3>7. Join a Snorkelling Trip</h3>
      <p>Many boat trips include a stop at a snorkelling site where the water is exceptionally clear. You'll find rocky reefs full of fish, crabs, and sea urchins.</p>
    `
  },
  {
    id: 'festivals-local-celebrations-taghazout',
    title: 'Festivals & Local Celebrations in Taghazout You Should Experience',
    excerpt: 'Discover the vibrant local festivals and cultural celebrations of Taghazout, Morocco — from Amazigh New Year and Moussem gatherings to Ramadan nights on the Atlantic coast.',
    date: 'March 18, 2026',
    author: 'Taghazout Jet Team',
    authorAvatar: 'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?auto=format&fit=crop&q=80&w=100',
    category: 'Culture & Festivals',
    image: 'https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/blog%20post%20images/Festivals%20%26%20Local%20Celebrations%20in%20Taghazout%20You%20Should%20Experience.avif',
    readTime: '9 min read',
    content: `
      <p>Taghazout is often talked about for its waves, its sunshine, and its laid-back atmosphere — but beneath the surf-town surface lies a deeply rooted Amazigh (Berber) community with a rich calendar of cultural celebrations.</p>

      <h3>Yennayer — Amazigh New Year (January)</h3>
      <p>Every year on the 13th of January, the Amazigh people of Morocco celebrate Yennayer — the Berber New Year. Families gather to share traditional dishes including a rich couscous topped with dried fruits, honey, and argan oil.</p>

      <h3>Moussem of Sidi Mohammed ou Ali (Spring)</h3>
      <p>A traditional Moroccan pilgrimage festival held at the tomb of a local saint. draws communities from across the province for spiritual devotion, traditional music, and food.</p>

      <h3>Ramadan Evenings on the Atlantic Coast</h3>
      <p>Ramadan transforms Taghazout completely after sunset. After the Iftar meal breaks the fast, families spill out onto the seafront, and a spirit of generosity pervades every interaction.</p>

      <h3>Eid Al-Fitr — The Festival of Breaking the Fast</h3>
      <p>The end of Ramadan is celebrated with Eid Al-Fitr. The morning begins with communal prayers on the seafront followed by family meals and exchange of gifts.</p>

      <div class="mt-8 p-6 bg-ocean/5 rounded-2xl border border-ocean/10">
        <h4 class="text-ocean font-bold mb-4">Tips for Visitors</h4>
        <ul class="space-y-2 text-sm text-ocean/70">
          <li>• <strong>Dress modestly</strong> when attending cultural celebrations.</li>
          <li>• <strong>Ask permission</strong> before photographing people or gatherings.</li>
          <li>• Accept food invitations graciously — it shows respect.</li>
          <li>• During Ramadan, avoid eating or drinking in public during daylight hours.</li>
        </ul>
      </div>
    `
  }
];

export default function Blog() {
  const featuredPost = blogPosts[0];
  const otherFeatured = blogPosts.slice(1, 4);
  const recentPosts = blogPosts; // Show all 6 real posts in the grid

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
