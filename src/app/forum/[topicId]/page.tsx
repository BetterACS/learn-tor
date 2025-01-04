'use client';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { Navbar } from '@/components/index';

export default function Topic() {
  const params = useParams();
  const mockup_data = {
    title: "ขอรีวิวสาขาวิทย์คอมประยุกต์บางมดหน่อยครับ",
    body: "blablabla รายละเอียด",
    image: ""
  }

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    console.log(`Clicked ${e.currentTarget.name} button!`);
  }
  
  return (
    <div>
      <Navbar />
      <div className="flex flex-col p-4 gap-2">
        <div>
          <h1 className="text-primary-600 text-headline-3">This is Topic {params.topicId} page</h1>
        </div>
        <div className="flex content-center items-center gap-2">
          <div className="size-10">
            <img src="https://images.unsplash.com/photo-1554629947-334ff61d85dc?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1024&h=1280&q=80" className="w-full h-full object-cover rounded-full"/>
          </div>
          <div className="text-headline-6">Username</div>
          <div className="text-body-large">-</div>
          <div className="text-subtitle-small">second ago</div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-headline-4">{mockup_data.title}</div>
          <div className="text-body-large">{mockup_data.body}</div>
          <div className="h-[30rem] w-full">
            <img src="https://images.unsplash.com/photo-1554629947-334ff61d85dc?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1024&h=1280&q=80" className="w-full h-full object-cover"/>
          </div>
          <div className="flex gap-2">
            <button type="button" name="like" onClick={handleClick} className="text-button">Like</button>
            <button type="button" name="save" onClick={handleClick} className="text-button">Save</button>
            <button type="button" name="share" onClick={handleClick} className="text-button">Share</button>
          </div>
        </div>
        <div className="flex">
          <textarea name="comment" id="" placeholder="Add a comment" className="text-body-large text-monochrome-950 placeholder-monochrome-600 w-full rows-1 rounded-[1rem] px-4 py-2 resize-none border border-monochrome-500 outline-none"></textarea>
        </div>
        <div className="flex gap-2 items-center">
          <p>Sort by: </p>
          <div className="flex py-2 px-1 gap-1 items-center border-b border-monochrome-200 hover:bg-monochrome-100 transition duration-100">
            <p>Newest</p>
            <svg className="size-6" xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><title>down_line</title><g id="down_line" fill='none' fillRule='evenodd'><path d='M24 0v24H0V0h24ZM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01-.184-.092Z'/><path fill='black' d='M12.707 15.707a1 1 0 0 1-1.414 0L5.636 10.05A1 1 0 1 1 7.05 8.636l4.95 4.95 4.95-4.95a1 1 0 0 1 1.414 1.414l-5.657 5.657Z'/></g></svg>
          </div>
        </div>
      </div>
    </div>
  )
}