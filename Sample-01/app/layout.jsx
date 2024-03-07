'use client';

import './globals.css';
import { NavBar } from '../components/Navbar';
import React, { ReactNode } from 'react';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { ThemeProvider } from '../components/MaterialTailwind';
import { ShoppingCartProvider } from '../context/ShoppingCartContext';



export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>BRS Automotive NextJS App</title>
      </head>
      <body>
        <ThemeProvider>
          <UserProvider>
            <ShoppingCartProvider>
              <main id="app" className="d-flex flex-column h-100" data-autoid="layout">
                <NavBar />
                <div className="flex-grow-1 mt-5 max-w-[1200px] my-0 mx-auto">
                  {children}
                </div>
              </main>
            </ShoppingCartProvider>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
