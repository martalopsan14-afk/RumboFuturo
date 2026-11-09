export interface NewsItem {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  body: string;
  date: string;
  image: string | null;
  link?: string | null;
}

export const NEWS_ITEMS: NewsItem[] = [];
