'use client';
import { Topic, SortBy, MockupTopicLoadingCard, LoadingCircle } from '@/components/index';
import { trpc } from '@/app/_trpc/client';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useSession } from "next-auth/react";
import { usePathname } from 'next/navigation';

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
  _id: string;
  img: string;
  title: string;
  body: string;
  created_at: string;
  n_like: number;
  user_id: { username: string };
  isLiked: boolean;
  n_comment: number;
}

export default function PostSection({ searchTerm, filterTags, myTopic=false, myBookmark=false }: PostSectionProps) {
  const LIMIT = 6;

  const pathname = usePathname();
  const { data: session } = useSession();

  const observer = useRef<IntersectionObserver | null>(null);
  const isFirstLoadRef = useRef(true);  // track first load state without re-render

  const [sortBy, setSortBy] = useState<string>("Newest");
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const queryData = myTopic
    ? trpc.queryMyTopic.useQuery({
        email: session?.user?.email,
        sortBy,
        limit: LIMIT,
        page: currentPage
      })
    : myBookmark
    ? trpc.queryMyBookmark.useQuery({
        email: session?.user?.email,
        sortBy,
        limit: LIMIT,
        page: currentPage
      })
    : trpc.searchQuery.useQuery({
        searchTerm: searchTerm || '',
        filterTags: filterTags || [],
        sortBy,
        limit: LIMIT,
        page: currentPage
      });

  const { data, isLoading } = queryData;

  // Handle first load
  useEffect(() => {
    isFirstLoadRef.current = true;
    setCurrentPage(1);
    setPosts([]);
  }, [searchTerm, filterTags, sortBy, pathname]);

  // Handle appending new topics if not first load
  useEffect(() => {
    if (data && Array.isArray(data.data)) {
      setPosts(prev => {
        const seen = new Set(prev.map(p => p._id));
        const newPosts = data.data.filter(p => !seen.has(p._id));
      
        if (isFirstLoadRef.current) {
          isFirstLoadRef.current = false;
          return data.data;
        } else {
          return [...prev, ...newPosts];
        }
      });
    }
  }, [data]);

  const lastPostElementRef = useCallback(
    (node: HTMLElement | null) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
          setCurrentPage(prev => prev + 1);
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
        <SortBy filters={["Newest", "Oldest", "Popular"]} sortBy={sortBy} setSortBy={setSortBy} />
      </div>

      {isLoading && posts.length === 0 ? (
        <div className="w-full h-full">
          <LoadingCircle />
        </div>
      ) : (
        <div className="h-fit lg:w-[55rem] md:w-[45rem] maxmd:w-full min-w-[26rem] maxmd:px-0 px-[5%] flex flex-col gap-6">
          {data?.status === 400 && posts.length === 0 && (
            <p className="text-headline-5 self-center">Topic not found</p>
          )}
          {data?.status === 500 && (
            <p className="text-headline-5 self-center">Fail to fetch topic</p>
          )}
          {posts.length > 0 &&
            posts.map((post, index) => (
              <Topic
                ref={posts.length === index + 1 && data?.maxPage !== currentPage ? lastPostElementRef : null}
                key={post._id}
                topicId={post._id}
              />
          ))}

          {/* {isLoading && posts.length === 0 && (
            <div className="h-fit w-full flex flex-col gap-6">
              <MockupTopicLoadingCard/>
            </div>
          )}
          {isLoading && posts.length > 0 && (
            <div className="w-full h-full">
              <LoadingCircle />
            </div>
          )} */}
          {isLoading && (
            <div className="w-full h-full">
              <LoadingCircle />
            </div>
          )}
          {!isLoading && data?.maxPage !== currentPage && posts.length > 0 && (
            <div className="w-full h-[2rem]" />
          )}
        </div>
      )}
    </div>
  );
}
