import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || 'general';
  
  try {
    const response = await fetch(
      `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${process.env.NEXT_PUBLIC_NEWS_API_KEY}`,
      { 
        cache: 'no-store',
        headers: {
          'User-Agent': 'Mozilla/5.0'
        }
      }
    );
    
    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('News API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news' }, 
      { status: 500 }
    );
  }
}