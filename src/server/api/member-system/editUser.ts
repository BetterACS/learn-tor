import { UserModel } from "@/db/models";
import { connectDB } from "@/server/db";
import { z } from "zod";
import { publicProcedure } from "../../trpc";
import logError from '@/utils/logError';
import bcrypt from 'bcrypt';

export default function editUser() {
    return {
        editUser: publicProcedure
            .input(
                z.object({
                    email: z.string(),
                    updates: z.record(z.string(), z.any()),
                })
            )
            .mutation(async ({ input }) => {
                const { email, updates } = input;
                try {
                    await connectDB();
                    const user = await UserModel.findOne({ email });
                    if (!user) {
                        return {
                            status: 400,
                            data: { message: "User not found" },
                        };
                    }

                    // Update the user with the provided fields
                    Object.keys(updates).forEach((key) => {
                        if (key === "password") {
                            const hashedPassword = bcrypt.hashSync(updates[key], 12);
                            user[key] = hashedPassword;
                            return;
                        }
                        user[key] = updates[key];
                    });

                    await user.save();

                    return {
                        status: 200,
                        data: { message: "User updated successfully", user },
                    };
                } catch (error) {
                    console.error("Error updating user:", error);
                    logError(error as Error);
                    return {
                        status: 500,
                        data: { message: "Failed to update user" },
                    };
                }
            }),
    };
}
