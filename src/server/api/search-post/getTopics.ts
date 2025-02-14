// import { TopicModel } from "@/db/models";
// import { connectDB } from "@/server/db";
// import { z } from 'zod';
// import { publicProcedure } from "../../trpc";
// import logError from '@/utils/logError';
// export default function search() {
//   return {
//     searchQuery: publicProcedure
//       .input(
//         z.object({
//           searchTerm: z.string().optional(),
//           filterTags: z.record(z.string(), z.enum(["included", "excluded"])).optional(),
//           sortBy: z.string(),
//         }),
//       )
//       .query(async ({ input }) => {
//         const { searchTerm, filterTags, sortBy } = input;
//         try {
//           await connectDB();

//           const query: any = {
//             $or: [
//               { title: { $regex: searchTerm, $options: "i" } },
//               { body: { $regex: searchTerm, $options: "i" } },
//               { forum: { $regex: searchTerm, $options: "i" } },
//             ],
//           };

//           // Handle filterTags logic
//           if (filterTags) {
//             const tagsQuery: any = {};

//             for (const [tag, value] of Object.entries(filterTags)) {
//               if (value === "included") {
//                 tagsQuery.$in = tagsQuery.$in || [];
//                 tagsQuery.$in.push(tag);
//               } else if (value === "excluded") {
//                 tagsQuery.$nin = tagsQuery.$nin || [];
//                 tagsQuery.$nin.push(tag);
//               }
//             }

//             // If we have any tag filters, add them to the query
//             if (tagsQuery.$in || tagsQuery.$nin) {
//               query.tags = tagsQuery;
              
//             }
//           }

//           const sortOptions: Record<string, any> = {
//             Newest: { created_at: -1 },
//             Oldest: { created_at: 1 },
//             Popular: { n_like: -1, created_at: -1 },
//           };

//           const topics = await TopicModel.find(query).sort(sortOptions[sortBy] || { created_at: -1 });
//           if (!topics || topics.length === 0) {
//             return {
//               status: 400,
//               data: { message: "Topic not found" }
//             }
//           }

//           const topicUser = await TopicModel.populate(topics, { path: 'user_id', select: 'username' }); 

//           return {
//             status: 200,
//             data: topicUser
//           }
//         } catch (error) {
//           console.log("Error fetching topic:", error);
//           logError(error as Error);
//           return {
//             status: 500,
//             data: { message: "Fail to fetch topic" },
//           }
//         }
//       }),
//   };
// }

import { TopicModel, TopicAndTagModel, TagNameModel, UserModel } from "@/db/models";
import { connectDB } from "@/server/db";
import { z } from "zod";
import { publicProcedure } from "../../trpc";
import logError from "@/utils/logError";

