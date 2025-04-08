'use client';
import { useEffect, useState } from 'react';
import { Button, AlertBox , AddTagPopup, LoadingCircle, ErrorLoading, ConfirmModule, ImageFullView } from '@/components/index';
import { useParams, useRouter } from 'next/navigation';
import { trpc } from '@/app/_trpc/client';
import { useSession } from 'next-auth/react';
import type {Topic} from '@/db/models';
import imageCompression from 'browser-image-compression';
import { extractPublicId } from 'cloudinary-build-url';

interface PostData {
  id?: string,
  title: string,
  body: string,
  imgs: string[]
}

type Tag = {
  tagname: string;
  category: string;
  count?: number;
}

export default function EditTopic() {
  const router = useRouter();
  const { topicId } = useParams();
  const { data: session } = useSession();

  const queryData = trpc.queryTopicById.useQuery({ Id: topicId });
  const { data, isLoading, isError, refetch } = queryData;

  const mutationTag = trpc.updateTags.useMutation();
  const mutation = trpc.updateTopic.useMutation();
  const deleteTopicMutation = trpc.deleteTopic.useMutation();

  const [postData, setPostData] = useState<PostData>({
    id: '',
    title: '',
    body: '',
    imgs: [],
  });
  const [originalImages, setOriginalImages] = useState<string[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [tags, setTags] = useState<Tag[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoaded, setIsLoaded] = useState(false); // Fully loaded state
  const [isConfirmModuleOpen, setIsConfirmModuleOpen] = useState(false);
  const [isImageFull, setIsImageFull] = useState(false);
  const [clickedId, setClickedId] = useState<string>('');

  useEffect(() => {
    if (isLoading) return;
    let fetchedData = data?.data[0];

    setPostData({
      title: fetchedData.title,
      body: fetchedData.body,
      imgs: fetchedData.imgs,
    });

    setTimeout(() => {
      setIsLoaded(true);
    }, 500);

    setOriginalImages(fetchedData.imgs);

    if (tags.some(tag => Object.keys(tag).length > 0)) {
      setTags(fetchedData.tags);
    };
    
  }, [isLoading, data])

  
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setPostData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOnClickAddTags = () => {
    setIsPopupOpen(true);
  };

  const handleOnClickSave = async () => {
    setError('');
    setSuccess('');
  
    // NO TITLE
    if (postData.title === "") {
      setError("Title is required");
      return;
    }
  
    // UPLOAD IMAGES
    const imageUrls: string[] = [];
  
    for (const img of postData.imgs) {
      let imageUrl = '';
      const compareResult = await compareImages(originalImages, img); //link, base64

      if (img && !compareResult) {
        try {
          const res = await fetch('/api/upload-image', {
            method: 'POST',
            body: JSON.stringify({ file: img }),
            headers: {
              'Content-Type': 'application/json',
            }
          });
  
          const data = await res.json();
          if (data.secure_url) {
            imageUrl = data.secure_url;
            console.log('Image uploaded successfully:', data.secure_url);
          }
        } catch (error) {
          console.error('Image upload failed', error);
          setError('Image upload failed');
          return; // Exit early on error
        }
      } else if (img && compareResult) {
        console.log("old image");
        imageUrl = compareResult;
      } else {
        console.log("remove image");
        imageUrl = '';
      }
  
      if (imageUrl) imageUrls.push(imageUrl);
    }

    // DELETE OLD IMAGE
    for (let i = 0; i < originalImages.length; i++) {
      const originalImage = originalImages[i];

      if (!imageUrls.includes(originalImage)) {
        try {
          const oldImagePublicId = extractPublicId(originalImage);
          const deleteRes = await fetch('/api/delete-image', {
            method: 'POST',
            body: JSON.stringify({ public_id: oldImagePublicId }),
            headers: {
              'Content-Type': 'application/json',
            },
          });

          const deleteResult = await deleteRes.json();
          if (deleteResult.status !== 'ok') {
            console.error('Failed to delete the old image');
            setError('Failed to delete the old image');
            return;
          }

          console.log('Old image deleted successfully');
        } catch (error) {
          console.error('Error deleting old image', error);
          setError('Error deleting old image');
          return;
        }
      }
    }
  
    // Save data
    mutation.mutate(
      {
        id: topicId,
        title: postData.title,
        body: postData.body,
        email: session?.user?.email || '',
        imgs: imageUrls, // Send the array of images
      },
      {
        onSuccess: (data) => {
          if (data.status === 200) {
            setSuccess(data.data.message);
            const topicId = data.data.topic._id;
            if (tags.length > 0) {
              mutationTag.mutate(
                {
                  topicId: topicId,
                  tags: tags.map(({ tagname, category }) => ({ tagname, category })),
                  email: session?.user?.email || '',
                },
                {
                  onSuccess: (data) => {
                    setSuccess(data.data.message);
                  },
                  onError: (error) => {
                    console.error("Tag mutation error:", error);
                  },
                }
              );
            }
  
            router.push(`/forum/${topicId}`);
          }
        },
        onError: (error) => {
          console.error("Mutation Failed:", error);
          setError(error.message);
        },
      }
    );
  };

  const handleImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const selectedImages: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const maxSizeMB = 10;
        if (file.size / 1024 / 1024 <= maxSizeMB) {
          const base64file = await blobToBase64(file) as string;
          selectedImages.push(base64file);
        } else {
          const options = {
            maxSizeMB,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
          };
  
          try {
            const compressedFile = await imageCompression(file, options);
            const base64file = await blobToBase64(compressedFile) as string;
            selectedImages.push(base64file);
          } catch (error) {
            console.log(error);
          }
        }
      }
      setPostData((prev) => ({ ...prev, imgs: [ ...prev.imgs, ...selectedImages ] }));
    }
  };
    
  const handleOnDeleteConfirm = () => {
    deleteTopicMutation.mutate(
      {
        topicId: topicId,
        email: session?.user?.email || '',
      },
      {
        onSuccess: (data) => {
          console.log("Delete successfully" + data);
          setSuccess(data.data.message);
          router.push(`/forum`)
        },
        onError: (error) => {
          console.error("Delete error:", error);
          setError(error.message);
        },
      }
    );
  };

  const handleOnDeletecancel = () => {
    setIsConfirmModuleOpen(false);
  };

  const blobToBase64 = (blob: Blob) => {
    return new Promise((resolve, _) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  }

  const compareImages = async (cloudinaryImageUrls: string[], base64Image: string): Promise<string | null> => {
    for (let url of cloudinaryImageUrls) {
      const result = await compareSingleImage(url, base64Image);
      if (result) {
        return result
      }
    }
    return null;
  };
  
  const compareSingleImage = async (cloudinaryImageUrl: string, base64Image: string): Promise<string | null> => {
    try {
      // Fetch Cloudinary image URL -> Blob
      const response = await fetch(cloudinaryImageUrl);
      const imageBlob = await response.blob();
  
      // Convert Blob -> base64
      const cloudinaryBase64 = await blobToBase64(imageBlob);
  
      // Compare the base64
      if (cloudinaryBase64 === base64Image) {
        return cloudinaryImageUrl; // url
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error comparing images:', error);
      return null;
    }
  };

  if (!isLoaded) {
    return <LoadingCircle />
  } else if (isError) {
    return <ErrorLoading />
  }

  return (
    <div className="relative h-full w-full px-[5%]">
      <p className="text-headline-3 mb-6">
        Edit Topic
      </p>
      {error && 
        <AlertBox
        alertType="error"
        title="Error"
        message={error}
      />
      }
      {/* {success &&
        <AlertBox
        alertType="success"
        title="Success"
        message={success}
        />
      } */}
      <div className="flex flex-col gap-6">
        {/* Display selected tags */}
        {tags.some(tag => Object.keys(tag).length > 0) && (
          <div className="flex flex-col gap-1 items-center">
            <p className="self-start text-headline-6">Selected Tags</p>
            <div className="flex gap-2 flex-wrap w-full">
              {tags.map((tag, index) => (
                <div
                  key={index}
                  className={`text-body-1 border border-green-600 rounded-[1rem] px-3 py-2`}
                >
                  {tag.tagname}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2 text-headline-5">
          <p>Title</p>
          <div className="w-full h-fit bg-monochrome-100 py-3 px-4 rounded-md">
            <input
              type="text"
              name="title"
              placeholder="Title"
              onChange={handleInputChange}
              value={postData.title} 
              className="bg-transparent w-full outline-none placeholder-monochrome-600 caret-monochrome-600"/> 
          </div>
        </div>

        <div className="flex flex-col gap-2 text-headline-5">
          <p>Body</p>
          <div className="w-full h-fit bg-monochrome-100 py-3 px-4 rounded-md">
            <textarea
              name="body"
              placeholder="Body"
              id=""
              rows={4}
              onChange={handleInputChange}
              value={postData.body}
              className="w-full resize-none bg-transparent outline-none placeholder-monochrome-600 caret-monochrome-600 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-monochrome-200"
            ></textarea>
          </div>
        </div>

        {/* Image Preview */}
        <div className="w-full h-fit flex flex-col gap-4 justify-center items-center my-6 mb-[3rem]">
          <p className="text-headline-5">Image Preview</p>
          {Array.isArray(postData?.imgs) && postData.imgs.length > 0 && 
            (!isLoaded ? (
              <div className="w-[30rem] maxnm:md:w-[25rem] maxmd:min2sm:w-[40rem] max2sm:w-[25rem] h-[25rem] maxnm:md:h-[20rem] maxmd:min2sm:h-[35rem] max2sm:h-[20rem] animate-pulse">
                <div className="w-full h-full bg-monochrome-100 rounded-md"/>
              </div>
            ) : (
              // Display multiple images layout
              postData.imgs.length === 1 && (
                <div className="flex w-[30rem] maxnm:md:w-[25rem] maxmd:min2sm:w-[40rem] max2sm:w-[25rem] h-[25rem] maxnm:md:h-[20rem] maxmd:min2sm:h-[35rem] max2sm:h-[20rem]">
                  {postData.imgs.map((img, index) => (
                    <div 
                      id={img} 
                      key={index} 
                      onClick={(e) => {setIsImageFull(true); setClickedId(e.currentTarget.id);}}
                      className="h-full w-full rounded-sm bg-monochrome-950"
                    >
                      <img src={img || '/'} className="h-full w-full object-cover rounded-sm"/>
                    </div>
                  ))}
                </div>
              )
              ||
              postData.imgs.length === 2 && (
                <div className="grid grid-cols-2 gap-[1px] w-[30rem] maxnm:md:w-[25rem] maxmd:min2sm:w-[40rem] max2sm:w-[25rem] h-[25rem] maxnm:md:h-[20rem] maxmd:min2sm:h-[35rem] max2sm:h-[20rem]">
                  {postData.imgs.map((img, index) => (
                    <div 
                      id={img} 
                      key={index} 
                      onClick={(e) => {setIsImageFull(true); setClickedId(e.currentTarget.id);}}
                      className="h-full w-full rounded-sm bg-monochrome-950"
                    >
                      <img src={img || '/'} className="h-full w-full object-cover rounded-sm"/>
                    </div>
                  ))}
                </div>
              )
              ||
              postData.imgs.length === 3 && (
                <div className="grid grid-cols-2 grid-rows-2 gap-[1px] w-[30rem] maxnm:md:w-[25rem] maxmd:min2sm:w-[40rem] max2sm:w-[25rem] h-[25rem] maxnm:md:h-[20rem] maxmd:min2sm:h-[35rem] max2sm:h-[20rem]">
                  {postData.imgs.map((img, index) => (
                    <div 
                      id={img} 
                      key={index} 
                      onClick={(e) => {setIsImageFull(true); setClickedId(e.currentTarget.id);}}
                      className="w-full h-full rounded-sm bg-monochrome-950 first:row-span-2"
                    >
                      <img src={img || '/'} className="h-full w-full object-cover rounded-sm"/>
                    </div>
                  ))}
                </div>
              )
              ||
              postData.imgs.length === 4 && (
                <div className="grid grid-cols-2 grid-rows-2 gap-[1px] w-[30rem] maxnm:md:w-[25rem] maxmd:min2sm:w-[40rem] max2sm:w-[25rem] h-[25rem] maxnm:md:h-[20rem] maxmd:min2sm:h-[35rem] max2sm:h-[20rem]">
                  {postData.imgs.map((img, index) => (
                    <div 
                      id={img} 
                      key={index} 
                      onClick={(e) => {setIsImageFull(true); setClickedId(e.currentTarget.id);}}
                      className="w-full h-full rounded-sm bg-monochrome-950"
                    >
                      <img src={img || '/'} className="h-full w-full object-cover rounded-sm"/>
                    </div>
                  ))}
                </div>
              )
              ||
              postData.imgs.length === 5 && (
                <div className="grid grid-cols-6 grid-rows-6 gap-[1px] w-[30rem] maxnm:md:w-[25rem] maxmd:min2sm:w-[40rem] max2sm:w-[25rem] h-[25rem] maxnm:md:h-[20rem] maxmd:min2sm:h-[35rem] max2sm:h-[20rem]">
                  {postData.imgs.map((img, index) => {
                    const gridStyles = [
                      "col-span-3 row-span-3",
                      "col-start-4 col-span-3 row-span-3",
                      "col-span-2 row-start-4 row-span-3",
                      "col-start-3 col-span-2 row-start-4 row-span-3",
                      "col-start-5 col-span-2 row-start-4 row-span-3",
                    ];

                    return (
                      <div 
                        id={img} 
                        key={index} 
                        onClick={(e) => {setIsImageFull(true); setClickedId(e.currentTarget.id);}}
                        className={`${gridStyles[index]} w-full h-full rounded-sm bg-monochrome-950`}
                      >
                        <img src={img || '/'} className="h-full w-full object-cover rounded-sm"/>
                      </div>
                    );
                    
                  })}
                </div>
              )
              ||
              postData.imgs.length > 5 && (
                <div className="grid grid-cols-6 grid-rows-6 gap-[1px] w-[30rem] maxnm:md:w-[25rem] maxmd:min2sm:w-[40rem] max2sm:w-[25rem] h-[25rem] maxnm:md:h-[20rem] maxmd:min2sm:h-[35rem] max2sm:h-[20rem]">
                  {Array.from({ length: 5 }, (_, index) => {
                    const gridStyles = [
                      "col-span-3 row-span-3",
                      "col-start-4 col-span-3 row-span-3",
                      "col-span-2 row-start-4 row-span-3",
                      "col-start-3 col-span-2 row-start-4 row-span-3",
                      "col-start-5 col-span-2 row-start-4 row-span-3",
                    ];
                    return (
                      <div 
                        id={postData.imgs[index]} 
                        key={index} 
                        onClick={(e) => {setIsImageFull(true); setClickedId(e.currentTarget.id);}}
                        className={`${gridStyles[index]} w-full h-full rounded-sm bg-monochrome-950 relative`}
                      >
                        {index === 4 && (
                          <>
                            <div className="absolute w-full h-full bg-monochrome-950 opacity-60"/>
                            <div className="absolute w-full h-full flex items-center justify-center">
                              <p className="text-monochrome-50 font-medium text-headline-4 mr-4">
                                +{postData.imgs.length-5}
                              </p>
                            </div>
                          </>
                        )}
                        <img src={postData.imgs[index] || '/'} className="h-full w-full object-cover rounded-sm"/>
                      </div>
                    );
                  })}
                </div>
              )
            ))
          }
        </div>

        {/* Image Select */}
        <div className="w-full h-fit flex flex-col gap-8 justify-center items-center">
          <p className="text-headline-5">Selected Image</p>
          <div className="w-full h-full flex flex-wrap gap-4 justify-center">
          {postData.imgs && (
            postData.imgs.map((img, index) => (
              <div key={index} className="relative w-fit h-fit flex flex-col justify-center items-center gap-2 rounded-md">
                <button 
                  onClick={() => setPostData((prev) => ({ ...prev, imgs: postData.imgs.filter(item => item !== img) }))} className="size-6 text-red-800 self-end"
                >
                  <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
                    <path fill="currentColor" d="M24.879 2.879A3 3 0 1 1 29.12 7.12l-8.79 8.79a.125.125 0 0 0 0 .177l8.79 8.79a3 3 0 1 1-4.242 4.243l-8.79-8.79a.125.125 0 0 0-.177 0l-8.79 8.79a3 3 0 1 1-4.243-4.242l8.79-8.79a.125.125 0 0 0 0-.177l-8.79-8.79A3 3 0 0 1 7.12 2.878l8.79 8.79a.125.125 0 0 0 .177 0z"></path>
                  </svg>
                </button>
                <div className="flex w-fit h-[15rem] self-center pointer-events-none">
                  <img
                    src={img}
                    alt="Uploaded"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            ))
          )}
          </div>
        </div>

        <div className="w-full flex justify-between">
          <div className="flex items-center gap-4">
            <svg 
              onClick={() => document.getElementById('file-input')?.click()}
              className="text-primary-600 hover:text-primary-700 transition-all duration-200 cursor-pointer"
              xmlns="http://www.w3.org/2000/svg"
              width={24}
              height={24}
              viewBox="0 0 24 24"
            >
              <path fill="currentColor" d="M19 10a1 1 0 0 0-1 1v3.38l-1.48-1.48a2.79 2.79 0 0 0-3.93 0l-.7.71l-2.48-2.49a2.79 2.79 0 0 0-3.93 0L4 12.61V7a1 1 0 0 1 1-1h8a1 1 0 0 0 0-2H5a3 3 0 0 0-3 3v12.22A2.79 2.79 0 0 0 4.78 22h12.44a3 3 0 0 0 .8-.12a2.74 2.74 0 0 0 2-2.65V11A1 1 0 0 0 19 10M5 20a1 1 0 0 1-1-1v-3.57l2.89-2.89a.78.78 0 0 1 1.1 0L15.46 20Zm13-1a1 1 0 0 1-.18.54L13.3 15l.71-.7a.77.77 0 0 1 1.1 0L18 17.21Zm3-15h-1V3a1 1 0 0 0-2 0v1h-1a1 1 0 0 0 0 2h1v1a1 1 0 0 0 2 0V6h1a1 1 0 0 0 0-2"></path>
            </svg>

            {/* Image input */}
            <input
              type="file"
              id="file-input"
              accept="image/*"
              multiple
              style={{ display: 'none' }}
              onChange={handleImageSelect}
            />

            <Button
              button_name="Add tags"
              variant="secondary"
              onClick={handleOnClickAddTags}
            />
          </div>
          <Button
            button_name="Save"
            variant="primary"
            onClick={handleOnClickSave}
          />
        </div>

        <Button
          button_name="Delete"
          variant="red"
          onClick={() => setIsConfirmModuleOpen(true)}
        />

        <AddTagPopup
          isPopupOpen={isPopupOpen}
          setIsPopupOpen={setIsPopupOpen}
          tags={tags}
          setTags={setTags}
          state={isPopupOpen}
        />

        <ConfirmModule 
          text='Do you want to delete this topic?' 
          description='This topic will be permanently deleted and cannot be restored.' 
          confirmText='Delete'
          cancelText='Cancel'
          confirmHandle={handleOnDeleteConfirm}
          cancelHandle={handleOnDeletecancel}
          state={isConfirmModuleOpen}
        />
      </div>
      {/* Image Full View */}
      {postData && (
        <ImageFullView isImageFull={isImageFull} setIsImageFull={setIsImageFull} imgs={postData.imgs || []} clickedId={clickedId}/>
      )}
    </div>
  );
}