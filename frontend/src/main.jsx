import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App.jsx';
import './index.css';

function getErrorMessage(error) {
  return error?.response?.data?.message || error?.message || 'Something went wrong while loading music.';
}

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      window.dispatchEvent(new CustomEvent('sonic:error', { detail: getErrorMessage(error) }));
    },
  }),
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
);

