'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calendar, ScanLine, ShoppingBag, User } from 'lucide-react';

const WBH_STORE_URL = 'https://wholesalebeautyhub.co.uk/';

const links = [
  { href: '/dashboard', icon: Home, external: false },
  { href: '/booking', icon: Calendar, external: false },
  { href: '/scan', icon: ScanLine, external: false },
  { href: WBH_STORE_URL, icon: ShoppingBag, external: true },
  { href: '/profile', icon: User, external: false },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bottom-nav">
      {links.map((link) => {
        const Icon = link.icon;
        const isActive = !link.external && pathname.startsWith(link.href);
        
        if (link.external) {
          return (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="bnav-item"
            >
              <div className="bnav-icon">
                <Icon size={22} />
              </div>
            </a>
          );
        }

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

