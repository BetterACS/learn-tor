import { publicProcedure } from "@/server/trpc";
import { connectDB } from "@/server/db";
import { CommentModel } from "@/db/models";
import { z } from "zod";

// ในไฟล์ getAllComments
export default function getAllComments() {
    return {
        getAllComments: publicProcedure
            .input(z.object({ topic_id: z.string(), sortOrder: z.string().default('desc') })) // รับค่าจาก front-end
            .query(async ({ input }) => {
                await connectDB();
                const { topic_id, sortOrder } = input; // รับค่า sortOrder

                try {
                    const comments = await CommentModel.find({ topic_id })
                        .populate('user_id', 'email username') // เพิ่ม username
                        .sort({ created_at: sortOrder === 'asc' ? 1 : -1 }); // ใช้ค่าของ sortOrder เพื่อจัดเรียง

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


