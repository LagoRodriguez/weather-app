import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import i18n from './i18n';

import { CssBaseline } from "@mui/material";
import { SnackbarProvider } from "notistack";


createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <SnackbarProvider>
            <CssBaseline/>
            <App />
        </SnackbarProvider>
  </React.StrictMode>
)
