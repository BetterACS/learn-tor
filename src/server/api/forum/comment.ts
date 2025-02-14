import { publicProcedure } from '@/server/trpc';
import { z } from 'zod';
import { connectDB } from '@/server/db';
import { CommentModel, UserModel, TopicModel } from '@/db/models';

// สร้าง comment โดยใช้ `topic_id` ใน URL
export const createComment = {
    createComment: publicProcedure
        .input(
            z.object({
                topic_id: z.string(), // ดึง topic_id จาก URL
                email: z.string(),
                comment: z.string(),
                parent_id: z.string().optional()
            })
        )
        .mutation(async ({ input }) => {
            await connectDB();
            const { topic_id, email, comment, parent_id } = input;
            
            // ค้นหาผู้ใช้
            const user = await UserModel.findOne({ email });
            if (!user) {
                return { status: 400, data: { message: 'User not found' } };
            }
            
            // ค้นหาโพสต์
            const topic = await TopicModel.findById(topic_id);
            if (!topic) {
                return { status: 404, data: { message: 'Topic not found' } };
            }
            
            // สร้างคอมเมนต์ใหม่
            const newComment = new CommentModel({
                user_id: user._id,
                topic_id,
                parent_id: parent_id || null,
                comment,
                n_like: 0,
            });

            try {
                const savedComment = await newComment.save();
                return { status: 200, data: { message: 'Comment created successfully', comment: savedComment } };
            } catch (error) {
                console.error('Error saving comment:', error);
                return { status: 500, data: { message: 'Failed to create comment' } };
            }
        })
};

//ดึง comment ทั้งหมดของโพสต์
export const getComments = {
    getComments: publicProcedure
        .input(
            z.object({
                topic_id: z.string() // ดึง topic_id จาก URL
            })
        )
        .query(async ({ input }) => {
            await connectDB();
            const { topic_id } = input;
            
            // ค้นหา comment ทั้งหมดของโพสต์นั้นนๆ
            const comments = await CommentModel.find({ topic_id }).populate('user_id');
            return comments;
        })
};

//เพิ่ม Like ให้ comment
export const likeComment = {
    likeComment: publicProcedure
        .input(
            z.object({
                comment_id: z.string()
            })
        )
        .mutation(async ({ input }) => {
            await connectDB();
            const { comment_id } = input;
            
            const comment = await CommentModel.findById(comment_id);
            if (!comment) {
                return { status: 404, data: { message: 'Comment not found' } };
            }
            
            comment.n_like += 1;
            await comment.save();
            return { status: 200, data: { message: 'Comment liked', likes: comment.n_like } };
        })
};
