'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { trpc } from '@/app/_trpc/client';
import { useSession } from 'next-auth/react';

type Tag = {
  tagname: string;
  category: string;
};

export default function CompactSidebar() {
  const LIMIT = 10;

  const router = useRouter();
  const { data: session } = useSession();

  const tagExpandRef = useRef(null);

  const { data, isLoading, isError, refetch } = trpc.getTopTags.useQuery();

  const [topTags, setTopTags] = useState<Tag[]>([]);
  const [tagExpand, setTagExpand] = useState(false);


  useEffect(() => {
    if (isLoading) return;
    const Tags: Tag[] = data?.map(tag => ({ tagname: tag.tagname, category: tag.category })) ?? [];
    setTopTags(Tags.slice(0, LIMIT));
  }, [isLoading]);

  const handleTagClicked = (tagname: string, category: string) => {
    const query = [{ tagname, category, state: 'included' }];
    if (!session) {
      router.push('/login');
    } else {
      router.push(`/forum/search/?query=${encodeURIComponent(JSON.stringify(query))}`);
    }

    setTagExpand(false);
  };

  const handleRedirect = (path: string) => {
    router.refresh();
    router.push(path);
  };

  return (
    <div className="sticky top-[5.15rem] w-full h-fit overflow-y-hidden bg-monochrome-50 z-10 flex flex-col px-4">
      <div className="w-full h-[3.5rem] mobile:h-[5rem] flex items-center py-8 gap-2 overflow-y-hidden overflow-x-auto">
        {/* Home */}
        <div onClick={() => handleRedirect('/forum')} className="w-fit h-fit py-2 flex gap-2 items-center px-4 hover:bg-monochrome-100 transform duration-100 rounded-full border border-monochrome-300">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-house w-5 min-w-5"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
          <p className="text-headline-6 cursor-default text-nowrap">
            Homepage
          </p>
        </div>

        {/* My Topic */}
        <div onClick={() => handleRedirect('/forum/my-topic')} className="w-fit h-fit py-2 flex gap-2 items-center px-4 hover:bg-monochrome-100 transform duration-100 rounded-full border border-monochrome-300">
          <p className="text-headline-6 cursor-default text-nowrap">
            My Topic
          </p>
        </div>

        {/* Bookmark */}
        <div onClick={() => handleRedirect('/forum/bookmark')} className="w-fit h-fit py-2 flex gap-2 items-center px-4 hover:bg-monochrome-100 transform duration-100 rounded-full border border-monochrome-300">
          <p className="text-headline-6 cursor-default text-nowrap">
            My Bookmark
          </p>
        </div>

        {/* Create Topic */}
        <div onClick={() => handleRedirect('/forum/create-topic')} className="w-fit h-fit py-2 flex gap-1 items-center px-4 hover:bg-monochrome-100 transform duration-100 rounded-full border border-monochrome-300">
          <p className="text-headline-6 cursor-default text-nowrap">
            Create Topic
          </p>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 min-w-6"><path fill="currentColor" d="M18 12.998h-5v5a1 1 0 0 1-2 0v-5H6a1 1 0 0 1 0-2h5v-5a1 1 0 0 1 2 0v5h5a1 1 0 0 1 0 2"/></svg>
        </div>

        {/* Tags */}
        <div 
          onClick={() => setTagExpand(!tagExpand)}
          className="w-fit h-fit py-2 flex items-center px-4 hover:bg-monochrome-100 transform duration-100 rounded-full border border-monochrome-300 "
        >
          <p className="text-headline-6 cursor-default text-nowrap">
            Forum
          </p>
          <svg className={`size-8 ${tagExpand ? 'rotate-180' : 'rotate-0'} transition-all duration-100 ease-in`} xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m8 10l4 4l4-4"></path>
          </svg>
        </div>
      </div>
      <div ref={tagExpandRef} className={`w-full overflow-hidden transition-all duration-200 ease-in ${tagExpand ? 'max-h-[500px]' : 'max-h-0'}`}>
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
          <div className="w-full flex flex-col pl-4 gap-4 text-headline-6 py-2 border-b">
            {topTags.map(({ tagname, category }, index) => (
              <button onClick={() => handleTagClicked(tagname, category)} key={index} className="hover:underline w-fit text-start">{tagname}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );  
}