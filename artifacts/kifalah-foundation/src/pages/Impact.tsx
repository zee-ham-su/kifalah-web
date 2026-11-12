import { useListImpactStats } from '@workspace/api-client-react';
import { Target, Users, MapPin, Heart, Activity } from 'lucide-react';

export function Impact() {
  const { data: stats, isLoading } = useListImpactStats();

  return (
    <div className="flex flex-col w-full bg-gray-50 pb-24">
      {/* Page Header */}
      <section className="bg-emerald-950 py-20 lg:py-32">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            Our Impact
          </h1>
          <p className="text-xl text-emerald-100 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150">
            Measurable change and sustainable progress across communities in Ghana.
          </p>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="py-20 -mt-10">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 relative z-10">
            {isLoading ? (
              [1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 animate-pulse h-40" />
              ))
            ) : (
              stats?.map((stat) => (
                <div key={stat.id} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:-translate-y-1 transition-transform">
                  <div className="text-4xl md:text-5xl font-bold text-amber-500 mb-2">
                    {stat.value}{stat.unit}
                  </div>
                  <div className="text-emerald-950 font-medium text-lg mb-2">{stat.label}</div>
                  {stat.description && (
                    <div className="text-sm text-gray-500">{stat.description}</div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Interactive Map Placeholder */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-950 mb-6">Where We Work</h2>
            <p className="text-lg text-gray-600">
              Our interventions span across multiple regions in Ghana, focusing on marginalized and underserved communities.
            </p>
          </div>
          
          <div className="bg-emerald-50 rounded-3xl aspect-video md:aspect-[21/9] w-full flex items-center justify-center border border-emerald-100 relative overflow-hidden">
            <MapPin className="w-16 h-16 text-emerald-300 absolute" />
            <div className="text-emerald-800 font-medium text-xl z-10 bg-white/80 backdrop-blur px-6 py-3 rounded-full">
              Ghana Regions Map (Interactive Placeholder)
            </div>
            {/* Map dots */}
            <div className="absolute w-4 h-4 bg-amber-500 rounded-full top-1/3 left-1/3 animate-ping opacity-75" />
            <div className="absolute w-4 h-4 bg-amber-500 rounded-full top-1/3 left-1/3" />
            
            <div className="absolute w-4 h-4 bg-emerald-500 rounded-full bottom-1/3 right-1/3 animate-ping opacity-75" />
            <div className="absolute w-4 h-4 bg-emerald-500 rounded-full bottom-1/3 right-1/3" />
          </div>
        </div>
      </section>
    </div>
  );
}