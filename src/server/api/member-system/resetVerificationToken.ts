import { UserModel } from "@/db/models";
import { connectDB } from "@/server/db";
import { z } from "zod";
import { publicProcedure } from "../../trpc";
import logError from '@/utils/logError';
import {sendToken,generateToken} from '@/utils/mailer';
export default function resetVerificationToken() {
    return {
        resetVerificationToken: publicProcedure
            .input(
                z.object({
                    email: z.string(),
                })
            )
            .mutation(async ({ input }) => {
                const { email } = input;
                try {
                    await connectDB();
                    const user = await UserModel.findOne({ email });
                    if (!user) {
                        return {
                            status: 400,
                            data: { message: "User not found" },
                        };
                    }
                    const token = generateToken();
                    user.token = token;                    
                    user.token_expire = new Date(Date.now() + 15 * 60 * 1000);
                    await user.save();
                    sendToken(email,token,"Reset Password",false);
                    return { status: 200, data: { message: "send reset verification successfully"} };

                    } catch (error) {
                    console.error("Error logging in:", error);
                    logError(error as Error);
                    return {
                        status: 500,
                        data: { message: "Fail to login" },
                    };
                }
            }),
        };
}