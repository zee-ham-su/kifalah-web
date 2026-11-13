import { usePageMeta } from '@/lib/usePageMeta';
import { Link } from 'wouter';
import { ArrowRight, Heart, Users, BookOpen, Droplets, Briefcase, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useListProgrammes, useListNews } from '@workspace/api-client-react';
import { getProgrammeImageUrl } from '@/lib/programmeImages';
import heroImg from '@assets/education/hero-classroom.jpg';
import educationImg from '@assets/education/education-learning.jpg';
import { format } from 'date-fns';

export function Home() {
  usePageMeta();
  const { data: programmes } = useListProgrammes({ featured: true });
  const { data: news } = useListNews({ featured: true, limit: 3 });

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative min-h-[90dvh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImg} 
            alt="Students learning with their teacher in a Ghanaian classroom"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-emerald-950/70" />
        </div>
        
        <div className="container relative z-10 mx-auto px-4 lg:px-8 flex flex-col items-center text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-emerald-800/50 border border-emerald-500/30 text-emerald-100 text-sm font-medium tracking-wide mb-6 animate-in slide-in-from-bottom-4 duration-700">
            COMPASSION • JUSTICE • TRUST • EXCELLENCE
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white max-w-4xl leading-tight mb-6 animate-in slide-in-from-bottom-6 duration-700 delay-150">
            Empowering Communities, <span className="text-amber-400">Transforming Lives</span> in Ghana.
          </h1>
          <p className="text-lg md:text-xl text-emerald-50 max-w-2xl mb-10 animate-in slide-in-from-bottom-8 duration-700 delay-300 leading-relaxed">
            We are a humanitarian organisation dedicated to sustainable development, economic empowerment, and delivering hope to vulnerable populations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-in slide-in-from-bottom-10 duration-700 delay-500">
            <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-white border-0 h-14 px-8 text-lg rounded-xl shadow-lg shadow-amber-500/20" asChild>
              <Link href="/support-us">Support Our Work</Link>
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-xl border-white/30 text-white hover:bg-white/10 backdrop-blur-sm" asChild>
              <Link href="/programmes">Explore Programmes</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-20 bg-emerald-900 text-white relative">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-emerald-800/50">
            <div className="flex flex-col items-center text-center px-4">
              <span className="text-4xl md:text-5xl font-bold text-amber-400 mb-2">15k+</span>
              <span className="text-emerald-100 font-medium">Lives Impacted</span>
            </div>
            <div className="flex flex-col items-center text-center px-4">
              <span className="text-4xl md:text-5xl font-bold text-amber-400 mb-2">50+</span>
              <span className="text-emerald-100 font-medium">Communities Reached</span>
            </div>
            <div className="flex flex-col items-center text-center px-4">
              <span className="text-4xl md:text-5xl font-bold text-amber-400 mb-2">12</span>
              <span className="text-emerald-100 font-medium">Active Projects</span>
            </div>
            <div className="flex flex-col items-center text-center px-4">
              <span className="text-4xl md:text-5xl font-bold text-amber-400 mb-2">100%</span>
              <span className="text-emerald-100 font-medium">Commitment</span>
            </div>
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-emerald-950 mb-6">Inspired by Islamic values of Rahmah (Compassion)</h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Kifalah Foundation Ghana is dedicated to alleviating poverty and fostering self-reliance across communities. We believe in holistic development that addresses immediate needs while building long-term resilience.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                From building schools and clean water infrastructure to providing vocational training and emergency relief, our work is rooted in trust, excellence, and a deep commitment to human dignity.
              </p>
              <Button variant="ghost" className="group text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 px-0" asChild>
                <Link href="/about" className="flex items-center text-lg">
                  Learn more about our mission
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
            <div className="relative">
              <div className="aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden bg-gray-100 shadow-xl relative z-10">
                 {/* Fallback image if custom not found */}
                <div className="w-full h-full bg-emerald-100 flex items-center justify-center text-emerald-800 font-medium text-lg border border-emerald-200">
                  <img src={educationImg} className="w-full h-full object-cover" alt="Students taking part in a classroom lesson" loading="lazy" decoding="async" />
                  <span className="absolute">Education &amp; Scholarships</span>
                </div>
              </div>
              <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-amber-400 rounded-full blur-3xl opacity-20 z-0" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Programmes */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold text-emerald-950 mb-4">Our Core Programmes</h2>
              <p className="text-gray-600 text-lg">
                We deliver targeted interventions across six key areas to create sustainable, lasting change in Ghanaian communities.
              </p>
            </div>
            <Button variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50" asChild>
              <Link href="/programmes">View All Programmes</Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programmes ? programmes.slice(0, 3).map((programme) => {
              const imageUrl = getProgrammeImageUrl(programme.icon, programme.imageUrl);

              return (
                <div key={programme.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow border border-gray-100 group">
                  <div className="aspect-[16/9] bg-gray-100 relative overflow-hidden">
                    {imageUrl ? (
                      <img src={imageUrl} alt={programme.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full bg-emerald-50 flex items-center justify-center">
                        <BookOpen className="h-12 w-12 text-emerald-300" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-bold text-white mb-1">{programme.title}</h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-600 line-clamp-3 mb-6">
                      {programme.description}
                    </p>
                    <Button variant="ghost" className="w-full text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800" asChild>
                      <Link href={`/programmes/${programme.slug}`}>Explore Programme</Link>
                    </Button>
                  </div>
                </div>
              );
            }) : (
              // Skeleton loading
              [1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 h-96 animate-pulse">
                  <div className="h-48 bg-gray-200" />
                  <div className="p-6 space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-3/4" />
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-full" />
                      <div className="h-4 bg-gray-200 rounded w-5/6" />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Get Involved CTA */}
      <section className="py-24 bg-emerald-950 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-emerald-900 rounded-l-full blur-3xl opacity-50 transform translate-x-1/3" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Be Part of the Solution</h2>
          <p className="text-xl text-emerald-100 max-w-2xl mx-auto mb-10">
            Your support enables us to reach more communities, build more schools, and empower more families to break the cycle of poverty.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-white border-0 h-14 px-8 text-lg rounded-xl" asChild>
              <Link href="/support-us">Support Us Today</Link>
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-xl border-emerald-700 text-white hover:bg-emerald-900" asChild>
              <Link href="/get-involved">Volunteer With Us</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Latest News */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold text-emerald-950 mb-4">Latest Stories</h2>
              <p className="text-gray-600 text-lg">
                Read about the impact of our work and stories from the communities we serve.
              </p>
            </div>
            <Button variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50" asChild>
              <Link href="/news">Read All News</Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news ? news.map((article) => (
              <Link key={article.id} href={`/news/${article.slug}`} className="group cursor-pointer">
                <article className="flex flex-col h-full">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 mb-6">
                    {article.imageUrl ? (
                      <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full bg-emerald-50 flex items-center justify-center">
                        <span className="text-emerald-300 font-medium">News Image</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <span className="text-emerald-700 font-medium bg-emerald-50 px-2 py-1 rounded">{article.category}</span>
                    <span>{format(new Date(article.publishedAt || article.createdAt), 'MMM d, yyyy')}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-emerald-700 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 line-clamp-2 flex-1">
                    {article.excerpt}
                  </p>
                </article>
              </Link>
            )) : (
              [1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse flex flex-col">
                  <div className="aspect-[4/3] bg-gray-200 rounded-2xl mb-6" />
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-4" />
                  <div className="h-6 bg-gray-200 rounded w-full mb-3" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}