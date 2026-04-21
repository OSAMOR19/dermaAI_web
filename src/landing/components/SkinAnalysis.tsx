"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Scan, ShieldCheck, Activity, Heart, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function SkinAnalysis() {
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<null | any>(null);

  const startScan = () => {
    setIsScanning(true);
    setProgress(0);
    setResult(null);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          setResult({
            hydration: "82%",
            elasticity: "Excellent",
            pigmentation: "Normal",
            diagnosis: "Your skin barrier is healthy. We noticed minor dehydration around the forehead area. Recommended treatment: Hyaluronic Acid infusion."
          });
          return 100;
        }
        return prev + 2;
      });
    }, 50);
  };

  return (
    <section id="analysis" className="py-16 lg:py-32 bg-brand-dark text-white relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-12 h-full w-full">
           {Array.from({ length: 48 }).map((_, i) => (
             <div key={i} className="border-[0.5px] border-white/20 aspect-square" />
           ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-20">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex-1 text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-pink/20 text-brand-pink mb-8 border border-brand-pink/30">
               <Sparkles className="w-4 h-4" />
               <span className="text-sm font-bold uppercase tracking-widest">Next-Gen Technology</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-serif font-bold mb-8 leading-[1.1]">
               AI-Powered Skin Analysis <br/> 
               <span className="text-brand-pink italic">Instant Clinical Diagnosis</span>
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-white/70 mb-12 leading-relaxed max-w-xl">
              Using advanced computer vision, our scanner identifies 14+ specific skin concerns in seconds. Professional medical insights at your fingertips.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-16">
               {[
                 { icon: ShieldCheck, title: "Privacy First", desc: "Encoded facial data" },
                 { icon: Activity, title: "Deep Analysis", desc: "Pores & Hydration" },
                 { icon: Scan, title: "High Precision", desc: "Medical Accuracy" },
                 { icon: Heart, title: "Personalized", desc: "Custom Care Plans" }
               ].map((item, i) => (
                 <div key={i} className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl bg-white/5 border border-white/10 group hover:bg-white/10 transition-colors">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-pink/20 rounded-xl flex items-center justify-center text-brand-pink flex-shrink-0 group-hover:scale-110 transition-transform">
                       <item.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div>
                       <h4 className="font-bold text-base sm:text-lg tracking-tight">{item.title}</h4>
                       <p className="text-white/40 text-xs sm:text-sm">{item.desc}</p>
                    </div>
                 </div>
               ))}
            </div>
            
            <Button 
               onClick={startScan}
               disabled={isScanning}
               className="bg-primary hover:bg-primary/90 text-white rounded-2xl px-10 py-5 sm:px-12 sm:py-8 text-base sm:text-lg lg:text-xl font-bold shadow-xl shadow-primary/20 disabled:opacity-50 min-w-[240px]"
            >
               {isScanning ? (
                 <span className="flex items-center gap-3">
                    <Scan className="w-6 h-6 animate-pulse" />
                    Scanning... {progress}%
                 </span>
               ) : "Start Diagnostic Scan"}
            </Button>
          </motion.div>
          
          <div className="flex-1 w-full max-w-lg lg:max-w-none">
             <div className="relative w-full aspect-square rounded-[4rem] border-8 border-white/5 overflow-hidden bg-black/20 backdrop-blur-3xl shadow-2xl">
                
                <AnimatePresence mode="wait">
                   {isScanning || result ? (
                      <motion.div 
                        key="active"
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 z-20 p-6 sm:p-12 flex flex-col items-center justify-center"
                      >
                         {isScanning && (
                           <>
                             <div className="absolute inset-0 bg-[#000] opacity-20" />
                             <motion.div 
                              initial={{ top: "0%" }}
                              animate={{ top: "100%" }}
                              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                              className="absolute left-0 right-0 h-1 bg-brand-pink shadow-[0_0_40px_rgba(227,27,93,1)] z-30"
                             />
                             <div className="relative z-40 text-center">
                                <Scan className="w-24 h-24 sm:w-32 sm:h-32 mx-auto text-brand-pink mb-8 animate-pulse" />
                                <h3 className="text-2xl sm:text-3xl font-serif font-bold">Face analysis in progress</h3>
                                <p className="text-white/60 mt-2">Please keep your face centered</p>
                             </div>
                           </>
                         )}

                         {result && !isScanning && (
                            <motion.div 
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="w-full text-center"
                            >
                               <div className="w-20 h-20 sm:w-24 sm:h-24 bg-brand-pink rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-brand-pink/20">
                                  <ShieldCheck className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                               </div>
                               <h3 className="text-3xl sm:text-4xl font-serif font-bold mb-4">Analysis Complete</h3>
                               
                               <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8">
                                  <div className="bg-white/10 p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-white/5">
                                     <p className="text-xl sm:text-3xl font-serif font-bold text-brand-pink">{result.hydration}</p>
                                     <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest mt-1">Hydration</p>
                                  </div>
                                  <div className="bg-white/10 p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-white/5">
                                     <p className="text-lg sm:text-2xl font-serif font-bold text-brand-pink text-nowrap">{result.elasticity}</p>
                                     <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest mt-1">Elastic</p>
                                  </div>
                                  <div className="bg-white/10 p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-white/5">
                                     <p className="text-lg sm:text-2xl font-serif font-bold text-brand-pink">{result.pigmentation}</p>
                                     <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest mt-1">Pigment</p>
                                  </div>
                                </div>

                               <div className="bg-brand-pink/10 p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-brand-pink/20 text-left">
                                  <p className="text-brand-pink font-bold mb-1 uppercase tracking-wide text-[10px]">Clinical Observation</p>
                                  <p className="text-lg sm:text-xl text-white/90 leading-relaxed font-serif italic">
                                     "{result.diagnosis}"
                                  </p>
                               </div>

                               <Button 
                                  variant="ghost" 
                                  className="mt-6 text-brand-pink hover:text-white font-bold"
                                  onClick={() => setResult(null)}
                                >
                                   Restart Scan
                               </Button>
                            </motion.div>
                         )}
                      </motion.div>
                   ) : (
                       <motion.div 
                        key="idle"
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 flex flex-col items-center justify-center text-center group"
                      >
                         <div className="absolute inset-0 z-0">
                            <Image 
                              src="/face1.jpg" 
                              alt="Scanner Ready" 
                              fill 
                              className="object-cover opacity-40 grayscale group-hover:grayscale-0 transition-all duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/50 to-transparent" />
                         </div>
                         
                         <div className="relative z-10 p-8 sm:p-12">
                            <div className="w-24 h-24 sm:w-32 sm:h-32 border-2 border-white/20 rounded-full flex items-center justify-center mb-6 sm:mb-8 mx-auto relative shadow-2xl">
                               <div className="absolute inset-0 border-4 border-dashed border-brand-pink/40 rounded-full animate-spin-slow" />
                               <Camera className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                            </div>
                            <h3 className="text-2xl sm:text-3xl font-serif font-bold mb-4">Scanner Ready</h3>
                            <p className="text-white/70 max-w-xs mx-auto text-base sm:text-lg leading-relaxed">
                               Position yourself in a well-lit area for the most accurate diagnostic result.
                            </p>
                         </div>
                      </motion.div>
                   )}
                </AnimatePresence>

                {/* Decorative scanning elements */}
                <div className="absolute top-6 left-6 w-10 h-10 border-t-2 border-l-2 border-brand-pink/40 rounded-tl-2xl" />
                <div className="absolute top-6 right-6 w-10 h-10 border-t-2 border-r-2 border-brand-pink/40 rounded-tr-2xl" />
                <div className="absolute bottom-6 left-6 w-10 h-10 border-b-2 border-l-2 border-brand-pink/40 rounded-bl-2xl" />
                <div className="absolute bottom-6 right-6 w-10 h-10 border-b-2 border-r-2 border-brand-pink/40 rounded-br-2xl" />
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
