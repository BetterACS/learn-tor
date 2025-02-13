import { UserModel } from "@/db/models";
import { connectDB } from "@/server/db";
import { z } from "zod";
import { publicProcedure } from "../../trpc";
import logError from '@/utils/logError';

export default function getUser() {
    return {
        getUser: publicProcedure
            .input(
                z.object({
                    _id: z.string(),
                })
            )
            .query(async ({ input }) => {
                const { _id } = input;
                console.log("-id",_id);
                try {
                    await connectDB();
                    const user = await UserModel.findById(_id);
                    if (!user) {
                        return {
                            status: 400,
                            data: { message: "User not found" },
                        };
                    }

                    return {
                        status: 200,
                        data: { user },
                    };
                } catch (error) {
                    console.error("Error fetching user:", error);
                    logError(error as Error);
                    return {
                        status: 500,
                        data: { message: "Failed to fetch user" },
                    };
                }
            }),
    };
}