import { publicProcedure } from "@/server/trpc";
import { connectDB } from "@/server/db";
import { TopicModel } from "@/db/models";

const queryTopic = {
    queryTopic: publicProcedure.query(async () => {
        await connectDB();
        const topics = await TopicModel.find();
        const topicUser = await TopicModel.populate(topics, { path: 'user_id', select: 'username' }); 
        return topicUser;
    })
};

export default queryTopic;
