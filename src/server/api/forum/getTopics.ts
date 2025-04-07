import { TopicModel, TopicAndTagModel, TagNameModel, UserModel, BookmarkModel } from "@/db/models";
import { connectDB } from "@/server/db";
import { z } from "zod";
import { publicProcedure } from "../../trpc";
import logError from "@/utils/logError";
import { Types } from 'mongoose';

const getTopics = {
  searchQuery: publicProcedure
    .input(
      z.object({
        searchTerm: z.string().optional(),
        filterTags: z.record(z.string(), z.enum(["included", "excluded"])).optional(),
        sortBy: z.string(),
        limit: z.number().default(6),
        page: z.number().min(1).default(1)
      })
    )
    .query(async ({ input }) => {
      const { searchTerm, filterTags, sortBy, limit, page } = input;
      try {
        await connectDB();

        const query: any = searchTerm
          ? {
              $or: [
                { title: { $regex: searchTerm, $options: "i" } },
                { body: { $regex: searchTerm, $options: "i" } },
                { forum: { $regex: searchTerm, $options: "i" } },
              ],
            }
          : {}; // If searchTerm === "", fetch all topics

        const includedTags = Object.keys(filterTags ?? {}).filter((tag) => filterTags?.[tag] === "included");
        const excludedTags = Object.keys(filterTags ?? {}).filter((tag) => filterTags?.[tag] === "excluded");

        const sortOptions: Record<string, any> = {
          Newest: { created_at: -1 },
          Oldest: { created_at: 1 },
          Popular: { popularityScore: -1 },
        };

        const topics = await TopicModel.aggregate([
          { $match: query },
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
              tags: { $push: "$tagDetails.tagname" }, // avoid duplicates
            },
          },
          {
            $lookup: {
              from: "comments",
              localField: "_id",
              foreignField: "topic_id",
              as: "comments",
            }
          },
          {
            $addFields: {
              n_comment: { $size: "$comments" },
            }
          },
          {
            $project: {
              comments: 0
            }
          },
          {
            $addFields: {
              popularityScore: {
                $add: [
                  { $multiply: ["$n_like", 2] },
                  { $multiply: ["$n_comment", 1.5] },
                  {
                    $multiply: [
                      5,
                      {
                        $divide: [
                          1,
                          {
                            $add: [
                              1,
                              { $divide: [{ $subtract: [new Date(), "$created_at"] }, 1000 * 60 * 60 * 24] } // age in days
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            }
          },
          {
            $match: {
              ...(includedTags.length > 0 && {
                tags: { $all: includedTags }
              }),
              ...(excludedTags.length > 0 && {
                tags: { $not: { $in: excludedTags } }
              }),
            },
          },
          {
            $facet: {
              totalCount: [{ $count: "count" }], // Count total items before pagination
              paginatedResults: [
                { $sort: sortOptions[sortBy] || { created_at: -1 } },
                { $skip: (page - 1) * limit },
                { $limit: limit },
              ],
            },
          },
        ]);

        const totalResultsCount = topics[0]?.totalCount[0]?.count || 0;
        const resultTopics = topics[0]?.paginatedResults || [];
        
        if (!resultTopics || resultTopics.length === 0) {
          return { status: 400, data: { message: "Topic not found" } };
        }

        const topicWUser = await TopicModel.populate(resultTopics, { path: 'user_id', select: 'username avatar' }); 
        
        return { 
          status: 200, 
          data: topicWUser, 
          totalResults: totalResultsCount,
          maxPage: Math.ceil(totalResultsCount / limit)
        };
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
        limit: z.number().default(6),
        page: z.number().min(1).default(1)
      })
    )
    .query(async ({ input }) => {
      const { email, sortBy, limit, page } = input;
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
          Popular: { popularityScore: -1 },
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
          {
            $lookup: {
              from: "comments",
              localField: "_id",
              foreignField: "topic_id",
              as: "comments",
            }
          },
          {
            $addFields: {
              n_comment: { $size: "$comments" },
            }
          },
          {
            $project: {
              comments: 0
            }
          },
          {
            $addFields: {
              popularityScore: {
                $add: [
                  { $multiply: ["$n_like", 2] },
                  { $multiply: ["$n_comment", 1.5] },
                  {
                    $multiply: [
                      5,
                      {
                        $divide: [
                          1,
                          {
                            $add: [
                              1,
                              { $divide: [{ $subtract: [new Date(), "$created_at"] }, 1000 * 60 * 60 * 24] } // age in days
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            }
          },
          {
            $facet: {
              totalCount: [{ $count: "count" }], // Count total items before pagination
              paginatedResults: [
                { $sort: sortOptions[sortBy] || { created_at: -1 } },
                { $skip: (page - 1) * limit },
                { $limit: limit },
              ],
            },
          },
        ]);

        const totalResultsCount = topics[0]?.totalCount[0]?.count || 0;
          const resultTopics = topics[0]?.paginatedResults || [];
          
          if (!resultTopics || resultTopics.length === 0) {
            return { status: 400, data: { message: "Topic not found" } };
          }

          const topicWUser = await TopicModel.populate(resultTopics, { path: 'user_id', select: 'username avatar' }); 
          
          return { 
            status: 200, 
            data: topicWUser, 
            totalResults: totalResultsCount,
            maxPage: Math.ceil(totalResultsCount / limit)
          };
      } catch (error) {
        console.log("Error fetching user topics:", error);
        return { status: 500, data: { message: "Failed to fetch user topics" } };
      }
    }),
  queryMyBookmark: publicProcedure
    .input(
      z.object({
        email: z.string(),
        sortBy: z.string(),
        limit: z.number().default(6),
        page: z.number().min(1).default(1)
      })
    )
    .query(async ({ input }) => {
      const { email, sortBy, limit, page } = input;
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
          Popular: { popularityScore: -1 },
        };
  
        // Find bookmarks by the user
        const bookmarks = await BookmarkModel.aggregate([
          { $match: { user_id: user._id } },
          {
            $lookup: {
              from: "topics",
              localField: "topic_id",
              foreignField: "_id",
              as: "topicDetails",
            },
          },
          { $unwind: { path: "$topicDetails", preserveNullAndEmptyArrays: true } },
          {
            $lookup: {
              from: "topicandtags",
              localField: "topicDetails._id",
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
              _id: "$topicDetails._id",
              title: { $first: "$topicDetails.title" },
              body: { $first: "$topicDetails.body" },
              user_id: { $first: "$topicDetails.user_id" },
              created_at: { $first: "$topicDetails.created_at" },
              n_like: { $first: "$topicDetails.n_like" },
              img: { $first: "$topicDetails.img" },
              tags: { $push: "$tagDetails.tagname" },
            },
          },
          {
            $lookup: {
              from: "comments",
              localField: "_id",
              foreignField: "topic_id",
              as: "comments",
            }
          },
          {
            $addFields: {
              n_comment: { $size: "$comments" },
            }
          },
          {
            $project: {
              comments: 0
            }
          },
          {
            $addFields: {
              popularityScore: {
                $add: [
                  { $multiply: ["$n_like", 2] },
                  { $multiply: ["$n_comment", 1.5] },
                  {
                    $multiply: [
                      5,
                      {
                        $divide: [
                          1,
                          {
                            $add: [
                              1,
                              { $divide: [{ $subtract: [new Date(), "$created_at"] }, 1000 * 60 * 60 * 24] } // age in days
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            }
          },
          {
            $facet: {
              totalCount: [{ $count: "count" }], // Count total items before pagination
              paginatedResults: [
                { $sort: sortOptions[sortBy] || { created_at: -1 } },
                { $skip: (page - 1) * limit },
                { $limit: limit },
              ],
            },
          },
        ]);
  
        const totalResultsCount = bookmarks[0]?.totalCount[0]?.count || 0;
        const resultTopics = bookmarks[0]?.paginatedResults || [];
  
        if (!resultTopics || resultTopics.length === 0) {
          return { status: 400, data: { message: "No bookmarks found" } };
        }
  
        const topicWithUser = await TopicModel.populate(resultTopics, {
          path: 'user_id',
          select: 'username avatar',
        });
  
        return {
          status: 200,
          data: topicWithUser,
          totalResults: totalResultsCount,
          maxPage: Math.ceil(totalResultsCount / limit),
        };
      } catch (error) {
        console.log("Error fetching bookmarked topics:", error);
        return { status: 500, data: { message: "Failed to fetch bookmarked topics" } };
      }
    }),
  queryTopicById: publicProcedure
    .input(
      z.object({
        Id: z.string(),
      })
    )
    .query(async ({ input }) => {
      const { Id } = input;
      try {
        const topic = await TopicModel.aggregate([
          { $match: { _id: new Types.ObjectId(Id) } },
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
              tags: { $push: {
                tagname: "$tagDetails.tagname",
                category: "$tagDetails.category"
              } },
            },
          },
          {
            $lookup: {
              from: "comments",
              localField: "_id",
              foreignField: "topic_id",
              as: "comments",
            }
          },
          {
            $addFields: {
              n_comment: { $size: "$comments" },
            }
          },
          {
            $project: {
              comments: 0
            }
          }
        ])

        const topicWithUser = await TopicModel.populate(topic, {
          path: 'user_id',
          select: 'username avatar',
        });

        return { 
          status: 200, 
          data: topicWithUser
        };
      } catch (error) {
        return { status: 500, data: { message: "Failed to fetch topic by id" } };
      }
      
    }),
  checkTopicOwner: publicProcedure
    .input(
      z.object({
        email: z.string(),
        topicId: z.string(),
      })
    )
    .query(async ({ input }) => {
      const { email, topicId } = input;
      try {
        await connectDB();

        const user = await UserModel.findOne({ email }).select("_id");
        if (!user) {
          return { status: 404, data: { message: "User not found", permission: false } };
        }
  
        const topic = await TopicModel.findOne({ _id: topicId, user_id: user._id });

        if (!topic) return { status: 404, data: { message: "No permission", permission: false } };

        return { 
          status: 200, 
          data: { message: "Has permission", permission: true }
        };
      } catch (error) {
        return { status: 500, data: { message: "Failed to fetch topic by id", permission: false } };
      }
      
    }),
}

export default getTopics;
