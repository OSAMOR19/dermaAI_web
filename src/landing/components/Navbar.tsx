"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Menu, LogIn, X } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { name: "Home", href: "#" },
  { name: "About Us", href: "#" },
  { name: "Services", href: "#" },
  { name: "Blog", href: "#" },
  { name: "Contact", href: "#" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 md:px-8 py-4",
        isScrolled ? "bg-background/90 backdrop-blur-xl border-b py-3 shadow-sm" : "bg-transparent py-5"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group z-50">
          <div className="relative h-10 w-40">
             <Image 
                src="/wbh-logo.png" 
                alt="Wholesale Beauty Hub" 
                fill
                className="object-contain"
                priority
             />
          </div>
        </Link>
        
        {/* Desktop Links - Increased size to text-base */}
        <div className="hidden lg:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href} 
              className="text-base font-bold text-foreground/80 hover:text-primary transition-colors relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-pink transition-all group-hover:w-full" />
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4 z-50">
          <Link href="https://www.wbhskin.com/login">
            <Button 
              className="hidden sm:flex bg-primary hover:bg-primary/90 text-white rounded-full px-8 py-6 text-base font-semibold group shadow-lg shadow-primary/10 transition-all"
            >
              Login
              <LogIn className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden text-foreground hover:bg-transparent"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-0 left-0 right-0 h-screen bg-background border-b z-40 lg:hidden flex flex-col p-8 pt-24"
          >
            <div className="flex flex-col gap-8">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link 
                    href={link.href} 
                    className="text-4xl font-serif font-bold text-foreground hover:text-brand-pink transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="mt-auto py-10 border-t">
              <Link href="https://www.wbhskin.com/login" className="flex">
                <Button className="bg-primary text-white rounded-xl py-4 px-6 text-sm font-bold shadow-lg hover:bg-primary/90 transition-all">
                  Login
                  <LogIn className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <p className="text-left mt-8 text-foreground/40 font-medium tracking-widest text-[10px] uppercase">
                Wholesale Beauty Hub
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
