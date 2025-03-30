import { publicProcedure } from "@/server/trpc";
import { z } from "zod";
import { connectDB } from "@/server/db";
import { ScoreModel, UserModel } from "@/db/models";

export default function editScore() {
  return {
    editScore: publicProcedure
      .input(
        z.object({
          email: z.string().email(),
          field: z.string(),
          value: z.number(),
        })
      )
      .mutation(async ({ input }) => {
        await connectDB();
        const { email, field, value } = input;

        const user = await UserModel.findOne({ email });
        if (!user) {
          throw new Error("User not found");
        }

        const score = await ScoreModel.findOne({ user_id: user._id });
        if (!score) {
          throw new Error("Score not found");
        }

        if (!(field in score)) {
          throw new Error(`Field '${field}' is not valid in Score schema`);
        }

        (score as any)[field] = value;
        await score.save();

        return {
          status: 200,
          message: `Score field '${field}' updated successfully to ${value}`,
        };
      }),
  };
}
