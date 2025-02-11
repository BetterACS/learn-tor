import { publicProcedure } from '@/server/trpc';
import { z } from 'zod';
import { connectDB } from '@/server/db';
import { UserModel, TopicModel, LikeTopicModel, BookmarkModel } from '@/db/models';

export default function likeTopic() {
  return {
    likeTopic: publicProcedure
      .input(
        z.object({
          topic_id: z.string(),
          email: z.string().email(),
          type: z.enum(['like', 'save', 'share']),
          status: z.boolean(),
        })
      )
      .mutation(async ({ input }) => {
        await connectDB();
        const { topic_id, email, type, status } = input;
        const user = await UserModel.findOne({email});
        const userId = user._id

//////////////////////// LIKE ////////////////////////

        if (type === 'like') {
          if (status) {
            console.log('กดไลค์มาหรอ okkkk');

            const existingLikeTopic = await LikeTopicModel.findOne({
              user_id: userId,
              topic_id: topic_id,
            });

            if (existingLikeTopic) {
              console.log('มี Like นี้อยู่แล้ว ไม่ต้องเพิ่มซ้ำ');
              const updatedTopic = await TopicModel.findById(topic_id);
              return {
                status: 200,
                data: { message: 'Already liked', n_like: updatedTopic?.n_like || 0 },
              };
            }
            
            const newLikeTopic = new LikeTopicModel ({
              user_id: userId,
              topic_id: topic_id,
            })

            try{
              await newLikeTopic.save();
              const updatedTopic = await TopicModel.findByIdAndUpdate(
                topic_id,
                { $inc: { n_like: 1 } },
                { new: true }
              );

              return {
                status: 200,
                data: {
                  message: 'LikeTopic Success',
                  n_like: updatedTopic?.n_like || 0,
                  state: true,
                },
              };
            } catch (error) {
              console.error('Error saving topic:', error);
              return {
                status: 500,
                data: { message: 'Failed to LikeTopic' },
              };
            }
          }else {
            console.log('กดไลค์ไปแล้ว ลบบบบบบบ');

            try {
              const deletedLikeTopic = await LikeTopicModel.findOneAndDelete({
                user_id: userId,
                topic_id: topic_id,
              });
        
              if (!deletedLikeTopic) {
                return {
                  status: 404,
                  data: { message: 'LikeTopic not found' },
                };
              }

              const updatedTopic = await TopicModel.findByIdAndUpdate(
                topic_id,
                { $inc: { n_like: -1 } },
                { new: true }
              );
              
              return {
                status: 200,
                data: {
                  message: 'LikeTopic removed successfully',
                  n_like: updatedTopic?.n_like || 0,
                  state: false,
                },
              };
            } catch (error) {
              console.error('Error removing LikeTopic:', error);
              return {
                status: 500,
                data: { message: 'Failed to remove LikeTopic' },
              };
            }
          }
        }
//////////////////////// SAVE ////////////////////////

        if (type === 'save'){
          if (status){
            console.log('กด BOOKMARK มาหรอ okkkk');

            const existingBookmark = await BookmarkModel.findOne({
              user_id: userId,
              topic_id: topic_id,
            });
        
            if (existingBookmark) {
              console.log('มี Bookmark นี้อยู่แล้ว ไม่สามารถกดซ้ำได้');
              return {
                status: 400,
                data: { message: 'Bookmark already exists' },
              };
            }

            const newBookmark = new BookmarkModel ({
              user_id: userId,
              topic_id: topic_id,
            })
            try{
              const savedBookmark = await newBookmark.save();
              return {
                  status: 200,
                  data: {
                    message: 'Bookmark Success',
                    topic: savedBookmark,
                  },
              };
            } catch (error) {
                console.error('Error saving topic:', error);
                return {
                  status: 500,
                  data: { message: 'Failed to Bookmark' },
                };
            }
          }else {
            console.log('กด BOOKMARK ไปแล้ว ลบบบบบบบ');
            try {
              const deletedBookmark = await BookmarkModel.findOneAndDelete({
                user_id: userId,
                topic_id: topic_id,
              });
        
              if (!deletedBookmark) {
                return {
                  status: 404,
                  data: { message: 'Bookmark not found' },
                };
              }
        
              return {
                status: 200,
                data: { message: 'Bookmark removed successfully' },
              };
            } catch (error) {
              console.error('Error removing bookmark:', error);
              return {
                status: 500,
                data: { message: 'Failed to remove bookmark' },
              };
            }
          }
        }

//////////////////////// SHARE ////////////////////////

        if (type === 'share'){
          if (status){
            console.log('กด SHARE มาหรอ okkkk')
          }else {
            console.log('กด SHARE ไปแล้ว ลบบบบบบบ')
          }
        }
      }),
  };
}
