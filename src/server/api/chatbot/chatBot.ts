import { publicProcedure } from "@/server/trpc";
import { z } from 'zod'
import { connectDB } from "@/server/db";
import { ChatModel, UserModel } from "@/db/models";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const CHAT_BOT_API_URL = process.env.CHAT_BOT_API_URL;

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
                await connectDB();
                const { email, content, chatId} = input;
                const time = new Date();

                const user = await UserModel.findOne({ email });
                if (!user) {
                    throw new Error("User not found");
                }
                const user_id = user._id;

                // ชื่อห้องยังคิดไม่ออกว่าจะทำเป็นยังไง
                const roomName = content.slice(0, 15);

                let chat;
                if(chatId) {
                    chat = await ChatModel.findById(chatId);
                }else{
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
                    chat.history = [];
                }
                try{
                    chat.history.push({ role: "user", content ,time: time });
                    console.log("History before saving:", chat.history);
                    
                    const formattedData = {
                        q: chat.history.map(({ role, content }: { role: string; content: string }) => ({
                        role,
                        content,
                      }))};

                    if (!CHAT_BOT_API_URL) {
                        return{status:200,message:"CHAT_BOT_API_URL is not defined"};
                    }
                    
                    const response = await axios.post(CHAT_BOT_API_URL, formattedData);

                    if (response.data && response.data.data) {
                        const responseData = response.data.data;
                        chat.history.push({ role: "assistant", content: responseData, time });
                    } else {
                        console.error("Unexpected response format:", response.data);
                    }
                    
                }catch(error){
                    console.error("Error pushing history:", error);
                }

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
                    chat,
                    ChatId: chat._id
                };
            })
    }
}