'use client';

import mongoose from "mongoose";
import { useState } from 'react';

// In reality topic_id will not be null (null just for testing only)
interface Comment {
  topic_id: mongoose.Types.ObjectId | null;
  parent_id?: mongoose.Types.ObjectId | null;
  setIsCommentClicked?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CommentInput({ topic_id, parent_id, setIsCommentClicked }: Comment) {
  const [isCommentExpanded, setIsCommentExpanded] = useState<Boolean>(false);
  const [comment, setComment] = useState<string>('');
  const [rows, setRows] = useState<number>(1);

  const handleExpand = () => {
    setIsCommentExpanded(true);
    setRows(3);
  }

  const handleCancel = () => {
    setIsCommentExpanded(false);
    setComment('');
    setRows(1);

    if (setIsCommentClicked) {
      setIsCommentClicked(false);
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
        id=""
        placeholder="Add a comment"
        rows={rows}
        onChange={(e) => setComment(e.target.value)}
        className={`w-full text-body-large text-monochrome-950 placeholder-monochrome-600 resize-none outline-none scrollbar-thin scrollbar-track-transparent scrollbar-thumb-monochrome-100 caret-monochrome-600`}
      ></textarea>
      {isCommentExpanded && (
        <div className="flex justify-end gap-1 text-button">
          <button 
            className="px-3 py-3 rounded-[1.3rem] bg-monochrome-200"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button className="px-3 py-3 rounded-[1.3rem] bg-primary-600 text-monochrome-50">
            Comment
          </button>
        </div>
    )}
  </div>
  )
}