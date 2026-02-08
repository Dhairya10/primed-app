import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  useNavigate,
  useParams,
  useRouterState,
} from '@tanstack/react-router';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';
import { BackgroundParticles } from '@/components/ui/BackgroundParticles';
import { Landing } from '@/pages/Landing';
import { About } from '@/pages/About';
import { AppNavigation } from '@/components/layout/AppNavigation';
import { Home } from '@/pages/Home';
import { Dashboard } from '@/pages/Dashboard';
import { Profile } from '@/pages/Profile';
import { Library } from '@/pages/Library';
import { SkillDetailScreen } from '@/pages/SkillDetailScreen';
import { FeedbackScreen } from '@/pages/FeedbackScreen';
import { DrillSession } from '@/pages/DrillSession';
import { LoadingScreen } from '@/components/drill/LoadingScreen';
import { Onboarding } from '@/pages/Onboarding';
import { Login } from '@/pages/Login';
import { Signup } from '@/pages/Signup';
import { ForgotPassword } from '@/pages/ForgotPassword';
import { ResetPassword } from '@/pages/ResetPassword';
import { VerifyEmail } from '@/pages/VerifyEmail';
import { OAuthCallback } from '@/pages/auth/Callback';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { PublicRoute } from '@/components/auth/PublicRoute';
import { IS_AUTH_ENABLED } from '@/lib/constants';

const rootRoute = createRootRoute({
  component: () => (
    <div className="bg-black text-white min-h-screen font-sans overflow-x-hidden">
      <Outlet />
    </div>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => (
    <>
      <BackgroundParticles />
      <Navigation />
      <Landing />
      {/* <Footer /> */}
    </>
  ),
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: () => (
    <>
      <BackgroundParticles />
      <Navigation />
      <About />
      {/* <Footer /> */}
    </>
  ),
});

const authenticatedLayout = createRoute({
  getParentRoute: () => rootRoute,
  id: 'authenticated',
  component: () => {
    const pathname = useRouterState({
      select: (state) => state.location.pathname,
    });
    const isDrillRoute = pathname.startsWith('/drill/');
    const content = (
      <div className="bg-black text-white min-h-screen">
        {!isDrillRoute && <AppNavigation />}
        <Outlet />
      </div>
    );

    // Only protect routes when auth is enabled
    if (IS_AUTH_ENABLED) {
      return <ProtectedRoute requireOnboarding>{content}</ProtectedRoute>;
    }

    return content;
  },
});

const homeRoute = createRoute({
  getParentRoute: () => authenticatedLayout,
  path: '/home',
  component: Home,
});

const dashboardRoute = createRoute({
  getParentRoute: () => authenticatedLayout,
  path: '/dashboard',
  component: Dashboard,
});

const profileRoute = createRoute({
  getParentRoute: () => authenticatedLayout,
  path: '/profile',
  component: Profile,
});

const libraryRoute = createRoute({
  getParentRoute: () => authenticatedLayout,
  path: '/library',
  component: Library,
});

const skillDetailRoute = createRoute({
  getParentRoute: () => authenticatedLayout,
  path: '/skills/$skillId',
  component: SkillDetailScreen,
});

const drillSessionRoute = createRoute({
  getParentRoute: () => authenticatedLayout,
  path: '/drill/$sessionId',
  component: DrillSession,
});

const drillLoadingRoute = createRoute({
  getParentRoute: () => authenticatedLayout,
  path: '/drill/loading/$problemId',
  component: () => {
    const params = useParams({ strict: false });
    const navigate = useNavigate();
    const problemId = params.problemId as string;

    return (
      <LoadingScreen
        problemId={problemId}
        onCancel={() => navigate({ to: '/library' })}
      />
    );
  },
});

const feedbackRoute = createRoute({
  getParentRoute: () => authenticatedLayout,
  path: '/feedback/$sessionId',
  component: FeedbackScreen,
});

const onboardingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/onboarding',
  component: () => {
    // Only protect onboarding when auth is enabled
    if (IS_AUTH_ENABLED) {
      return (
        <ProtectedRoute>
          <Onboarding />
        </ProtectedRoute>
      );
    }
    return <Onboarding />;
  },
});

// Auth routes (login, signup, etc.)
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: () => {
    // Only use PublicRoute when auth is enabled
    if (IS_AUTH_ENABLED) {
      return (
        <PublicRoute>
          <Login />
        </PublicRoute>
      );
    }
    return <Login />;
  },
});

const signupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/signup',
  component: () => {
    if (IS_AUTH_ENABLED) {
      return (
        <PublicRoute>
          <Signup />
        </PublicRoute>
      );
    }
    return <Signup />;
  },
});

const forgotPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/forgot-password',
  component: () => {
    if (IS_AUTH_ENABLED) {
      return (
        <PublicRoute>
          <ForgotPassword />
        </PublicRoute>
      );
    }
    return <ForgotPassword />;
  },
});

const resetPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reset-password',
  component: ResetPassword,
});

const verifyEmailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/verify-email',
  component: VerifyEmail,
});

const authCallbackRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auth/callback',
  component: OAuthCallback,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  aboutRoute,
  loginRoute,
  signupRoute,
  forgotPasswordRoute,
  resetPasswordRoute,
  verifyEmailRoute,
  authCallbackRoute,
  onboardingRoute,
  authenticatedLayout.addChildren([
    homeRoute,
    dashboardRoute,
    profileRoute,
    libraryRoute,
    skillDetailRoute,
    drillLoadingRoute,
    drillSessionRoute,
    feedbackRoute,
  ]),
]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
