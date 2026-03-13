import { User, Settings, Bell, Shield, HelpCircle, LogOut, ChevronRight, CreditCard, FileText } from 'lucide-react';

export default function ProfilePage() {
  const menuSections = [
    {
      title: 'Account',
      items: [
        { icon: User, label: 'Edit Profile' },
        { icon: CreditCard, label: 'Payment Methods' },
        { icon: Bell, label: 'Notifications' },
      ],
    },
    {
      title: 'Preferences',
      items: [
        { icon: Settings, label: 'App Settings' },
        { icon: Shield, label: 'Privacy & Security' },
        { icon: FileText, label: 'Scan History' },
      ],
    },
    {
      title: 'Support',
      items: [
        { icon: HelpCircle, label: 'Help Center' },
        { icon: LogOut, label: 'Sign Out', danger: true },
      ],
    },
  ];

  return (
    <div className="profile-page">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-avatar-lg">
          <img src="/images/DP.svg" alt="Tina" />
        </div>
        <div>
          <div className="profile-name">Tina Anderson</div>
          <div className="profile-email">tina.anderson@email.com</div>
        </div>
      </div>

      {/* Menu Sections */}
      {menuSections.map((section) => (
        <div key={section.title} className="profile-section">
          <h2>{section.title}</h2>
          {section.items.map((item) => (
            <div key={item.label} className="profile-item">
              <div className="profile-item-left">
                <item.icon size={20} className="profile-item-icon" style={('danger' in item && item.danger) ? { color: 'var(--phone-red)' } : {}} />
                <span className="profile-item-label" style={('danger' in item && item.danger) ? { color: 'var(--phone-red)' } : {}}>{item.label}</span>
              </div>
              <ChevronRight size={18} className="profile-item-chevron" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
