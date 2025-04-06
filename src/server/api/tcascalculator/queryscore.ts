import { publicProcedure } from "@/server/trpc";
import { z } from 'zod';
import { connectDB } from "@/server/db";
import { ScoreModel, UserModel } from "@/db/models";

export default function queryScore() {
    return {
        queryScore: publicProcedure
            .input(
                z.object({
                    email: z.string().email(), 
                })
            )
            .query(async ({ input }) => {  //ลอง ใช้ query แล้วใน postman ขึ้น error วิธีแก้คือใช้ mutation แทน query
                await connectDB();
                const { email } = input;
                const user = await UserModel.findOne({ email });

                if (!user) {
                    throw new Error("User not found");
                }

                const user_id = user._id;
                const score = await ScoreModel.findOne({ user_id });

                return {
                    score,
                    GPAX: user.GPAX ?? null
                };
            })
    }
}