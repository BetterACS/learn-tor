'use client';
import { Post, SortBy } from '@/components/index';
import { trpc } from '@/app/_trpc/client';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useSession } from "next-auth/react";
import PreviousMap_ from 'postcss/lib/previous-map';

interface PostSectionProps {
  searchTerm?: string;
  filterTags?: Record<string, "included" | "excluded">;
  myTopic?: boolean;
  myBookmark?: boolean;
}

interface Post {
  _id: number, 
  img: string, 
  title: string, 
  body: string, 
  created_at: string, 
  n_like: number, 
  user_id: { username: string }, 
  isLiked : boolean
}

export default function PostSection({ searchTerm, filterTags, myTopic=false, myBookmark=false }: PostSectionProps) {
  const { data: session, status } = useSession();
  const [sortBy, setSortBy] = useState<string>("Newest");
  const [posts, setPosts] = useState<Post[] | []>([]);
  const limit = 6;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const observer = useRef<IntersectionObserver | null>(null);

  const queryData = myTopic 
    ? trpc.queryMyTopic.useQuery({ 
        email: session?.user?.email,
        sortBy: sortBy,
        limit: limit,
        page: currentPage
      })
    : myBookmark ? 
      trpc.queryMyBookmark.useQuery({ 
        email: session?.user?.email,
        sortBy: sortBy,
        limit: limit,
        page: currentPage
      }) : 
      trpc.searchQuery.useQuery({ 
        searchTerm: searchTerm || '',
        filterTags: filterTags || {},
        sortBy: sortBy,
        limit: limit,
        page: currentPage
      })

  const { data, isLoading, isError, refetch } = queryData;

  // Reset the page and refetch posts when searchTerm, filterTags, or sortBy changes
  useEffect(() => {
    setCurrentPage(1); // Reset to page 1 on filter or sort changes
    setPosts([]); // Clear posts to show fresh data after change
  }, [searchTerm, filterTags, sortBy]);

  // Append new posts when data changes and pagination progresses
  useEffect(() => {
    if (data && Array.isArray(data.data)) {
      setPosts((prevPosts) => {
        const newUniquePosts = new Map([...prevPosts, ...data.data].map(post => [post._id, post]));
        return Array.from(newUniquePosts.values());
      });
    } else {
      console.log('API response is not an array:', data, isLoading);
    }
  }, [data, sortBy, currentPage]);
  
  const lastPostElementRef = useCallback(
    (node: HTMLElement | null) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setCurrentPage((prev) => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading]
  );

  return (
    <div className="h-fit w-full flex flex-col gap-6">
      <div className="flex w-fit gap-2 items-center">
        <p className="text-monochrome-500 text-subtitle-large">
          Sort by:
        </p>
        <SortBy filters={["Newest", "Oldest", "Popular"]} sortBy={sortBy} setSortBy={setSortBy}/>
      </div>
      <div className="h-fit w-full px-[14vw] flex flex-col gap-6">
        {
          data?.status === 400 && posts.length === 0 && (
            <p className="text-headline-5 self-center">Topic not found</p>
          )
          ||
          data?.status === 500 && (
            <p className="text-headline-5 self-center">Fail to fetch topic</p>
          )
          ||
          (posts.length > 0 && Array.isArray(posts) && 
            posts.map((post, index) => (
              <Post
                ref={posts.length === index + 1 && data?.maxPage !== currentPage ? lastPostElementRef : null}
                key={post._id}
                post={post}
              />
            ))
          )
        }
        
        {isLoading && posts.length === 0 && (
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
        )}
        {isLoading && posts.length > 0 ? (
          <div className="w-full h-[2rem] flex justify-center items-center">
            {/* The loading spinner */}
            <svg className="animate-spin size-8 -ml-1 mr-3 text-monochrome-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : (data?.maxPage !== currentPage) && posts.length > 0 && (
          <div className="w-full h-[2rem]"></div>
        )}
      </div>
    </div>
  );
}
