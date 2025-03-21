import { publicProcedure } from "@/server/trpc";
import { z } from 'zod'
import { connectDB } from "@/server/db";
import { ChatModel, UserModel } from "@/db/models";

export default function editRoom(){
    return{
        editRoom: publicProcedure
            .input(
                z.object({
                    email: z.string().email(),
                    chatId: z.string(),
                    name: z.string()
                })
            )
            .mutation(async ({input}) => {
                await connectDB();
                const { email, chatId, name } = input;

                // ค้นหาผู้ใช้จากอีเมล
                const user = await UserModel.findOne({ email });
                if (!user) {
                throw new Error("User not found");
                }
                const user_id = user._id;
                const chatDetail = await ChatModel.findOne({ user_id: user_id, _id: chatId });
                if (!chatDetail) {
                    throw new Error("Chat not found");
                }

                chatDetail.name = name;
                try {
                    await chatDetail.save();
                    console.log("Chat room name updated successfully");
                } catch (error) {
                    console.error("Error updating chat room name:", error);
                    throw new Error("Failed to update chat room name");
                }
                return {
                    status: 200,
                    message: "Chat room name updated successfully",
                    chat: chatDetail
                };
            })
    }
}