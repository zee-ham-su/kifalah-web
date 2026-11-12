import { ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import { useUser, useClerk } from '@clerk/react';
import { LayoutDashboard, Megaphone, Users, Handshake, DollarSign, MessageSquare, FileText, Mail, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
  { icon: Megaphone, label: 'Programmes', path: '/admin/programmes' },
  { icon: FileText, label: 'News', path: '/admin/news' },
  { icon: LayoutDashboard, label: 'Impact Stats', path: '/admin/impact' },
  { icon: MessageSquare, label: 'Messages', path: '/admin/messages' },
  { icon: Users, label: 'Volunteers', path: '/admin/volunteers' },
  { icon: Handshake, label: 'Partnerships', path: '/admin/partnerships' },
  { icon: DollarSign, label: 'Pledges', path: '/admin/donations' },
  { icon: FileText, label: 'Documents', path: '/admin/documents' },
  { icon: Mail, label: 'Newsletter', path: '/admin/newsletter' },
];

export function AdminLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { user } = useUser();
  const { signOut } = useClerk();

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-emerald-950 text-emerald-50 flex flex-col h-full shrink-0">
        <div className="h-20 flex items-center px-6 border-b border-emerald-900">
          <Link href="/" className="font-bold text-xl text-white flex items-center gap-3">
            <img src="/logo.svg" alt="Logo" className="h-8 w-8" />
            <span>Admin</span>
          </Link>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6">
          <nav className="space-y-1 px-3">
            {navItems.map((item) => {
              const isActive = location === item.path || (item.path !== '/admin' && location.startsWith(item.path));
              return (
                <Link 
                  key={item.path} 
                  href={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive ? 'bg-emerald-800 text-white font-medium' : 'text-emerald-100/80 hover:bg-emerald-900 hover:text-white'
                  }`}
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-emerald-900">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-emerald-800 flex items-center justify-center font-bold text-white shrink-0">
              {user?.firstName?.charAt(0) || 'A'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{user?.fullName}</p>
              <p className="text-xs text-emerald-100/60 truncate">{user?.primaryEmailAddress?.emailAddress}</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-emerald-100/80 hover:text-white hover:bg-emerald-900"
            onClick={() => signOut({ redirectUrl: '/' })}
          >
            <LogOut className="w-4 h-4 mr-3" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="h-20 bg-white border-b border-gray-200 flex items-center px-8 shrink-0">
          <h1 className="text-2xl font-bold text-gray-900">
            {navItems.find(i => location === i.path || (i.path !== '/admin' && location.startsWith(i.path)))?.label || 'Dashboard'}
          </h1>
        </header>
        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}