import { useListPartnershipEnquiries, useUpdatePartnershipStatus } from '@workspace/api-client-react';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

export function ManagePartnerships() {
  const { data: partnerships, isLoading } = useListPartnershipEnquiries();
  const updateStatus = useUpdatePartnershipStatus();
  const queryClient = useQueryClient();

  const handleUpdate = (id: number, status: string) => {
    updateStatus.mutate({ id, data: { status } }, {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['/api/admin/partnerships'] })
    });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Partnership Enquiries</h2>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-6 py-4 font-medium">Organisation</th>
              <th className="px-6 py-4 font-medium">Contact</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {partnerships?.map((part) => (
              <tr key={part.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{part.organisationName}</td>
                <td className="px-6 py-4">
                  <div className="text-gray-900">{part.contactName}</div>
                  <div className="text-gray-500 text-xs">{part.email}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium uppercase ${
                    part.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                    part.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {part.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  {part.status === 'pending' && (
                    <>
                      <Button variant="outline" size="sm" className="text-emerald-600 border-emerald-200" onClick={() => handleUpdate(part.id, 'approved')}>
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 border-red-200" onClick={() => handleUpdate(part.id, 'rejected')}>
                        <X className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {partnerships?.length === 0 && (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">No enquiries.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}