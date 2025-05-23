'use client';
import Link from 'next/link';
import { useParams, useRouter, usePathname } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { CommentSection, CommentInput, Comments, LoadingCircle, ErrorLoading, ImageFullView } from '@/components/index';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { trpc } from '@/app/_trpc/client';
import { useSession } from 'next-auth/react';
import type { User } from '@/db/models';
dayjs.extend(relativeTime);

interface Post {
  _id: string, 
  imgs: string[], 
  title: string, 
  body: string, 
  created_at: string, 
  n_like: number, 
  user_id: { username: string }, 
  isLiked : boolean
}
export default function Topic() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const { topicId } = useParams<{ topicId: string }>();

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
  const mutation = trpc.likeTopic.useMutation();
  const checkLikeMutation = trpc.checkLike.useMutation();
  const topicTagsMutation = trpc.topicTags.useMutation();

  const [post, setPost] = useState<Post | null>(null);
  const [isLiked, setIsLiked] = useState<boolean>();
  const [isSaved, setIsSaved] = useState<boolean>();
  const [countLike, setCountLike] = useState<number>();
  const [tags, setTags] = useState<string[]>([]);
  const [buttonStates, setButtonStates] = useState<Record<string, { liked: boolean, isClicked: boolean }>>({
    like: { liked: isLiked ?? false , isClicked: false },
    save: { liked: isSaved ?? false, isClicked: false },
    share: { liked: false, isClicked: false },
  });
  const [isLoaded, setIsLoaded] = useState(false); // Fully loaded state
  const [isImageFull, setIsImageFull] = useState(false);
  const [clickedId, setClickedId] = useState<string>('');

  useEffect(() => {
    if (isLoading) return;
    if (data && Array.isArray(data.data)) {
      const [ dData ] = data.data;
      setPost(dData);
      setTimeout(() => {
        setIsLoaded(true);
      }, 1000);
    } else {
      // console.log('API response is not an array:', data, isLoading);
    }
  }, [data, pathname])

  useEffect(() => {
    if (session?.user?.email && post?._id) {
      checkLikeMutation.mutate({
        topic_id: post._id,
        email: session.user.email,
      }, {
        onSuccess: (data) => {
          if (typeof data.data !== 'string') {
            setIsLiked(data.data.liked);
            setIsSaved(data.data.saved);
            setCountLike(data.data.n_like ?? 0);
          }
        },
        onError: (error) => {
          console.error("Error checking like status:", error);
        }
      });
      topicTagsMutation.mutate(
        { topic_id: post._id },
        {
          onSuccess: (data) => {
            if (data.topicTags && Array.isArray(data.topicTags)) {
              const extractedTags = data.topicTags.map(tag => tag.tagname);
              setTags(extractedTags);
              // console.log("Fetching Tags for post successfully: ", post._id);
            }
          },
          onError: (error) => {
            console.error("Error:", error);
          }
        }
      )
    }
  }, [session, post]);

  useEffect(() => {
    if (isLiked !== undefined) {
      setButtonStates((prev) => ({
        ...prev,
        like: {
          liked: isLiked, // ตั้งค่า liked ตาม isLiked
          isClicked: false, // สถานะการคลิก reset
        },
      }));
    }
  }, [isLiked]);

  useEffect(() => {
    if (isSaved !== undefined) {
      setButtonStates((prev) => ({
        ...prev,
        save: {
          liked: isSaved, // ตั้งค่า liked ตาม isSaved
          isClicked: false, // สถานะการคลิก reset
        },
      }));
    }
  }, [isSaved]);

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const buttonName = event.currentTarget.name as string;
    const type = buttonName as 'like' | 'save' | 'share';
    const status: boolean = !buttonStates[buttonName].liked;  // กำหนดประเภทเป็น boolean
    const topic_id = post?._id;
    const email = session?.user?.email;
    if (!email) {
      alert("You must Login first.!")
      return
    }

    if (!topic_id) {
      console.error("Post ID is missing!")
      return
    }

    mutation.mutate(
      { 
        topic_id: topic_id,
        type: type,
        email: email,
        status: status,
      },
      {
        onSuccess: (data) => {
          if (data?.data?.n_like != null) {
            setCountLike((data as { data: { n_like: number } }).data.n_like);
            // console.log(data)
          }
          
        },
        onError: (error) => {
          console.error("Mutation Failed:", error);
        }
      }
    );
    

    if (buttonName) {
      setButtonStates((prev) => {
        const currentButtonState = prev[buttonName];
        return {
          ...prev,
          [buttonName]: {
            liked: !currentButtonState.liked,
            isClicked: true,
          },
        };
      });

      setTimeout(() => {
        setButtonStates((prev) => ({
          ...prev,
          [buttonName]: {
            ...prev[buttonName],
            isClicked: false,
          },
        }));
      }, 300);
    }
  };

  if (isLoading) {
    return <LoadingCircle />
  } else if (isError) {
    return <ErrorLoading />
  }

  return (
    <div className="relative w-[35vw] maxlg:w-full px-[5%] h-full">
      {/* Back button */}
      {/* <button onClick={() => router.back()} className="absolute top-1 -left-6 size-8">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 48 48"
          className="scale-[110%] fill-none stroke-black hover:stroke-primary-600 transition duration-100"
        >
          <g strokeLinejoin="round" strokeWidth={3}>
            <path d="M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4S4 12.954 4 24s8.954 20 20 20Z"></path>
            <path strokeLinecap="round" d="m27 33l-9-9l9-9"></path>
          </g>
        </svg>
      </button> */}
      <div className="w-full h-full flex flex-col gap-6">
        <div className="w-full h-fit flex justify-between">
          {/* Post username section */}
          <div className="flex content-center items-center gap-2">
            <div className="size-10">
              <img src={post?.user_id && 'avatar' in post.user_id ? post.user_id.avatar : '/images/profile.avif'} className="w-full h-full object-cover rounded-full"/>
            </div>
            <div>
              <p className="text-headline-6">
                {post?.user_id && 'username' in post.user_id ? post.user_id.username : 'Unknown User'}
              </p>
              <p className="text-subtitle-small text-monochrome-400">
                {dayjs(post?.created_at).fromNow()}
              </p>
            </div>
          </div>
          {ownershipData?.data.permission && (
          <svg 
            onClick={(e) => {router.push(`/forum/edit-topic/${post?._id}`); e.preventDefault();}}
            className="text-monochrome-500 size-7 cursor-pointer"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path fill="currentColor" d="M20.71 7.04c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.37-.39-1.02-.39-1.41 0l-1.84 1.83l3.75 3.75M3 17.25V21h3.75L17.81 9.93l-3.75-3.75z"></path>
          </svg>
        )}
        </div>
        {/* Post details */}
        <div className="w-full h-fit flex flex-col items-center gap-2">
          {tags.length > 0 && 
          <div className="flex gap-2 self-start flex-wrap">
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
          <div className="w-full h-fit text-headline-4">{post?.title}</div>
          <div className="text-headline-6 w-full">{post?.body}</div>
          {Array.isArray(post?.imgs) && post.imgs.length > 0 && 
            (!isLoaded ? (
              <div className="w-[30rem] maxnm:md:w-[25rem] maxmd:min2sm:w-[40rem] max2sm:w-[25rem] h-[25rem] maxnm:md:h-[20rem] maxmd:min2sm:h-[35rem] max2sm:h-[20rem] animate-pulse">
                <div className="w-full h-full bg-monochrome-100 rounded-md"/>
              </div>
            ) : (
              // Display multiple images layout
              post.imgs.length === 1 && (
                <div className="flex w-[30rem] maxnm:md:w-[25rem] maxmd:min2sm:w-[40rem] max2sm:w-[25rem] h-[25rem] maxnm:md:h-[20rem] maxmd:min2sm:h-[35rem] max2sm:h-[20rem]">
                  {post.imgs.map((img, index) => (
                    <div 
                      id={img} 
                      key={index} 
                      onClick={(e) => {setIsImageFull(true); setClickedId(e.currentTarget.id);}}
                      className="h-full w-full rounded-sm bg-monochrome-950"
                    >
                      <img src={img || '/'} className="h-full w-full object-cover rounded-sm"/>
                    </div>
                  ))}
                </div>
              )
              ||
              post.imgs.length === 2 && (
                <div className="grid grid-cols-2 gap-[1px] w-[30rem] maxnm:md:w-[25rem] maxmd:min2sm:w-[40rem] max2sm:w-[25rem] h-[25rem] maxnm:md:h-[20rem] maxmd:min2sm:h-[35rem] max2sm:h-[20rem]">
                  {post.imgs.map((img, index) => (
                    <div 
                      id={img} 
                      key={index} 
                      onClick={(e) => {setIsImageFull(true); setClickedId(e.currentTarget.id);}}
                      className="h-full w-full rounded-sm bg-monochrome-950"
                    >
                      <img src={img || '/'} className="h-full w-full object-cover rounded-sm"/>
                    </div>
                  ))}
                </div>
              )
              ||
              post.imgs.length === 3 && (
                <div className="grid grid-cols-2 grid-rows-2 gap-[1px] w-[30rem] maxnm:md:w-[25rem] maxmd:min2sm:w-[40rem] max2sm:w-[25rem] h-[25rem] maxnm:md:h-[20rem] maxmd:min2sm:h-[35rem] max2sm:h-[20rem]">
                  {post.imgs.map((img, index) => (
                    <div 
                      id={img} 
                      key={index} 
                      onClick={(e) => {setIsImageFull(true); setClickedId(e.currentTarget.id);}}
                      className="w-full h-full rounded-sm bg-monochrome-950 first:row-span-2"
                    >
                      <img src={img || '/'} className="h-full w-full object-cover rounded-sm"/>
                    </div>
                  ))}
                </div>
              )
              ||
              post.imgs.length === 4 && (
                <div className="grid grid-cols-2 grid-rows-2 gap-[1px] w-[30rem] maxnm:md:w-[25rem] maxmd:min2sm:w-[40rem] max2sm:w-[25rem] h-[25rem] maxnm:md:h-[20rem] maxmd:min2sm:h-[35rem] max2sm:h-[20rem]">
                  {post.imgs.map((img, index) => (
                    <div 
                      id={img} 
                      key={index} 
                      onClick={(e) => {setIsImageFull(true); setClickedId(e.currentTarget.id);}}
                      className="w-full h-full rounded-sm bg-monochrome-950"
                    >
                      <img src={img || '/'} className="h-full w-full object-cover rounded-sm"/>
                    </div>
                  ))}
                </div>
              )
              ||
              post.imgs.length === 5 && (
                <div className="grid grid-cols-6 grid-rows-6 gap-[1px] w-[30rem] maxnm:md:w-[25rem] maxmd:min2sm:w-[40rem] max2sm:w-[25rem] h-[25rem] maxnm:md:h-[20rem] maxmd:min2sm:h-[35rem] max2sm:h-[20rem]">
                  {post.imgs.map((img, index) => {
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
                        onClick={(e) => {setIsImageFull(true); setClickedId(e.currentTarget.id);}}
                        className={`${gridStyles[index]} w-full h-full rounded-sm bg-monochrome-950`}
                      >
                        <img src={img || '/'} className="h-full w-full object-cover rounded-sm"/>
                      </div>
                    );
                    
                  })}
                </div>
              )
              ||
              post.imgs.length > 5 && (
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
                        id={post.imgs[index]} 
                        key={index} 
                        onClick={(e) => {setIsImageFull(true); setClickedId(e.currentTarget.id);}}
                        className={`${gridStyles[index]} w-full h-full rounded-sm bg-monochrome-950 relative`}
                      >
                        {index === 4 && (
                          <>
                            <div className="absolute w-full h-full bg-monochrome-950 opacity-60"/>
                            <div className="absolute w-full h-full flex items-center justify-center">
                              <p className="text-monochrome-50 font-medium text-headline-4 mr-4">
                                +{post.imgs.length-5}
                              </p>
                            </div>
                          </>
                        )}
                        <img src={post.imgs[index] || '/'} className="h-full w-full object-cover rounded-sm"/>
                      </div>
                    );
                  })}
                </div>
              )
            ))
          }
          <div className="flex gap-2 self-start">
            {/* Like */}
            <button type="button" name="like" onClick={handleClick} className={`text-button flex items-center flex-nowrap gap-1 bg-monochrome-100 py-2 px-2 rounded-[1.5rem] transition duration-200 ${buttonStates.like.liked ? 'bg-primary-500 text-monochrome-50 hover:text-monochrome-50' : 'bg-monochrome-100 text-monochrome-950 hover:text-primary-500'}`}>
              <svg className={`size-6 transition-transform duration-200 ${buttonStates.like.isClicked ? 'scale-125' : 'scale-100'}`} xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 1024 1024"><path fill="currentColor" d="M885.9 533.7c16.8-22.2 26.1-49.4 26.1-77.7c0-44.9-25.1-87.4-65.5-111.1a67.67 67.67 0 0 0-34.3-9.3H572.4l6-122.9c1.4-29.7-9.1-57.9-29.5-79.4A106.62 106.62 0 0 0 471 99.9c-52 0-98 35-111.8 85.1l-85.9 311H144c-17.7 0-32 14.3-32 32v364c0 17.7 14.3 32 32 32h601.3c9.2 0 18.2-1.8 26.5-5.4c47.6-20.3 78.3-66.8 78.3-118.4c0-12.6-1.8-25-5.4-37c16.8-22.2 26.1-49.4 26.1-77.7c0-12.6-1.8-25-5.4-37c16.8-22.2 26.1-49.4 26.1-77.7c-.2-12.6-2-25.1-5.6-37.1M184 852V568h81v284zm636.4-353l-21.9 19l13.9 25.4a56.2 56.2 0 0 1 6.9 27.3c0 16.5-7.2 32.2-19.6 43l-21.9 19l13.9 25.4a56.2 56.2 0 0 1 6.9 27.3c0 16.5-7.2 32.2-19.6 43l-21.9 19l13.9 25.4a56.2 56.2 0 0 1 6.9 27.3c0 22.4-13.2 42.6-33.6 51.8H329V564.8l99.5-360.5a44.1 44.1 0 0 1 42.2-32.3c7.6 0 15.1 2.2 21.1 6.7c9.9 7.4 15.2 18.6 14.6 30.5l-9.6 198.4h314.4C829 418.5 840 436.9 840 456c0 16.5-7.2 32.1-19.6 43"></path></svg>
              <p>{countLike}</p>
              <p>Like</p>
            </button>
            {/* Bookmark */}
            <button type="button" name="save" onClick={handleClick} className={`text-button flex items-center gap-1 bg-monochrome-100 py-2 px-2 rounded-[1.5rem] transition duration-200 ${buttonStates.save.liked ? 'bg-primary-500 text-monochrome-50 hover:text-monochrome-50' : 'bg-monochrome-100 text-monochrome-950 hover:text-primary-500'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" className={`size-6 transition-transform duration-200 ${buttonStates.save.isClicked ? 'scale-125' : 'scale-100'}`}><path fill="currentColor" d="M200-120v-640q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v640L480-240 200-120Zm80-122 200-86 200 86v-518H280v518Zm0-518h400-400Z"/></svg>
            </button>
            {/* Share */}
            <button type="button" name="share" onClick={handleClick} className={`text-button flex items-center gap-1 bg-monochrome-100 py-2 px-2 rounded-[1.5rem] hover:text-primary-500 transition duration-200`}>
              <svg className={`size-6 transition-transform duration-200`} xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="currentColor" d="m21.707 11.293l-8-8A1 1 0 0 0 12 4v3.545A11.015 11.015 0 0 0 2 18.5V20a1 1 0 0 0 1.784.62a11.46 11.46 0 0 1 7.887-4.049c.05-.006.175-.016.329-.026V20a1 1 0 0 0 1.707.707l8-8a1 1 0 0 0 0-1.414M14 17.586V15.5a1 1 0 0 0-1-1c-.255 0-1.296.05-1.562.085a14 14 0 0 0-7.386 2.948A9.013 9.013 0 0 1 13 9.5a1 1 0 0 0 1-1V6.414L19.586 12Z"></path></svg>
              <p>
                Share
              </p>
            </button>
          </div>
        </div>
        {/* Comment text area */}
        <div className="flex">
        {post?._id && session?.user?.email && (
          <CommentInput topic_id={post._id} parent_id={null} userEmail={session.user.email} />
        )}
        </div>
        <div>
          {post?._id && session?.user?.email && (
            <Comments topicId={post._id} userEmail={session.user.email} />
          )}
        </div>
      </div>

      {/* Image Full View */}
      {post && (
        <ImageFullView isImageFull={isImageFull} setIsImageFull={setIsImageFull} imgs={post.imgs || []} clickedId={clickedId}/>
      )}
    </div>
  )
}