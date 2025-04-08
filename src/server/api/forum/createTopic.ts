import { publicProcedure } from '@/server/trpc';
import { z } from 'zod';
import { connectDB } from '@/server/db';
import { UserModel } from '@/db/models';
import { TopicModel } from '@/db/models';

export default function createTopic() {
    return {
        createTopic : publicProcedure
            .input(
                z.object({
                    title: z.string(),
                    body: z.string().default(''),
                    email: z.string(),
                    // img: z.string().default(''),
                    imgs: z.array(z.string()).default([]),
                })
            )
            .mutation(async ({ input }) => {
                await connectDB();
                const { title, body, email, imgs } = input;
                console.log(imgs);

                const user = await UserModel.findOne({ email });

                if (!user){
                    return {
                        status: 400,
                        data: {
                            message: 'User not found',
                        },
                    };
                }
                const newTopic = new TopicModel({
                    title,
                    body,
                    user_id: user._id,
                    status: 'active',
                    created_at: new Date(),
                    n_like: 0,
                    forum: 'general',
                    img: imgs,
                });
                

                try{
                    const savedTopic = await newTopic.save();
                    const populatedTopic = await TopicModel.populate(savedTopic, { path: 'user_id', select: 'username avatar' }); 
                    return {
                        status: 200,
                        data: {
                          message: 'Topic created successfully',
                          topic: populatedTopic
                        },
                      };
                    } catch (error) {
                      console.error('Error saving topic:', error);
                      return {
                        status: 500,
                        data: { message: 'Failed to create topic' },
                      };
                }
        })
    }
}