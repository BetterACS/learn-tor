import { publicProcedure } from "@/server/trpc";
import { z } from 'zod';
import { LikeTopicModel, UserModel } from "@/db/models";
import { connectDB } from "@/server/db";
import likeTopic from "./likeTopic";

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

                console.log(user._id)
                const liked = await LikeTopicModel.findOne({ topic_id: topic_id, user_id: user._id })
                console.log(liked)
                if (liked){
                    return {
                        status: 200,
                        data: true
                      };
                }else{
                    return {
                        status: 200,
                        data: false
                      };
                }
            })
    }
}