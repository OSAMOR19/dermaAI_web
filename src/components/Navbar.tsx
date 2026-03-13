'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/dashboard', label: 'Home' },
  { href: '/booking', label: 'Booking' },
  { href: '/scan', label: 'Scan' },
  { href: '/profile', label: 'Profile' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="navbar">
      <Link href="/" className="navbar-logo">
        DERMA<span>AI</span>
      </Link>
      <div className="navbar-links">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`navbar-link ${pathname.startsWith(link.href) ? 'active' : ''}`}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
