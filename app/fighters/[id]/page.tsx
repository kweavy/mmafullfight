import { Metadata, ResolvingMetadata } from 'next';
import { Suspense } from 'react';
import FighterDetailClient from './FighterDetailClient';

interface Params {
  params: {
    id: string;
  };
}

// Generate metadata for SEO
export async function generateMetadata(
  { params }: Params,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = params.id;
  
  // Fetch fighter data
  let fighter = null;
  try {
    const response = await fetch(`https://api.octagon-api.com/fighters`);
    const data = await response.json();
    fighter = data[id];
  } catch (error) {
    console.error('Error fetching fighter for metadata:', error);
  }

  // Fallback metadata if fighter not found
  if (!fighter) {
    return {
      title: 'Fighter Not Found | UFC Fighters',
      description: 'This fighter profile could not be found.',
    };
  }

  // Clean fighter name and validate required properties
  const fighterName = fighter.name ? fighter.name.trim() : 'Unknown Fighter';
  const status = fighter.status ? fighter.status.toLowerCase() : 'active';
  const category = fighter.category || 'UFC';
  const wins = fighter.wins || '0';
  const losses = fighter.losses || '0';
  const draws = fighter.draws || '0';
  const height = fighter.height ? `${Math.floor(Number(fighter.height) / 12)}'${Number(fighter.height) % 12}"` : 'N/A';
  const weight = fighter.weight ? `${fighter.weight} lbs` : 'N/A';
  
  // Create structured data for rich results
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: fighterName,
    image: fighter.imgUrl || '',
    description: `${fighterName} is a UFC fighter in the ${category} with a record of ${wins}-${losses}-${draws}.`,
    affiliation: {
      '@type': 'SportsOrganization',
      name: 'UFC',
    },
    height: height,
    weight: weight,
  };

  return {
    title: `${fighterName} | UFC Fighter Profile`,
    description: `${fighterName} is a ${status} UFC fighter in the ${category} with a professional record of ${wins}-${losses}-${draws}. View profile and fight videos.`,
    openGraph: {
      title: `${fighterName} - UFC Fighter Profile`,
      description: `Check out ${fighterName}'s UFC profile, record, stats, and watch fight videos.`,
      type: 'profile',
      images: fighter.imgUrl ? [fighter.imgUrl] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${fighterName} | UFC Fighter`,
      description: `${fighterName} (${wins}-${losses}-${draws}) - ${category} fighter in the UFC.`,
      images: fighter.imgUrl ? [fighter.imgUrl] : [],
    },
    alternates: {
      canonical: `/fighters/${id}`,
    },
    keywords: [fighterName, 'UFC', 'MMA', category, 'fighter profile', 'fight videos'],
    other: {
      'og:site_name': 'UFC Fighters Database',
    },
    // Add the JSON-LD structured data
  };
}

// Generate static paths at build time
export async function generateStaticParams() {
  try {
    const response = await fetch('https://api.octagon-api.com/fighters');
    const fighters = await response.json();
    
    // Return an array of objects with the id parameter
    return Object.keys(fighters).map(id => ({
      id
    }));
  } catch (error) {
    console.error('Error generating static paths:', error);
    return [];
  }
}

export default function FighterPage({ params }: Params) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#141414] pt-20 flex justify-center items-center">
      <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
    </div>}>
      <FighterDetailClient params={params} />
    </Suspense>
  );
}