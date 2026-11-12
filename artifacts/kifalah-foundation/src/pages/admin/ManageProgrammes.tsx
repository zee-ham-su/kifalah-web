import { useState } from 'react';
import { useListProgrammes, useDeleteProgramme } from '@workspace/api-client-react';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Edit } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

export function ManageProgrammes() {
  const { data: programmes, isLoading } = useListProgrammes();
  const deleteProgramme = useDeleteProgramme();
  const queryClient = useQueryClient();

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this programme?")) {
      deleteProgramme.mutate({ id }, {
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['/api/programmes'] })
      });
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Manage Programmes</h2>
        <Button className="bg-emerald-700 hover:bg-emerald-800 text-white">
          <Plus className="w-4 h-4 mr-2" /> Add Programme
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-6 py-4 font-medium">Title</th>
              <th className="px-6 py-4 font-medium">Slug</th>
              <th className="px-6 py-4 font-medium">Featured</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {programmes?.map((prog) => (
              <tr key={prog.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{prog.title}</td>
                <td className="px-6 py-4 text-gray-500">{prog.slug}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${prog.featured ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'}`}>
                    {prog.featured ? 'Yes' : 'No'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Button variant="ghost" size="sm" className="text-blue-600">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-600" onClick={() => handleDelete(prog.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
            {programmes?.length === 0 && (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">No programmes found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}