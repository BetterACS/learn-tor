import { UserModel } from "@/db/models";
import { connectDB } from "@/server/db";
import { z } from "zod";
import { publicProcedure } from "../../trpc";
import bcrypt from 'bcrypt';
import logError from '@/utils/logError';
import { redirect } from 'next/navigation';
export default function login() {
    return {
        login: publicProcedure
            .input(
                z.object({
                    email: z.string(),
                    password: z.string(),
                })
            )
            .mutation(async ({ input }) => {
                const { email, password } = input;
                try {
                    await connectDB();
                    const user = await UserModel.findOne({ email });
                    if (!user) {
                        return {
                            status: 400,
                            data: { message: "User not found" },
                        };
                    }

                    const isPasswordCorrect = await bcrypt.compare(password, user.password);
                    if (!isPasswordCorrect) {
                        return {
                            status: 400,
                            data: { message: "Password incorrect" },
                        };
                    }
                    else if (!user.verified) {
                        return {
                            status: 400,
                            data: { message: "User not verified" },
                        };
                    }
                    else {
                        return {
                            status: 200,
                            data: { message: "Login successful", user: user},
                        };
                    }
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