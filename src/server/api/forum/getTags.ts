import { publicProcedure } from "@/server/trpc";
import { connectDB } from "@/server/db";
import { TagNameModel } from "@/db/models";

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

        console.log(groupedTags);
        return groupedTags;
    })
};

export default getTags;
