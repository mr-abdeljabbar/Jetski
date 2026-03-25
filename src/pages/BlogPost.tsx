import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Clock, MessageCircle, Heart, Share2 } from 'lucide-react';
import { blogPosts } from './Blog';

export default function BlogPost() {
  const { id } = useParams();
  const post = blogPosts.find(p => p.id === id);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-paper">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-ocean mb-6">Story Not Found</h2>
          <Link to="/blog" className="text-coral flex items-center justify-center font-bold">
            <ArrowLeft className="mr-2 w-4 h-4" /> Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-paper min-h-screen pb-32 pt-40">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-12"
        >
          <Link to="/blog" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-ocean/40 hover:text-coral transition-colors group">
            <ArrowLeft className="mr-3 w-4 h-4 group-hover:-translate-x-2 transition-transform" />
            Back to Stories
          </Link>
        </motion.div>

        <header className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <span className="bg-coral/10 text-coral px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.2em]">
              {post.category}
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-bold text-ocean tracking-tight mb-8 leading-[1.1]"
          >
            {post.title}
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap items-center text-ocean/40 text-xs font-bold uppercase tracking-widest gap-8 border-y border-ocean/5 py-8"
          >
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              {post.date}
            </div>
            <div className="flex items-center">
              <User className="w-4 h-4 mr-2" />
              {post.author}
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              {post.readTime}
            </div>
            <div className="ml-auto flex items-center space-x-6">
              <button className="flex items-center hover:text-coral transition-colors">
                <Heart className="w-4 h-4 mr-2" /> 24
              </button>
              <button className="flex items-center hover:text-ocean transition-colors">
                <Share2 className="w-4 h-4 mr-2" /> Share
              </button>
            </div>
          </motion.div>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative rounded-[3rem] overflow-hidden shadow-heavy mb-16 h-[500px]"
        >
          <img 
            src={post.image} 
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="prose prose-ocean prose-xl max-w-none text-ocean/70 leading-[1.8] font-medium"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <footer className="mt-24 pt-12 border-t border-ocean/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-sun rounded-full flex items-center justify-center text-white font-bold text-xl">
                TJ
              </div>
              <div>
                <p className="text-xs font-bold text-ocean uppercase tracking-widest mb-1">Written by</p>
                <p className="text-lg font-bold text-ocean">{post.author}</p>
              </div>
            </div>
            <button className="bg-ocean text-white px-10 py-5 rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-ocean/90 transition-all shadow-heavy">
              Subscribe to Newsletter
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