const getTopics = {
  searchQuery: publicProcedure
    .input(
      z.object({
        searchTerm: z.string().optional(),
        filterTags: z.record(z.string(), z.enum(["included", "excluded"])).optional(),
        sortBy: z.string(),
      })
    )
    .query(async ({ input }) => {
      const { searchTerm, filterTags, sortBy } = input;
      try {
        await connectDB();

        const query: any = {
          $or: [
            { title: { $regex: searchTerm, $options: "i" } },
            { body: { $regex: searchTerm, $options: "i" } },
            { forum: { $regex: searchTerm, $options: "i" } },
          ],
        };

        const sortOptions: Record<string, any> = {
          Newest: { created_at: -1 },
          Oldest: { created_at: 1 },
          Popular: { n_like: -1, created_at: -1 },
        };

        // Find topics first
        const topics = await TopicModel.aggregate([
          { $match: query },
          {
            $lookup: {
              from: "topicandtags", // Collection storing topic_id & tag_id
              localField: "_id",
              foreignField: "topic_id",
              as: "tags",
            },
          },
          { $unwind: { path: "$tags", preserveNullAndEmptyArrays: true } }, // Unwind tags array
          {
            $lookup: {
              from: "tagnames", // Collection storing tag details
              localField: "tags.tag_id",
              foreignField: "_id",
              as: "tagDetails",
            },
          },
          { $unwind: { path: "$tagDetails", preserveNullAndEmptyArrays: true } },
          {
            $group: {
              _id: "$_id",
              title: { $first: "$title" },
              body: { $first: "$body" },
              user_id: { $first: "$user_id" },
              created_at: { $first: "$created_at" },
              n_like: { $first: "$n_like" },
              img: { $first: "$img" },
              tags: { $push: "$tagDetails.tagname" }, // Collect tag names
            },
          },
          { $sort: sortOptions[sortBy] || { created_at: -1 } },
        ]);

        // Handle filtering included/excluded tags
        if (filterTags) {
          const includedTags = Object.keys(filterTags).filter((tag) => filterTags[tag] === "included");
          const excludedTags = Object.keys(filterTags).filter((tag) => filterTags[tag] === "excluded");

          const filteredTopics = topics.filter((topic) => {
            const topicTags = topic.tags || [];
            return (
              (includedTags.length === 0 || includedTags.every((tag) => topicTags.includes(tag))) &&
              (excludedTags.length === 0 || !excludedTags.some((tag) => topicTags.includes(tag)))
            );
          });

          const topicUser = await TopicModel.populate(filteredTopics, { path: 'user_id', select: 'username' }); 

          if (!filteredTopics.length) {
            return { status: 400, data: { message: "No matching topics found" } };
          }
          return { status: 200, data: topicUser };
        }

        if (!topics || topics.length === 0) {
          return { status: 400, data: { message: "Topic not found" } };
        }

        return { status: 200, data: topics };
      } catch (error) {
        console.log("Error fetching topic:", error);
        logError(error as Error);
        return { status: 500, data: { message: "Fail to fetch topic" } };
      }
    }),
    queryMyTopic: publicProcedure
    .input(
      z.object({
        email: z.string(),
        sortBy: z.string(),  // Sorting by Newest, Oldest, or Popular
      })
    )
    .query(async ({ input }) => {
      const { email, sortBy } = input;
  
      try {
        await connectDB();
  
        // Find the user by email
        const user = await UserModel.findOne({ email }).select("_id");
        if (!user) {
          return { status: 404, data: { message: "User not found" } };
        }
  
        const sortOptions: Record<string, any> = {
          Newest: { created_at: -1 },
          Oldest: { created_at: 1 },
          Popular: { n_like: -1, created_at: -1 },
        };
  
        // Find topics created by the user
        const topics = await TopicModel.aggregate([
          { $match: { user_id: user._id } },
          {
            $lookup: {
              from: "topicandtags",
              localField: "_id",
              foreignField: "topic_id",
              as: "tags",
            },
          },
          { $unwind: { path: "$tags", preserveNullAndEmptyArrays: true } },
          {
            $lookup: {
              from: "tagnames",
              localField: "tags.tag_id",
              foreignField: "_id",
              as: "tagDetails",
            },
          },
          { $unwind: { path: "$tagDetails", preserveNullAndEmptyArrays: true } },
          {
            $group: {
              _id: "$_id",
              title: { $first: "$title" },
              body: { $first: "$body" },
              user_id: { $first: "$user_id" },
              created_at: { $first: "$created_at" },
              n_like: { $first: "$n_like" },
              img: { $first: "$img" },
              tags: { $push: "$tagDetails.tagname" },
            },
          },
          { $sort: sortOptions[sortBy] || { created_at: -1 } },
        ]);

        const topicUser = await TopicModel.populate(topics, { path: 'user_id', select: 'username' }); 
  
        if (!topics || topics.length === 0) {
          return { status: 400, data: { message: "No topics found for this user" } };
        }
  
        return { status: 200, data: topicUser };
      } catch (error) {
        console.log("Error fetching user topics:", error);
        return { status: 500, data: { message: "Failed to fetch user topics" } };
      }
    }),
}

export default getTopics;
