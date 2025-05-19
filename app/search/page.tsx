import { redirect } from 'next/navigation';

export default function SearchRedirectPage({ searchParams }: { searchParams: { q?: string } }) {
  const query = searchParams.q;

  if (query) {
    // Redirect ke /search/[query]
    redirect(`/search/${encodeURIComponent(query)}`);
  }

  // Jika tidak ada query, arahkan ke halaman home atau tampilkan pesan
  redirect('/');
}
