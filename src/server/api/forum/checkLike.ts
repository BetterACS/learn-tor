import { publicProcedure } from "@/server/trpc";
import { z } from 'zod';
import { LikeTopicModel, UserModel, BookmarkModel } from "@/db/models";
import { connectDB } from "@/server/db";

export default function checkLike(){
    return {
        checkLike: publicProcedure
            .input(
                z.object({
                    topic_id: z.string(),
                    email: z.string().email(),
                })
            )
            .mutation(async ({ input }) => {
                await connectDB()
                const { topic_id, email } = input;
                const user = await UserModel.findOne({email});

                if (!user) {
                    return {
                      status: 404,
                      data: "User not found"
                    };
                  }

                const liked = await LikeTopicModel.findOne({ topic_id: topic_id, user_id: user._id })
                const saved = await BookmarkModel.findOne({ topic_id: topic_id, user_id: user._id})
                const n_like = await LikeTopicModel.countDocuments({ topic_id: topic_id });
                return {
                    status: 200,
                    data: {
                      liked: liked ? true : false,  // หรือใช้ค่าของ liked
                      saved: saved ? true : false,  // หรือใช้ค่าของ saved
                      n_like: n_like,
                    },
                }
            })
    }
}