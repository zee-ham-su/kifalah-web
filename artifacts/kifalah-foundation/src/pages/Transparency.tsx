import { useListDocuments } from '@workspace/api-client-react';
import { FileText, Download, TrendingUp, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

export function Transparency() {
  const { data: documents, isLoading } = useListDocuments({ category: 'financial' });

  return (
    <div className="flex flex-col w-full bg-gray-50 pb-24 min-h-screen">
      <section className="bg-emerald-950 py-20 lg:py-32">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">Transparency & Accountability</h1>
          <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
            We hold ourselves to the highest standards of integrity, ensuring every donation makes maximum impact.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 mb-20">
            <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
              <ShieldCheck className="w-16 h-16 text-emerald-600 mb-6" />
              <h2 className="text-2xl font-bold text-emerald-950 mb-4">Financial Integrity</h2>
              <p className="text-gray-600">
                We conduct annual independent audits and maintain strict internal controls to ensure all funds are used efficiently and exactly as intended.
              </p>
            </div>
            <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
              <TrendingUp className="w-16 h-16 text-amber-500 mb-6" />
              <h2 className="text-2xl font-bold text-emerald-950 mb-4">Impact Measurement</h2>
              <p className="text-gray-600">
                Our programmes are rigorously monitored and evaluated. We measure outcomes, not just outputs, to guarantee sustainable change.
              </p>
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-emerald-950 mb-8">Annual Reports & Financials</h2>
            
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              {isLoading ? (
                <div className="p-8 animate-pulse space-y-4">
                  <div className="h-12 bg-gray-100 rounded" />
                  <div className="h-12 bg-gray-100 rounded" />
                  <div className="h-12 bg-gray-100 rounded" />
                </div>
              ) : documents && documents.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {documents.map(doc => (
                    <div key={doc.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">{doc.title}</h3>
                          <div className="text-sm text-gray-500 flex gap-3">
                            <span>{doc.year || format(new Date(doc.createdAt), 'yyyy')}</span>
                            <span>•</span>
                            <span>{doc.fileSize || 'PDF'}</span>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" className="text-emerald-700 border-emerald-200" asChild>
                        <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                          <Download className="w-4 h-4 mr-2" /> Download
                        </a>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center text-gray-500">
                  No public reports available at this time.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}