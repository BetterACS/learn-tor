'use client';
import { Navbar, Footer, AlertBox } from '@/components/index';

export default function Page() {
  return (
    <div>
      <Navbar />
      
      <div className="text-primary-600 text-headline-3">This is Example page เทส</div>
      <AlertBox alertType="success" title="Success Message" message="This is a success message." />
      <AlertBox alertType="error" title="Error Message" message="This is an error message." />
      <AlertBox alertType="warning" title="Warning Message" message="This is a warning message." />
      <AlertBox alertType="info" title="Info Message" message="This is an info message." />
      <Footer />
    </div>
  );
}
