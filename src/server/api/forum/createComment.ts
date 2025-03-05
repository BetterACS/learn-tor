import { publicProcedure } from '@/server/trpc';
import { z } from 'zod';
import { connectDB } from '@/server/db';
import { CommentModel } from '@/db/models';
import { UserModel } from '@/db/models';
import { TopicModel } from '@/db/models';

export default function createComment() {
    return {
        createComment: publicProcedure
            .input(
                z.object({
                    topic_id: z.string(),
                    email: z.string(),
                    comment: z.string(),
                    parent_id: z.string().optional(),
                })
            )
            .mutation(async ({ input }) => {
                await connectDB();
                const { topic_id, email, comment, parent_id } = input;

                try {
                    const user = await UserModel.findOne({ email });
                    if (!user) {
                        return {
                            status: 400,
                            data: { message: 'User not found' },
                        };
                    }

                    const topic = await TopicModel.findById(topic_id);
                    if (!topic) {
                        return {
                            status: 400,
                            data: { message: 'Topic not found' },
                        };
                    }

                    const newComment = new CommentModel({
                        user_id: user._id,
                        topic_id,
                        comment,
                        parent_id: parent_id || null,
                        n_like: 0,
                        created_at: new Date(),
                    });

                    const savedComment = await newComment.save();
                    return {
                        status: 200,
                        data: {
                            message: 'Comment created successfully',
                            comment: savedComment,
                        },
                    };
                } catch (error) {
                    console.error('Error creating comment:', error);
                    return {
                        status: 500,
                        data: { message: 'Failed to create comment' },
                    };
                }
            }),
    };
}
