import { usePageMeta } from '@/lib/usePageMeta';
import { useGetProgramme, useListProgrammes } from '@workspace/api-client-react';
import { useParams, Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Target, Users, LayoutList } from 'lucide-react';
import NotFound from './not-found';

export function ProgrammeDetail() {
  const { slug } = useParams();
  
  // We need to fetch all and find by slug, because the API get by ID takes numeric ID.
  const { data: programmes, isLoading } = useListProgrammes();
  const programme = programmes?.find(p => p.slug === slug);
  usePageMeta(programme?.title ?? 'Programme', programme?.description);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-24 min-h-screen">
        <div className="animate-pulse space-y-8 max-w-4xl mx-auto">
          <div className="h-8 w-32 bg-gray-200 rounded" />
          <div className="h-64 bg-gray-200 rounded-3xl" />
          <div className="h-12 w-3/4 bg-gray-200 rounded" />
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded" />
            <div className="h-4 w-5/6 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!programme) {
    return <NotFound />;
  }

  return (
    <div className="flex flex-col w-full bg-white pb-24">
      {/* Hero Image */}
      <section className="relative h-[40vh] min-h-[300px] w-full bg-emerald-950 flex items-center justify-center">
        {programme.imageUrl && (
          <>
            <img src={programme.imageUrl} alt={programme.title} className="absolute inset-0 w-full h-full object-cover opacity-40" />
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 to-transparent" />
          </>
        )}
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            {programme.title}
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Button variant="ghost" className="mb-8 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 -ml-4" asChild>
              <Link href="/programmes">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Programmes
              </Link>
            </Button>

            <div className="prose prose-lg prose-emerald max-w-none">
              <p className="text-xl md:text-2xl text-gray-700 leading-relaxed font-medium mb-12">
                {programme.description}
              </p>

              {programme.fullDescription && (
                <div className="mb-12 text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {programme.fullDescription}
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-8 my-16">
                {programme.goal && (
                  <div className="bg-emerald-50 p-8 rounded-2xl border border-emerald-100">
                    <div className="flex items-center gap-3 mb-4 text-emerald-800">
                      <Target className="w-6 h-6" />
                      <h3 className="text-xl font-bold m-0">Programme Goal</h3>
                    </div>
                    <p className="text-gray-700 m-0">{programme.goal}</p>
                  </div>
                )}

                {programme.targetBeneficiaries && (
                  <div className="bg-amber-50 p-8 rounded-2xl border border-amber-100">
                    <div className="flex items-center gap-3 mb-4 text-amber-800">
                      <Users className="w-6 h-6" />
                      <h3 className="text-xl font-bold m-0">Target Beneficiaries</h3>
                    </div>
                    <p className="text-gray-700 m-0">{programme.targetBeneficiaries}</p>
                  </div>
                )}
              </div>

              {programme.keyActivities && (
                <div className="mb-12">
                  <div className="flex items-center gap-3 mb-6 text-emerald-950">
                    <LayoutList className="w-8 h-8" />
                    <h2 className="text-3xl font-bold m-0">Key Activities</h2>
                  </div>
                  <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm text-gray-700 whitespace-pre-wrap">
                    {programme.keyActivities}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-16 pt-12 border-t border-gray-100 flex justify-center">
              <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-white border-0 h-14 px-8 text-lg rounded-xl shadow-lg shadow-amber-500/20" asChild>
                <Link href="/support-us">Support This Programme</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}