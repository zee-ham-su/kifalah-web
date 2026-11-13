import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter, Redirect } from 'wouter';
import { lazy, Suspense } from 'react';
import { Layout } from '@/components/layout/Layout';

// Every page is its own chunk, fetched when first visited.
const Home = lazy(() => import('@/pages/Home').then((m) => ({ default: m.Home })));
const About = lazy(() => import('@/pages/About').then((m) => ({ default: m.About })));
const Programmes = lazy(() => import('@/pages/Programmes').then((m) => ({ default: m.Programmes })));
const ProgrammeDetail = lazy(() => import('@/pages/ProgrammeDetail').then((m) => ({ default: m.ProgrammeDetail })));
const Impact = lazy(() => import('@/pages/Impact').then((m) => ({ default: m.Impact })));
const GetInvolved = lazy(() => import('@/pages/GetInvolved').then((m) => ({ default: m.GetInvolved })));
const News = lazy(() => import('@/pages/News').then((m) => ({ default: m.News })));
const NewsArticle = lazy(() => import('@/pages/NewsArticle').then((m) => ({ default: m.NewsArticle })));
const Transparency = lazy(() => import('@/pages/Transparency').then((m) => ({ default: m.Transparency })));
const Contact = lazy(() => import('@/pages/Contact').then((m) => ({ default: m.Contact })));
const SupportUs = lazy(() => import('@/pages/SupportUs').then((m) => ({ default: m.SupportUs })));
const Privacy = lazy(() => import('@/pages/Privacy').then((m) => ({ default: m.Privacy })));
// Sign-in and admin (and Clerk, the biggest dependency) load only when someone goes there.
const AdminApp = lazy(() => import('./AdminApp'));

const queryClient = new QueryClient();
const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

const Loading = () => <div className="flex min-h-[50vh] items-center justify-center text-gray-500">Loading...</div>;

function App() {
  return (
    <TooltipProvider>
      <WouterRouter base={basePath}>
        <QueryClientProvider client={queryClient}>
          <Switch>
            <Route path="/sign-in/*?">
              <Suspense fallback={<Loading />}><AdminApp /></Suspense>
            </Route>
            <Route path="/admin/*?">
              <Suspense fallback={<Loading />}><AdminApp /></Suspense>
            </Route>

            <Route path="/*?">
              <Layout>
                <Suspense fallback={<Loading />}>
                  <Switch>
                <Route path="/" component={Home} />
                <Route path="/about" component={About} />
                <Route path="/programmes" component={Programmes} />
                <Route path="/programmes/:slug" component={ProgrammeDetail} />
                <Route path="/impact" component={Impact} />
                <Route path="/get-involved" component={GetInvolved} />
                <Route path="/news" component={News} />
                <Route path="/news/:slug" component={NewsArticle} />
                <Route path="/transparency" component={Transparency} />
                <Route path="/contact" component={Contact} />
                <Route path="/support-us" component={SupportUs} />
                <Route path="/donate"><Redirect to="/support-us" /></Route>
                <Route path="/privacy" component={Privacy} />
                <Route component={NotFound} />
                  </Switch>
                </Suspense>
              </Layout>
            </Route>
          </Switch>
        </QueryClientProvider>
      </WouterRouter>
      <Toaster />
    </TooltipProvider>
  );
}

export default App;
