import { UserModel } from "@/db/models";
import { connectDB } from "@/server/db";
import { z } from "zod";
import { publicProcedure } from "../../trpc";
import logError from '@/utils/logError';
import {sendToken,generateToken} from '@/utils/mailer';
export default function verified() {
    return {
        verified: publicProcedure
            .input(
                z.object({
                    email: z.string(),
                    token: z.string(),
                })
            )
            .query(async ({ input }) => {
                const { email, token} = input;
                try {
                    await connectDB();
                    const user = await UserModel.findOne({ email });
                    if (!user) {
                        return {
                            status: 400,
                            data: { message: "User not found" },
                        };
                    }
                    if (user.token !== token) {
                        return {
                            status: 400,
                            data: { message: "Token incorrect" },
                        };
                    }

                    const isTokenExpired = new Date() > user.token_expire;

                    if (isTokenExpired) {
                        const newToken = generateToken();
                        user.token = newToken;
                        user.token_expire = new Date(Date.now() + 15 * 60 * 1000);
                        await user.save();
                        sendToken(email, newToken, 'Verify your email',true);   
                        return {
                            status: 400,
                            data: { message: "Token expired. Please check new token in your email." },
                        };}
                    
                    user.verified = true;
                    user.token_expire = new Date(Date.now());
                    await user.save();
                    return { status: 200, data: { message: "Verified successfully"} };

                    } catch (error) {
                    console.error("Error logging in:", error);
                    logError(error as Error);
                    return {
                        status: 500,
                        data: { message: "Fail to login" },
                    };
                }
            }),
            verifiedMutation: publicProcedure
            .input(
                z.object({
                    email: z.string(),
                    token: z.string(),
                })
            )
            .mutation(async ({ input }) => {
                const { email, token} = input;
                try {
                    await connectDB();
                    const user = await UserModel.findOne({ email });
                    if (!user) {
                        return {
                            status: 400,
                            data: { message: "User not found" },
                        };
                    }
                    if (user.token !== token) {
                        return {
                            status: 400,
                            data: { message: "Token incorrect" },
                        };
                    }

                    const isTokenExpired = new Date() > user.token_expire;

                    if (isTokenExpired) {
                        const newToken = generateToken();
                        user.token = newToken;
                        user.token_expire = new Date(Date.now() + 15 * 60 * 1000);
                        await user.save();
                        sendToken(email, newToken, 'Reset Password',false);
                        return {
                            status: 400,
                            data: { message: "Token expired already sent a new token" },
                        };}
                    
                    user.verified = true;
                    user.token_expire = new Date(Date.now());
                    await user.save();
                    return { status: 200, data: { message: "Verified successfully"} };

                    } catch (error) {
                    console.error("Error logging in:", error);
                    logError(error as Error);
                    return {
                        status: 500,
                        data: { message: "Fail to login" },
                    };
                }
            })
        }
        
}