"use client";

import { trpc } from "@/app/_trpc/client";
import { useState,useEffect } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { CommentSection, CommentInput, SortBy} from '@/components/index';

dayjs.extend(relativeTime);

interface Comment {
  _id: string;
  user_id: {
    email: string;
    username: string;
    avatar: string;
  };
  comment: string;
  created_at: string;
  parent_id?: string;
  children: Comment[]; // เพิ่ม children
  n_like?: number;
}

// ฟังก์ชันแปลง comments เป็น Tree Structure
const buildCommentTree = (comments: Comment[]) => {
  const commentMap: Record<string, Comment & { children: Comment[] }> = {};
  const rootComments: (Comment & { children: Comment[] })[] = [];

  comments.forEach(comment => {
    commentMap[comment._id] = { ...comment, children: [] };
  });

  comments.forEach(comment => {
    if (comment.parent_id && commentMap[comment.parent_id]) {
      commentMap[comment.parent_id].children.push(commentMap[comment._id]);
    } else {
      rootComments.push(commentMap[comment._id]);
    }
  });

  return rootComments;
};

// Component แสดงคอมเมนต์แบบ Nested
const CommentItem = ({ comment, postId, userEmail, isRoot = false }: { comment: Comment & { children: Comment[] }, postId: string, userEmail: string, isRoot?: boolean }) => {
  const [showInput, setShowInput] = useState(false);
  const [isCommentClicked, setIsCommentClicked] = useState(false);
  const [isLiked, setIsLiked] = useState<boolean | undefined>(undefined);
  const [likesCount, setLikesCount] = useState(comment.n_like || 0);
  const [showReplies, setShowReplies] = useState(false);

  const [buttonStates, setButtonStates] = useState<Record<string, { liked: boolean, isClicked: boolean }>>({
    like: { liked: isLiked ?? false , isClicked: false },
  });

  const likeCommentMutation = trpc.likeComment.useMutation();
  const checkLikeMutation = trpc.checkLike.useMutation();

  useEffect(() => {
    if (isLiked !== undefined) {
      setButtonStates((prev) => ({
        ...prev,
        like: {
          liked: isLiked, 
          isClicked: false,
        },
      }));
    }
  }, [isLiked]);
  
  const handleLike = async () => {
    try {
      const res = await likeCommentMutation.mutateAsync({
        comment_id: comment._id,
        email: userEmail,
        status: !isLiked,  // Toggle like status
      });
  
      if (res.status === 200) {
        setLikesCount(res.data.n_like);
        setIsLiked(res.data.state);
        localStorage.setItem(`likeStatus-${comment._id}`, JSON.stringify(res.data.state));  // Store the new like status
      } else {
        console.error('Like failed:', res.data.message);
      }
    } catch (err) {
      console.error('API error:', err);
    }
  };

  const handleToggleInput = () => {
    setShowInput(prev => {
      const newState = !prev;
      setIsCommentClicked(newState); 
      return newState;
    });
  };

  const countAllDescendants = (comment: Comment): number => {
    if (!comment.children || comment.children.length === 0) return 0;
  
    return comment.children.reduce((total, child) => {
      return total + 1 + countAllDescendants(child);
    }, 0);
  };

  return (
    <div className="h-fit w-full flex flex-col item-start">
      <div className="flex content-center items-center gap-2">
        <div className="w-10 h-10 min-w-[2.5rem]">
          <img src={comment.user_id.avatar || '/images/profile.avif'}  className="w-full h-full object-cover rounded-full"/>
        </div>
        <p className="text-headline-6 font-bold">
          {comment.user_id.username}
        </p>
        <p className="text-subtitle-small">•</p>
        <p className="text-subtitle-small text-monochrome-400">
          {dayjs(comment.created_at).fromNow()}
        </p>
      </div>

      <div className="h-fit w-full flex mb-3">
        <div className="flex justify-end w-12 min-w-12 pt-2">
          {comment.children && comment.children.length > 0 ? (
            <div className="h-full w-0.5 bg-monochrome-200 mr-6"></div>
          ) : null}
        </div>
        <div className="w-full h-fit flex flex-col ml-0 gap-2">
          
          {/* Comment text */}
          <p className="text-headline-5">
            {comment.comment}
          </p>

          {/* Buttons */}
          <div className="flex gap-2">
            <button
              type="button"
              name="like"
              onClick={handleLike}
              className={`text-button flex items-center gap-1 py-2 px-2 rounded-[1.5rem] transition duration-200 
                ${isLiked 
                  ? 'bg-primary-500 text-white' 
                  : 'bg-monochrome-100 text-monochrome-950 hover:text-primary-500'}
              `}
            >
              <svg 
                className={`size-6 transition-transform duration-200 ${buttonStates.like.isClicked ? 'scale-125' : 'scale-100'}`}
                xmlns="http://www.w3.org/2000/svg" 
                width={24} 
                height={24} 
                viewBox="0 0 1024 1024"
              >
                <path fill="currentColor" d="M885.9 533.7c16.8-22.2 26.1-49.4 26.1-77.7c0-44.9-25.1-87.4-65.5-111.1a67.67 67.67 0 0 0-34.3-9.3H572.4l6-122.9c1.4-29.7-9.1-57.9-29.5-79.4A106.62 106.62 0 0 0 471 99.9c-52 0-98 35-111.8 85.1l-85.9 311H144c-17.7 0-32 14.3-32 32v364c0 17.7 14.3 32 32 32h601.3c9.2 0 18.2-1.8 26.5-5.4c47.6-20.3 78.3-66.8 78.3-118.4c0-12.6-1.8-25-5.4-37c16.8-22.2 26.1-49.4 26.1-77.7c0-12.6-1.8-25-5.4-37c16.8-22.2 26.1-49.4 26.1-77.7c-.2-12.6-2-25.1-5.6-37.1M184 852V568h81v284zm636.4-353l-21.9 19l13.9 25.4a56.2 56.2 0 0 1 6.9 27.3c0 16.5-7.2 32.2-19.6 43l-21.9 19l13.9 25.4a56.2 56.2 0 0 1 6.9 27.3c0 16.5-7.2 32.2-19.6 43l-21.9 19l13.9 25.4a56.2 56.2 0 0 1 6.9 27.3c0 22.4-13.2 42.6-33.6 51.8H329V564.8l99.5-360.5a44.1 44.1 0 0 1 42.2-32.3c7.6 0 15.1 2.2 21.1 6.7c9.9 7.4 15.2 18.6 14.6 30.5l-9.6 198.4h314.4C829 418.5 840 436.9 840 456c0 16.5-7.2 32.1-19.6 43"></path>
              </svg>
              <p className="text-nowrap">{likesCount} Like</p>
            </button>
            <button 
              type="button" 
              name="comment"
              onClick={handleToggleInput}
              className={`text-button flex items-center gap-1 bg-monochrome-100 py-2 px-2 rounded-[1.5rem] group hover:text-primary-500 transition duration-200`}
            >
              <svg className="size-6" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path className="fill-current" d="M144 208C126.3 208 112 222.2 112 239.1C112 257.7 126.3 272 144 272s31.1-14.25 31.1-32S161.8 208 144 208zM256 207.1c-17.75 0-31.1 14.25-31.1 32s14.25 31.1 31.1 31.1s31.1-14.25 31.1-31.1S273.8 207.1 256 207.1zM368 208c-17.75 0-31.1 14.25-31.1 32s14.25 32 31.1 32c17.75 0 31.99-14.25 31.99-32C400 222.2 385.8 208 368 208zM256 31.1c-141.4 0-255.1 93.12-255.1 208c0 47.62 19.91 91.25 52.91 126.3c-14.87 39.5-45.87 72.88-46.37 73.25c-6.624 7-8.373 17.25-4.624 26C5.818 474.2 14.38 480 24 480c61.49 0 109.1-25.75 139.1-46.25c28.87 9 60.16 14.25 92.9 14.0c141.4 0 255.1-93.13 255.1-207.1S397.4 31.1 256 31.1zM256 400c-26.75 0-53.12-4.125-78.36-12.12l-22.75-7.125L135.4 394.5c-14.25 10.12-33.87 21.38-57.49 29c7.374-12.12 14.37-25.75 19.87-40.25l10.62-28l-20.62-21.87C69.81 314.1 48.06 282.2 48.06 240c0-88.25 93.24-160 207.1-160s207.1 71.75 207.1 160S370.8 400 256 400z"/></svg>
              <p className="text-nowrap">
                Comment
              </p>
            </button>
          </div>

          {/* CommentInput โชว์ input แบบ expanded เลย */}
          {showInput && (
            <div className="flex">
              <CommentInput 
              topic_id={postId} 
              parent_id={comment._id} 
              userEmail={userEmail} 
              isCommentClicked={isCommentClicked} 
              setIsCommentClicked={setIsCommentClicked}
              />
            </div>
          )}
        </div>
      </div>

      {/* Nested comments */}
      {(showReplies || !isRoot) && comment.children.length > 0 && (
        <div className="relative w-full h-fit flex">
          <div className="w-full h-fit flex flex-col ml-10 gap-6 pt-4">
            {comment.children.map((nestedComment, index) => {
              const checkIfNextSameLevel = (comments: Comment[], index: number): boolean => {
                if (index < comments.length - 1) {
                  return comments[index].level === comments[index + 1].level;
                }
                return false;
              };
              
              const isLastChild = index === comment.children.length - 1;
              const hasNextSameLevel = checkIfNextSameLevel(comment.children, index);

              return (
                <div key={index} className="relative flex w-full h-fit">
                  <div className="absolute -left-[14px] -top-6 h-12 w-6 border-b-2 border-l-2 border-monochrome-200 rounded-bl-lg"></div>
                  {hasNextSameLevel && (
                    <div className="absolute -left-[14px] top-0 h-full w-6 border-l-2 border-monochrome-200"></div>
                  )}
                  <CommentItem comment={nestedComment} postId={postId} userEmail={userEmail} />
                </div>
              );
            })}
          </div>
        </div>
      )}
                
      {isRoot && comment.children.length > 0 && (
        <div className="relative flex items-center mt-2 ml-10 pl-2">
              {!showReplies && (
                <div className="absolute -left-5 top-0 h-5 w-5 border-b-2 border-l-2 border-monochrome-200 rounded-bl-lg"></div>
              )}
          <button
            onClick={() => setShowReplies(prev => !prev)}
            className="text-primary-700 text-body-large mt-2 hover:underline"
          >
            {showReplies
              ? `ซ่อนความเห็นตอบกลับของ ${comment.user_id.username}`
              : `แสดงความเห็นตอบกลับ (${countAllDescendants(comment)})`}
          </button>
        </div>
      )}
    </div>
  );
};

