import { useListNews } from '@workspace/api-client-react';
import { Link } from 'wouter';
import { format } from 'date-fns';

export function News() {
  const { data: news, isLoading } = useListNews();

  return (
    <div className="flex flex-col w-full bg-gray-50 pb-24 min-h-screen">
      <section className="bg-emerald-950 py-20 lg:py-32">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">News & Stories</h1>
          <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
            Updates, impact stories, and news from our programmes.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="animate-pulse bg-white p-6 rounded-3xl border border-gray-100 h-96">
                  <div className="bg-gray-200 h-48 rounded-xl mb-4" />
                  <div className="bg-gray-200 h-6 w-3/4 rounded mb-2" />
                  <div className="bg-gray-200 h-4 w-full rounded" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {news?.map((article) => (
                <Link key={article.id} href={`/news/${article.slug}`} className="group cursor-pointer">
                  <article className="flex flex-col h-full bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all">
                    <div className="aspect-[4/3] bg-gray-100 overflow-hidden relative">
                      {article.imageUrl ? (
                        <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full bg-emerald-50 flex items-center justify-center text-emerald-200">No Image</div>
                      )}
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        {article.category}
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <div className="text-sm text-gray-500 mb-3">
                        {format(new Date(article.publishedAt || article.createdAt), 'MMMM d, yyyy')}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-emerald-700 transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 line-clamp-3 mb-4 flex-1">
                        {article.excerpt}
                      </p>
                      <div className="text-emerald-700 font-medium group-hover:text-emerald-800 flex items-center mt-auto">
                        Read Story <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}