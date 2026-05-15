import { ReactNode } from 'react';
import Nav from './Nav';
import Footer from './Footer';

type LayoutProps = { children: ReactNode };

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-cream font-sans text-stone-600 antialiased">
      <Nav />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
