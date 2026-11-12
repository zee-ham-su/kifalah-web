import { useListVolunteerApplications, useUpdateVolunteerStatus } from '@workspace/api-client-react';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';

export function ManageVolunteers() {
  const { data: volunteers, isLoading } = useListVolunteerApplications();
  const updateStatus = useUpdateVolunteerStatus();
  const queryClient = useQueryClient();

  const handleUpdate = (id: number, status: string) => {
    updateStatus.mutate({ id, data: { status } }, {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['/api/admin/volunteers'] })
    });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Volunteer Applications</h2>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-6 py-4 font-medium">Name</th>
              <th className="px-6 py-4 font-medium">Interest</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {volunteers?.map((vol) => (
              <tr key={vol.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{vol.fullName}</div>
                  <div className="text-gray-500 text-xs">{vol.email}</div>
                </td>
                <td className="px-6 py-4 text-gray-700">{vol.areaOfInterest}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium uppercase ${
                    vol.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                    vol.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {vol.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  {vol.status === 'pending' && (
                    <>
                      <Button variant="outline" size="sm" className="text-emerald-600 border-emerald-200" onClick={() => handleUpdate(vol.id, 'approved')}>
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 border-red-200" onClick={() => handleUpdate(vol.id, 'rejected')}>
                        <X className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {volunteers?.length === 0 && (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">No applications.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}