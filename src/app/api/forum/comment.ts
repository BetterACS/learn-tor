// /pages/api/forum/comment.ts
import { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/server/db";
import { CommentModel, UserModel, TopicModel } from "@/db/models";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  if (req.method === "POST") {
    const { topic_id, email, comment, parent_id } = req.body;

    if (!topic_id || !email || !comment) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    try {
      const newComment = new CommentModel({
        user_id: user._id,
        topic_id,
        parent_id: parent_id || null,
        comment,
        n_like: 0,
      });

      const savedComment = await newComment.save();
      return res.status(201).json({ message: "Comment created successfully", comment: savedComment });
    } catch (error) {
      console.error("Error saving comment:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
