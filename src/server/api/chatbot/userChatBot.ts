import { publicProcedure } from "@/server/trpc";
import { z } from 'zod'
import { connectDB } from "@/server/db";
import { ChatModel, UserModel } from "@/db/models";

export default function userChatBot(){
    return{
        userChatBot: publicProcedure
            .input(
                z.object({
                    email: z.string().email(),
                })
            )
            .mutation(async ({input}) => {
                await connectDB();
                const { email } = input;

            // ค้นหาผู้ใช้จากอีเมล
                const user = await UserModel.findOne({ email });
                if (!user) {
                    return {status:400,data:{ message: "User not found" }};
                }
                const user_id = user._id;

                const allChat = await ChatModel.find({ user_id: user_id });
                return {status:200,data:{ allChat: allChat,message: "Chat found" }};
            })
    }
}