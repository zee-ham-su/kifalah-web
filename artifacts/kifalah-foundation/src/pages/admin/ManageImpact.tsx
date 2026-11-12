import { useListImpactStats, useDeleteImpactStat } from '@workspace/api-client-react';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Edit } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

export function ManageImpact() {
  const { data: stats, isLoading } = useListImpactStats();
  const deleteStat = useDeleteImpactStat();
  const queryClient = useQueryClient();

  const handleDelete = (id: number) => {
    if (confirm("Delete this impact stat?")) {
      deleteStat.mutate({ id }, {
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['/api/impact-stats'] })
      });
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Manage Impact Stats</h2>
        <Button className="bg-emerald-700 hover:bg-emerald-800 text-white">
          <Plus className="w-4 h-4 mr-2" /> Add Stat
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-6 py-4 font-medium">Label</th>
              <th className="px-6 py-4 font-medium">Value</th>
              <th className="px-6 py-4 font-medium">Unit</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {stats?.map((stat) => (
              <tr key={stat.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{stat.label}</td>
                <td className="px-6 py-4 font-bold text-emerald-700">{stat.value}</td>
                <td className="px-6 py-4 text-gray-500">{stat.unit || '-'}</td>
                <td className="px-6 py-4 text-right">
                  <Button variant="ghost" size="sm" className="text-blue-600">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-600" onClick={() => handleDelete(stat.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
            {stats?.length === 0 && (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">No stats found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}