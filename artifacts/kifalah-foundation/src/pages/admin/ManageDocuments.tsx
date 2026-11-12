import { useListDocuments, useDeleteDocument } from '@workspace/api-client-react';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, FileText } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

export function ManageDocuments() {
  const { data: documents, isLoading } = useListDocuments();
  const deleteDoc = useDeleteDocument();
  const queryClient = useQueryClient();

  const handleDelete = (id: number) => {
    if (confirm("Delete this document?")) {
      deleteDoc.mutate({ id }, {
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['/api/documents'] })
      });
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Manage Documents</h2>
        <Button className="bg-emerald-700 hover:bg-emerald-800 text-white">
          <Plus className="w-4 h-4 mr-2" /> Upload Doc
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-6 py-4 font-medium">Document</th>
              <th className="px-6 py-4 font-medium">Category</th>
              <th className="px-6 py-4 font-medium">Year</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {documents?.map((doc) => (
              <tr key={doc.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <div className="font-medium text-gray-900">{doc.title}</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600 capitalize">{doc.category}</td>
                <td className="px-6 py-4 text-gray-500">{doc.year || '-'}</td>
                <td className="px-6 py-4 text-right">
                  <Button variant="ghost" size="sm" className="text-red-600" onClick={() => handleDelete(doc.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
            {documents?.length === 0 && (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">No documents found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}