import { publicProcedure } from "@/server/trpc";
import { z } from 'zod'
import { connectDB } from "@/server/db";
import { ChatModel, UserModel } from "@/db/models";

export default function chatBot(){
    return{
        chatBot: publicProcedure
            .input(
                z.object({
                    email: z.string().email(),
                    chatId: z.string().optional(),
                    content: z.string()
                })
            )
            .mutation(async ({input}) => {
                connectDB();
                const { email, content, chatId} = input;
                const time = new Date();

                const user = await UserModel.findOne({ email });
                if (!user) {
                    throw new Error("User not found");
                }
                const user_id = user._id;
                // ชื่อห้องยังคิดไม่ออกว่าจะทำเป็นยังไง
                const roomName = "NewChat";

                let chat;
                if(chatId) {
                    chat = await ChatModel.findById(chatId);
                }else{
                    // ดึงประวิติการสนทนาล่าสุดของ user
                    chat = await ChatModel.findOne({ user_id: user_id, "history.0": { $exists: true } }).sort({ updatedAt: -1 });
                }
                if (!chat) {
                    chat = new ChatModel({
                        name: roomName,
                        user_id: user_id,
                        history: []
                    });
                }
                
                try {
                    await chat.save();
                    console.log("Chat saved successfully",chat);
                } catch (error) {
                    console.error("Error saving chat:", error);
                }

                if (!Array.isArray(chat.history)) {
                    chat.history = []; // รีเซ็ต history ให้เป็น array
                }

                chat.history.push({ role: "user", content ,time: time });

                console.log("History before saving:", chat.history);

                const botResponse = "This is a bot response"; // ตัวอย่างการตอบจากบอท
                chat.history.push({ role: "assistance", content: botResponse , time: time});

                try {
                    // ใช้ updateOne แทน save
                    const updatedChat = await ChatModel.updateOne(
                        { _id: chat._id },
                        { $set: { history: chat.history } }
                    );
                    console.log("Chat updated successfully", updatedChat);
                } catch (error) {
                    console.error("Error updating chat:", error);
                }

                
                return {
                    status:200,
                    message: "Chat successfully saved",
                    chat
                };
            })
    }
}