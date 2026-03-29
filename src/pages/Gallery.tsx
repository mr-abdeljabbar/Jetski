import { motion } from 'framer-motion';
import { Camera, Maximize2, X } from 'lucide-react';
import { useState } from 'react';
import PageHeader from '../components/ui/PageHeader';

const images = [
  {
    id: 1,
    src: '/images/gallery/jetski_gallery_1_1774464036778.png',
    title: 'Sunset Safari',
    category: 'Adventure',
    size: 'large'
  },
  {
    id: 2,
    src: '/images/gallery/jetski_gallery_2_1774464052667.png',
    title: 'Precision Wakes',
    category: 'Technical',
    size: 'medium'
  },
  {
    id: 3,
    src: '/images/gallery/jetski_gallery_3_1774464068393.png',
    title: 'Ocean Smiles',
    category: 'Lifestyle',
    size: 'small'
  },
  {
    id: 4,
    src: '/images/gallery/jetski_gallery_4_1774464082647.png',
    title: 'Pristine Parking',
    category: 'Equipment',
    size: 'medium'
  },
  {
    id: 5,
    src: '/images/gallery/jetski_gallery_5_1774464098296.png',
    title: 'Surf Support',
    category: 'Action',
    size: 'large'
  },
  {
    id: 6,
    src: '/images/gallery/jetski_gallery_6_1774464115497.png',
    title: 'Golden Bay',
    category: 'View',
    size: 'medium'
  }
];

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<any>(null);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="bg-paper min-h-screen pb-32">
      <PageHeader
        title="Ocean Gallery"
        subtitle="Explore breathtaking moments from our jet ski safaris, ocean adventures, and the stunning Taghazout coastline."
        category="Visual Impressions"
        icon={Camera}
        // backgroundImage="/images/gallery/jetski_gallery_6_1774464115497.png"
        backgroundImage="https://pub-3589da5c0f2c4adcaf01ef132ec9c853.r2.dev/bg%20pages/gallery%20page.avif"
      />

      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8"
        >
          {images.map((img) => (
            <motion.div
              key={img.id}
              variants={item}
              className="relative group cursor-pointer overflow-hidden rounded-[2.5rem] shadow-soft hover:shadow-heavy transition-all duration-500"
              onClick={() => setSelectedImage(img)}
            >
              <img
                src={img.src}
                alt={img.title}
                className="w-full h-auto object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ocean/80 via-ocean/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-10">
                <div className="mb-2">
                  <span className="text-[10px] font-bold text-coral uppercase tracking-widest">{img.category}</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{img.title}</h3>
                <div className="flex items-center text-white/60 text-xs font-medium uppercase tracking-[0.2em]">
                  <Maximize2 className="w-4 h-4 mr-2" />
                  View Larger
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Lightbox / Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-ocean/95 backdrop-blur-md"
            onClick={() => setSelectedImage(null)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative max-w-5xl w-full max-h-full overflow-hidden rounded-[3rem] shadow-heavy"
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-8 right-8 w-12 h-12 bg-white/10 hover:bg-coral text-white rounded-full flex items-center justify-center transition-all z-10"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={selectedImage.src}
              alt={selectedImage.title}
              className="w-full h-auto max-h-[85vh] object-contain bg-white/5"
            />
            <div className="bg-white p-10 md:p-12">
              <span className="text-xs font-bold text-coral uppercase tracking-widest mb-4 block">{selectedImage.category}</span>
              <h2 className="text-4xl font-bold text-ocean">{selectedImage.title}</h2>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
