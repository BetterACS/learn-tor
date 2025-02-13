import { publicProcedure } from "@/server/trpc";
import { z } from 'zod';
import { TopicAndTagModel, TagNameModel } from "@/db/models";
import { connectDB } from "@/server/db";
import mongoose from "mongoose";

export default function topicTags(){
    return {
        topicTags: publicProcedure
            .input(
                z.object({
                    topic_id: z.string(),
                })
            )
            .mutation(async ({ input }) => {

                await connectDB()
                const { topic_id } = input
                if (!mongoose.Types.ObjectId.isValid(topic_id)) {
                    return { status: 400, error: "Invalid topic_id" };
                }

                const topicTags = await TopicAndTagModel.find({topic_id})
                const tagIds = topicTags.map(tag => tag.tag_id);
                const tagDetails = await TagNameModel.find({ _id: { $in: tagIds } });
                const result = topicTags.map(tag => {
                    const tagInfo = tagDetails.find(t => t._id.toString() === tag.tag_id.toString());
                    return {
                        topic_id: tag.topic_id,
                        tagname: tagInfo ? tagInfo.tagname : "Unknown",
                        category: tagInfo ? tagInfo.category : "Unknown"
                    };
                });
                console.log("จะเอาtagggggggggg")
                console.log(result)
                return {
                    status: 200,
                    topicTags: result
                };
            })
    }
}