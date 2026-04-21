"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Play } from "lucide-react";

export default function WhyChooseUs() {
  return (
    <section className="py-16 lg:py-32 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-32">
          <div className="flex-1 relative w-full">
             <div className="relative aspect-[3/2] sm:aspect-square rounded-[2rem] sm:rounded-[4rem] overflow-hidden shadow-2xl border border-border">
                <Image 
                  src="/professional-treatment.png" 
                  alt="Clinical Treatment" 
                  fill 
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-brand-pink/10" />
             </div>
             
             {/* Dynamic Info Overlay */}
             <div className="absolute -bottom-10 -right-10 bg-white p-8 rounded-[3rem] shadow-2xl border border-border hidden sm:flex items-center gap-6 max-w-sm z-20 transition-transform hover:scale-105 duration-500">
                <div className="w-16 h-16 bg-brand-pink/10 rounded-full flex items-center justify-center">
                   <div className="w-4 h-4 bg-brand-pink rounded-full animate-ping" />
                </div>
                <div>
                   <p className="text-xs font-bold text-foreground opacity-50 uppercase">Live Session</p>
                   <p className="font-bold text-foreground">Booking Open</p>
                </div>
             </div>
          </div>
          
          <div className="flex-1 text-left">
             <div className="inline-flex items-center gap-3 px-5 py-2 bg-muted text-primary rounded-full text-sm font-extrabold uppercase tracking-widest mb-6 sm:mb-8 border border-border">
                <div className="w-2 h-2 bg-brand-pink rounded-full animate-pulse" />
                About Wholesale Beauty Hub
             </div>
             
             <h2 className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-foreground mb-6 sm:mb-10 leading-[1.1] tracking-tight">
               Your premier destination for <span className="text-brand-pink italic">beauty</span> excellence
             </h2>
             
             <p className="text-base sm:text-xl text-foreground/70 mb-10 sm:mb-12 leading-relaxed font-medium max-w-2xl">
               At Wholesale Beauty Hub, we're dedicated to helping you achieve and maintain beautiful, healthy skin. Trust us to provide exceptional care tailored to you, using the latest clinical technologies.
             </p>
             
             <div className="space-y-6 sm:space-y-8 mb-12 sm:mb-16">
                {[
                  "Global Standards in Skin Health",
                  "Wholesale Distribution & Clinical Services",
                  "Trusted by Professionals Nationwide"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 sm:gap-6 group">
                     <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-muted flex items-center justify-center text-brand-pink group-hover:bg-primary group-hover:text-white transition-all duration-300">
                        <Check className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3]" />
                     </div>
                     <span className="text-lg sm:text-2xl font-serif font-bold text-foreground tracking-tight transition-colors group-hover:text-brand-pink">{item}</span>
                  </div>
                ))}
             </div>
             
             <div className="flex flex-wrap gap-6 sm:gap-8 items-center">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 py-5 sm:px-10 sm:py-8 text-base sm:text-lg lg:text-xl font-bold group shadow-xl shadow-primary/20 transition-all">
                   Read More
                   <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </Button>
                
                <button className="flex items-center gap-4 text-base sm:text-xl font-bold text-foreground group hover:text-brand-pink transition-colors">
                   <div className="w-12 h-12 sm:w-14 sm:h-14 bg-brand-pink rounded-full flex items-center justify-center text-white shadow-lg shadow-brand-pink/30 group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-current ml-1" />
                   </div>
                   Watch Preview
                </button>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
