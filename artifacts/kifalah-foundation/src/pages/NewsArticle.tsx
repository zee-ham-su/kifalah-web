import { useGetNewsArticle, useListNews } from '@workspace/api-client-react';
import { useParams, Link } from 'wouter';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NotFound from './not-found';
import { format } from 'date-fns';

export function NewsArticle() {
  const { slug } = useParams();
  
  // To resolve slug to ID without a custom endpoint:
  const { data: newsList, isLoading: listLoading } = useListNews();
  const articleMeta = newsList?.find(n => n.slug === slug);
  const id = articleMeta?.id;

  const { data: article, isLoading: articleLoading } = useGetNewsArticle(id as number, { 
    query: { enabled: !!id, queryKey: ['news', id] } 
  });

  const isLoading = listLoading || (!!id && articleLoading);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!articleMeta && !listLoading) {
    return <NotFound />;
  }

  const data = article || articleMeta; // fallback to meta if full not loaded yet

  if (!data) return null;

  return (
    <article className="bg-white min-h-screen pb-24">
      <div className="container mx-auto px-4 pt-12 pb-8 max-w-4xl">
        <Button variant="ghost" className="mb-8 text-emerald-700 hover:bg-emerald-50 -ml-4" asChild>
          <Link href="/news"><ArrowLeft className="w-4 h-4 mr-2" /> Back to News</Link>
        </Button>

        <div className="mb-6 flex items-center gap-4 text-sm font-medium">
          <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full uppercase tracking-wider">{data.category}</span>
          <span className="text-gray-500">{format(new Date(data.publishedAt || data.createdAt), 'MMMM d, yyyy')}</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
          {data.title}
        </h1>
      </div>

      {data.imageUrl && (
        <div className="w-full max-w-5xl mx-auto px-4 mb-12">
          <div className="aspect-video w-full rounded-3xl overflow-hidden bg-gray-100">
            <img src={data.imageUrl} alt={data.title} className="w-full h-full object-cover" />
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 max-w-3xl">
        <div className="prose prose-lg prose-emerald max-w-none text-gray-700 whitespace-pre-wrap">
          <p className="lead text-xl md:text-2xl text-gray-600 font-medium mb-8">
            {data.excerpt}
          </p>
          {data.content}
        </div>
      </div>
    </article>
  );
}