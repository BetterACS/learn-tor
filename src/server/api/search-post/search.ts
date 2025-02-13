import { TopicModel } from "@/db/models";
import { connectDB } from "@/server/db";
import { z } from 'zod';
import { publicProcedure } from "../../trpc";
import logError from '@/utils/logError';
export default function search() {
  return {
    searchQuery: publicProcedure
      .input(
        z.object({
          searchTerm: z.string().optional(),
          filterTags: z.record(z.string(), z.enum(["included", "excluded"])).optional(),
        }),
      )
      .query(async ({ input }) => {
        const { searchTerm, filterTags } = input;
        try {
          await connectDB();

          const query: any = {
            $or: [
              { title: { $regex: searchTerm, $options: "i" } },
              { body: { $regex: searchTerm, $options: "i" } },
              { forum: { $regex: searchTerm, $options: "i" } },
            ],
          };

          // Handle filterTags logic
          if (filterTags) {
            const tagsQuery: any = {};

            for (const [tag, value] of Object.entries(filterTags)) {
              if (value === "included") {
                tagsQuery.$in = tagsQuery.$in || [];
                tagsQuery.$in.push(tag);
              } else if (value === "excluded") {
                tagsQuery.$nin = tagsQuery.$nin || [];
                tagsQuery.$nin.push(tag);
              }
            }

            // If we have any tag filters, add them to the query
            if (tagsQuery.$in || tagsQuery.$nin) {
              query.tags = tagsQuery;
              
            }
          }

          const topics = await TopicModel.find(query);
          if (!topics || topics.length === 0) {
            return {
              status: 400,
              data: { message: "Topic not found" }
            }
          }
          return {
            status: 200,
            data: topics
          }
        } catch (error) {
          console.log("Error fetching topic:", error);
          logError(error as Error);
          return {
            status: 500,
            data: { message: "Fail to fetch topic" },
          }
        }
      }),
  };
}
