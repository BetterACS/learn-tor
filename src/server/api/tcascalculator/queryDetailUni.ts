import { publicProcedure } from "@/server/trpc";
import { z } from 'zod'
import { connectDB } from "@/server/db";
import { UniversityModel } from "@/db/models";

export default function queryDetail(){
    return{
        queryDetail: publicProcedure
            .input(
                z.object({
                    institution: z.string().optional(),
                    faculty: z.string().optional(),
                    program: z.string().optional()
                })
            )
            .mutation(async ({input}) => {
                await connectDB();
                const { institution, faculty, program } = input;
                const allData = await UniversityModel.find({});
                if (!institution) {
                    const universityName = Array.from(new Set(allData.map(uni => uni.institution)));
                    return universityName;
                }else if (institution && !faculty) {
                    // คณะที่มีในมหาลัยนั้นๆ
                    const searchFaculty = allData.filter(uni => uni.institution === institution).map(uni => uni.faculty);
                    const uniqueFaculty = Array.from(new Set(searchFaculty));
                    return uniqueFaculty;
                }else if (institution && faculty && !program) {
                    // โปรแกรมที่มีในคณะนั้นๆ
                    const searchProgram = allData.filter(uni => uni.institution === institution && uni.faculty === faculty).map(uni => uni.program);
                    const uniqueProgram = Array.from(new Set(searchProgram));
                    return uniqueProgram;
                }else if (institution && faculty && program) {
                    // รูปแบบการรับ
                    const searchAdmission = allData.filter(uni => uni.institution === institution && uni.faculty === faculty && uni.program === program)
                    .map(uni => {
                        if (Array.isArray(uni.round_3)) {
                            return uni.round_3.map(round => round.description).filter(description => description !== undefined);
                        }
                        return [];
                    })
                    .flat()
                    .filter(description => description !== null && description !== undefined);
                    const uniqueAdmission = Array.from(new Set(searchAdmission));
                    return uniqueAdmission;
                }

                // คณะและโปรแกรมทั้งหมด
                // const facultyResult = Array.from(new Set(allData.map(uni => uni.faculty)));
                // const programResult = Array.from(new Set(allData.map(uni => uni.program)));

                return {
                    institution,
                    faculty,
                    program,
                    uniqueAdmission
                };

            })
    }
}