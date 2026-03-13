'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calendar, ScanLine, User } from 'lucide-react';

const links = [
  { href: '/dashboard', icon: Home },
  { href: '/booking', icon: Calendar },
  { href: '/scan', icon: ScanLine },
  { href: '/profile', icon: User },
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
            className={`bnav-item ${isActive ? 'active' : ''}`}
          >
            <div className="bnav-icon">
              <Icon size={22} />
            </div>
          </Link>
        );
      })}
    </nav>
  );
}
