'use client';
import { useEffect, useState } from 'react';
import { Button, AlertBox , AddTagPopup } from '@/components/index';
import { useRouter } from 'next/navigation';
import { trpc } from '@/app/_trpc/client';
import { useSession } from 'next-auth/react';
import type {Topic} from '@/db/models';
import { CldUploadWidget } from 'next-cloudinary'; // Import CldUploadWidget

interface PostData {
  title: string;
  body: string;
  img: string;
  tags: string[];
}

export default function CreateTopic() {
  const router = useRouter();
  const [postData, setPostData] = useState<PostData>({
    title: '',
    body: '',
    img: '',
    tags: [],
  });

  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    setPostData((prev) => ({
      ...prev,
      tags: tags,
    }));
  }, [isPopupOpen]);
  const { data: session } = useSession();
  const [error, setError] = useState('');

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
  // const handleOnClickPost = () => {
  //   console.log(postData);
  // }
  const mutationTag = trpc.addTags.useMutation();
  const mutation = trpc.createTopic.useMutation();
  // console.log(postData)
  const handleOnClickPost = async () => {
    setError('');
    if (postData.title === "") {
      setError("Title is required");
    } 
    else{
      mutation.mutate(
        { 
          title: postData.title,
          body: postData.body,
          email: session?.user?.email || '',
          img: postData.img || '',
        },
        {
          onSuccess: (data) => {
              if (data.status !== 200) {
                  // console.warn("Validation Error:", data.data.message);
                  setError(data.data.message);
              } else if (data.status === 200) {
                  console.log("Mutation Successful:", data);

                  const postId = data.data.topic._id;

                  console.log("Tags before mutation:", tags);

                  if (tags.length > 0) {
                    mutationTag.mutate(
                      {
                        postId: postId,
                        tags: tags,
                      },
                      {
                        onSuccess: (data) => {
                          console.log("After add tag success" + data);
                        },
                        onError: (error) => {
                          console.error("Tag mutation error:", error);
                        },
                      }
                    );
                  }

              
                  if ('topic' in data.data) {
                    router.push(`/forum/${(data.data.topic as Topic)._id}?${JSON.stringify({
                      ...data.data.topic,
                      img: postData.img,
                    })}`
                      
                    );
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
    }
  };

  return (
    <div className="relative h-full w-full">
      <p className="text-headline-3 mb-6">
        Create Topic
      </p>
      {error && 
        <AlertBox
        alertType="error"
        title="Error"
        message={error}
      />
      }
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

        {/* Image upload area */}
        <div className="w-full h-[15rem] flex flex-col justify-center items-center gap-1 border-2 border-dashed border-monochrome-400 bg-monochrome-100 rounded-md">
          {postData.img ? (
            <div className="flex w-fit h-full self-center">
              <img
                src={postData.img}
                alt="Uploaded"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <CldUploadWidget
              uploadPreset="learn-tor"
              signatureEndpoint="/api/sign-image"
              options={{
                folder: `learn-tor/`, // Specify the folder path
                publicId: `custom-public-id-${Date.now()}`,// Unique public ID 
              }}
              // backend ต้องเอา url ไปเก็บ
              onSuccess={(results) => {
                if (results.info && typeof results.info !== 'string') {
                  const imageUrl = results.info.secure_url;
                  setPostData((prev) => ({
                    ...prev,
                    img: imageUrl,
                  }));

                  
                }
              }}
            >
              {({ open }) => (
                <label
                  htmlFor="dropzone-file"
                  className="w-full h-full flex justify-center items-center hover:cursor-pointer"
                  onClick={() => open()} // Open Cloudinary widget on click
                >
                  <div className="flex flex-col items-center justify-center text-monochrome-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="size-10 fill-monochrome-600"
                    >
                      <title>file-image-plus-outline</title>
                      <path d="M7 19L12 14L13.88 15.88C13.33 16.79 13 17.86 13 19H7M10 10.5C10 9.67 9.33 9 8.5 9S7 9.67 7 10.5 7.67 12 8.5 12 10 11.33 10 10.5M13.09 20H6V4H13V9H18V13.09C18.33 13.04 18.66 13 19 13C19.34 13 19.67 13.04 20 13.09V8L14 2H6C4.89 2 4 2.9 4 4V20C4 21.11 4.89 22 6 22H13.81C13.46 21.39 13.21 20.72 13.09 20M18 15V18H15V20H18V23H20V20H23V18H20V15H18Z" />
                    </svg>
                    <p>Click to upload or drag and drop</p>
                    <p className="text-monochrome-400">
                      SVG, PNG, JPG or JPEG (MAX. 2000x2000 px)
                    </p>
                  </div>
                </label>
              )}
            </CldUploadWidget>
          )}
        </div>

        <div className="w-full flex justify-between">
          <Button
            button_name="Add tags"
            variant="secondary"
            onClick={handleOnClickAddTags}
          />
          <Button
            button_name="Post"
            variant="primary"
            onClick={handleOnClickPost}
          />
        </div>

        {isPopupOpen && (
          <AddTagPopup
            isPopupOpen={isPopupOpen}
            setIsPopupOpen={setIsPopupOpen}
            tags={tags}
            setTags={setTags}
          />
        )}
      </div>
    </div>
  );
}