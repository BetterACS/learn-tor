import { publicProcedure } from '@/server/trpc'; 
import { z } from 'zod';
import { connectDB } from '@/server/db';
import { UserModel, CommentModel, LikeCommentModel } from '@/db/models';

export default function likeComment() {
  return {
    likeComment: publicProcedure
      .input(
        z.object({
          comment_id: z.string(),
          email: z.string().email(),
          status: z.boolean(),
        })
      )
      .mutation(async ({ input }) => {
        await connectDB();
        const { comment_id, email, status } = input;
        
        const user = await UserModel.findOne({ email });
        if (!user) {
          return { status: 404, data: { message: 'User not found' } };
        }

        const userId = user._id;

        // เมื่อไลค์คอมเมนต์แล้ว
        if (status) {
          const existingLike = await LikeCommentModel.findOne({ user_id: userId, comment_id });
          if (existingLike) {
            const updatedComment = await CommentModel.findById(comment_id);
            return { 
              status: 200, 
              data: { 
                message: 'Already liked', 
                n_like: updatedComment?.n_like || 0, 
                state: true  // ระบุว่าไลค์แล้ว
              } 
            };
          }

          const newLike = new LikeCommentModel({ user_id: userId, comment_id });
          try {
            await newLike.save();
            const updatedComment = await CommentModel.findByIdAndUpdate(
              comment_id,
              { $inc: { n_like: 1 } },
              { new: true }
            );
            return {
              status: 200,
              data: { 
                message: 'LikeComment Success', 
                n_like: updatedComment?.n_like || 0, 
                state: true // ตั้งค่าค่าสถานะเป็น true 
              },
            };
          } catch (error) {
            return { status: 500, data: { message: 'Failed to LikeComment' } };
          }
        } else {
          // เมื่อ un-like
          try {
            const deletedLike = await LikeCommentModel.findOneAndDelete({ user_id: userId, comment_id });
            if (!deletedLike) return { status: 404, data: { message: 'LikeComment not found' } };

            const updatedComment = await CommentModel.findByIdAndUpdate(
              comment_id,
              { $inc: { n_like: -1 } },
              { new: true }
            );

            return {
              status: 200,
              data: { 
                message: 'LikeComment removed successfully', 
                n_like: updatedComment?.n_like || 0, 
                state: false // ระบุว่า unliked
              },
            };
          } catch (error) {
            return { status: 500, data: { message: 'Failed to remove LikeComment' } };
          }
        }
      }),
  };
}
