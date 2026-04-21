import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import UserDetailClient from './UserDetailClient';

export const dynamic = 'force-dynamic';

export default async function UserDetailPage() {
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
    <UserDetailClient
      adminEmail={profile.email || user.email || ''}
      adminName={profile.first_name || ''}
    />
  );
}
