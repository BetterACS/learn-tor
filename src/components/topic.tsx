'use client';
import { useState, useRef, useEffect, forwardRef } from 'react';
import { useRouter } from 'next/navigation'
import Link from 'next/link';
import { PostInteractionBar, MockupTopicLoadingCard, ErrorLoading, ImageFullView, SharePopup } from '@/components/index';
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
  imgs: string[], 
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
  const [topic, setTopic] = useState<Post>();
  const [isLoaded, setIsLoaded] = useState(false); // Fully loaded state
  const [isImageFull, setIsImageFull] = useState(false);
  const [clickedId, setClickedId] = useState<string>('');
    const [shareState, setShareState] = useState(false);

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
    setClickedId(e.currentTarget.id);
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

          {Array.isArray(topic?.imgs) && topic.imgs.length > 0 && 
            (!isLoaded ? (
              <div className="w-full h-fit flex justify-center">
                <div className="w-[30rem] maxnm:md:w-[25rem] maxmd:min2sm:w-[40rem] max2sm:w-[25rem] h-[25rem] maxnm:md:h-[20rem] maxmd:min2sm:h-[35rem] max2sm:h-[20rem] animate-pulse">
                  <div className="w-full h-full bg-monochrome-100 rounded-md"/>
                </div>
              </div>
            ) : (
              <div className="w-full h-fit flex justify-center">
                {
                  // Display multiple images layout
                  topic.imgs.length === 1 && (
                    <div className="flex w-[30rem] maxnm:md:w-[25rem] maxmd:min2sm:w-[40rem] max2sm:w-[25rem] h-[25rem] maxnm:md:h-[20rem] maxmd:min2sm:h-[35rem] max2sm:h-[20rem]">
                      {topic.imgs.map((img, index) => (
                        <div 
                          id={img} 
                          key={index} 
                          onClick={handleImageClick}
                          className="h-full w-full rounded-sm bg-monochrome-950"
                        >
                          <img src={img || '/'} className="h-full w-full object-cover rounded-sm"/>
                        </div>
                      ))}
                    </div>
                  )
                  ||
                  topic.imgs.length === 2 && (
                    <div className="grid grid-cols-2 gap-[1px] w-[30rem] maxnm:md:w-[25rem] maxmd:min2sm:w-[40rem] max2sm:w-[25rem] h-[25rem] maxnm:md:h-[20rem] maxmd:min2sm:h-[35rem] max2sm:h-[20rem]">
                      {topic.imgs.map((img, index) => (
                        <div 
                          id={img} 
                          key={index} 
                          onClick={handleImageClick}
                          className="h-full w-full rounded-sm bg-monochrome-950"
                        >
                          <img src={img || '/'} className="h-full w-full object-cover rounded-sm"/>
                        </div>
                      ))}
                    </div>
                  )
                  ||
                  topic.imgs.length === 3 && (
                    <div className="grid grid-cols-2 grid-rows-2 gap-[1px] w-[30rem] maxnm:md:w-[25rem] maxmd:min2sm:w-[40rem] max2sm:w-[25rem] h-[25rem] maxnm:md:h-[20rem] maxmd:min2sm:h-[35rem] max2sm:h-[20rem]">
                      {topic.imgs.map((img, index) => (
                        <div 
                          id={img} 
                          key={index} 
                          onClick={handleImageClick}
                          className="w-full h-full rounded-sm bg-monochrome-950 first:row-span-2"
                        >
                          <img src={img || '/'} className="h-full w-full object-cover rounded-sm"/>
                        </div>
                      ))}
                    </div>
                  )
                  ||
                  topic.imgs.length === 4 && (
                    <div className="grid grid-cols-2 grid-rows-2 gap-[1px] w-[30rem] maxnm:md:w-[25rem] maxmd:min2sm:w-[40rem] max2sm:w-[25rem] h-[25rem] maxnm:md:h-[20rem] maxmd:min2sm:h-[35rem] max2sm:h-[20rem]">
                      {topic.imgs.map((img, index) => (
                        <div 
                          id={img} 
                          key={index} 
                          onClick={handleImageClick}
                          className="w-full h-full rounded-sm bg-monochrome-950"
                        >
                          <img src={img || '/'} className="h-full w-full object-cover rounded-sm"/>
                        </div>
                      ))}
                    </div>
                  )
                  ||
                  topic.imgs.length === 5 && (
                    <div className="grid grid-cols-6 grid-rows-6 gap-[1px] w-[30rem] maxnm:md:w-[25rem] maxmd:min2sm:w-[40rem] max2sm:w-[25rem] h-[25rem] maxnm:md:h-[20rem] maxmd:min2sm:h-[35rem] max2sm:h-[20rem]">
                      {topic.imgs.map((img, index) => {
                        const gridStyles = [
                          "col-span-3 row-span-3",
                          "col-start-4 col-span-3 row-span-3",
                          "col-span-2 row-start-4 row-span-3",
                          "col-start-3 col-span-2 row-start-4 row-span-3",
                          "col-start-5 col-span-2 row-start-4 row-span-3",
                        ];

                        return (
                          <div 
                            id={img} 
                            key={index} 
                            onClick={handleImageClick}
                            className={`${gridStyles[index]} w-full h-full rounded-sm bg-monochrome-950`}
                          >
                            <img src={img || '/'} className="h-full w-full object-cover rounded-sm"/>
                          </div>
                        );
                        
                      })}
                    </div>
                  )
                  ||
                  topic.imgs.length > 5 && (
                    <div className="grid grid-cols-6 grid-rows-6 gap-[1px] w-[30rem] maxnm:md:w-[25rem] maxmd:min2sm:w-[40rem] max2sm:w-[25rem] h-[25rem] maxnm:md:h-[20rem] maxmd:min2sm:h-[35rem] max2sm:h-[20rem]">
                      {Array.from({ length: 5 }, (_, index) => {
                        const gridStyles = [
                          "col-span-3 row-span-3",
                          "col-start-4 col-span-3 row-span-3",
                          "col-span-2 row-start-4 row-span-3",
                          "col-start-3 col-span-2 row-start-4 row-span-3",
                          "col-start-5 col-span-2 row-start-4 row-span-3",
                        ];
                        return (
                          <div 
                            id={topic.imgs[index]} 
                            key={index} 
                            onClick={handleImageClick}
                            className={`${gridStyles[index]} w-full h-full rounded-sm bg-monochrome-950 relative`}
                          >
                            {index === 4 && (
                              <>
                                <div className="absolute w-full h-full bg-monochrome-950 opacity-60"/>
                                <div className="absolute w-full h-full flex items-center justify-center">
                                  <p className="text-monochrome-50 font-medium text-headline-4 mr-4">
                                    +{topic.imgs.length-5}
                                  </p>
                                </div>
                              </>
                            )}
                            <img src={topic.imgs[index] || '/'} className="h-full w-full object-cover rounded-sm"/>
                          </div>
                        );
                      })}
                    </div>
                  )
                }
              </div>
            ))
          }

          {/* Interaction Bar */}
          <PostInteractionBar 
            post={{ id: topic?._id, n_comment: topic?.n_comment }}
            comment_enable={true}
            setShareState={setShareState}
          />
        </div>
      </Link>
      {/* Image Full View */}
      {topic && (
        <ImageFullView isImageFull={isImageFull} setIsImageFull={setIsImageFull} imgs={topic?.imgs || []} clickedId={clickedId}/>
      )}
      {topic &&
      <SharePopup topicId={topic._id} shareState={shareState} setShareState={setShareState} />
      }
    </>
  )
});

export default Topic;