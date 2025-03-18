import { publicProcedure } from "@/server/trpc";
import { z } from 'zod'
import { connectDB } from "@/server/db";
import { ChatModel, UserModel } from "@/db/models";

export default function queryChat(){
    return{
        queryChat: publicProcedure
            .input(
                z.object({
                    email: z.string().email(),
                    chatId: z.string()
                })
            )
            .mutation(async ({input}) => {
                connectDB();
                const { email, chatId } = input;

            // ค้นหาผู้ใช้จากอีเมล
                const user = await UserModel.findOne({ email });
                if (!user) {
                throw new Error("User not found");
                }
                const user_id = user._id;
                const chatDetail = await ChatModel.findOne({ user_id: user_id, _id: chatId });
                return chatDetail;
            })
    }
}
