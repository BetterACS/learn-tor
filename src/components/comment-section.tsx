'use client';

import { useEffect, useState } from 'react';
import {CommentInput, SortBy} from '@/components/index';
import mongoose from 'mongoose';

interface Comment {
  _id: string;
  user_id: {
    username: string;
  };
  topic_id: string;
  parent_id?: string;
  comment: string;
  n_like: number;
  createdAt?: string;
  replies?: Comment[];
}

interface CommentProps {
  comment: Comment;
  onLike: (commentId: string) => void;
}

const CommentComponent = ({ comment, onLike }: CommentProps) => {
  const [isCommentClicked, setIsCommentClicked] = useState(false);

  return (
    <div className="h-fit w-full flex flex-col item-start">
      <div className="flex content-center items-center gap-2">
        <div className="w-10 min-w-10">
          <img src="/images/profile.avif" className="w-full h-full object-cover rounded-full" />
        </div>
        <p className="text-headline-6 font-bold">{comment.user_id.username}</p>
        <p className="text-subtitle-small">•</p>
        <p className="text-subtitle-small text-monochrome-400 text-nowrap">
          {comment.createdAt ? new Date(comment.createdAt).toLocaleTimeString() : "Just now"}
        </p>
      </div>

      <div className="h-fit w-full flex">
        <div className="w-full h-fit flex flex-col gap-2">
          <p className="text-headline-5">{comment.comment}</p>

          {/* Buttons */}
          <div className="flex gap-1">
            <button
              type="button"
              name="like"
              className="text-button flex items-center gap-1 bg-monochrome-100 py-2 px-2 rounded-[1.5rem] transition duration-200"
              onClick={() => onLike(comment._id)}
            >
              <svg className="size-6 transition-transform duration-200" xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 1024 1024">
                <path fill="currentColor" d="M885.9 533.7c16.8-22.2 26.1-49.4 26.1-77.7c0-44.9-25.1-87.4-65.5-111.1a67.67 67.67 0 0 0-34.3-9.3H572.4l6-122.9c1.4-29.7-9.1-57.9-29.5-79.4A106.62 106.62 0 0 0 471 99.9c-52 0-98 35-111.8 85.1l-85.9 311H144c-17.7 0-32 14.3-32 32v364c0 17.7 14.3 32 32 32h601.3c9.2 0 18.2-1.8 26.5-5.4c47.6-20.3 78.3-66.8 78.3-118.4c0-12.6-1.8-25-5.4-37c16.8-22.2 26.1-49.4 26.1-77.7c0-12.6-1.8-25-5.4-37c16.8-22.2 26.1-49.4 26.1-77.7c-.2-12.6-2-25.1-5.6-37.1"/>
              </svg>
              <p className="text-nowrap">
                {comment.n_like} Likes
              </p>
            </button>

            <button 
              type="button" 
              name="comment"
              onClick={() => setIsCommentClicked(true)}
              className="text-button flex items-center gap-1 bg-monochrome-100 py-2 px-2 rounded-[1.5rem] hover:text-primary-500 transition duration-200"
            >
              <svg className="size-6" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                <path className="fill-current" d="M144 208C126.3 208 112 222.2 112 239.1C112 257.7 126.3 272 144 272s31.1-14.25 31.1-32S161.8 208 144 208zM256 207.1c-17.75 0-31.1 14.25-31.1 32s14.25 31.1 31.1 31.1s31.1-14.25 31.1-31.1S273.8 207.1 256 207.1zM368 208c-17.75 0-31.1 14.25-31.1 32s14.25 32 31.1 32c17.75 0 31.99-14.25 31.99-32C400 222.2 385.8 208 368 208zM256 31.1c-141.4 0-255.1 93.12-255.1 208c0 47.62 19.91 91.25 52.91 126.3c-14.87 39.5-45.87 72.88-46.37 73.25c-6.624 7-8.373 17.25-4.624 26C5.818 474.2 14.38 480 24 480c61.49 0 109.1-25.75 139.1-46.25c28.87 9 60.16 14.25 92.9 14.0c141.4 0 255.1-93.13 255.1-207.1S397.4 31.1 256 31.1zM256 400c-26.75 0-53.12-4.125-78.36-12.12l-22.75-7.125L135.4 394.5c-14.25 10.12-33.87 21.38-57.49 29c7.374-12.12 14.37-25.75 19.87-40.25l10.62-28l-20.62-21.87C69.81 314.1 48.06 282.2 48.06 240c0-88.25 93.24-160 207.1-160s207.1 71.75 207.1 160S370.8 400 256 400z"/>
              </svg>
              <p className="text-nowrap">
                Comment
              </p>
            </button>
          </div>

          {/* Reply input */}
          {isCommentClicked && (
            <CommentInput
              topic_id={comment.topic_id}
              parent_id={comment.parent_id}
              isCommentClicked={isCommentClicked}
              setIsCommentClicked={setIsCommentClicked}
            />
          )}
        </div>
      </div>

      {/* Nested comments */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-10 border-l-2 border-gray-300 pl-4 mt-2">
          {comment.replies.map((nestedComment) => (
            <CommentComponent key={nestedComment._id} comment={nestedComment} onLike={onLike} />
          ))}
        </div>
      )}
    </div>
  );
};

export default function CommentSection({ topic_id }: { topic_id: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/forum/topic/${topic_id}/comment`); //ไม่มั่นใจว่าเรียกมาถูกมั้ย
        const data = await response.json();

        if (response.ok) {
          setComments(data);
        } else {
          setError(data.message || "Failed to load comments");
        }
      } catch (err) {
        setError("Error");
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [topic_id]);

  const handleLike = async (commentId: string) => {
    try {
      const response = await fetch("/api/forum/comment/like", { //ไม่มั่นใจว่าเรียกมาถูกมั้ย
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ comment_id: commentId }),
      });

      if (response.ok) {
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment._id === commentId ? { ...comment, n_like: comment.n_like + 1 } : comment
          )
        );
      }
    } catch (err) {
      console.error("Failed to like comment");
    }
  };

  return (
    <div className="p-4">
      {/* <CommentInput topic_id={topic_id} /> */}

      {loading && <p>Loading comments...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && comments.length > 0 && (
        <div className="mt-4 flex flex-col gap-4">
          {comments.map((comment) => (
            <CommentComponent key={comment._id} comment={comment} onLike={handleLike} />
          ))}
        </div>
      )}
    </div>
  );
}
