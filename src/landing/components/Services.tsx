import { ArrowUpRight, Zap, Droplets, Target, Sparkles, Wind } from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  {
    title: "Scar Revision",
    icon: Zap,
    desc: "Advanced laser treatments and clinical procedures to minimize scar appearance and restore skin texture smooth for all skin types.",
    color: "brand-pink"
  },
  {
    title: "Wrinkle Reduction",
    icon: Target,
    desc: "Personalized anti-aging solutions using state-of-the-art diagnostic tools to ensure the most effective rejuvenated results.",
    color: "brand-pink"
  },
  {
    title: "Chemical Peels",
    icon: Droplets,
    desc: "Medical-grade exfoliation treatments designed to resurface skin and target deep pigmentation or uneven texture.",
    color: "brand-pink"
  }
];

export default function Services() {
  return (
    <section id="services" className="py-12 lg:py-32 relative overflow-hidden bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
         <div className="mb-12 lg:mb-24">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] mb-4 sm:mb-6">
              Our Expertise
            </div>
            
            <h2 className="text-2xl sm:text-4xl md:text-6xl font-serif font-bold text-foreground mb-6 sm:mb-8 leading-[1.2]">
               Comprehensive dermatology services <br className="hidden sm:block" /> <span className="text-brand-pink italic">for every skin need</span>
            </h2>
            
            <p className="max-w-3xl mx-auto text-sm sm:text-lg lg:text-xl text-foreground/60 leading-relaxed font-medium">
              From medical diagnostics to aesthetic enhancement, our specialized treatments are designed to empower your skin's natural brilliance.
            </p>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-14">
            {services.map((service, i) => (
              <div 
               key={i} 
               className="group relative bg-white p-6 sm:p-12 lg:p-14 rounded-[2rem] sm:rounded-[4rem] shadow-[0_20px_50px_rgba(45,26,18,0.05)] hover:shadow-[0_40px_100px_rgba(45,26,18,0.12)] transition-all duration-700 border border-primary/5 text-left overflow-hidden flex flex-col h-full"
              >
                 <div className="relative z-10 flex-grow">
                    <div className={`w-12 h-12 sm:w-20 sm:h-20 bg-muted rounded-xl sm:rounded-[2rem] flex items-center justify-center text-primary mb-6 sm:mb-10 group-hover:bg-primary group-hover:text-white transition-all duration-500 transform group-hover:rotate-12`}>
                       <service.icon className="w-6 h-6 sm:w-10 sm:h-10" />
                    </div>
                    
                    <h3 className="text-xl sm:text-3xl font-serif font-bold text-foreground mb-3 sm:mb-6">
                      {service.title}
                    </h3>
                    
                    <p className="text-foreground/60 leading-relaxed mb-8 text-sm sm:text-lg">
                      {service.desc}
                    </p>
                 </div>
                 
                 <div className="relative z-10 pt-4 sm:pt-6 border-t border-primary/5 flex items-center justify-between mt-auto">
                    <span className="text-xs font-bold uppercase tracking-widest text-primary/30 group-hover:text-primary transition-colors">Learn More</span>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-500">
                      <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                 </div>

                 {/* Subtle brand color accents */}
                 <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 h-32 bg-primary/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700" />
              </div>
            ))}
         </div>
         
         <div className="mt-12 sm:mt-24 text-center">
            <Button className="bg-primary hover:bg-primary/90 text-white rounded-full px-6 py-4 sm:px-12 sm:py-8 text-sm sm:text-xl font-bold group shadow-2xl transition-all">
               Explore All Clinical Services
               <ArrowUpRight className="ml-2 w-4 h-4 sm:w-6 sm:h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Button>
         </div>
      </div>
    </section>

  );
}
