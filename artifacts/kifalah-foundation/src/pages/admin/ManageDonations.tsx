import { useListDonations, useUpdateDonationStatus, getListDonationsQueryKey } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { downloadCsv } from '@/lib/download';

const STATUSES = [
  { value: 'pledged', label: 'Pledged' },
  { value: 'received', label: 'Received' },
  { value: 'follow_up', label: 'Follow up' },
] as const;

// Older rows may still hold the pre-change values; show them as "pledged".
const normalise = (s: string) => (s === 'received' || s === 'follow_up' ? s : 'pledged');

const badge: Record<string, string> = {
  pledged: 'bg-amber-100 text-amber-800',
  received: 'bg-emerald-100 text-emerald-800',
  follow_up: 'bg-blue-100 text-blue-800',
};

export function ManageDonations() {
  const { data: pledges, isLoading } = useListDonations();
  const updateStatus = useUpdateDonationStatus();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const setStatus = (id: number, status: (typeof STATUSES)[number]['value']) =>
    updateStatus.mutate(
      { id, data: { status } },
      {
        onSuccess: () => queryClient.invalidateQueries({ queryKey: getListDonationsQueryKey() }),
        onError: () => toast({ title: 'Could not update status', variant: 'destructive' }),
      },
    );

  const exportCsv = () =>
    downloadCsv('/api/admin/donations/export.csv', 'pledges.csv').catch(() =>
      toast({ title: 'Export failed', description: 'Please try again.', variant: 'destructive' }),
    );

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">Pledges</h2>
          <p className="text-sm text-gray-500 max-w-xl">
            Intent to give, recorded from the Support Us page. No money passes through the website: mark a pledge
            <strong> Received</strong> only after the gift reaches the Foundation's official account.
          </p>
        </div>
        <Button variant="outline" onClick={exportCsv}><Download className="mr-2 h-4 w-4" /> Export CSV</Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-6 py-4 font-medium">Supporter</th>
              <th className="px-6 py-4 font-medium">Pledge</th>
              <th className="px-6 py-4 font-medium">Programme</th>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {pledges?.map((p) => {
              const status = normalise(p.status);
              return (
                <tr key={p.id} className="hover:bg-gray-50 align-top">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{p.donorName}</div>
                    <div className="text-gray-500 text-xs">{p.email}</div>
                    {p.phone && <div className="text-gray-500 text-xs">{p.phone}</div>}
                    {p.message && <div className="mt-1 max-w-xs text-xs text-gray-500 italic">{p.message}</div>}
                  </td>
                  <td className="px-6 py-4">
                    {p.amount ? <div className="font-bold text-emerald-700">{p.currency} {p.amount.toLocaleString()}</div> : null}
                    {p.inKindSupport ? <div className="max-w-xs text-gray-700">{p.inKindSupport}</div> : null}
                  </td>
                  <td className="px-6 py-4 text-gray-600 capitalize">{p.programme || 'General'}</td>
                  <td className="px-6 py-4 text-gray-500">{format(new Date(p.createdAt), 'MMM d, yyyy')}</td>
                  <td className="px-6 py-4">
                    <Select value={status} onValueChange={(v) => setStatus(p.id, v as (typeof STATUSES)[number]['value'])}>
                      <SelectTrigger className={`h-8 w-32 text-xs font-medium ${badge[status]}`}><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {STATUSES.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </td>
                </tr>
              );
            })}
            {pledges?.length === 0 && (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No pledges yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
