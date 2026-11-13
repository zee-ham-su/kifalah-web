import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Route, Switch, useLocation, Redirect } from 'wouter';
import { ClerkProvider, SignIn, Show, useClerk, ClerkLoaded } from '@clerk/react';
import { publishableKeyFromHost } from '@clerk/react/internal';
import { shadcn } from '@clerk/themes';
import { lazy, Suspense, useEffect, useRef } from 'react';
import NotFound from '@/pages/not-found';
import { AdminLayout } from '@/pages/admin/AdminLayout';

// Everything that needs Clerk lives in this file so public visitors never download it.
// App.tsx loads it only for /sign-in and /admin.
const Dashboard = lazy(() => import('@/pages/admin/Dashboard').then((m) => ({ default: m.Dashboard })));
const ManageProgrammes = lazy(() => import('@/pages/admin/ManageProgrammes').then((m) => ({ default: m.ManageProgrammes })));
const ManageNews = lazy(() => import('@/pages/admin/ManageNews').then((m) => ({ default: m.ManageNews })));
const ManageImpact = lazy(() => import('@/pages/admin/ManageImpact').then((m) => ({ default: m.ManageImpact })));
const ManageMessages = lazy(() => import('@/pages/admin/ManageMessages').then((m) => ({ default: m.ManageMessages })));
const ManageVolunteers = lazy(() => import('@/pages/admin/ManageVolunteers').then((m) => ({ default: m.ManageVolunteers })));
const ManagePartnerships = lazy(() => import('@/pages/admin/ManagePartnerships').then((m) => ({ default: m.ManagePartnerships })));
const ManageDonations = lazy(() => import('@/pages/admin/ManageDonations').then((m) => ({ default: m.ManageDonations })));
const ManageDocuments = lazy(() => import('@/pages/admin/ManageDocuments').then((m) => ({ default: m.ManageDocuments })));
const ManageNewsletter = lazy(() => import('@/pages/admin/ManageNewsletter').then((m) => ({ default: m.ManageNewsletter })));

const clerkPubKey = publishableKeyFromHost(
  window.location.hostname,
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
);
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;
const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || "/"
    : path;
}

if (!clerkPubKey) throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY');

const clerkAppearance = {
  theme: shadcn,
  cssLayerName: "clerk",
  options: {
    logoPlacement: "inside" as const,
    logoLinkUrl: basePath || "/",
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
  },
  variables: {
    colorPrimary: "hsl(160 84% 20%)",
    colorForeground: "hsl(210 20% 12%)",
    colorMutedForeground: "hsl(210 10% 40%)",
    colorDanger: "hsl(0 84% 60%)",
    colorBackground: "hsl(0 0% 100%)",
    colorInput: "hsl(40 15% 90%)",
    colorInputForeground: "hsl(210 20% 12%)",
    colorNeutral: "hsl(40 15% 90%)",
    fontFamily: "Inter, sans-serif",
    borderRadius: "0.5rem",
  },
  elements: {
    rootBox: "w-full flex justify-center",
    cardBox: "bg-white rounded-2xl w-[440px] max-w-full overflow-hidden border border-gray-100 shadow-xl",
    card: "!shadow-none !border-0 !bg-transparent !rounded-none",
    footer: "!shadow-none !border-0 !bg-transparent !rounded-none",
    headerTitle: "text-2xl font-bold text-gray-900",
    headerSubtitle: "text-gray-600",
    socialButtonsBlockButtonText: "font-medium",
    formFieldLabel: "text-gray-900 font-medium",
    footerActionLink: "text-emerald-700 hover:text-emerald-800 font-medium",
    footerActionText: "text-gray-600",
    dividerText: "text-gray-500 text-sm",
    identityPreviewEditButton: "text-emerald-700",
    formFieldSuccessText: "text-emerald-700",
    alertText: "text-red-600",
    logoBox: "h-12 w-auto mb-6 mx-auto",
    logoImage: "h-full w-auto object-contain",
    socialButtonsBlockButton: "border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-colors",
    formButtonPrimary: "bg-emerald-700 hover:bg-emerald-800 text-white transition-colors shadow-sm",
    formFieldInput: "bg-gray-50 border-gray-200 focus:bg-white focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all",
    footerAction: "bg-gray-50/50 pt-6 pb-8 border-t border-gray-100",
    dividerLine: "bg-gray-200",
    alert: "bg-red-50 border border-red-100 text-red-800",
    otpCodeFieldInput: "border-gray-200 focus:border-emerald-600",
    formFieldRow: "mb-4",
    main: "p-8",
  },
};

function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <SignIn routing="path" path={`${basePath}/sign-in`} />
    </div>
  );
}

// Signing in is not enough: the server only admits emails on its ADMIN_EMAILS allowlist.
// This asks the server, and shows a clear message to anyone who is signed in but not allowed.
function AdminGate({ children }: { children: React.ReactNode }) {
  const { signOut } = useClerk();
  const { data, isLoading } = useQuery({
    queryKey: ['admin-me'],
    retry: false,
    queryFn: async () => {
      const res = await fetch('/api/admin/me', { credentials: 'include' });
      return res.ok;
    },
  });

  if (isLoading) return <div className="flex h-screen items-center justify-center text-gray-500">Checking access...</div>;
  if (!data) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="text-2xl font-bold text-gray-900">No access</h1>
        <p className="max-w-md text-gray-600">
          This account is not on the Foundation's admin list. If you should have access, ask an existing admin to add your email.
        </p>
        <button className="rounded-lg bg-emerald-700 px-5 py-2 font-medium text-white" onClick={() => signOut({ redirectUrl: '/' })}>
          Sign out
        </button>
      </div>
    );
  }
  return <>{children}</>;
}

function AdminRouter() {
  return (
    <Show when="signed-in">
      <AdminGate>
      <AdminLayout>
        <Suspense fallback={<div className="flex min-h-[50vh] items-center justify-center text-gray-500">Loading...</div>}>
        <Switch>
          <Route path="/admin" component={Dashboard} />
          <Route path="/admin/programmes" component={ManageProgrammes} />
          <Route path="/admin/news" component={ManageNews} />
          <Route path="/admin/impact" component={ManageImpact} />
          <Route path="/admin/messages" component={ManageMessages} />
          <Route path="/admin/volunteers" component={ManageVolunteers} />
          <Route path="/admin/partnerships" component={ManagePartnerships} />
          <Route path="/admin/donations" component={ManageDonations} />
          <Route path="/admin/documents" component={ManageDocuments} />
          <Route path="/admin/newsletter" component={ManageNewsletter} />
          <Route component={NotFound} />
        </Switch>
        </Suspense>
      </AdminLayout>
      </AdminGate>
    </Show>
  );
}

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const queryClient = useQueryClient();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (
        prevUserIdRef.current !== undefined &&
        prevUserIdRef.current !== userId
      ) {
        queryClient.clear();
      }
      prevUserIdRef.current = userId;
    });
    return unsubscribe;
  }, [addListener, queryClient]);

  return null;
}


export default function AdminApp() {
  const [, setLocation] = useLocation();

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      appearance={clerkAppearance}
      signInUrl={`${basePath}/sign-in`}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <ClerkQueryClientCacheInvalidator />
      <Switch>
        <Route path="/sign-in/*?" component={SignInPage} />
        <Route path="/admin/*?">
          <Show when="signed-in">
            <AdminRouter />
          </Show>
          <Show when="signed-out">
            <Redirect to="/sign-in" />
          </Show>
        </Route>
      </Switch>
    </ClerkProvider>
  );
}
