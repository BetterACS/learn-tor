import { publicProcedure } from "@/server/trpc";
import { connectDB } from "@/server/db";
import { CommentModel } from "@/db/models";
import { z } from "zod";

export default function getAllComments() {
    return {
        getAllComments: publicProcedure
            .input(z.object({ topic_id: z.string() }))
            .mutation(async ({ input }) => { 
                await connectDB();
                const { topic_id } = input;

                try {
                    const comments = await CommentModel.find({ topic_id })
                        .populate('user_id', 'email')
                        .sort({ createdAt: -1 });

                    return {
                        status: 200,
                        data: {
                            message: 'Comments retrieved successfully',
                            comments,
                        },
                    };
                } catch (error) {
                    console.error('Error retrieving comments:', error);
                    return {
                        status: 500,
                        data: { message: 'Failed to retrieve comments' },
                    };
                }
            }),
    };
}

