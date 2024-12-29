import '../styles/globals.css';
import React from 'react';
import type { AppProps } from 'next/app';
import { DarkModeProvider } from '../context/DarkModeContext';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <DarkModeProvider>
      <Component {...pageProps} />
    </DarkModeProvider>
  );
}

export default MyApp;