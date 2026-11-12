import { useListNewsletterSubscribers } from '@workspace/api-client-react';
import { format } from 'date-fns';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { downloadCsv } from '@/lib/download';

export function ManageNewsletter() {
  const { data: subscribers, isLoading } = useListNewsletterSubscribers();
  const { toast } = useToast();
  const exportCsv = () =>
    downloadCsv('/api/admin/newsletter/export.csv', 'subscribers.csv').catch(() =>
      toast({ title: 'Export failed', description: 'Please try again.', variant: 'destructive' }),
    );

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-bold">Newsletter Subscribers</h2>
        <Button variant="outline" onClick={exportCsv}><Download className="mr-2 h-4 w-4" /> Export CSV</Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-6 py-4 font-medium">Name</th>
              <th className="px-6 py-4 font-medium">Email</th>
              <th className="px-6 py-4 font-medium">Subscribed On</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {subscribers?.map((sub) => (
              <tr key={sub.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{sub.fullName}</td>
                <td className="px-6 py-4 text-gray-600">{sub.email}</td>
                <td className="px-6 py-4 text-gray-500">{format(new Date(sub.createdAt), 'MMM d, yyyy')}</td>
              </tr>
            ))}
            {subscribers?.length === 0 && (
              <tr><td colSpan={3} className="px-6 py-8 text-center text-gray-500">No subscribers yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}