'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Users, Activity, Settings, LogOut } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const navLinks = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/activity', label: 'Activity', icon: Activity },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

interface AdminSidebarProps {
  adminName: string;
  adminEmail: string;
}

export default function AdminSidebar({ adminName, adminEmail }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const initial = adminName ? adminName[0].toUpperCase() : adminEmail?.[0]?.toUpperCase() || 'A';

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-brand">
        <h2><span className="brand-dot" />WBH Admin</h2>
        <p>Derma AI Control Panel</p>
      </div>

      <nav className="admin-nav">
        <div className="admin-nav-section-label">Navigation</div>
        {navLinks.map(({ href, label, icon: Icon, exact }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link key={href} href={href} className={`admin-nav-link ${isActive ? 'active' : ''}`}>
              <Icon size={18} className="nav-icon" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="admin-sidebar-footer">
        <div className="admin-user-info">
          <div className="admin-user-avatar">{initial}</div>
          <div style={{ minWidth: 0 }}>
            <div className="admin-user-name">{adminName || adminEmail}</div>
            <div className="admin-user-role">Administrator</div>
          </div>
        </div>
        <button className="admin-sign-out-btn" onClick={handleSignOut}>
          <LogOut size={14} /> Sign Out
        </button>
      </div>
    </aside>
  );
}
