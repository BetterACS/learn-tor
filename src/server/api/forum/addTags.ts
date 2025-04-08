  import { publicProcedure } from "@/server/trpc";
  import { z } from 'zod'
  import { connectDB } from "@/server/db";
  import { TagNameModel, TopicAndTagModel } from "@/db/models";

  export default function addTags(){
	return{
		addTags:publicProcedure
			.input(
				z.object({
					topicId: z.string(),
					tags: z.array(
						z.object({
							tagname: z.string(),
							category: z.string(),
						})
					),
				})
			)
			.mutation(async ({input}) => {
				connectDB();
				const { topicId, tags } = input;

				const conditions = tags.map(({tagname, category}) => ({
					tagname,
					category
				}));
				const tagNames = await TagNameModel.find({ $or: conditions });

				// Add new tag to TagNameModel
				const missingTags = conditions.filter(
					({ tagname, category }) =>
						!tagNames.some(dbTag => dbTag.tagname === tagname && dbTag.category === category)
				);
				const tagsToAdd = missingTags.map(tag => ({ ...tag, is_guide: false }))
				if (missingTags.length > 0) {
					await TagNameModel.insertMany(tagsToAdd);
					console.log(`Added ${tagsToAdd.length} new tags to the database.`);
				}

				// Fetch updated tag list
				const allTagNames = await TagNameModel.find({ $or: conditions });
				const newTagIds = allTagNames.map(tag => tag._id);

				// Add new tags (only if they don't already exist)
				for (const tagId of newTagIds) {
					const existingTag = await TopicAndTagModel.findOne({ topic_id: topicId, tag_id: tagId });
					if (!existingTag) {
						await TopicAndTagModel.create({ topic_id: topicId, tag_id: tagId });
						console.log(`Tag added with ID: ${tagId}`);
					}
				}
				return {
					status:200,
					message: "Tags added successfully"
				};
			})
	}
}