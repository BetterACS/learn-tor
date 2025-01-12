import { UserModel } from "@/db/models";
import { connectDB } from "@/server/db";
import { z } from "zod";
import { publicProcedure } from "../../trpc";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

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
                    if (user && isPasswordCorrect) {
                        const token = jwt.sign(
                            { email: user.email, user_id: user._id },
                            process.env.NEXT_PUBLIC_JWT_SECRET as string,
                            { expiresIn: "1h" }
                        );

                        user.token = token;
                        return {
                            status: 200,
                            data: { user },
                        };
                    }
                    return {
                        status: 200,
                        data: { message: "Login successful" },
                    };
                    } catch (error) {
                    console.error("Error logging in:", error);
                    return {
                        status: 500,
                        data: { message: "Fail to login" },
                    };
                }
            }),
        };
}