interface AdminTopbarProps {
  title: string;
  subtitle?: string;
  adminEmail: string;
}

export default function AdminTopbar({ title, subtitle, adminEmail }: AdminTopbarProps) {
  return (
    <header className="admin-topbar">
      <div className="admin-topbar-left">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      <div className="admin-topbar-right">
        <div className="admin-badge">
          <span className="admin-badge-dot" />
          Admin Portal
        </div>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
          {adminEmail}
        </span>
      </div>
    </header>
  );
}
