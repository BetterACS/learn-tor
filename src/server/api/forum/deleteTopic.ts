import { TopicModel, TopicAndTagModel, TagNameModel, UserModel } from "@/db/models";
import { connectDB } from "@/server/db";
import { z } from "zod";
import { publicProcedure } from "../../trpc";
import logError from "@/utils/logError";
import { Types } from 'mongoose';

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

      try {
        await connectDB();

        // Find the user
        const user = await UserModel.findOne({ email }).select("_id");
        if (!user) {
          return {
            status: 400,
            data: { message: "User not found" },
          };
        }

        // Find the topic and ensure the user owns it
        const topic = await TopicModel.findOne({ _id: topicId, user_id: user._id });
        if (!topic) {
          return {
            status: 404,
            data: { message: "Topic not found or you don't have permission to delete it" },
          };
        }

        // Get all tag_ids attached to the topic
        const topicTags = await TopicAndTagModel.find({ topic_id: topicId });
        const tagIds = topicTags.map(tag => tag.tag_id);

        // Delete this topic
        await TopicModel.deleteOne({ _id: topicId });

        // Delete all related tags in TopicAndTagModel
        await TopicAndTagModel.deleteMany({ topic_id: topicId });

        // Check if tag still being use in other topics
        for (const tagId of tagIds) {
          const isTagUsed = await TopicAndTagModel.exists({ tag_id: tagId });

          if (!isTagUsed) {
            await TagNameModel.deleteOne({ _id: tagId });
          }
        }

        return {
          status: 200,
          data: { message: "Topic and related tags deleted successfully" },
        };
      } catch (error) {
        console.error("Error deleting topic:", error);
        return { status: 500, data: { message: "Failed to delete topic" } };
      }
    }),
}

export default deleteTopic;
