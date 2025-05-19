import { redirect } from "next/navigation";

export default function SearchRedirect({ searchParams }: { searchParams: { q?: string } }) {
  const q = searchParams.q;
  if (!q) redirect("/ufc-wallpaper"); // fallback
  redirect(`/ufc-wallpaper/search/${encodeURIComponent(q)}`);
}
