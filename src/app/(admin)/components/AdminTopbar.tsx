'use client';

import { Menu } from 'lucide-react';

interface AdminTopbarProps {
  title: string;
  subtitle?: string;
  onMenuToggle: () => void;
}

export default function AdminTopbar({ title, subtitle, onMenuToggle }: AdminTopbarProps) {
  return (
    <header className="admin-topbar">
      <div className="admin-topbar-left">
        <button className="admin-menu-btn" onClick={onMenuToggle}>
          <Menu size={20} />
        </button>
        <div>
          <h1>{title}</h1>
          {subtitle && <p>{subtitle}</p>}
        </div>
      </div>
      <div className="admin-topbar-right">
        <div className="admin-badge">
          <span className="admin-badge-dot" />
          Admin Portal
        </div>
      </div>
    </header>
  );
}
