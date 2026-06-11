import './globals.css';
import React from 'react';

export const metadata = {
  title: 'WorldCup Guardian AI',
  description: 'Autonomous AI travel agent for international sports events.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
