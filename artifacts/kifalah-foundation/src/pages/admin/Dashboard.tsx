import { useGetAdminSummary } from '@workspace/api-client-react';
import { Users, Handshake, DollarSign, MessageSquare } from 'lucide-react';

export function Dashboard() {
  const { data: summary, isLoading } = useGetAdminSummary();

  if (isLoading) return <div>Loading dashboard...</div>;
  if (!summary) return <div>Failed to load summary.</div>;

  const stats = [
    { label: 'Unread Messages', value: summary.unreadContactMessages, total: summary.totalContactMessages, icon: MessageSquare, color: 'bg-blue-100 text-blue-700' },
    { label: 'Pending Volunteers', value: summary.pendingVolunteers, total: summary.totalVolunteers, icon: Users, color: 'bg-amber-100 text-amber-700' },
    { label: 'Pending Partnerships', value: summary.pendingPartnerships, total: summary.totalPartnerships, icon: Handshake, color: 'bg-emerald-100 text-emerald-700' },
    { label: 'Pledges', value: summary.totalDonations, icon: DollarSign, color: 'bg-purple-100 text-purple-700' },
  ];

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
              {stat.total !== undefined && (
                <p className="text-xs text-gray-400 mt-2">out of {stat.total} total</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Welcome to the Admin Panel</h2>
        <p className="text-gray-600">
          Use the sidebar to navigate through the different management areas. 
          You can create new programmes, post news articles, manage volunteer applications, and follow up on pledges.
        </p>
      </div>
    </div>
  );
}