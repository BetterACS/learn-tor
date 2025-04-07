'use client';
import { useEffect, useState } from 'react';
import { Button, AlertBox , AddTagPopup } from '@/components/index';
import { useRouter } from 'next/navigation';
import { trpc } from '@/app/_trpc/client';
import { useSession } from 'next-auth/react';
import type {Topic} from '@/db/models';
import imageCompression from 'browser-image-compression';

interface PostData {
  title: string;
  body: string;
  img: string;
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
    img: '',
  });
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  // const [tagsWCategory, setTagsWCategory] = useState<Record<string, Tag[]>>({});
  const [tags, setTags] = useState<Tag[]>([]);
  const [error, setError] = useState('');

  const handleOnClickPost = async () => {
    setError('');

    // NO TITLE
    if (postData.title === "") {
      setError("Title is required");
      return;
    } 

    // UPLOAD IMAGE
    let uploadedImageUrl = '';
    if (postData.img) {
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
          uploadedImageUrl = data.secure_url;
          console.log("Upload image successfully");
        }
      } catch (error) {
        console.error('Image upload failed', error);
        return;
      }
    }
    
    // STORE DATA
    mutation.mutate(
      { 
        title: postData.title,
        body: postData.body,
        email: session?.user?.email || '',
        img: uploadedImageUrl,
      },
      {
        onSuccess: async (data) => {
          if (data.status !== 200) {
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
                  router.push(`/forum/${(data.data.topic as Topic)._id}?${JSON.stringify({
                    ...data.data.topic,
                    img: uploadedImageUrl,
                  })}`);
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
  
                  console.log("Topic rolled back successfully");
                } catch (rollbackError) {
                  console.error("Rollback failed", rollbackError);
                }
  
                setError("Failed to add tags, topic has been deleted.");
              }
            } else if ('topic' in data.data) {
              console.log("No tags to add.");
              router.push(`/forum/${(data.data.topic as Topic)._id}?${JSON.stringify({
                ...data.data.topic,
                img: uploadedImageUrl,
              })}`);
            }
          }
        },
        onError: (error) => {
          console.error("Topic creation failed:", error);
          setError("Failed to create topic.");
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
      }
    }
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
      <p className="text-headline-3 w-full maxmd:text-headline-4 mb-6">
        Create Topic
      </p>
      {error && 
        <AlertBox
        alertType="error"
        title="Error"
        message={error}
      />
      }
      <div className="flex flex-col gap-6 ">
        {/* Display selected tags */}
        {tags.length > 0 && (
          <div className="flex gap-2 items-center">
            <p className="text-headline-6">Selected Tags:</p>
            <div className="flex gap-2">
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
            button_name="Post"
            variant="primary"
            onClick={handleOnClickPost}
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
    </div>
  );
}