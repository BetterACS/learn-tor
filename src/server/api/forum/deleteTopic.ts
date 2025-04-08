import { 
  TopicModel, 
  TopicAndTagModel, 
  TagNameModel, 
  UserModel, 
  CommentModel, 
  LikeCommentModel, 
  LikeTopicModel, 
  BookmarkModel 
} from "@/db/models";
import { connectDB } from "@/server/db";
import { z } from "zod";
import { publicProcedure } from "../../trpc";
import logError from "@/utils/logError";
import { Types } from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import { extractPublicId } from 'cloudinary-build-url';
import mongoose from "mongoose";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const deleteTopic = {
  deleteTopic: publicProcedure
    .input(
      z.object({
        topicId: z.string(),
        email: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { topicId, email } = input;

      await connectDB();
      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        // Find the user
        const user = await UserModel.findOne({ email }).select("_id").session(session);
        if (!user) {
          await session.abortTransaction();
          session.endSession();

          return {
            status: 400,
            data: { message: "User not found" },
          };
        }

        // Find the topic and ensure the user owns it
        const topic = await TopicModel.findOne({ _id: topicId, user_id: user._id }).session(session);
        if (!topic) {
          await session.abortTransaction();
          session.endSession();

          return {
            status: 404,
            data: { message: "Topic not found or you don't have permission to delete it" },
          };
        }

        // Get all tag_ids attached to the topic
        const topicTags = await TopicAndTagModel.find({ topic_id: topicId }).session(session);
        const tagIds = topicTags.map(tag => tag.tag_id);

        // Delete this topic
        await TopicModel.deleteOne({ _id: topicId }).session(session);

        // Delete all related tags in TopicAndTagModel
        await TopicAndTagModel.deleteMany({ topic_id: topicId }).session(session);

        // Check if tag still being use in other topics
        for (const tagId of tagIds) {
          const isTagUsed = await TopicAndTagModel.exists({ tag_id: tagId }).session(session);

          if (!isTagUsed) {
            await TagNameModel.deleteOne({ _id: tagId }).session(session);
          }
        }

        // Delete image in cloudinary
        if (Array.isArray(topic.img) && topic.img.length > 0) {
          for (const image of topic.img) {
            try {
              const imgPublicId = extractPublicId(image);
              const cloudinaryRes = await cloudinary.uploader.destroy(imgPublicId);
      
              if (cloudinaryRes?.result !== "ok") {
                throw new Error("Cloudinary image deletion failed");
              }
            } catch (cloudinaryError) {
              console.error("Error deleting image from Cloudinary:", cloudinaryError);
              throw new Error("Cloudinary image deletion failed");
            }
          }
        }

        // Delete Comment
        const comments = await CommentModel.find({ topic_id: topicId }).session(session);
        const commentId = comments.map(comment => comment._id);
        await CommentModel.deleteMany({ topic_id: topicId }).session(session);
        
        // Delete LikeComment
        await LikeCommentModel.deleteMany({ comment_id: { $in: commentId } }).session(session);

        // Delete Like
        await LikeTopicModel.deleteOne({ topic_id: topicId }).session(session);

        // Delete Bookmark
        await BookmarkModel.deleteOne({ topic_id: topicId }).session(session);

        await session.commitTransaction();
        session.endSession();

        return {
          status: 200,
          data: { message: "Topic, image, and related tags deleted successfully" },
        };
      } catch (error) {
        console.error("Error deleting topic:", error);

        // Rollback
        await session.abortTransaction();
        session.endSession();

        return { status: 500, data: { message: "Failed to delete topic" } };
      }
    }),
}

export default deleteTopic;
