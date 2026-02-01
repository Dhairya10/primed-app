import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from '@tanstack/react-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/query-client';
import { router } from './router';
import { registerServiceWorker } from './lib/sw-registration';
import { AuthInitializer } from './components/auth/AuthInitializer';
import { IS_AUTH_ENABLED } from './lib/constants';
import './styles/index.css';

// Register Service Worker for background audio upload (production only)
if (import.meta.env.PROD) {
  registerServiceWorker().catch((error) => {
    console.error('Service Worker registration failed:', error);
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      {IS_AUTH_ENABLED ? (
        <AuthInitializer>
          <RouterProvider router={router} />
        </AuthInitializer>
      ) : (
        <RouterProvider router={router} />
      )}
    </QueryClientProvider>
  </React.StrictMode>
);
