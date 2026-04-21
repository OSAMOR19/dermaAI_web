"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, LogIn } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative pt-24 pb-16 lg:pt-48 lg:pb-32 overflow-hidden bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex-1 text-left"
          >
            <Badge className="bg-brand-pink/10 text-brand-pink border-brand-pink/20 mb-6 px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-bold tracking-wider uppercase">
              Beauty Specialists Hub
            </Badge>
            <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-foreground leading-[1.1] mb-6 sm:mb-8">
              Excellence in <span className="italic text-brand-pink">premium skin</span> care treatments
            </h1>
            <p className="text-base sm:text-xl md:text-2xl text-foreground/70 max-w-2xl mb-8 sm:mb-12 leading-relaxed font-medium">
              Transform your skin at Wholesale Beauty Hub. Our AI-powered analysis and clinical expertise bring out your natural brilliance.
            </p>
            <div className="flex flex-row items-center gap-3 sm:gap-4 mb-12 sm:mb-16">
               <Link href="https://www.wbhskin.com/login">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-full px-5 py-4 sm:px-12 sm:py-8 text-sm sm:text-lg lg:text-xl font-bold group shadow-xl shadow-primary/20 transition-all">
                   Login
                   <LogIn className="ml-1 sm:ml-2 w-4 h-4 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" />
                 </Button>
               </Link>
              <Button size="lg" variant="outline" className="border-2 border-foreground text-foreground hover:bg-foreground hover:text-white rounded-full px-5 py-4 sm:px-12 sm:py-8 text-sm sm:text-lg lg:text-xl font-bold transition-all">
                Shop Wholesale
              </Button>
            </div>
            
            <div className="flex flex-wrap items-center gap-6 sm:gap-8 pt-8 border-t border-border">
               <div className="flex -space-x-3 sm:-space-x-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 sm:w-14 sm:h-14 rounded-full border-2 sm:border-4 border-background overflow-hidden relative bg-muted grayscale hover:grayscale-0 transition-all duration-500 shadow-xl">
                        <Image 
                          src={`/avatar-${i}.png`} 
                          alt={`Happy Patient ${i}`} 
                          fill 
                          className="object-cover"
                        />
                    </div>
                  ))}
                  <div className="w-8 h-8 sm:w-14 sm:h-14 rounded-full border-2 sm:border-4 border-background bg-brand-pink flex items-center justify-center text-white font-bold text-[8px] sm:text-sm z-10 shadow-lg">
                    +2k
                  </div>
               </div>
               <div>
                  <div className="flex items-center gap-1 text-brand-pink mb-0.5 sm:mb-1">
                    {[1, 2, 3, 4, 5].map((i) => <Star key={i} className="w-3 h-3 sm:w-5 sm:h-5 fill-current" />)}
                    <span className="ml-1.5 text-foreground font-bold text-sm sm:text-lg">5.0</span>
                  </div>
                  <p className="text-[10px] sm:text-base font-semibold text-foreground/60 leading-tight">Trusted by 10,000+ happy patients</p>
               </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="flex-1 relative w-full"
          >
            <div className="relative w-full aspect-[4/3] sm:aspect-[4/5] rounded-[2rem] sm:rounded-[4rem] overflow-hidden shadow-[0_40px_80px_-15px_rgba(227,27,93,0.2)] border border-border">
               <Image 
                src="/pimple-lady.jpg" 
                alt="Expert Skin Treatment" 
                fill 
                className="object-cover hover:scale-105 transition-transform duration-1000"
                priority
               />
               <div className="absolute inset-0 bg-gradient-to-t from-brand-pink/10 via-transparent to-transparent" />
            </div>
            
            {/* Animated Floating Badge - Optimized for Mobile */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-4 -left-2 sm:-bottom-12 sm:-left-12 bg-white p-3 sm:p-8 rounded-[1.2rem] sm:rounded-[2.5rem] shadow-2xl border border-border max-w-[170px] sm:max-w-[280px] z-20"
            >
               <div className="flex items-center gap-2 sm:gap-4 mb-2 sm:mb-5">
                  <div className="w-8 sm:w-14 h-8 sm:h-14 bg-brand-pink rounded-lg sm:rounded-2xl flex items-center justify-center text-white shadow-lg shadow-brand-pink/20">
                    <Star className="w-4 sm:w-7 h-4 sm:h-7 fill-current" />
                  </div>
                  <div>
                    <p className="text-[7px] sm:text-xs text-foreground/50 font-bold uppercase tracking-widest leading-none mb-1">Client Review</p>
                    <p className="font-serif font-bold text-foreground text-xs sm:text-xl leading-none">Top Rated Clinic</p>
                  </div>
               </div>
               <p className="text-foreground/70 italic text-[10px] sm:text-lg leading-snug sm:leading-relaxed">
                 "I am beyond thrilled with the results of my clinical skin treatment."
               </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      {/* Background Shapes */}
      <div className="absolute top-0 right-0 w-[45%] h-screen bg-brand-pink -z-0 rounded-l-[20rem] opacity-[0.03] hidden lg:block pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-brand-pink/5 rounded-full blur-3xl -z-0 pointer-events-none" />
    </section>
  );
}
