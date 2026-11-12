import { useListNews, useDeleteNewsArticle } from '@workspace/api-client-react';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Edit } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';

export function ManageNews() {
  const { data: news, isLoading } = useListNews();
  const deleteNews = useDeleteNewsArticle();
  const queryClient = useQueryClient();

  const handleDelete = (id: number) => {
    if (confirm("Delete this news article?")) {
      deleteNews.mutate({ id }, {
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['/api/news'] })
      });
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Manage News</h2>
        <Button className="bg-emerald-700 hover:bg-emerald-800 text-white">
          <Plus className="w-4 h-4 mr-2" /> Add Article
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-6 py-4 font-medium">Title</th>
              <th className="px-6 py-4 font-medium">Category</th>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {news?.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900 line-clamp-1">{item.title}</td>
                <td className="px-6 py-4 text-gray-500">{item.category}</td>
                <td className="px-6 py-4 text-gray-500">{format(new Date(item.createdAt), 'MMM d, yyyy')}</td>
                <td className="px-6 py-4 text-right">
                  <Button variant="ghost" size="sm" className="text-blue-600">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-600" onClick={() => handleDelete(item.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
            {news?.length === 0 && (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">No articles found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}