'use client';
import { Navbar, Footer } from '@/components/index';

export default function Page() {
  return (
    <div>
      <Navbar />

      <div className="text-primary-600 text-headline-3">This is about us page</div>
      <Footer />
    </div>
  );
}
