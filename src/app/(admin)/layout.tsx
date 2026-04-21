import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import '../globals.css';
import './admin.css';

export const metadata = {
  title: 'Admin Dashboard — WBH Derma AI',
  description: 'Internal admin panel for Wholesale Beauty Hub Derma AI platform.',
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) { redirect('/login'); }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, email, first_name')
    .eq('id', user.id)
    .single();

  if (!profile || profile.role !== 'admin') { redirect('/'); }

  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
