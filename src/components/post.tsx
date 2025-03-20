'use client';
import { useState, useRef, useEffect, forwardRef } from 'react';
import Link from 'next/link';
import { PostInteractionBar } from '@/components/index';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { trpc } from '@/app/_trpc/client';

dayjs.extend(relativeTime);

interface PostProps {
  post: { 
    _id: number, 
    img: string, 
    title: string, 
    body: string, 
    created_at: string, 
    n_like: number, 
    user_id: { username: string }, 
    isLiked : boolean
  };
}

const Post = forwardRef<HTMLDivElement, PostProps>(({ post }, ref) => {
  const topicTagsMutation = trpc.topicTags.useMutation();
  const [tags, setTags] = useState<string[]>([]);

  // Not yet added comment auto focus functionality when redirect with comment button
  const onCommentClicked = (event: React.MouseEvent<HTMLButtonElement>) => {
    // event.preventDefault();
    // const query = JSON.stringify(post);
    // router.push(`/forum/${post.id}?${query}`);
  }

  useEffect(() => {
    topicTagsMutation.mutate(
      { topic_id: String(post._id) },
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

  return (
    <Link
    href={{ pathname: `/forum/${post._id}`,
    query: JSON.stringify({ ...post, tags: tags })}}
    className="h-full w-full bg-monochrome-50 drop-shadow-[0_0_6px_rgba(0,0,0,0.1)] rounded-xl"
    >
      <div ref={ref} className="h-full w-full pt-6 pb-3 px-8 flex flex-col gap-3 text-start">
        {/* Username Section */}
        <div className="flex content-center items-center gap-2">
          <div className="size-10">
            <img src='/images/profile.avif' className="w-full h-full object-cover rounded-full"/>
          </div>
          <p className="text-body-large font-bold">
            {post.user_id.username}
          </p>
          <p className="text-subtitle-small">•</p>
          <p className="text-subtitle-small text-monochrome-400">
            {dayjs(post.created_at).fromNow()}
          </p>
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
            {post.title}
          </p>
          <p className='text-body-large'>
            {post.body}
          </p>
        </div>
        
        {post.img && post.img.trim() !== "" && (
          <div className="h-[25rem] w-full">
            <img src={post.img} className="w-full h-full object-cover"/>
          </div>
        )}

        {/* Interaction Bar */}
        <PostInteractionBar 
          post={{ id: post._id, img: post.img, title: post.title, body: post.body, like: post.n_like, isLiked : post.isLiked }}
          comment_enable={true} 
          onCommentClicked={onCommentClicked}
        />
      </div>
    </Link>
  )
});

export default Post;