'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Props {
  keyword: string;
}

export default function TrackSearch({ keyword }: Props) {
  useEffect(() => {
    async function insertSearchKeyword() {
      const keywordNormalized = keyword.trim().toLowerCase();
      const slug = encodeURIComponent(keywordNormalized.replace(/\s+/g, '-'));

      const { data: existing, error } = await supabase
        .from('search_keywords')
        .select('id, count')
        .eq('slug', slug)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Supabase error:', error.message);
        return;
      }

      if (existing) {
        await supabase
          .from('search_keywords')
          .update({ count: existing.count + 1, last_searched: new Date().toISOString() })
          .eq('id', existing.id);
      } else {
        await supabase.from('search_keywords').insert([
          {
            keyword: keywordNormalized,
            slug,
            count: 1,
            last_searched: new Date().toISOString(),
          },
        ]);
      }
    }

    insertSearchKeyword();
  }, [keyword]);

  return null;
}
