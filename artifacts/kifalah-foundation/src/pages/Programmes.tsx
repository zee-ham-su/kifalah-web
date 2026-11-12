import { useListProgrammes } from '@workspace/api-client-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { BookOpen, Briefcase, Droplets, HeartPulse, Leaf, Users } from 'lucide-react';

const defaultIcons: Record<string, any> = {
  'education': BookOpen,
  'women-empowerment': Users,
  'youth': Briefcase,
  'community': Droplets,
  'welfare': HeartPulse,
  'waqf': Leaf,
};

export function Programmes() {
  const { data: programmes, isLoading } = useListProgrammes();

  return (
    <div className="flex flex-col w-full bg-gray-50 pb-24">
      {/* Page Header */}
      <section className="bg-emerald-950 py-20 lg:py-32">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            Our Programmes
          </h1>
          <p className="text-xl text-emerald-100 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150">
            Comprehensive interventions designed to build resilient communities and empower individuals across Ghana.
          </p>
        </div>
      </section>

      {/* Programmes List */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          {isLoading ? (
            <div className="grid md:grid-cols-2 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="animate-pulse bg-white p-8 rounded-3xl border border-gray-100 h-80" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
              {programmes?.map((programme) => {
                const IconComponent = defaultIcons[programme.icon] || BookOpen;
                
                return (
                  <div key={programme.id} className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all group flex flex-col md:flex-row h-full">
                    {/* Image Area */}
                    <div className="md:w-2/5 aspect-[4/3] md:aspect-auto bg-emerald-50 relative overflow-hidden shrink-0">
                      {programme.imageUrl ? (
                        <img 
                          src={programme.imageUrl} 
                          alt={programme.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-emerald-100 text-emerald-800">
                          <IconComponent className="w-16 h-16 opacity-50" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/50 to-transparent" />
                      <div className="absolute bottom-4 left-4 md:bottom-auto md:top-4 md:left-4 bg-amber-500 text-white p-2 rounded-lg shadow-sm">
                        <IconComponent className="w-6 h-6" />
                      </div>
                    </div>
                    
                    {/* Content Area */}
                    <div className="p-8 md:w-3/5 flex flex-col justify-center">
                      <h2 className="text-2xl font-bold text-emerald-950 mb-4 group-hover:text-emerald-700 transition-colors">
                        {programme.title}
                      </h2>
                      <p className="text-gray-600 mb-6 line-clamp-3">
                        {programme.description}
                      </p>
                      <div className="mt-auto">
                        <Button variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50" asChild>
                          <Link href={`/programmes/${programme.slug}`}>
                            Learn More
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}