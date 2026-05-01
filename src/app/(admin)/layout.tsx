import '../globals.css';
import './admin.css';

export const metadata = {
  title: 'Admin Dashboard — WBH Derma AI',
  description: 'Internal admin panel for Wholesale Beauty Hub Derma AI platform.',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
