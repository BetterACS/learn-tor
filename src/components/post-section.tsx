'use client';
import { Post, SortBy, MockupTopicLoadingCard } from '@/components/index';
import { trpc } from '@/app/_trpc/client';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useSession } from "next-auth/react";
import PreviousMap_ from 'postcss/lib/previous-map';

type TagWState = {
  tagname: string;
  category: string;
  state: 'included' | 'excluded';
}

interface PostSectionProps {
  searchTerm?: string;
  filterTags?: TagWState[];
  myTopic?: boolean;
  myBookmark?: boolean;
}

interface Post {
  _id: string, 
  img: string, 
  title: string, 
  body: string, 
  created_at: string, 
  n_like: number, 
  user_id: { username: string }, 
  isLiked : boolean,
  n_comment: number,
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
        filterTags: filterTags || [],
        sortBy: sortBy,
        limit: limit,
        page: currentPage
      })

  const { data, isLoading, isError, refetch } = queryData;
  
  useEffect(() => {
    setPosts([]);
    setCurrentPage(1);
    if (data && Array.isArray(data.data)) {
      setPosts(data.data);
    } else {
      // console.log('API response is not an array:', data, isLoading);
    }
  }, [searchTerm, filterTags, sortBy]);

  // Append new posts when data changes and pagination progresses
  useEffect(() => {
    if (data && Array.isArray(data.data)) {
      setPosts((prevPosts) => {
        const newUniquePosts = new Map([...prevPosts, ...data.data].map(post => [post._id, post]));
        return Array.from(newUniquePosts.values());
      });
    } else {
      // console.log('API response is not an array:', data, isLoading);
    }
  }, [data, currentPage]);
  
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
    <div className="h-fit w-full flex flex-col gap-6 items-center">
      <div className="flex w-fit gap-2 items-center self-start">
        <p className="text-monochrome-500 text-subtitle-large">
          Sort by:
        </p>
        <SortBy filters={["Newest", "Oldest", "Popular"]} sortBy={sortBy} setSortBy={setSortBy}/>
      </div>
      <div className="h-fit lg:w-[55rem] md:w-[45rem] maxmd:w-full min-w-[26rem] maxmd:px-0 px-[5%]  flex flex-col gap-6">
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
                topicId={post?._id}
              />
            ))
          )
        }
        
        {isLoading && posts.length === 0 && (
          <div className="h-fit w-full flex flex-col gap-6">
            <MockupTopicLoadingCard/>
            <MockupTopicLoadingCard/>
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
