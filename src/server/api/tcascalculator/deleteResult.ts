import { publicProcedure } from "@/server/trpc";
import { z } from "zod";
import { connectDB } from "@/server/db";
import { TcasCalculatorModel } from "@/db/models";

export default function deleteResult() {
  return {
    deleteResult: publicProcedure
      .input(z.object({ result_id: z.string() })) // รับ _id ของผลลัพธ์ที่จะลบ
      .mutation(async ({ input }) => {
        await connectDB();
        const { result_id } = input;
        const result = await TcasCalculatorModel.findByIdAndDelete(result_id);

        if (!result) {
          throw new Error("Result not found");
        }

        return { status: 200, message: "Result deleted successfully" };
      }),
  };
}
