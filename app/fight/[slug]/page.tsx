// app/fight/[...slug]/page.js

import FightPage from "../page";

export default function FightMatchupPage() {
  return <FightPage />;
}

// This ensures the page is server-side rendered rather than statically generated
export const dynamic = 'force-dynamic';