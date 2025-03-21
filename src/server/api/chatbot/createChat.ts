import { publicProcedure } from "@/server/trpc";
import { z } from 'zod'
import { connectDB } from "@/server/db";
import { ChatModel, UserModel } from "@/db/models";

export default function createChat(){
    return{
        createChat: publicProcedure
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
                throw new Error("User not found");
                }
                const user_id = user._id;
                const roomName = "NewChat";
                // สร้าง chat ใหม่
                const newChat = new ChatModel({
                name: roomName,
                user_id: user_id,
                history: [],
                });

                try {
                // บันทึก chat ใหม่ลงฐานข้อมูล
                const savedChat = await newChat.save();

                console.log("New chat created:", savedChat);

                return {
                    status: 200,
                    message: "Chat created successfully",
                    chatId: savedChat._id.toString(), // ส่งแค่ chatId
                };
                } catch (error) {
                console.error("Error creating chat:", error);
                throw new Error("Error creating chat");
                }
            })
    }
}