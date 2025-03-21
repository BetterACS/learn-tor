import { publicProcedure } from "@/server/trpc";
import { z } from 'zod';
import { connectDB } from "@/server/db";
import { ChatModel, UserModel } from "@/db/models";

export default function deleteChat() {
    return {
        deleteChat: publicProcedure
            .input(
                z.object({
                    email: z.string().email(),
                    chatId: z.string()
                })
            )
            .mutation(async ({ input }) => {
                await connectDB();
                const { email, chatId } = input;

                // ค้นหาผู้ใช้จากอีเมล
                const user = await UserModel.findOne({ email });
                if (!user) {
                    throw new Error("User not found");
                }
                const user_id = user._id;

                // ค้นหาและลบแชท
                const deletedChat = await ChatModel.findOneAndDelete({ user_id: user_id, _id: chatId });
                if (!deletedChat) {
                    throw new Error("Chat not found");
                }

                return {
                    status: 200,
                    message: "Chat deleted successfully",
                    chat: deletedChat
                };
            })
    }
}