import AdminPage from '@/app/admin/page';

export default function Home() {
  if (typeof window !== 'undefined') {
    localStorage.getdata('data');
  }

  return (
    <main>
      <AdminPage />
    </main>
  );
}
