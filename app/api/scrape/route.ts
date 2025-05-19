import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

const BASE_URL = 'https://watchmmafull.com';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const iframeSrc = $('iframe').first().attr('src');
    const title = $('meta[property="og:title"]').attr('content') || $('h1').first().text().trim();

    let thumbnail = $('meta[property="og:image"]').attr('content') || $('.thumb-bv').attr('src');
    if (thumbnail && !thumbnail.startsWith('http')) {
      thumbnail = `${BASE_URL}${thumbnail}`;
    }

    const categories: string[] = [];
    let foundCategories = false;
    $('#extras').children().each((_, el) => {
      if ($(el).is('h4') && $(el).text().includes('Categories:')) {
        foundCategories = true;
        return;
      }
      if (foundCategories) {
        if ($(el).is('h4')) return false;
        if ($(el).is('a[rel="category tag"]')) {
          categories.push($(el).text().trim());
        }
      }
    });

    const fighters: string[] = [];
    let foundFighters = false;
    $('#extras').children().each((_, el) => {
      if ($(el).is('h4') && $(el).text().includes('Fighters:')) {
        foundFighters = true;
        return;
      }
      if (foundFighters) {
        if ($(el).is('h4')) return false;
        if ($(el).is('a[rel="category tag"]')) {
          fighters.push($(el).text().trim());
        }
      }
    });

    let description = '';
    const articleParagraphs = $('article.infobv p');
    if (articleParagraphs.length >= 2) {
      const p1 = $(articleParagraphs[0]).text().trim();
      const p2 = $(articleParagraphs[1]).text().trim();
      description = `${p1} ${p2}`;
    } else if (articleParagraphs.length === 1) {
      description = $(articleParagraphs[0]).text().trim();
    }

    if (iframeSrc) {
      try {
        await axios.get(iframeSrc, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            'Referer': url,
          }
        });

        return NextResponse.json({
          title,
          thumbnail,
          video_embed: iframeSrc,
          categories,
          fighters,
          description,
          url
        });
      } catch (err) {
        return NextResponse.json({ error: 'Failed to access iframe video' }, { status: 500 });
      }
    }

    return NextResponse.json({ error: 'Embed video not found' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to scrape video detail' }, { status: 500 });
  }
}