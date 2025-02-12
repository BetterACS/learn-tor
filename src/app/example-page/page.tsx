'use client';
import { Navbar, Footer, AlertBox } from '@/components/index';
import { CldImage, CldUploadWidget } from 'next-cloudinary';
export default function Page() {
  return (
    // <div>
    //   <Navbar />
      
    //   <div className="text-primary-600 text-headline-3">This is Example page เทส</div>
    //   <AlertBox alertType="success" title="Success Message" message="This is a success message." />
    //   <AlertBox alertType="error" title="Error Message" message="This is an error message." />
    //   <AlertBox alertType="warning" title="Warning Message" message="This is a warning message." />
    //   <AlertBox alertType="info" title="Info Message" message="This is an info message." />
    //   <Footer />
    // </div>
    <>
      <CldImage
      src="naw7ewycl70ytakxcgyz" // Use this sample image or upload your own via the Media Explorer
      width="500" // Transform the image: auto-crop to square aspect_ratio
      height="500"
      alt="Sample image" // Add alt text for accessibility
      crop={{
        type: 'auto',
        source: true
      }}
      />
      <CldUploadWidget
        uploadPreset='learn-tor'
        signatureEndpoint='/api/sign-image'
        options={{
          folder: 'learn-tor/test', // Specify the folder path
          publicId: 'custom-public-id',  // Specify a custom public ID ถ้ามันใช้ทับกันมันจะเขียนทับกัน
          maxFileSize: 5000000, // 5 MB limit ไม่ต้องใส่ก็ใช้ได้
        }}
        onSuccess={(results) => {
          if (results.info)  {
            if (typeof results.info !== 'string' && results.info.public_id) {
              console.log('Public ID', results.info.public_id);
            } else {
              console.log('No public ID');
            }
        }       
        }}
      >
        {({ open }) => (
          <button onClick={() => open()}>Upload new image</button>
        )}
      </CldUploadWidget>

    <img src="https://res.cloudinary.com/ddwxdqhwr/image/upload/f_auto,q_auto/p3enppi5sbyg74bpkkds"/>
  </>
  );
}
