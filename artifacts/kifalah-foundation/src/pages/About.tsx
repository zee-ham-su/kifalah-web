import { usePageMeta } from '@/lib/usePageMeta';
import { Layout } from '@/components/layout/Layout';
import { Target, Eye, Heart, Award, Shield, Users } from 'lucide-react';
import womenImg from '@assets/generated_images/women-empowerment.jpg';

export function About() {
  usePageMeta("About Us", "Learn about Kifalah Foundation Ghana: our mission, vision, values and the people behind our work.");
  return (
    <div className="flex flex-col w-full bg-gray-50 pb-24">
      {/* Page Header */}
      <section className="bg-emerald-950 py-20 lg:py-32">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            About Kifalah Foundation
          </h1>
          <p className="text-xl text-emerald-100 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150">
            A Ghanaian non-governmental organisation driven by compassion, justice, and a commitment to human dignity.
          </p>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl relative z-10">
                <img 
                  src={womenImg} 
                  alt="Women Empowerment in Ghana" 
                  className="w-full h-full object-cover" 
                  onError={(e) => { e.currentTarget.style.display='none' }}
                />
              </div>
              <div className="absolute -top-8 -left-8 w-64 h-64 bg-amber-400 rounded-full blur-3xl opacity-20 z-0" />
            </div>
            <div className="order-1 lg:order-2 space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-emerald-950">Who We Are</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Kifalah Foundation Ghana is a humanitarian and community development organisation dedicated to improving lives across Ghana. Founded on the principles of social justice and equitable development, we work to address both immediate humanitarian needs and long-term systemic challenges.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Our approach is holistic, community-led, and evidence-based. We believe that true development occurs when communities are empowered with the skills, resources, and opportunities they need to author their own futures.
              </p>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mt-8">
                <h3 className="font-semibold text-emerald-800 text-xl mb-3">Our Core Philosophy</h3>
                <p className="text-gray-600">
                  Inspired by Islamic values of Rahmah (Compassion), Adl (Justice), Amanah (Trust), and Ihsan (Excellence), we serve all people regardless of their religious, ethnic, or social background.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 bg-emerald-900 text-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-24">
            <div className="bg-emerald-800/50 p-10 rounded-3xl border border-emerald-700/50 relative overflow-hidden group hover:bg-emerald-800/80 transition-colors">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Eye className="w-32 h-32 text-amber-400" />
              </div>
              <div className="relative z-10">
                <Eye className="w-12 h-12 text-amber-400 mb-6" />
                <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
                <p className="text-lg text-emerald-100 leading-relaxed">
                  A prosperous and equitable Ghana where every individual, regardless of their background, has access to basic necessities, quality education, and the opportunity to build a sustainable livelihood in a thriving community.
                </p>
              </div>
            </div>
            
            <div className="bg-emerald-800/50 p-10 rounded-3xl border border-emerald-700/50 relative overflow-hidden group hover:bg-emerald-800/80 transition-colors">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Target className="w-32 h-32 text-amber-400" />
              </div>
              <div className="relative z-10">
                <Target className="w-12 h-12 text-amber-400 mb-6" />
                <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                <p className="text-lg text-emerald-100 leading-relaxed">
                  To provide comprehensive humanitarian assistance and implement sustainable development programmes that empower vulnerable populations, strengthen community resilience, and foster economic independence across Ghana.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-950 mb-6">Our Core Values</h2>
            <p className="text-lg text-gray-600">
              These fundamental principles guide every decision we make and every project we implement.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-8 rounded-2xl bg-gray-50 border border-gray-100 text-center hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 mx-auto bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                <Heart className="w-8 h-8 text-emerald-700" />
              </div>
              <h3 className="text-xl font-bold text-emerald-950 mb-3">Rahmah (Compassion)</h3>
              <p className="text-gray-600">Deep empathy for the vulnerable, driving our commitment to alleviate suffering.</p>
            </div>
            
            <div className="p-8 rounded-2xl bg-gray-50 border border-gray-100 text-center hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 mx-auto bg-amber-100 rounded-full flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-emerald-950 mb-3">Adl (Justice)</h3>
              <p className="text-gray-600">Fairness and equity in all our dealings, ensuring resources reach those most in need.</p>
            </div>

            <div className="p-8 rounded-2xl bg-gray-50 border border-gray-100 text-center hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 mx-auto bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-emerald-700" />
              </div>
              <h3 className="text-xl font-bold text-emerald-950 mb-3">Amanah (Trust)</h3>
              <p className="text-gray-600">Absolute transparency and accountability to our donors, partners, and beneficiaries.</p>
            </div>

            <div className="p-8 rounded-2xl bg-gray-50 border border-gray-100 text-center hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 mx-auto bg-amber-100 rounded-full flex items-center justify-center mb-6">
                <Award className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-emerald-950 mb-3">Ihsan (Excellence)</h3>
              <p className="text-gray-600">Striving for the highest quality in project delivery to ensure sustainable, lasting impact.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}