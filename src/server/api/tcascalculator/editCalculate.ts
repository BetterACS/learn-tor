import { publicProcedure } from "@/server/trpc";
import { z } from 'zod';
import { connectDB } from "@/server/db";
import { ScoreModel, UserModel } from "@/db/models";

export default function editCalculate() {
  return {
    editCalculate: publicProcedure
      .input(
        z.object({
          email: z.string().email(),
          scores: z.record(z.any().optional()),
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

        //อัปเดต MAX 
        const updatedScores = { ...scores };
        if (scores.MAX) {
          updatedScores.MAX = scores.MAX;
        }

        if (oldScore) {
          result = await ScoreModel.findOneAndUpdate(
            { user_id },
            { $set: updatedScores },
            { new: true }
          );
        } else {
          const newScore = await ScoreModel.create({ user_id, ...updatedScores });
          result = { status: 200, data: { message: "Score added", newScore } };
        }

        //อัปเดต GPAX และ lesson_plan
        if (scores.GPAX || scores.lesson_plan) {
          const updatedUser = await UserModel.findOneAndUpdate(
            { _id: user._id },
            {
              $set: {
                GPAX: parseFloat(scores.GPAX || "0"),
                lesson_plan: scores.lesson_plan || "",
              },
            },
            { new: true }
          );

          console.log("Updated User GPAX/LessonPlan:", updatedUser);
        }

        return result;
      }),
  };
}
