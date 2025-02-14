import { publicProcedure } from "@/server/trpc";
import { connectDB } from "@/server/db";
import { TagNameModel, TopicAndTagModel } from "@/db/models";

const getTags = {
    getTags: publicProcedure.query(async () => {
        await connectDB();
        const tags = await TagNameModel.find({}).exec();
        const groupedTags = tags.reduce((acc, { category, tagname }) => {
            if (tagname && category) {
                if (!acc[category]) {
                    acc[category] = [];
                }
                acc[category].push(tagname);  // เก็บแค่ tagname
            } else {
                console.log("Skipping invalid tag or category:", { category, tagname });
            }
            return acc;
        }, {} as Record<string, string[]>);

        return groupedTags;
    }),
    getTopTags: publicProcedure.query(async () => {
        await connectDB();
        const tagUsage = await TopicAndTagModel.aggregate([
            {
                $group: {
                    _id: "$tag_id",
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            {
                $lookup: {
                    from: "tagnames",
                    localField: "_id",
                    foreignField: "_id",
                    as: "tagDetails"
                }
            },
            { $unwind: "$tagDetails" },
            {
                $project: {
                    _id: 0,
                    tag_id: "$_id",
                    tagname: "$tagDetails.tagname",
                    category: "$tagDetails.category",
                    count: 1
                }
            }
        ]);

        return tagUsage;
    })
};

export default getTags;
