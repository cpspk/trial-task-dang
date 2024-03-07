import { NextRequest, NextResponse } from 'next/server'
import Parser from 'rss-parser'

const parser = new Parser<{ extendedDescription: string }, { "media:thumbnail": { '$': { url: string } } }>({
  customFields: {
    item: ['media:thumbnail']
  }
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');

  try {
    const feed = await parser.parseURL(`${url}`).then(res => res.items.map(item => {

      return {
        title: item.title,
        link: item.link,
        thumbnail: item["media:thumbnail"]?.["$"].url
      }
    }))

    return NextResponse.json(feed);
  } catch (error) {
    return NextResponse.json(error, { status: 404 });
  }
}
