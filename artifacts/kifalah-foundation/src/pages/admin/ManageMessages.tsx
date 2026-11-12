import { useListContactMessages, useMarkContactRead } from '@workspace/api-client-react';
import { Button } from '@/components/ui/button';
import { Mail, MailOpen } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';

export function ManageMessages() {
  const { data: messages, isLoading } = useListContactMessages();
  const markRead = useMarkContactRead();
  const queryClient = useQueryClient();

  const handleMarkRead = (id: number) => {
    markRead.mutate({ id }, {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['/api/admin/contact'] })
    });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Contact Messages</h2>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-6 py-4 font-medium">From</th>
              <th className="px-6 py-4 font-medium">Subject</th>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {messages?.map((msg) => (
              <tr key={msg.id} className={`hover:bg-gray-50 ${!msg.read ? 'bg-emerald-50/50' : ''}`}>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{msg.name}</div>
                  <div className="text-gray-500 text-xs">{msg.email}</div>
                </td>
                <td className="px-6 py-4 text-gray-900 max-w-xs truncate">{msg.subject}</td>
                <td className="px-6 py-4 text-gray-500">{format(new Date(msg.createdAt), 'MMM d, yyyy')}</td>
                <td className="px-6 py-4 text-right">
                  {!msg.read ? (
                    <Button variant="outline" size="sm" className="text-emerald-700" onClick={() => handleMarkRead(msg.id)}>
                      <Mail className="w-4 h-4 mr-2" /> Mark Read
                    </Button>
                  ) : (
                    <span className="flex items-center justify-end text-gray-400 text-sm">
                      <MailOpen className="w-4 h-4 mr-2" /> Read
                    </span>
                  )}
                </td>
              </tr>
            ))}
            {messages?.length === 0 && (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">No messages.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}