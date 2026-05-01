import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { MainLayout } from '../layouts/MainLayout';
import { AuthLayout } from '../layouts/AuthLayout';

import PrivateRoute from '../components/PrivateRoute';

const HomePage = lazy(() => import('../pages/HomePage'));

const WhyUsPage = lazy(() => import('../pages/WhyUsPage'));
const RevenueCalculatorPage = lazy(() => import('../pages/RevenueCalculatorPage'));
const ContactPage = lazy(() => import('../pages/ContactPage'));
const ChatPage = lazy(() => import('../pages/chat/ChatPage'));
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const SignupPage = lazy(() => import('../pages/auth/SignupPage'));
const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));
const ResumePage = lazy(() => import('../pages/ResumePage'));
const OnboardingPage = lazy(() => import('../pages/OnboardingPage'));
const BundlesPage = lazy(() => import('../pages/BundlesPage'));
const ProfilePage = lazy(() => import('../pages/ProfilePage'));

const Loader = () => (
  <div className="flex h-screen items-center justify-center bg-white">
    <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
  </div>
);

export const AppRoutes = () => (
  <Suspense fallback={<Loader />}>
    <Routes>
      <Route element={<MainLayout />}>
        <Route path={ROUTES.HOME} element={<HomePage />} />

        <Route path={ROUTES.WHY_US} element={<WhyUsPage />} />
        <Route path={ROUTES.REVENUE_CALCULATOR} element={<RevenueCalculatorPage />} />
        <Route path={ROUTES.CONTACT} element={<ContactPage />} />
        <Route path={ROUTES.CHAT} element={<ChatPage />} />
        <Route path={ROUTES.ADVISOR} element={<ChatPage />} />
        <Route
          path={ROUTES.DASHBOARD}
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path={ROUTES.ONBOARDING}
          element={
            <PrivateRoute>
              <OnboardingPage />
            </PrivateRoute>
          }
        />
        <Route
          path={ROUTES.BUNDLES}
          element={
            <PrivateRoute>
              <BundlesPage />
            </PrivateRoute>
          }
        />
        <Route
          path={ROUTES.PROFILE}
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.SIGNUP} element={<SignupPage />} />
      </Route>

      <Route path={ROUTES.RESUME} element={<ResumePage />} />
      <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to={ROUTES.NOT_FOUND} replace />} />
    </Routes>
  </Suspense>
);
