'use client';
import { useEffect, useState } from 'react';
import { Button, AlertBox , AddTagPopup, LoadingCircle, ErrorLoading, ConfirmModule } from '@/components/index';
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
  img: string,
  tags: string[]
}

export default function EditTopic() {
  const router = useRouter();
  const { topicId } = useParams();
  const { data: session } = useSession();

  const queryData = trpc.queryTopicById.useQuery({ Id: topicId });
  const { data, isLoading, isError, refetch } = queryData;

  const topicTagsMutation = trpc.topicTags.useMutation();
  const mutationTag = trpc.updateTags.useMutation();
  const mutation = trpc.updateTopic.useMutation();
  const deleteTopicMutation = trpc.deleteTopic.useMutation();

  const [postData, setPostData] = useState<PostData>({
    id: '',
    title: '',
    body: '',
    img: '',
    tags: [],
  });
  const [originalImage, setOriginalImage] = useState<string>('');
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [tags, setTags] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoaded, setIsLoaded] = useState(false); // Fully loaded state
  const [isConfirmModuleOpen, setIsConfirmModuleOpen] = useState(false);
  // const [confirmDelete, setComfirmDelete] = useState(false);


  useEffect(() => {
    if (isLoading) return;
    let fetchedData = data?.data[0];

    setPostData({
      title: fetchedData.title,
      body: fetchedData.body,
      img: fetchedData.img,
      tags: fetchedData.tags,
    });

    setTimeout(() => {
      setIsLoaded(true);
    }, 500);

    setOriginalImage(fetchedData.img);
    
    topicTagsMutation.mutate(
      { topic_id: String(topicId) },
      {
        onSuccess: (data) => {
          if (data.topicTags && Array.isArray(data.topicTags)) {
            const extractedTags = data.topicTags.map(tag => tag.tagname);
            setTags(extractedTags);
          }
        },
        onError: (error) => {
          console.error("Error fetching tags:", error);
        }
      }
    );

  }, [isLoading])

  useEffect(() => {
    setPostData((prev) => ({
      ...prev,
      tags: tags,
    }));
  }, [isPopupOpen]);

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
  
    // UPLOAD IMAGE
    let imageUrl = '';
    // True if selected image is same image as original image (prevent duplicate upload)
    const compareResult = await compareImages(originalImage, postData.img); //link, base64 
    if (postData.img && !compareResult) {
      try {
        const res = await fetch('/api/upload-image', {
          method: 'POST',
          body: JSON.stringify({ file: postData.img }),
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
    } else if (postData.img && compareResult) {
      console.log("old image");
      imageUrl = originalImage;
    } else {
      console.log("remove image");
      imageUrl = '';
    }
  
    // DELETE OLD IMAGE
    if (originalImage && originalImage !== imageUrl) {
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
          // If the delete fails, rollback = delete the newly uploaded image
          console.error('Failed to delete the old image');
          await fetch(`/api/delete-image`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ public_id: extractPublicId(imageUrl) }),
          });
          setError('Failed to delete the old image, rollback changes');
          return; // Exit early on error
        }
  
        console.log('Old image deleted successfully');
      } catch (error) {
        console.error('Error deleting old image', error);
        setError('Error deleting old image');
        return; // Exit early on error
      }
    }
  
    // Finally, update data after everything is complete
    mutation.mutate(
      {
        id: topicId,
        title: postData.title,
        body: postData.body,
        email: session?.user?.email || '',
        img: imageUrl || ''
      },
      {
        onSuccess: (data) => {
          if (data.status !== 200) {
            setError(data.data.message);
          } else if (data.status === 200) {
            console.log("Mutation Successful:", data);
            setSuccess(data.data.message);
  
            const topicId = data.data.topic._id;
  
            if (tags.length > 0) {
              mutationTag.mutate(
                {
                  topicId: topicId,
                  tags: tags,
                  email: session?.user?.email || '',
                },
                {
                  onSuccess: (data) => {
                    console.log("After add tag success" + data);
                    setSuccess(data.data.message);
                  },
                  onError: (error) => {
                    console.error("Tag mutation error:", error);
                  },
                }
              );
            }
  
            if ('topic' in data.data) {
              router.push(`/forum/${(data.data.topic as Topic)._id}`)
            } else {
              setError("Topic data is missing");
            }
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
      const file = event.target.files?.[0];
      if (file) {
        const maxSizeMB = 10;
        if (file.size / 1024 / 1024 <= maxSizeMB) {
          console.log('File size is already under the limit, no compression needed.');
          const base64file = await blobToBase64(file) as string;
          setPostData((prev) => ({ ...prev, img: base64file }));
        } else {
          const options = {
            maxSizeMB,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
          }
  
          try {
            const compressedFile = await imageCompression(file, options);
            console.log('compressedFile instanceof Blob', compressedFile instanceof Blob);
            console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`);
            
            const base64file = await blobToBase64(compressedFile) as string;
            setPostData((prev) => ({ ...prev, img: base64file }));
          } catch (error) {
            console.log(error);
          }
        };
      };
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

  const compareImages = async (cloudinaryImageUrl: string, base64Image: string): Promise<boolean> => {
    if (cloudinaryImageUrl === base64Image) return true;

    try {
      // Fetch Cloudinary url -> Blob
      const response = await fetch(cloudinaryImageUrl);
      const imageBlob = await response.blob();
  
      // Blob -> base64
      const cloudinaryBase64 = await blobToBase64(imageBlob);
  
      // Compare
      return cloudinaryBase64 === base64Image;
    } catch (error) {
      console.error('Error comparing images:', error);
      return false;
    }
  };

  if (!isLoaded) {
    return <LoadingCircle />
  } else if (isError) {
    return <ErrorLoading />
  }

  return (
    <div className="relative h-full w-full">
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
        {tags.length > 0 && (
          <div className="flex gap-2 items-center">
            <p className="text-headline-6">Selected Tags:</p>
            <div className="flex gap-2">
              {tags.map((tag) => (
                <div
                  key={tag}
                  className={`text-body-1 border border-green-600 rounded-[1rem] px-3 py-2`}
                >
                  {tag}
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
        {postData.img && (
          <div className="relative w-full h-fit flex flex-col justify-center items-center gap-2 rounded-md">
            <button onClick={() => setPostData((prev) => ({ ...prev, img: '' }))} className="size-6 text-red-800 self-end">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
                <path fill="currentColor" d="M24.879 2.879A3 3 0 1 1 29.12 7.12l-8.79 8.79a.125.125 0 0 0 0 .177l8.79 8.79a3 3 0 1 1-4.242 4.243l-8.79-8.79a.125.125 0 0 0-.177 0l-8.79 8.79a3 3 0 1 1-4.243-4.242l8.79-8.79a.125.125 0 0 0 0-.177l-8.79-8.79A3 3 0 0 1 7.12 2.878l8.79 8.79a.125.125 0 0 0 .177 0z"></path>
              </svg>
            </button>
            <div className="flex w-fit h-[15rem] self-center pointer-events-none">
              <img
                src={postData.img}
                alt="Uploaded"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        <div className="w-full flex justify-between">
          <div className="flex items-center gap-4">
            {postData.img ? (
              <svg 
                onClick={() => document.getElementById('file-input')?.click()}
                className="text-primary-600 hover:text-primary-700 transition-all duration-200 cursor-pointer"
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                viewBox="0 0 24 24"
              >
                <path fill="currentColor" d="M21.5 1.5a1 1 0 0 0-1 1a5 5 0 1 0 .3 7.75a1 1 0 0 0-1.32-1.51a3 3 0 1 1 .25-4.25H18.5a1 1 0 0 0 0 2h3a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-.99m-3 12a1 1 0 0 0-1 1v.39L16 13.41a2.77 2.77 0 0 0-3.93 0l-.7.7l-2.46-2.49a2.79 2.79 0 0 0-3.93 0L3.5 13.1V7.5a1 1 0 0 1 1-1h5a1 1 0 0 0 0-2h-5a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3v-5a1 1 0 0 0-1-1m-14 7a1 1 0 0 1-1-1v-3.57L6.4 13a.79.79 0 0 1 1.09 0l3.17 3.17L15 20.5Zm13-1a1 1 0 0 1-.18.53l-4.51-4.51l.7-.7a.78.78 0 0 1 1.1 0l2.89 2.9Z"></path>
              </svg>
            ) : (
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
            )}

            {/* Image input */}
            <input
              type="file"
              id="file-input"
              accept="image/*"
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

        {isPopupOpen && (
          <AddTagPopup
            isPopupOpen={isPopupOpen}
            setIsPopupOpen={setIsPopupOpen}
            tags={tags}
            setTags={setTags}
          />
        )}

        {isConfirmModuleOpen && (
          <ConfirmModule 
            text='Do you want to delete this topic?' 
            description='This topic will be permanently deleted and cannot be restored.' 
            confirmText='Delete'
            cancelText='Cancel'
            confirmHandle={handleOnDeleteConfirm}
            cancelHandle={handleOnDeletecancel}
          />
        )}

      </div>
    </div>
  );
}