import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { useAuth } from '../features/auth/context/AuthProvider';
import { protectedRoutes } from './protected';
import { publicRoutes } from './public';
import { MainLayout } from '../components/Layout';
import { LoadingPage } from '../components/LoadingPage';

export function AppRouterProvider() {
  const { isLoggedIn } = useAuth();

  const routes = [
    {
      element: <MainLayout />,
      children: isLoggedIn ? protectedRoutes : publicRoutes,
    },
  ];

  const router = createBrowserRouter(routes);

  return <RouterProvider router={router} fallbackElement={<LoadingPage />} />;
}
