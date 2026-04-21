"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const images = [
  { src: "/face.jpg", alt: "Clinical Result 1", span: "row-span-2" },
  { src: "/beauty-product.png", alt: "Luxury Product", span: "row-span-1" },
  { src: "/face1.jpg", alt: "Clinical Result 2", span: "row-span-2" },
  { src: "/skincare-routine.png", alt: "Routine", span: "row-span-1" },
  { src: "/treatment.png", alt: "Professional Treatment", span: "row-span-1" },
  { src: "/beauty-product.png", alt: "Clinical Serum", span: "row-span-1" },
];

export default function ImageGallery() {
  return (
    <section className="py-12 lg:py-32 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-12 lg:mb-24">
           <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] mb-4 sm:mb-6">
              Visual Excellence
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-6xl font-serif font-bold text-foreground mb-6 leading-[1.2]">
               Clinical art & <span className="text-brand-pink italic">results</span>
            </h2>
            <p className="max-w-2xl mx-auto text-sm sm:text-lg lg:text-xl text-foreground/60 leading-relaxed font-medium">
              A glimpse into our world of professional skincare, from clinical treatments to luxury wholesale products.
            </p>
         </div>

         <div className="columns-1 md:columns-2 lg:columns-3 gap-4 sm:gap-8 space-y-4 sm:space-y-8">
            {images.map((img, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="relative group rounded-[1.5rem] sm:rounded-[3rem] overflow-hidden shadow-xl border border-white"
              >
                 <div className="relative aspect-[3/4] sm:aspect-[4/5] bg-muted">
                    <Image 
                      src={img.src} 
                      alt={img.alt} 
                      fill 
                      className="object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                       <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10">
                          <p className="text-[10px] sm:text-xs text-brand-pink font-bold uppercase tracking-widest mb-1 sm:mb-2 italic">WBH Clinical</p>
                          <h4 className="text-white font-serif font-bold text-lg sm:text-2xl">{img.alt}</h4>
                       </div>
                    </div>
                 </div>
              </motion.div>
            ))}
         </div>
      </div>
    </section>
  );
}
