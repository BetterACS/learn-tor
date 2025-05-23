'use client';
import { useEffect, useState } from 'react';
import { Button, AlertBox , AddTagPopup, ImageFullView } from '@/components/index';
import { useRouter } from 'next/navigation';
import { trpc } from '@/app/_trpc/client';
import { useSession } from 'next-auth/react';
import type {Topic} from '@/db/models';
import imageCompression from 'browser-image-compression';

interface PostData {
  title: string;
  body: string;
  imgs: string[];
}

type Tag = {
  tagname: string;
  category: string;
  count?: number;
}

export default function CreateTopic() {
  const router = useRouter();
  const { data: session } = useSession();

  const mutationTag = trpc.addTags.useMutation();
  const mutation = trpc.createTopic.useMutation();
  const deleteTopic = trpc.deleteTopic.useMutation();

  const [postData, setPostData] = useState<PostData>({
    title: '',
    body: '',
    imgs: [],
  });
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  // const [tagsWCategory, setTagsWCategory] = useState<Record<string, Tag[]>>({});
  const [tags, setTags] = useState<Tag[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isImageFull, setIsImageFull] = useState(false);
  const [clickedId, setClickedId] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false); // Fully loaded state
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleOnClickPost = async () => {
    setError('');
    setSuccess('');
    setIsCreating(true);
    // NO TITLE
    if (postData.title === "") {
      setIsCreating(false);
      setError("Title is required");
      return;
    } 

    let uploadedImageUrls: string[] = [];

    if (postData.imgs.length > 0) {
      try {
        const uploadResults = await Promise.all(postData.imgs.map(async (img) => {
          const res = await fetch('/api/upload-image', {
            method: 'POST',
            body: JSON.stringify({ file: img }),
            headers: {
              'Content-Type': 'application/json',
            }
          });

          const data = await res.json();
          return data.secure_url || null;
        }));

        uploadedImageUrls = uploadResults.filter(Boolean) as string[];
      } catch (err) {
        console.error('Image upload failed', err);
        setIsCreating(false);
        return;
      }
    }
    
    // STORE DATA
    mutation.mutate(
      { 
        title: postData.title,
        body: postData.body,
        email: session?.user?.email || '',
        imgs: uploadedImageUrls,
      },
      {
        onSuccess: async (data) => {
          if (data.status !== 200) {
            setIsCreating(false);
            setError(data.data.message);
          } else if (data.status === 200) {
            console.log("Mutation Successful:", data);

            const topicId = data.data.topic._id;

            if (tags.length > 0) {
              try {
                await mutationTag.mutateAsync({
                  topicId: topicId,
                  tags: tags.map(({ tagname, category }) => ({ tagname, category })),
                });
  
                console.log("Tags added successfully");
  
                // After successful tag addition, navigate to the new post
                if ('topic' in data.data) {
                  setSuccess("Create topic successfully.");
                  setTimeout(() => {
                    setIsCreating(false);
                    router.push(`/forum/${(data.data.topic as Topic)._id}`);
                  }, 2000);
                } else {
                  setError("Topic data is missing");
                }
              } catch (error) {
                console.error("Tag mutation failed, rolling back topic creation", error);
                
                // Rollback: Delete the topic if tag mutation fails
                try {
                  await deleteTopic.mutateAsync({
                    topicId: topicId,
                    email: session?.user?.email || '',
                  });
  
                  console.log("Topic rolled back successfully.");
                } catch (rollbackError) {
                  console.error("Rollback failed", rollbackError);
                } finally {
                  setIsCreating(false);
                }
                
                setError("Failed to add tags, topic has been deleted.");
              } finally {
                setIsCreating(false);
              }
            } else if ('topic' in data.data) {
              setSuccess("Create topic successfully.");
              setTimeout(() => {
                setIsCreating(false);
                router.push(`/forum/${(data.data.topic as Topic)._id}`);
              }, 2000);
            }
          }
        },
        onError: (error) => {
          console.error("Topic creation failed:", error);
          setIsCreating(false);
          setError("Failed to create topic.");
        },
      }
    );
  };

  const handleImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
  
    const maxSizeMB = 10;
    const newImages: string[] = [];
  
    for (const file of files) {
      try {
        let fileToUse = file;
  
        if (file.size / 1024 / 1024 > maxSizeMB) {
          const options = {
            maxSizeMB,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
          };
          fileToUse = await imageCompression(file, options);
        }
  
        const base64 = await blobToBase64(fileToUse) as string;
        newImages.push(base64);
      } catch (error) {
        console.error('Error processing file:', file.name, error);
      }
    }
  
    setPostData((prev) => ({
      ...prev,
      imgs: [...prev.imgs, ...newImages],
    }));
  };
  

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

  const blobToBase64 = (blob: Blob) => {
    return new Promise((resolve, _) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  }
  
  return (
    <div className="relative h-full w-full px-[5%]">
      <p className={`text-headline-3 w-full maxmd:text-headline-4 mb-6 ${isCreating ? 'text-monochrome-700' : 'text-monochrome-950'}`}>
        Create Topic
      </p>
      {error && 
        <AlertBox
        alertType="error"
        title="Error"
        message={error}
      />
      }
      {success &&
        <AlertBox
        alertType="success"
        title="Success"
        message={success}
        />
      }
      <div className="flex flex-col gap-6 ">
        {/* Display selected tags */}
        {tags.length > 0 && (
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
          <p className={`${isCreating ? 'text-monochrome-700' : 'text-monochrome-950'}`}>Title</p>
          <div className={`w-full h-fit bg-monochrome-100 py-3 px-4 rounded-md`}>
            <input
              disabled={isCreating}
              type="text"
              name="title"
              placeholder="Title"
              onChange={handleInputChange}
              value={postData.title} 
              className={`bg-transparent w-full outline-none caret-monochrome-600 ${isCreating ? 'placeholder-monochrome-300 text-monochrome-500' : 'placeholder-monochrome-600 text-monochrome-950'}`}/> 
          </div>
        </div>

        <div className="flex flex-col gap-2 text-headline-5">
          <p className={`${isCreating ? 'text-monochrome-700' : 'text-monochrome-950'}`}>Body</p>
          <div className="w-full h-fit bg-monochrome-100 py-3 px-4 rounded-md">
            <textarea
              disabled={isCreating}
              name="body"
              placeholder="Body"
              id=""
              rows={4}
              onChange={handleInputChange}
              value={postData.body}
              className={`w-full resize-none bg-transparent outline-none placeholder-monochrome-600 caret-monochrome-600 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-monochrome-200 ${isCreating ? 'placeholder-monochrome-300 text-monochrome-500' : 'placeholder-monochrome-600 text-monochrome-950'}`}
            ></textarea>
          </div>
        </div>

        {/* Image Preview */}
        {Array.isArray(postData?.imgs) && postData.imgs.length > 0 && (
          <div className="w-full h-fit flex flex-col gap-4 justify-center items-center my-6 mb-[3rem]">
            <p className="text-headline-5">Image Preview</p>
              {!isLoaded ? (
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
              )}
          </div>
        )}

        {/* Image Select */}
        {postData.imgs.length > 0 && (
        <div className="w-full h-fit flex flex-col gap-8 justify-center items-center">
          <p className="text-headline-5">Selected Image</p>
          <div className="w-full h-full flex flex-wrap gap-4 justify-center">
            {postData.imgs.map((img, index) => (
              <div key={index} className="relative w-fit h-fit flex flex-col justify-center items-center gap-2 rounded-md">
                <button 
                  disabled={isCreating}
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
            ))}
          </div>
        </div>
        )}

        <div className="w-full flex justify-between">
          <div className="flex items-center gap-4">
            <svg 
              onClick={() => {
                if (!isCreating) {
                  document.getElementById('file-input')?.click();
                }
              }}
              className={`transition-all duration-200 ${isCreating ? 'text-primary-300 cursor-default' : 'text-primary-600 hover:text-primary-700 cursor-pointer'}`}
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
              pending={isCreating}
            />
          </div>
          <Button
            button_name="Post"
            variant="primary"
            onClick={handleOnClickPost}
            pending={isCreating}
          />
        </div>

        <AddTagPopup
          isPopupOpen={isPopupOpen}
          setIsPopupOpen={setIsPopupOpen}
          tags={tags}
          setTags={setTags}
          state={isPopupOpen}
        />
      </div>
      {/* Image Full View */}
      {postData && (
        <ImageFullView isImageFull={isImageFull} setIsImageFull={setIsImageFull} imgs={postData.imgs || []} clickedId={clickedId}/>
      )}
    </div>
  );
}