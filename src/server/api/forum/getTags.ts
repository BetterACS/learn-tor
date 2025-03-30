import { publicProcedure } from "@/server/trpc";
import { connectDB } from "@/server/db";
import { TagNameModel, TopicAndTagModel } from "@/db/models";
import { z } from "zod";
import { connect } from "mongoose";

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
    }),
    getSearchTags: publicProcedure
        .input(z.object({ query: z.string().optional() }))
        .query(async ({ input }) => {
            const { query } = input;

            try {
                await connectDB();

                const tags = await TagNameModel.find({
                    tagname: { $regex: query, $options: 'i' },
                }).exec();

                const tagIds = tags.map((tag) => tag._id);

                const tagCounts = await TopicAndTagModel.aggregate([
                    { $match: { tag_id: { $in: tagIds } } },
                    { $group: { _id: "$tag_id", count: { $sum: 1 } } },
                ]);

                const tagCountMap = tagCounts.reduce((acc, { _id, count }) => {
                    acc[_id.toString()] = count;
                    return acc;
                }, {} as Record<string, number>);

                const groupedTags = tags.reduce((acc, { category, tagname, _id }) => {
                    if (tagname && category) {
                        if (!acc[category]) {
                            acc[category] = [];
                        }
                        acc[category].push({ tagname, count: tagCountMap[_id.toString()] || 0 });
                    }
                    return acc;
                }, {} as Record<string, { tagname: string; count: number }[]>);

                return groupedTags;
            } catch (error) {
            console.error("Error searching tags:", error);
            throw new Error('Failed to fetch tags');
            }
        }),
};

export default getTags;
