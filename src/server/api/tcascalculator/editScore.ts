import { publicProcedure } from "@/server/trpc";
import { z } from 'zod'
import { connectDB } from "@/server/db";
import { ScoreModel, UserModel } from "@/db/models";

export default function editCalculate(){
  return {
    editCalculate: publicProcedure
      .input(
        z.object({
          email: z.string().email(),
          scores: z.record(z.any().optional())
        })
      )
      .mutation(async ({ input }) => {
        await connectDB();
        const { email, scores } = input;
        const user = await UserModel.findOne({ email });

        if (!user) throw new Error("User not found");

        const user_id = user._id;

        let result;
        const oldScore = await ScoreModel.findOne({ user_id });

        if (oldScore) {
          result = await ScoreModel.findOneAndUpdate(
            { user_id },
            { $set: scores },
            { new: true }
          );
        } else {
          result = await ScoreModel.create({ user_id, ...scores });
        }

        if (scores.GPAX || scores.lesson_plan) {
          await UserModel.updateOne(
            { _id: user._id },
            {
              $set: {
                GPAX: parseFloat(scores.GPAX || "0"),
                lesson_plan: scores.lesson_plan || "",
              },
            }
          );
        }

        return { status: 200, data: result };
      })
  }
}