const Comments = ({ topicId, userEmail }: { topicId: string, userEmail: string }) => {
  const [sortOrder, setSortOrder] = useState('desc');
  const { data, isLoading, error } = trpc.getAllComments.useQuery(
    { topic_id: topicId, sortOrder }, // ส่งค่าของ sortOrder ไป
    {
      enabled: !!topicId, 
    }
  );
  
  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSortOrder(value);
  };

  const sortComments = (comments: Comment[]) => {
    if (sortOrder === 'like') {
      // Sort by like count (descending), break ties with creation date (newest first)
      return comments.sort((a, b) => {
        if (b.n_like === a.n_like) {
          return dayjs(b.created_at).isAfter(dayjs(a.created_at)) ? 1 : -1;
        }
        return b.n_like - a.n_like;
      });
    }
    if (sortOrder === 'asc') {
      // Oldest first
      return comments.sort((a, b) => dayjs(a.created_at).isAfter(dayjs(b.created_at)) ? 1 : -1);
    }
    // Default: Newest first
    return comments.sort((a, b) => dayjs(b.created_at).isAfter(dayjs(a.created_at)) ? 1 : -1);
  };

  if (isLoading) return <p>กำลังโหลดความคิดเห็น...</p>;
  if (error) return <p className="text-red-500">เกิดข้อผิดพลาด: {error.message}</p>;

  const comments: Comment[] = data?.data?.comments ?? [];
  const sortedComments = sortComments(comments); 
  const nestedComments = buildCommentTree(comments);

  return (
    <div className="p-4">
      <h2 className="text-headline-6 font-bold mb-2">ความคิดเห็น</h2>
      {nestedComments.length === 0 ? (
        <p className="text-headline-6 mb-2 mt-8" >ยังไม่มีความคิดเห็น</p>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="relative h-full flex w-fit gap-2 items-center mb-4 text-body-large">
            <p className="text-monochrome-500 text-subtitle-large">
              Sort by:
            </p>
            <select onChange={handleSortChange} value={sortOrder} className="py-2 px-1 border-b border-monochrome-200 transition duration-100 hover:bg-monochrome-100 hover:cursor-pointer">
              <option value="desc">Newest</option>
              <option value="asc">Oldest</option>
              <option value="like">Popular</option>
            </select>
          </div>
          {nestedComments.map(comment => (
            <CommentItem key={comment._id} comment={comment} postId={topicId} userEmail={userEmail} isRoot={true} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Comments;