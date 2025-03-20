import { publicProcedure } from '@/server/trpc';
import { z } from 'zod';
import { connectDB } from '@/server/db';
import { UserModel } from '@/db/models';

export default function updateAvatar() {
  return {
    updateAvatar: publicProcedure
      .input(
        z.object({
          email: z.string().email(),
          avatar: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        await connectDB();
        const { email, avatar } = input;

        const user = await UserModel.findOne({ email });

        if (!user) {
          return {
            status: 404,
            data: {
              message: 'User not found',
            },
          };
        }

        try {
          user.avatar = avatar;
          const updatedUser = await user.save();

          return {
            status: 200,
            data: {
              message: 'Avatar updated successfully',
              user: updatedUser,
            },
          };
        } catch (error) {
          console.error('Error updating avatar:', error);
          return {
            status: 500,
            data: {
              message: 'Failed to update avatar',
            },
          };
        }
      }),
  };
}