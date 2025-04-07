'use client';
import { useState, useRef, useEffect, forwardRef } from 'react';
import { useRouter } from 'next/navigation'
import Link from 'next/link';
import { PostInteractionBar, MockupTopicLoadingCard, ErrorLoading, ImageFullView } from '@/components/index';
import dayjs from 'dayjs';
import { useSession } from 'next-auth/react';
import relativeTime from 'dayjs/plugin/relativeTime';
import { trpc } from '@/app/_trpc/client';

dayjs.extend(relativeTime);

interface TopicId {
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
  isLiked : boolean,
  n_comment: number,
}

const Topic = forwardRef<HTMLDivElement, TopicId>(({ topicId }, ref) => {
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
  const [topic, setTopic] = useState<Post | null>(null);
  const [isLoaded, setIsLoaded] = useState(false); // Fully loaded state
  const [isImageFull, setIsImageFull] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    if (data && Array.isArray(data.data)) {
      const [ dData ] = data.data;
      setTopic(dData);
      // setTimeout(() => {
      //   setIsLoaded(true);
      // }, 500);
      setIsLoaded(true);
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
  }, [topic]);

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsImageFull(true);
    console.log("Image Clicked!");
  };

  if (isLoading) {
    return <MockupTopicLoadingCard />
  } else if (isError) {
    return <ErrorLoading />
  }

  return (
    <>
      <Link
      href={{ pathname: `/forum/${topic?._id}`
      // ,query: JSON.stringify({ ...post, tags: tags })
      }}
      className="h-full w-full bg-monochrome-50 drop-shadow-[0_0_6px_rgba(0,0,0,0.1)] rounded-xl cursor-default"
      >
        <div ref={ref} className={`h-full w-full pt-6 pb-5 px-8 maxmd:px-5 flex flex-col gap-3 text-start`}>
          {/* Username Section */}
          <div className="flex justify-between content-center items-center">
            <div className="flex content-center items-center gap-2">
              <div className="size-10">
                <img src={topic?.user_id && 'avatar' in topic.user_id ? topic.user_id.avatar : '/images/profile.avif'} className="w-full h-full object-cover rounded-full"/>
              </div>
              <div>
                <p className="text-body-large">
                {topic?.user_id.username}
                </p>
                <p className="text-subtitle-small text-monochrome-400">
                  {dayjs(topic?.created_at).fromNow()}
                </p>
              </div>
            </div>
            {ownershipData?.data.permission && (
              <svg 
                onClick={(e) => {router.push(`/forum/edit-topic/${topic?._id}`); e.preventDefault();}}
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
            {/* {tags.length > 0 && 
            <div className="flex gap-2 flex-wrap">
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
            } */}
            {topicTagsMutation.isPending && tags.length > 0 && 
              <div className="text-subtitle-small rounded-lg text-transparent px-2 py-1 w-fit bg-monochrome-200 animate-pulse">placeholder</div>
            }
            {!topicTagsMutation.isPending && tags.length > 0 && 
              <div className="flex gap-2 flex-wrap">
                {tags.map((tag) => (
                  <div key={tag} className="text-subtitle-small rounded-lg border border-primary-500 text-primary-500 px-2 py-1 w-fit">
                    {tag}
                  </div>
                ))}
              </div>
            }
            <p className="text-headline-5">
              {topic?.title}
            </p>
            <p className='text-body-large'>
              {topic?.body}
            </p>
          </div>
          
          {topic?.img && topic.img.trim() !== "" && 
            (isLoaded ? 
              <div onClick={handleImageClick} className="h-[25rem] w-full rounded-md">
                <img src={topic?.img} className="w-full h-full object-contain bg-monochrome-950 rounded-md"/>
              </div>
            : (
              <div className="h-[25rem] w-full animate-pulse bg-monochrome-100 rounded-md"/>
            ))
          }

          {/* Interaction Bar */}
          <PostInteractionBar 
            post={{ id: topic?._id, img: topic?.img, title: topic?.title, body: topic?.body, like: topic?.n_like, isLiked : topic?.isLiked, n_comment: topic?.n_comment }}
            comment_enable={true}
          />
        </div>
      </Link>
      {/* Image Full View */}
      {topic && (
        <ImageFullView isImageFull={isImageFull} setIsImageFull={setIsImageFull} topicId={topic._id}/>
      )}
    </>
  )
});

export default Topic;