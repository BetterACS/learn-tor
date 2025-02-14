'use client';

import mongoose from "mongoose";
import { useEffect, useState, useRef } from 'react';
import { useSession } from "next-auth/react";

interface CommentProps {
  topic_id: mongoose.Types.ObjectId | string | null;
  parent_id?: mongoose.Types.ObjectId | string | null;
  isCommentClicked?: boolean | null;
  setIsCommentClicked?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CommentInput({ topic_id, parent_id, isCommentClicked, setIsCommentClicked }: CommentProps) {
  const [isCommentExpanded, setIsCommentExpanded] = useState<boolean>(false);
  const [comment, setComment] = useState<string>('');
  const [rows, setRows] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { data: session } = useSession(); // ดึงข้อมูล user (ไม่มั่นใจว่าใช้ session ดึงจาก auth เลยได้หรือเปล่า)
  const userEmail = session?.user?.email || null; // ตรวจสอบว่ามี email หรือไม่

  useEffect(() => {
    if (isCommentClicked) {
      handleExpand();
    }
  }, [isCommentClicked]);

  const handleExpand = () => {
    setIsCommentExpanded(true);
    setRows(3);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const handleCancel = () => {
    setIsCommentExpanded(false);
    setComment('');
    setRows(1);
    setError(null);

    if (setIsCommentClicked) {
      setIsCommentClicked(false);
    }
  };

  const handleSubmit = async () => {
    if (!comment.trim()) return; 
    if (!topic_id) {
      setError("Invalid topic ID");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/forum/${topic_id}/comment", { //ไม่มั่นใจว่าเรียก fetch ถูกมั้ย
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic_id,
          email: userEmail,
          comment,
          parent_id: parent_id || null,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setComment('');
        setIsCommentExpanded(false);
      } else {
        setError(data.message || "Failed to submit comment");
      }
    } catch (err) {
      setError("Error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className={`w-full h-fit rounded-[1.1rem] flex flex-col gap-2 px-3 py-3 border ${!isCommentExpanded ? "border-monochrome-500" : "border-primary-600"}`} 
      onClick={() => !isCommentExpanded && handleExpand()}
    >
      <textarea 
        name="comment_text_area"
        value={comment}
        placeholder="Add a comment"
        rows={rows}
        onChange={(e) => setComment(e.target.value)}
        ref={inputRef}
        className="w-full text-body-large text-monochrome-950 placeholder-monochrome-600 resize-none outline-none scrollbar-thin scrollbar-track-transparent scrollbar-thumb-monochrome-100 caret-monochrome-600"
      ></textarea>
      
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {isCommentExpanded && (
        <div className="flex justify-end gap-1 text-button">
          <button 
            className="px-3 py-3 rounded-[1.3rem] bg-monochrome-200"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button 
            className={`px-3 py-3 rounded-[1.3rem] bg-primary-600 text-monochrome-50 ${isSubmitting ? "opacity-50" : ""}`}
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Comment"}
          </button>
        </div>
      )}
    </div>
  );
}
