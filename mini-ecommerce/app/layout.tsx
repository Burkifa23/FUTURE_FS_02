import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from './components/AuthProvider';
import { CartProvider } from './components/CartProvider';
import Header from './components/Header';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ShopMini - Mini E-commerce Platform',
  description: 'A modern e-commerce platform built with Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            <div className="min-h-screen bg-gray-50">
              <Header />
              <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
              </main>
            </div>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}