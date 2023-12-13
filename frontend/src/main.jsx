import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Layout from './pages/Layout/Layout.jsx';
import AuthLayout from './pages/Auth/AuthLayout/AuthLayout.jsx';
import Login from './pages/Auth/Login/Login.jsx';
import Register from './pages/Auth/Register/Register.jsx';
import ForgotPassword from './pages/Auth/ForgotPassword/ForgotPassword.jsx';
import ForgotPasswordConfirmation from './pages/Auth/ForgotPasswordConfirmation/ForgotPasswordConfirmation.jsx';
import ResetPassword from './pages/Auth/ResetPassword/ResetPassword.jsx';
import VerifyEmail from './pages/Auth/VerifyEmail/VerifyEmail.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            path: 'login',
            element: <Login />,
          },
          {
            path: 'forgot-password',
            element: <ForgotPassword />,
          },
          {
            path: 'forgot-password-confirmation',
            element: <ForgotPasswordConfirmation />,
          },
          {
            path: 'reset-password',
            element: <ResetPassword />,
          },
          {
            path: 'register',
            element: <Register />,
          },
          {
            path: 'verify-email',
            element: <VerifyEmail />,
          },
        ],
      },
      {
        path: '/goals',
        element: <div>Goals page</div>,
      },
      {
        path: '/records',
        element: <div>Records page</div>,
      },
      {
        path: '/statistics',
        element: <div>Statistics page</div>,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </React.StrictMode>
);
