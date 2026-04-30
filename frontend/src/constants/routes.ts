export const ROUTES = {
  HOME: '/',
  SERVICES: '/services',

  WHY_US: '/why-us',
  ADVISOR: '/advisor',
  REVENUE_CALCULATOR: '/revenue-calculator',
  CONTACT: '/contact',
  CHAT: '/chat',
  LOGIN: '/auth/login',
  SIGNUP: '/auth/signup',
  DASHBOARD: '/dashboard',
  RESUME: '/resume',
  NOT_FOUND: '/404',
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = (typeof ROUTES)[RouteKey];
