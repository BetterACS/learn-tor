import { UniversityModel } from "@/db/models";
import { connectDB } from "@/server/db";
import { z } from "zod";
import { publicProcedure } from "../trpc";
import { SortOrder } from "mongoose";
import { startOfToday } from "date-fns";

function escapeRegex(str: string) {
    return str.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, "\\$&");
}

async function resetViewTodayIfNeeded() {
    await connectDB();
    const todayStart = startOfToday();
  
    await UniversityModel.updateMany(
      { last_reset_view_today: { $lt: todayStart } },
      {
        $set: {
          view_today: 0,
          last_reset_view_today: new Date(),
        },
      }
    );
  }

export default function universityQueries() {
    return {
        searchUniversities: publicProcedure
            .input(
                z.object({
                    search: z.string().optional(), // ค้นหาตามชื่อมหาวิทยาลัยหรือหลักสูตร
                    course_id: z.string().optional(), // ค้นหาตาม course_id
                    sortBy: z.enum(["institution", "program","view_today"]).optional(), // จัดเรียงตามชื่อมหาวิทยาลัยหรือหลักสูตร
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
                    await resetViewTodayIfNeeded();
                    
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
            getFilteredUniversities: publicProcedure
            .input(
                z.object({
                    institution: z.string().optional(), // มหาวิทยาลัย
                    faculty: z.string().optional(), // คณะ
                    program: z.string().optional(), // สาขา/หลักสูตร
                    course_type: z.string().optional(), // ภาษา
                    campus: z.string().optional(), // วิทยาเขต
                    admissionType: z.string().optional(), // รูปแบบการรับ
                })
            )
            .mutation(async ({ input }) => {
                const { institution, faculty, program, course_type, campus, admissionType } = input;
                try {
                    await connectDB();

                    // สร้าง query object แบบไดนามิก
                    const query: Record<string, any> = {};
                    if (institution) query.institution = { $regex: new RegExp(institution, "i") };
                    if (faculty) query.faculty = { $regex: new RegExp(faculty, "i") };
                    if (program) query.program = { $regex: new RegExp(program, "i") };
                    if (course_type) query.course_type = { $regex: new RegExp(course_type, "i") };
                    if (campus) query.campus = { $regex: new RegExp(campus, "i") };
                    console.log("admission",admissionType)
                    if (admissionType) {
                        const escapedAdmissionType = escapeRegex(admissionType);
                        query["round_3"] = {
                            $elemMatch: {
                                admission_type: { $regex: new RegExp(escapedAdmissionType, "i") }
                            }
                        };
                    }

                    // Query เพื่อหาข้อมูลที่ตรงกับเงื่อนไขทั้งหมด
                    const unique_universities = await UniversityModel.find(query).distinct("institution")
                    ;
                    const unique_faculties = await UniversityModel.find(query).distinct("faculty");
                    const unique_programs = await UniversityModel.find(query).distinct("program");
                    const unique_course_types = await UniversityModel.find(query).distinct("course_type");
                    const unique_campuses = await UniversityModel.find(query).distinct("campus");
                    // const unique_admissionTypes = await UniversityModel.find(query).distinct("round_3.admission_type")
                    const universities = await UniversityModel.find(query);
                    const unique_admissionTypes = [
                        ...new Set(
                            universities.flatMap((uni) =>
                                uni.round_3
                                    .filter((round) =>
                                        round.admission_type.match(new RegExp(admissionType || "", "i"))
                                    )
                                    .map((round) => round.admission_type)
                            )
                        ),
                    ];
                    if (
                        unique_universities.length === 1 &&
                        unique_faculties.length === 1 &&
                        unique_programs.length === 1 &&
                        unique_course_types.length === 1 &&
                        unique_campuses.length === 1 &&
                        unique_admissionTypes.length === 1
                    ) {
                        const result = await UniversityModel.countDocuments(query);
                        return {
                            status: 200,
                            data: {
                                unique_universities,
                                unique_faculties,
                                unique_programs,
                                unique_course_types,
                                unique_campuses,
                                unique_admissionTypes,
                                result:universities
                            },
                        };
                    }
                    return {
                        status: 200,
                        data: {
                            unique_universities,
                            unique_faculties,
                            unique_programs,
                            unique_course_types,
                            unique_campuses,
                            unique_admissionTypes,
                        },
                    };
                } catch (error) {
                    console.error("Error fetching filtered universities:", error);
                    return {
                        status: 500,
                        data: { message: "Failed to fetch filtered universities" },
                    };
                }
            }),
    };

}
