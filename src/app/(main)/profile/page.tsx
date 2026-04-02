'use client';

import Link from 'next/link';
import { User, Settings, Bell, Shield, HelpCircle, LogOut, ChevronRight, CreditCard, FileText } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';

const menuSections = [
  {
    title: 'Account',
    items: [
      { icon: User, label: 'Edit Profile', href: '/profile/edit-profile' },
      { icon: CreditCard, label: 'Payment Methods', href: '/profile/payment-methods' },
      { icon: Bell, label: 'Notifications', href: '/profile/notifications' },
    ],
  },
  {
    title: 'Preferences',
    items: [
      { icon: Settings, label: 'App Settings', href: '/profile/app-settings' },
      { icon: Shield, label: 'Privacy & Security', href: '/profile/privacy-security' },
      { icon: FileText, label: 'Scan History', href: '/profile/scan-history' },
    ],
  },
  {
    title: 'Support',
    items: [
      { icon: HelpCircle, label: 'Help Center', href: '/profile/help-center' },
    ],
  },
];

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const firstName = user?.user_metadata?.first_name || '';
  const lastName = user?.user_metadata?.last_name || '';
  const displayName = firstName ? `${firstName} ${lastName}`.trim() : 'Your Profile';
  const initials = firstName ? `${firstName[0]}${lastName?.[0] || ''}`.toUpperCase() : 'U';
  const displayEmail = user?.email || 'Manage your account settings';

  return (
    <div className="profile-page">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-avatar-lg">
          <span style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--primary)' }}>{initials}</span>
        </div>
        <div>
          <div className="profile-name">{displayName}</div>
          <div className="profile-email">{displayEmail}</div>
        </div>
      </div>

      {/* Menu Sections */}
      {menuSections.map((section) => (
        <div key={section.title} className="profile-section">
          <h2>{section.title}</h2>
          {section.items.map((item) => (
            <Link key={item.label} href={item.href} className="profile-item">
              <div className="profile-item-left">
                <item.icon size={20} className="profile-item-icon" />
                <span className="profile-item-label">{item.label}</span>
              </div>
              <ChevronRight size={18} className="profile-item-chevron" />
            </Link>
          ))}
        </div>
      ))}

      {/* Sign Out */}
      <div className="profile-section">
        <button
          onClick={signOut}
          className="profile-item"
          style={{ width: '100%', textAlign: 'left', cursor: 'pointer' }}
        >
          <div className="profile-item-left">
            <LogOut size={20} className="profile-item-icon" style={{ color: 'var(--phone-red)' }} />
            <span className="profile-item-label" style={{ color: 'var(--phone-red)' }}>Sign Out</span>
          </div>
          <ChevronRight size={18} className="profile-item-chevron" />
        </button>
      </div>
    </div>
  );
}

