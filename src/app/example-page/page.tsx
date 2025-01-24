'use client';
import { Navbar, Footer,  AlertBox } from '@/components/index';

export default function Page() {
  return (
    <div>
      <Navbar />

      <div className="text-primary-600 text-headline-3">This is Example page เทส</div>

      {/* <AlertBox alertType="success"/>
      <AlertBox //custom
        alertType="success"
        title="Success"
        message="Your request has been processed successfully."
      /> */}

      <AlertBox alertType="error"/>
      <AlertBox
        alertType="error"
        title="Error"
        message="An error occurred while processing your request."
      />
{/* 
      <AlertBox alertType="warning"/>
      <AlertBox
        alertType="warning"
        title="Warning"
        message="Certain features are unavailable for this selection."
      /> */}

      {/* <AlertBox alertType="info"/>
      <AlertBox
        alertType="info"
        title="Info"
        message="You will receive a notification once the process is complete."
      /> */}

      <Footer />
    </div>
  );
}
