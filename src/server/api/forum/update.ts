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
        imgs: z.array(z.string()),
      })
    )
    .mutation(async ({ input }) => {
      const { id, title, body, email, imgs } = input;
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
          { title, body, img: imgs },
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
        tags: z.array(
          z.object({
            tagname: z.string(),
            category: z.string(),
          })
        ),
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

        const existingTagIds = await TopicAndTagModel.find({ topic_id: topicId }).distinct("tag_id");

        // UPDATE TAG

        const conditions = tags.map(({tagname, category}) => ({
					tagname,
					category
				}));
        const tagNames = await TagNameModel.find({ $or: conditions });

        // Add tag: find what tag not yet stored in DB
        const missingTags = conditions.filter(
					({ tagname, category }) =>
						!tagNames.some(dbTag => dbTag.tagname === tagname && dbTag.category === category)
				);
        if (missingTags.length > 0) {
          const tagToAdd = missingTags.map(tag => ({ ...tag, is_guide: false }))
          await TagNameModel.insertMany(tagToAdd);
          console.log(`Added ${tagToAdd.length} new tags to the database.`);
        }

        // Fetch updated tag list
        const allTagNames = await TagNameModel.find({ $or: conditions });
        const newTagIds = allTagNames.map(tag => tag._id);

        // Remove Tag
        const tagsToRemove = existingTagIds.filter(tagId => !newTagIds.includes(tagId));
        if (tagsToRemove.length > 0) {
          await TopicAndTagModel.deleteMany({ topic_id: topicId, tag_id: { $in: tagsToRemove } });
          console.log(`Removed ${tagsToRemove.length} tags from topic.`);
        }

        // Add new tags (only if they don't already exist)
        for (let tagId of newTagIds) {
          const existingTag = await TopicAndTagModel.findOne({ topic_id: topicId, tag_id: tagId });
          if (!existingTag) {
            await TopicAndTagModel.create({ topic_id: topicId, tag_id: tagId });
            console.log(`Tag added with ID: ${tagId}`);
          }
        }

        // Remove unused tags from TagNameModel (if no topics use them)
        const getAllTags = await TagNameModel.find({}, { _id: 1, is_guide: 1 });
        const usedTags = await TopicAndTagModel.distinct("tag_id");

        const unusedTags = getAllTags.filter(tag => 
          !usedTags.some(usedTagId => usedTagId.equals(tag._id)) && !tag.is_guide
        );

        // If there are unused tags, delete them from TagNameModel
        if (unusedTags.length > 0) {
          await TagNameModel.deleteMany({ _id: { $in: unusedTags.map(tag => tag._id) } });
          console.log(`Deleted ${unusedTags.length} unused tags from TagNameModel.`);
        }

        return {
          status: 200,
          data: { message: "Tags updated successfully" },
        };
      } catch (error) {
        console.error("Error updating tags:", error);
        return { status: 500, data: { message: "Failed to update tags" } };
      }
    }),
}

export default updateTopic;
