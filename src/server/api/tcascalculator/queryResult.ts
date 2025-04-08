import { publicProcedure } from "@/server/trpc";
import { z } from 'zod';
import { connectDB } from "@/server/db";
import { TcasCalculatorModel, UserModel } from "@/db/models";

export default function queryResult() {
    return {
        queryResult: publicProcedure
            .input(
                z.object({
                    email: z.string().email(), 
                })
            )
            .mutation(async ({ input }) => { //ลอง ใช้ query แล้วใน postman ขึ้น error 
                await connectDB();
                const { email } = input;
                const user = await UserModel.findOne({ email });

                if (!user) {
                    throw new Error("User not found");
                }

                const user_id = user._id;
                const result = await TcasCalculatorModel.find({ user_id });

                return {
                    status: 200,
                    data: result
                };
            })
    }
}