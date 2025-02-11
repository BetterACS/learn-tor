import { UniversityModel } from "@/db/models";
import { connectDB } from "@/server/db";
import { z } from "zod";
import { publicProcedure } from "../trpc";
import { SortOrder } from "mongoose";

function escapeRegex(str: string) {
    return str.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, "\\$&");
}

export default function universityQueries() {
    return {
        searchUniversities: publicProcedure
            .input(
                z.object({
                    search: z.string().optional(), // ค้นหาตามชื่อมหาวิทยาลัยหรือหลักสูตร
                    course_id: z.string().optional(), // ค้นหาตาม course_id
                    sortBy: z.enum(["institution", "program"]).optional(), // จัดเรียงตามชื่อมหาวิทยาลัยหรือหลักสูตร
                    order: z.enum(["asc", "desc"]).optional(), // เรียงจากน้อยไปมาก หรือ มากไปน้อย
                    limit: z.number().min(1).max(100).default(10), // จำนวนผลลัพธ์ต่อหน้า (pagination)
                    page: z.number().min(1).default(1), // เลือกหน้าของผลลัพธ์ (pagination)
                })
            )
            .mutation(async ({ input }) => {
                const { search, course_id, sortBy = "institution", order = "asc", limit, page } = input;
                try {
                    await connectDB(); 
                    const query: Record<string, any> = search
                        ? {
                              $or: [
                                  { institution: { $regex: escapeRegex(search), $options: "i" } }, 
                                  { program: { $regex: escapeRegex(search), $options: "i" } },
                              ],
                          }
                        : {};
                    
                    if (course_id) {
                        query["course_id"] = course_id;
                    }
                    
                    const sortOrder = order === "asc" ? 1 : -1;
                    const sortCondition: Record<string, SortOrder> = { [sortBy]: sortOrder, _id: 1 };
                    const totalResults = await UniversityModel.countDocuments(query);

                    const universities = await UniversityModel.find(query).sort(sortCondition).skip((page - 1) * limit).limit(limit);
                    
                    if (course_id) {
                        universities.forEach((university) => {
                            university.view_today = university.view_today + 1;
                            university.save();
                        });
                    }

                    if (totalResults <= (page - 1) * limit) {
                        console.log("No more results to fetch for this page.");
                    }

                    return {
                        status: 200,
                        data: { universities },
                        maxPage: Math.ceil(totalResults / limit),
                    };
                } catch (error) {
                    console.error("Error fetching universities:", error);
                    return {
                        status: 500,
                        data: { message: "Failed to fetch universities" },
                    };
                }
            }),
    };
}
