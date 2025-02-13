'use client';
import { CldImage, CldUploadWidget } from 'next-cloudinary';
import { trpc } from '@/app/_trpc/client';
import { useEffect, useState } from 'react';
import type { University } from '@/db/models';
import { useSearchParams } from 'next/navigation';


export default function Page() {
  
  const mutation = trpc.searchUniversities.useMutation();
  const [state, setState] = useState({
    universities: [] as University[],
    error: null as string | null,
  });
  const searchParams = useSearchParams();

  useEffect(() => {
    const dataParam = searchParams.get('data');
    const test = dataParam ? JSON.parse(dataParam) : [];
    console.log("test", test);
    console.log("test type", typeof test);
    console.log("dataParam", dataParam);
    console.log("dataParam type", typeof dataParam);
  }, [searchParams]);
  

  
  
  useEffect(() => {
    const dataParam = searchParams.get('data');
    const dummy = dataParam ? JSON.parse(dataParam) : [];
    const fetchAllUniversities = async () => {
      const results: University[] = [];
      for (const cur of dummy) {
        try {
          const result = await fetchUniversity(cur);
          if (result) {
            results.push(result);
          }
        } catch (error) {
          setState((prevState) => ({
            ...prevState,
            error: (error as Error).message,
          }));
        }
      }
      setState((prevState) => ({
        ...prevState,
        universities: results,
      }));
    };

    fetchAllUniversities();
  }, []);

  const fetchUniversity = (cur: string): Promise<University | null> => {
    return new Promise((resolve, reject) => {
      mutation.mutate(
        {
          course_id: cur,
          sortBy: 'institution',
          order: 'asc',
          limit: 1,
        },
        {
          onSuccess: (data) => {
            if (data.status === 200 && 'universities' in data.data) {
              resolve((data.data as { universities: University[] }).universities[0]);
              // console.log((data.data as { universities: University[] }).universities[0]);
            }

            // resolve(data[0] || null);
          },
          onError: (error) => {
            reject(error);
          },
        }
      );
    });
  };

  return (
    <div>
      {/* Render the universities or error */}
      {state.error ? (
        <div>Error: {state.error}</div>
      ) : (
        <ul>
          {state.universities.map((university) => (
            <li key={university.course_id as string}>{university.program}</li>
          ))}
        </ul>
      )}
    </div>
  );
}



 // <div>
    //   <Navbar />
      
    //   <div className="text-primary-600 text-headline-3">This is Example page เทส</div>
    //   <AlertBox alertType="success" title="Success Message" message="This is a success message." />
    //   <AlertBox alertType="error" title="Error Message" message="This is an error message." />
    //   <AlertBox alertType="warning" title="Warning Message" message="This is a warning message." />
    //   <AlertBox alertType="info" title="Info Message" message="This is an info message." />
    //   <Footer />
    // </div>
    // <>
    //   <CldImage
    //   src="learn-tor/test/custom-public-id" // Use this sample image or upload your own via the Media Explorer
    //   width="500" // Transform the image: auto-crop to square aspect_ratio
    //   height="500"
    //   alt="Sample image" // Add alt text for accessibility
    //   crop={{
    //     type: 'auto',
    //     source: true
    //   }}
    //   />
    //   <CldUploadWidget
    //     uploadPreset='learn-tor'
    //     signatureEndpoint='/api/sign-image'
    //     // https://next.cloudinary.dev/clduploadwidget/configuration
    //     options={{
    //       folder: 'learn-tor/test', // Specify the folder path
    //       publicId: 'custom-public-id',  // Specify a custom public ID ถ้ามันใช้ทับกันมันจะเขียนทับกัน
    //       maxFileSize: 5000000, // 5 MB limit ไม่ต้องใส่ก็ใช้ได้
    //     }}
        
    //     onSuccess={(results) => {
    //       if (results.info)  {
    //         if (typeof results.info !== 'string' && results.info.public_id) {
    //           console.log('Public ID', results.info.public_id);
    //         } else {
    //           console.log('No public ID');
    //         }
    //     }       
    //     }}
    //   >
    //     {({ open }) => (
    //       <button onClick={() => open()}>Upload new image</button>
    //     )}
    //   </CldUploadWidget>

    // <img src="https://res.cloudinary.com/ddwxdqhwr/image/upload/f_auto,q_auto/learn-tor/test/custom-public-id"/>
