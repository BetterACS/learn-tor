'use client';
import { useState, useRef, useEffect, forwardRef } from 'react';
import { useRouter } from 'next/navigation'
import Link from 'next/link';
import { PostInteractionBar, MockupTopicLoadingCard, ErrorLoading } from '@/components/index';
import dayjs from 'dayjs';
import { useSession } from 'next-auth/react';
import relativeTime from 'dayjs/plugin/relativeTime';
import { trpc } from '@/app/_trpc/client';

dayjs.extend(relativeTime);

// interface PostProps {
//   post: { 
//     _id: string, 
//     img: string, 
//     title: string, 
//     body: string, 
//     created_at: string, 
//     n_like: number, 
//     user_id: { username: string, avatar?: string }, 
//     isLiked : boolean
//   };
// }

interface PostProps {
  topicId: string;
}

interface Post {
  _id: string, 
  img: string, 
  title: string, 
  body: string, 
  created_at: string, 
  n_like: number, 
  user_id: { username: string }, 
  isLiked : boolean
}

const Post = forwardRef<HTMLDivElement, PostProps>(({ topicId }, ref) => {
  const { data: session } = useSession();
  const router = useRouter();

  const fetchPostData = trpc.queryTopicById.useQuery(
    { Id: topicId },
    { refetchOnMount: true }
  );
  const { data, isLoading, isError, refetch } = fetchPostData;
  const topicOwnership = trpc.checkTopicOwner.useQuery({ 
    email: session?.user?.email || '',
    topicId: topicId,
  });
  const { data: ownershipData, isLoading: ownershipIsLoading, isError: ownershipIsError } = topicOwnership;
  const topicTagsMutation = trpc.topicTags.useMutation();
  
  const [tags, setTags] = useState<string[]>([]);
  const [post, setPost] = useState<Post | null>(null);
  const [isLoaded, setIsLoaded] = useState(false); // Fully loaded state

  useEffect(() => {
    if (isLoading) return;
    if (data && Array.isArray(data.data)) {
      const [ dData ] = data.data;
      setPost(dData);
      setTimeout(() => {
        setIsLoaded(true);
      }, 500);
    }
  }, [data]);

  useEffect(() => {
    topicTagsMutation.mutate(
      { topic_id: topicId },
      {
        onSuccess: (data) => {
          if (data.topicTags && Array.isArray(data.topicTags)) {
            const extractedTags = data.topicTags.map(tag => tag.tagname);
            setTags(extractedTags);
            // console.log("Fetching Tags for post successfully: ", post._id);
          }
        },
        onError: (error) => {
          console.error("Error fetching tags:", error);
        }
      }
    );
  }, [post]);

  if (isLoading) {
    return <MockupTopicLoadingCard />
  } else if (isError) {
    return <ErrorLoading />
  }

  return (
    <Link
    href={{ pathname: `/forum/${post?._id}`
    // ,query: JSON.stringify({ ...post, tags: tags })
    }}
    className="h-full w-full bg-monochrome-50 drop-shadow-[0_0_6px_rgba(0,0,0,0.1)] rounded-xl cursor-default"
    >
      <div ref={ref} className="h-full w-full pt-6 pb-3 px-8 flex flex-col gap-3 text-start">
        {/* Username Section */}
        <div className="flex justify-between content-center items-center">
          <div className="flex content-center items-center gap-2">
            <div className="size-10">
              <img src={post?.user_id && 'avatar' in post.user_id ? post.user_id.avatar : '/images/profile.avif'} className="w-full h-full object-cover rounded-full"/>
            </div>
            <p className="text-body-large font-bold">
              {post?.user_id.username}
            </p>
            <p className="text-subtitle-small">•</p>
            <p className="text-subtitle-small text-monochrome-400">
              {dayjs(post?.created_at).fromNow()}
            </p>
          </div>
          {ownershipData?.data.permission && (
            <svg 
              onClick={(e) => {router.push(`forum/edit-topic/${post?._id}`); e.preventDefault();}}
              className="text-monochrome-500 size-7 cursor-pointer"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path fill="currentColor" d="M20.71 7.04c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.37-.39-1.02-.39-1.41 0l-1.84 1.83l3.75 3.75M3 17.25V21h3.75L17.81 9.93l-3.75-3.75z"></path>
            </svg>
          )}
        </div>
        {/* Body */}
        <div className="flex flex-col gap-2">
          {tags.length > 0 && 
          <div className="flex gap-2">
            {topicTagsMutation.isPending && 
              <div className="text-subtitle-small rounded-lg text-transparent px-2 py-1 w-fit bg-monochrome-200 animate-pulse">placeholder</div>
            }
            {!topicTagsMutation.isPending && 
              tags.map((tag) => (
                <div key={tag} className="text-subtitle-small rounded-lg border border-primary-500 text-primary-500 px-2 py-1 w-fit">
                  {tag}
                </div>
              ))
            }
          </div>
          }
          <p className="text-headline-5">
            {post?.title}
          </p>
          <p className='text-body-large'>
            {post?.body}
          </p>
        </div>
        
        {post?.img && post.img.trim() !== "" && 
          ( isLoaded ? 
            <div className="h-[25rem] w-full">
              <img src={post?.img} className="w-full h-full object-contain bg-monochrome-950"/>
            </div>
          : (
            <div className="h-[25rem] w-full animate-pulse bg-monochrome-100 rounded-md"></div>
          ))
        }

        {/* Interaction Bar */}
        <PostInteractionBar 
          post={{ id: post?._id, img: post?.img, title: post?.title, body: post?.body, like: post?.n_like, isLiked : post?.isLiked }}
          comment_enable={true}
        />
      </div>
    </Link>
  )
});

export default Post;