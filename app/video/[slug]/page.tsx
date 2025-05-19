import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { VideoDetail } from './VideoDetail';
import type { Metadata } from 'next';
export const dynamic = 'force-static';
export async function generateStaticParams() {
  const { data, error } = await supabase
    .from('video_details')
    .select('slug')
    .limit(1000000);

  if (error || !data) {
    console.error('Failed to fetch slugs:', error);
    return [];
  }

  return data.map((video) => ({
    slug: video.slug,
  }));
}

// SEO metadata
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { data } = await supabase
    .from('video_details')
    .select('title, description, thumbnail, slug')
    .eq('slug', params.slug)
    .single();

  if (!data) return {};

  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'mmawatch';
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mmawatch.com';
  const url = `${baseUrl}/video/${data.slug}`;
  const title = `Watch ${data.title} Free Full HD | ${siteName}`;
  const description = data.description || `Watch ${data.title} free full HD on ${siteName}.`;

  return {
    title,
    description,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName,
      type: 'video.other',
      images: [
        {
          url: data.thumbnail,
          alt: data.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [data.thumbnail],
    },
    keywords: [
      ...data.title.replace(/[-,]/g, '').split(' '),
      'MMA',
      'UFC',
      'Fight',
      'mmawatch',
    ],
  };
}

export default async function Page({ params }: { params: { slug: string } }) {
  const { data, error } = await supabase
    .from('video_details')
    .select('id')
    .eq('slug', params.slug)
    .single();

  if (error || !data) {
    console.error('Video not found for slug:', params.slug);
    return notFound();
  }

  return <VideoDetail id={data.id} />;
}
