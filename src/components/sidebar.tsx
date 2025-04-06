'use client'; 
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { trpc } from '@/app/_trpc/client';
import { useEffect, useState } from 'react';

export default function Sidebar() {
  const router = useRouter();

  const { data, isLoading, isError, refetch } = trpc.getTopTags.useQuery();
  const [topTags, setTopTags] = useState<string[]>([]);
  const top = 10;

  const isUserLoggedIn = false;

  const handleTagClicked = (event: React.MouseEvent<HTMLButtonElement>) => {
    const buttonName = event.currentTarget.name;
    router.push(`/forum/search/?query=${encodeURIComponent(buttonName)}`);
  };

  // const handleLinkClick = (path: string) => {
  //   if (!isUserLoggedIn) {
  //     router.push('/login');
  //   } else {
  //     router.push(path);
  //   }
  // };

  useEffect(() => {
    const tagNames = data?.map(tag => tag.tagname);
    setTopTags(tagNames?.slice(0, top) || []);
  }, [isLoading]);

  const handleRedirect = (path: string) => {
    router.refresh();
    router.push(path);
  };

  return (
    <div className="h-[calc(100vh-5.25rem)] w-full bg-monochrome-50 sticky overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-monochrome-100 top-[5.25rem] flex flex-col divide-y divide-monochrome-200 items-center px-6 maxlg:px-2 py-6 z-20">
      <div className="w-full flex flex-col py-6 first:pt-0 items-start">
        <div onClick={() => handleRedirect('/forum')} className="w-full h-20 flex gap-3 items-center px-4 hover:bg-monochrome-100 transform duration-100 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-house w-8 min-w-8"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
          <p className="text-headline-5 cursor-default">
            Homepage
          </p>
        </div>
        <div onClick={() => handleRedirect('/forum/my-topic')} className="w-full h-20 flex gap-3 items-center px-1 hover:bg-monochrome-100 transform duration-100 rounded-lg">
          <div className="w-full flex gap-3 items-center px-4 hover:bg-monochrome-100 transform duration-100 rounded-lg">
            <p className="text-headline-5 cursor-default">
              My Topic
            </p>
          </div>
        </div>
        <div onClick={() => handleRedirect('/forum/bookmark')} className="w-full h-20 flex gap-3 items-center px-1 hover:bg-monochrome-100 transform duration-100 rounded-lg">
          <div className="w-full flex gap-3 items-center px-4 hover:bg-monochrome-100 transform duration-100 rounded-lg">
            <p className="text-headline-5 cursor-default">
              My Bookmark
            </p>
          </div>
        </div>
      </div>

      <div className="w-full flex items-center gap-4 py-6 px-4">
        <p className="w-full text-nowrap text-headline-5">
          Create Topic
        </p>
        <Link href="/forum/create-topic">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-8 min-w-8"><path fill="currentColor" d="M18 12.998h-5v5a1 1 0 0 1-2 0v-5H6a1 1 0 0 1 0-2h5v-5a1 1 0 0 1 2 0v5h5a1 1 0 0 1 0 2"/></svg>
          </div>
        </Link>
      </div>

      <div className="w-full flex flex-col py-6 px-4 last:pb-0 items-start gap-6">
        <h1 className="text-headline-5">
          Forum
        </h1>
        {isLoading ? (
          <div className="animate-pulse w-full flex flex-col pl-4 gap-4 text-headline-6">
            <div className="w-fit text-start text-transparent bg-monochrome-100 rounded-md">Placeholder</div>
            <div className="w-fit text-start text-transparent bg-monochrome-100 rounded-md">Placeholderrrr</div>
            <div className="w-fit text-start text-transparent bg-monochrome-100 rounded-md">Placeholderrr</div>
            <div className="w-fit text-start text-transparent bg-monochrome-100 rounded-md">Placeholderrrrr</div>
            <div className="w-fit text-start text-transparent bg-monochrome-100 rounded-md">Placeholderr</div>
            <div className="w-fit text-start text-transparent bg-monochrome-100 rounded-md">Placeholderr</div>
            <div className="w-fit text-start text-transparent bg-monochrome-100 rounded-md">Placeholderrrrrr</div>
            <div className="w-fit text-start text-transparent bg-monochrome-100 rounded-md">Placeholder</div>
          </div>
        ) : (
          <div className="w-full flex flex-col pl-4 gap-4 text-headline-6">
            {topTags.map((item) => (
              <button name={item} onClick={handleTagClicked} key={item} className="hover:underline w-fit text-start">{item}</button>
            ))}
          </div>
        )}
        
      </div>
    </div>
  );
}
