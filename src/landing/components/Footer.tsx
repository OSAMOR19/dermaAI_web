import Link from "next/link";
import Image from "next/image";
import { FaFacebook, FaInstagram, FaXTwitter, FaLinkedin } from "react-icons/fa6";
import { Mail, MapPin, Clock } from "lucide-react";

const infoItems = [
  {
    icon: Mail,
    title: "Contact Us",
    lines: ["info@dermal.clinic", "(123) 465 - 798"]
  },
  {
    icon: MapPin,
    title: "Our Location",
    lines: ["4517 Washington Ave. Manchester,", "Kentucky 39495"]
  },
  {
    icon: Clock,
    title: "Working Hours",
    lines: ["Monday - Friday : 9:00 am to 6:00 pm", "Saturday : 11:00 am to 5pm"]
  }
];

export default function Footer() {
  return (
    <footer className="bg-foreground text-white relative overflow-hidden">
      {/* Subtle Background Accent */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-pink/5 rounded-full blur-[100px] -mb-48 -mr-48" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        
        {/* Top Section: Info Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 py-12 border-b border-white/10">
          {infoItems.map((item, idx) => (
            <div key={idx} className="flex items-start gap-5 group">
              <div className="pt-1.5 transition-transform group-hover:scale-110 duration-300">
                <item.icon className="w-8 h-8 text-brand-pink" />
              </div>
              <div>
                <h3 className="font-serif font-bold sm:text-2xl text-white mb-2 sm:mb-3 tracking-tight">
                  {item.title}
                </h3>
                {item.lines.map((line, i) => (
                  <p key={i} className="text-white/50 font-medium text-sm sm:text-lg leading-relaxed">{line}</p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Middle Section: Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 py-16">
          <div className="lg:pr-12">
             <div className="flex items-center gap-3 mb-8">
                <div className="bg-white p-5 rounded-2xl inline-block shadow-[0_10px_30px_rgba(227,27,93,0.15)] transform -rotate-2 hover:rotate-0 transition-transform duration-300">
                   <div className="relative h-12 w-40">
                      <Image 
                         src="/wbh-logo.png" 
                         alt="Wholesale Beauty Hub" 
                         fill
                         className="object-contain"
                      />
                   </div>
                </div>
             </div>
             <p className="text-white/40 leading-relaxed font-medium text-sm sm:text-lg mb-10">
               Providing professional beauty care with the perfect blend of medical science and artistic precision.
             </p>
             <div className="flex gap-4">
                {[FaFacebook, FaInstagram, FaXTwitter, FaLinkedin].map((Icon, i) => (
                  <Link key={i} href="#" className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-pink hover:text-white hover:border-brand-pink transition-all">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Link>
                ))}
             </div>
          </div>
          
          <div>
            <h4 className="text-xl sm:text-2xl font-serif font-bold mb-6 sm:mb-10 text-brand-pink italic">Quick Links</h4>
            <ul className="space-y-4 sm:space-y-6 text-white/40 font-bold text-base sm:text-lg">
              <li><Link href="#" className="hover:text-white transition-colors flex items-center gap-2 group">
                 <span className="w-0 h-0.5 bg-brand-pink group-hover:w-4 transition-all" /> Home
              </Link></li>
              <li><Link href="#" className="hover:text-white transition-colors flex items-center gap-2 group">
                 <span className="w-0 h-0.5 bg-brand-pink group-hover:w-4 transition-all" /> About Us
              </Link></li>
              <li><Link href="#" className="hover:text-white transition-colors flex items-center gap-2 group">
                 <span className="w-0 h-0.5 bg-brand-pink group-hover:w-4 transition-all" /> Services
              </Link></li>
              <li><Link href="https://www.wbhskin.com/login" className="hover:text-white transition-colors flex items-center gap-2 group">
                 <span className="w-0 h-0.5 bg-brand-pink group-hover:w-4 transition-all" /> Login
              </Link></li>
              <li><Link href="#" className="hover:text-white transition-colors flex items-center gap-2 group">
                 <span className="w-0 h-0.5 bg-brand-pink group-hover:w-4 transition-all" /> Contact
              </Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-xl sm:text-2xl font-serif font-bold mb-6 sm:mb-10 text-brand-pink italic">Our Services</h4>
            <ul className="space-y-4 sm:space-y-6 text-white/40 font-bold text-base sm:text-lg">
              <li><Link href="#" className="hover:text-white transition-colors">Scar Revision</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Wrinkle Reduction</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Chemical Peels</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Diagnosis Imaging</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Dermabrasion</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-xl sm:text-2xl font-serif font-bold mb-6 sm:mb-10 text-brand-pink italic">Newsletter</h4>
             <p className="text-white/40 mb-8 font-medium leading-relaxed text-sm sm:text-lg">
               Join our newsletter to stay updated with latest beauty tips and clinical insights.
             </p>
             <div className="relative">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 sm:py-5 px-6 text-white text-sm sm:text-base placeholder:text-white/20 focus:outline-none focus:border-brand-pink transition-colors"
                />
                <button className="absolute right-2 top-2 bottom-2 bg-brand-pink text-white rounded-xl px-4 sm:px-6 font-bold text-sm sm:text-base hover:bg-brand-pink/90 transition-colors">
                  Join
                </button>
             </div>
          </div>
        </div>
        
        {/* Bottom Section: Legal */}
        <div className="py-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8 text-white/20 text-[10px] sm:text-sm font-bold uppercase tracking-[0.3em] text-center md:text-left">
           <p>© 2026 Wholesale Beauty Hub. All Rights Reserved.</p>
           <div className="flex gap-8 sm:gap-12">
              <Link href="#" className="hover:text-white transition-colors underline decoration-brand-pink/30 underline-offset-8">Privacy</Link>
              <Link href="#" className="hover:text-white transition-colors underline decoration-brand-pink/30 underline-offset-8">Terms</Link>
              <Link href="#" className="hover:text-white transition-colors underline decoration-brand-pink/30 underline-offset-8">Cookies</Link>
           </div>
        </div>
      </div>
    </footer>
  );
}
