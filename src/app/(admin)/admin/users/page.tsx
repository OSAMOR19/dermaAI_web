import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import AdminUsersClient from './UsersClient';

export const dynamic = 'force-dynamic';

export default async function AdminUsersServerPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, email, first_name')
    .eq('id', user.id)
    .single();

  if (!profile || profile.role !== 'admin') redirect('/');

  return (
    <AdminUsersClient
      adminEmail={profile.email || user.email || ''}
      adminName={profile.first_name || ''}
    />
  );
}
