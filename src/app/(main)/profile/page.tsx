import Link from 'next/link';
import { User, Settings, Bell, Shield, HelpCircle, LogOut, ChevronRight, CreditCard, FileText } from 'lucide-react';

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
      { icon: LogOut, label: 'Sign Out', href: '/login', danger: true },
    ],
  },
];

export default function ProfilePage() {
  return (
    <div className="profile-page">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-avatar-lg">
          <span style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--primary)' }}>U</span>
        </div>
        <div>
          <div className="profile-name">Your Profile</div>
          <div className="profile-email">Manage your account settings</div>
        </div>
      </div>

      {/* Menu Sections */}
      {menuSections.map((section) => (
        <div key={section.title} className="profile-section">
          <h2>{section.title}</h2>
          {section.items.map((item) => (
            <Link key={item.label} href={item.href} className="profile-item">
              <div className="profile-item-left">
                <item.icon size={20} className="profile-item-icon" style={('danger' in item && item.danger) ? { color: 'var(--phone-red)' } : {}} />
                <span className="profile-item-label" style={('danger' in item && item.danger) ? { color: 'var(--phone-red)' } : {}}>{item.label}</span>
              </div>
              <ChevronRight size={18} className="profile-item-chevron" />
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
}
