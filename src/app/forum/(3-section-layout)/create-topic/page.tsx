'use client';
import { useState } from 'react';
import { Button } from '@/components/index';
import { useRouter } from 'next/navigation';

interface PostData {
  id: number;
  title: string;
  body: string;
  img: string;
}

export default function CreateTopic() {
  const router = useRouter();
  const [postData, setPostData] = useState<PostData>({
    id: 1,
    title: "",
    body: "",
    img: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setPostData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFiles = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      const reader = new FileReader();

      reader.onload = (event) => {
        const image = new Image();
        image.src = event.target?.result as string;

        image.onload = () => {
          // Custom max image size here
          if (image.width > 2000 || image.height > 2000) {
            alert("Your image is too large");
          } else {
            setPostData((prevData) => ({
              ...prevData,
              img: event.target?.result as string,
            }));
          }
        };
      };

      reader.readAsDataURL(file);
    }
  };

  const drop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    const filesArray = Array.from(e.dataTransfer.files);
    handleFiles(filesArray);
  };
  const dragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
  };

  // test if button work
  const handleOnClickAddTags = () => {
    console.log("Click Add Tags");
  }

  // const handleOnClickPost = () => {
  //   console.log(postData);

  // }

  const handleOnClickPost = () => {
    // const buttonName = event.currentTarget.name;
    console.log(postData);
    const query = JSON.stringify(postData);
    router.push(`/forum/${postData.id}?${JSON.stringify(postData)}`);
  };

  return (
    <div className="relative h-full w-full">
      <p className="text-headline-3 mb-6">
        Create Topic
      </p>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 text-headline-5">
          <p>Title</p>
          <div className="w-full h-fit bg-monochrome-100 py-3 px-4 rounded-md">
            <input 
              type="text"
              name="title"
              placeholder="Title"
              onChange={handleInputChange} 
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
              className="w-full resize-none bg-transparent outline-none placeholder-monochrome-600 caret-monochrome-600 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-monochrome-200"
            ></textarea>
          </div>
        </div>

        {/* Image upload area */}
        <div className="w-full h-[15rem] flex flex-col justify-center items-center gap-1 border-2 border-dashed border-monochrome-400 bg-monochrome-100 rounded-md">
          {postData.img ?
          <div className="flex w-fit h-full self-center">
            <img src={postData.img ?? undefined} alt="" className="w-full h-full object-cover" />
          </div>
          :
          <label
            htmlFor="dropzone-file"
            className="w-full h-full flex justify-center items-center hover:cursor-pointer"
            onDragOver={(e) => dragOver(e)}
            onDrop={(e) => drop(e)}
          >
            <div className="flex flex-col items-center justify-center text-monochrome-600">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="size-10 fill-monochrome-600"><title>file-image-plus-outline</title><path d="M7 19L12 14L13.88 15.88C13.33 16.79 13 17.86 13 19H7M10 10.5C10 9.67 9.33 9 8.5 9S7 9.67 7 10.5 7.67 12 8.5 12 10 11.33 10 10.5M13.09 20H6V4H13V9H18V13.09C18.33 13.04 18.66 13 19 13C19.34 13 19.67 13.04 20 13.09V8L14 2H6C4.89 2 4 2.9 4 4V20C4 21.11 4.89 22 6 22H13.81C13.46 21.39 13.21 20.72 13.09 20M18 15V18H15V20H18V23H20V20H23V18H20V15H18Z" /></svg>
              <p>
                Click to upload or drag and drop
              </p>
              <p className="text-monochrome-400">
                SVG, PNG, JPG or JPEG (MAX. 2000x2000 px)
              </p>
            </div>
            <input
              id="dropzone-file"
              type="file"
              multiple
              accept="image/*, video/*"
              className="hidden"
              onChange={(e) => handleFiles(Array.from(e.target.files || []))}
            />
          </label>}
        </div>

        {/* Image display */}
        {/* {postData.img &&
        <div className="flex w-fit h-[12rem] self-center">
          <img src={postData.img ?? undefined} alt="" className="w-full h-full object-cover" />
        </div>
        } */}

        <div className="w-full flex justify-between">
          <Button button_name="Add tags" variant="secondary" onClick={handleOnClickAddTags} />
          <Button button_name="Post" variant="primary" onClick={handleOnClickPost} />
        </div>
      </div>
    </div>
  )
}