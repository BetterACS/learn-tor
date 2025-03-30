import { publicProcedure } from "@/server/trpc";
import { z } from 'zod'
import { connectDB } from "@/server/db";
import { TagNameModel, TopicAndTagModel } from "@/db/models";

export default function addTags(){
    return{
        addTags:publicProcedure
            .input(
                z.object({
                    postId: z.string(),
                    tags: z.array(z.string()),
                })
            )
            .mutation(async ({input}) => {
                connectDB();
                const { postId, tags } = input;
                const tagNames = await TagNameModel.find({ tagname: { $in: tags } });

                if (tagNames.length === 0) {
                    throw new Error("No tags found in the database.");
                }

                const tagIds = tagNames.map(tag => tag._id);
                for (let tagId of tagIds) {
                    const topicAndTag = new TopicAndTagModel({
                        topic_id: postId,
                        tag_id: tagId,
                    });
        
                    await topicAndTag.save();
                    console.log(`Tag added with ID: ${tagId}`);
                }
                return {
                    status:200,
                    message: "Tags added successfully",
                    tagNames
                };
            })
    }
}