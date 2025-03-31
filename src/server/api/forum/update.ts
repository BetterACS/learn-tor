import { TopicModel, TopicAndTagModel, TagNameModel, UserModel } from "@/db/models";
import { connectDB } from "@/server/db";
import { z } from "zod";
import { publicProcedure } from "../../trpc";
import logError from "@/utils/logError";
import { Types } from 'mongoose';

const updateTopic = {
  updateTopic: publicProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
        body: z.string(),
        email: z.string(),
        img: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, title, body, email, img } = input;
      try {
        await connectDB();

        const user = await UserModel.findOne({ email });

        if (!user) {
            return {
                status: 400,
                data: { message: "User not found" },
            };
        }

        const updatedTopic = await TopicModel.findOneAndUpdate(
          { _id: id, user_id: user._id },
          { title, body, img },
          { new: true }
        ).populate("user_id", "username");

        if (!updatedTopic) {
          return {
            status: 404,
            data: { message: "Topic not found or you don't have permission to update it" },
          };
        }
        
        return { 
          status: 200, 
          data: { message: "Topic updated successfully", topic: updatedTopic }, 
        };
      } catch (error) {
        console.log("Error updating topic:", error);
        logError(error as Error);
        return { status: 500, data: { message: "Fail to update topic" } };
      }
    }),
  updateTags: publicProcedure
    .input(
      z.object({
        topicId: z.string(),
        tags: z.array(z.string()),
        email: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { topicId, tags, email } = input;
  
      try {
        await connectDB();

        const user = await UserModel.findOne({ email }).select("_id");
        if (!user) {
          return { status: 404, data: { message: "User not found" } };
        }
  
        const topic = await TopicModel.findOne({ _id: topicId, user_id: user._id });
        if (!topic) {
          return { status: 403, data: { message: "You don't have permission to update this topic." } };
        }
  
        const tagNames = await TagNameModel.find({ tagname: { $in: tags } });
  
        if (tagNames.length === 0) {
          return { status: 404, data: { message: "No matching tags found." } };
        }
  
        const tagIds = tagNames.map(tag => tag._id);
  
        await TopicAndTagModel.deleteMany({ topic_id: topicId });
  
        const updatedTags = await TopicAndTagModel.insertMany(
          tagIds.map(tagId => ({
            topic_id: topicId,
            tag_id: tagId,
          }))
        );
  
        return {
          status: 200,
          data: { message: "Tags updated successfully", topic: updatedTags },
        };
      } catch (error) {
        console.error("Error updating tags:", error);
        return { status: 500, data: { message: "Failed to update tags" } };
      }
    }),
}

export default updateTopic;
