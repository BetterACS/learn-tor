'use client';
import { Post, SortBy } from '@/components/index';
import { useState, useRef, useEffect } from 'react';
import { trpc } from '@/app/_trpc/client';

interface PostSectionProps {
  searchTerm?: string;
  filterTags?: Record<string, "included" | "excluded">;
}

interface Post { 
  id: number, 
  img: string, 
  title: string, 
  body: string 
};

export default function PostSection({ searchTerm, filterTags }: PostSectionProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [sortBy, setSortBy] = useState<string>("Newest");

  const { data, isLoading, error, refetch } = trpc.searchQuery.useQuery({ 
    searchTerm: searchTerm || '',
    filterTags: filterTags || {},
    sortBy: sortBy,
  });

  useEffect(() => {
    console.log("Data: ", data?.data);
    console.log("Sort By: ", sortBy);
    if (data && Array.isArray(data.data)) {
      setPosts(data.data);
    } 
    else {
      setPosts([]);
      console.log('API response is not an array:', data);
    }

  }, [data, sortBy]);

  return (
    <div className="h-fit w-full flex flex-col gap-6">
      <div className="flex w-fit gap-2 items-center">
        <p className="text-monochrome-500 text-subtitle-large">
          Sort by: 
        </p>
        <SortBy filters={["Newest", "Oldest", "Popular"]} sortBy={sortBy} setSortBy={setSortBy}/>
      </div>
      <div className="h-fit w-full px-[14vw] flex flex-col gap-6">
        {isLoading ? (
          <div
          className="h-fit w-full bg-monochrome-50 drop-shadow-[0_0_6px_rgba(0,0,0,0.1)] rounded-xl text-start pt-6 pb-3 px-8"
          >
            <div className="h-full w-full flex flex-col gap-3 animate-pulse">
              {/* Username Section */}
              <div className="flex content-center items-center gap-2">
                <div className="size-10">
                  <div className="w-full h-full bg-monochrome-100 rounded-full"/>
                </div>
                <p className="text-body-large font-bold text-transparent bg-monochrome-100 rounded-md">
                  Username
                </p>
                <p className="text-subtitle-small text-transparent bg-monochrome-100 rounded-md">
                  second ago
                </p>
              </div>
              {/* Body */}
              <div className="flex flex-col gap-2">
                <p className="text-headline-5 text-transparent bg-monochrome-100 rounded-md">
                  Lorem ipsum dolor sit amet
                </p>
                <p className='w-fit text-body-large text-transparent bg-monochrome-100 rounded-md'>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus magni doloremque
                </p>
                <p className='w-fit text-body-large text-transparent bg-monochrome-100 rounded-md'>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                </p>
              </div>
              <div className="h-[25rem] w-full pb-4">
                <div className="w-full h-full object-cover bg-monochrome-100 rounded-md"/>
              </div>
            </div>
          </div>
          ) : (
            data?.status === 400 && (
              <p className="text-headline-5 self-center">Topic not found</p>
            )
            ||
            data?.status === 500 && (
              <p className="text-headline-5 self-center">Fail to fetch topic</p>
            )
            ||
            data?.status === 200 && (
              posts?.map((post, index) => (
                <Post key={index} post={post} isLoading={isLoading}/>
              ))
            )
          )
        }
      </div>
    </div>
  )
}