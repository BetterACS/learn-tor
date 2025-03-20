import { publicProcedure } from "@/server/trpc";
import { z } from 'zod'
import { connectDB } from "@/server/db";
import { ScoreModel, UserModel } from "@/db/models";

export default function addScore(){
    return{
        addScore: publicProcedure
            .input(
                z.object({
                    email: z.string().email(),
                    scores: z.record(z.any().optional())
                })
            )
            .mutation(async ({input}) => {
                await connectDB();
                const { email, scores } = input;
                const user = await UserModel.findOne({ email: email });

                if (!user) {
                  throw new Error("User not found");
                }

                const user_id = user._id;
                const oldScore = await ScoreModel.findOne({ user_id: user_id });
                if (oldScore) {
                    const updatedScore = await ScoreModel.findOneAndUpdate(
                        { user_id },
                        { $set: scores },
                        { new: true }
                      );
                      return updatedScore;
                } else {
                  const newScore = await ScoreModel.create({
                    user_id: user_id,
                    ...scores,
                  });

                  return {status:200,data:{ message: "Score added", newScore }}

                }
            })
    };
}