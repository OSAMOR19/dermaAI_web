'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calendar, ScanLine, User } from 'lucide-react';

const links = [
  { href: '/dashboard', label: 'Home', icon: Home },
  { href: '/booking', label: 'Booking', icon: Calendar },
  { href: '/scan', label: 'Scan', icon: ScanLine, isScan: true },
  { href: '/profile', label: 'Profile', icon: User },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bottom-nav">
      {links.map((link) => {
        const Icon = link.icon;
        const isActive = pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`bnav-item ${isActive ? 'active' : ''} ${link.isScan ? 'scan-btn' : ''}`}
          >
            <div className={`bnav-icon ${link.isScan ? 'scan-icon' : ''}`}>
              <Icon size={link.isScan ? 24 : 22} />
            </div>
            <span className="bnav-label">{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
