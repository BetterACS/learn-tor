import { publicProcedure } from "@/server/trpc";
import { z } from 'zod';
import { connectDB } from "@/server/db";
import { TcasCalculatorModel, UserModel } from "@/db/models";

export default function showResult() {
    return {
        showResult: publicProcedure
            .input(
                z.object({
                    result_id: z.string()
                })
            )
            .mutation(async ({ input }) => { //ลอง ใช้ query แล้วใน postman ขึ้น error 
                await connectDB();
                const { result_id } = input;
                const result = await TcasCalculatorModel.findById(result_id);

                return {
                    status: 200,
                    data: result
                };
            })
    }
}