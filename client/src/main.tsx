import React from 'react';
import ReactDOM from 'react-dom/client';
import RouterWrapper from './router';
import ThemeWrapper from './theme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AxiosConfig from './axios';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

AxiosConfig();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeWrapper>
      <QueryClientProvider client={new QueryClient()}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <RouterWrapper />
        </LocalizationProvider>
      </QueryClientProvider>
    </ThemeWrapper>
  </React.StrictMode>
);
