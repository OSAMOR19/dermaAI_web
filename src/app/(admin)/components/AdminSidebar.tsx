'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Activity, Settings, ScanLine, X } from 'lucide-react';

const navLinks = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/scans', label: 'Scan Viewer', icon: ScanLine },
  { href: '/admin/activity', label: 'Activity', icon: Activity },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="admin-sidebar-overlay" onClick={onClose} />}
      
      <aside className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-brand">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2><span className="brand-dot" />WBH Admin</h2>
            <button className="admin-sidebar-close" onClick={onClose}>
              <X size={18} />
            </button>
          </div>
          <p>Derma AI Control Panel</p>
        </div>

        <nav className="admin-nav">
          <div className="admin-nav-section-label">Navigation</div>
          {navLinks.map(({ href, label, icon: Icon, exact }) => {
            const isActive = exact ? pathname === href : pathname.startsWith(href);
            return (
              <Link key={href} href={href} className={`admin-nav-link ${isActive ? 'active' : ''}`} onClick={onClose}>
                <Icon size={18} className="nav-icon" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            <div className="admin-user-avatar">A</div>
            <div style={{ minWidth: 0 }}>
              <div className="admin-user-name">Administrator</div>
              <div className="admin-user-role">Super Admin</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
