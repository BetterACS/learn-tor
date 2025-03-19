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
                    major: z.string().optional()
                })
            )
            .mutation(async ({input}) => {
                await connectDB();
                const { institution, faculty, major } = input;
                const allData = await UniversityModel.find({});
                if (!institution) {
                    const universityName = Array.from(new Set(allData.map(uni => uni.institution)));
                    return universityName;
                    
                }else if (institution && !faculty) {
                    // คณะที่มีในมหาลัยนั้นๆ
                    const searchFaculty = allData.filter(uni => uni.institution === institution).map(uni => uni.faculty);
                    const uniqueFaculty = Array.from(new Set(searchFaculty));
                    return uniqueFaculty;

                }else if (institution && faculty && !major) {
                    // โปรแกรมที่มีในคณะนั้นๆ
                    const searchMajor = allData.filter(uni => uni.institution === institution && uni.faculty === faculty)
                    .map(uni => {
                        if (Array.isArray(uni.round_3)) {
                            return uni.round_3.map((round: any) => round.field_major).filter((field_major: any) => field_major !== undefined);
                        }
                        return [];
                    })
                    .flat()
                    .filter(field_major => field_major !== null && field_major !== undefined);

                    const uniqueMajor = Array.from(new Set(searchMajor));
                    return uniqueMajor;

                }else if (institution && faculty && major) {
                    // รูปแบบการรับ
                    const searchAdmission = allData.filter(uni => 
                        uni.institution === institution &&
                        uni.faculty === faculty &&
                        uni.round_3.some((round: any) => round.field_major === major))

                    .map(uni => {
                        if (Array.isArray(uni.round_3)) {
                            return uni.round_3
                            .filter((round: any) => round.field_major === major)
                            .map((round: any) => round.description)
                            .filter((description: any) => description !== undefined);
                        }
                        return [];
                    })
                    .flat()
                    .filter(description => description !== null && description !== undefined);
                    const uniqueAdmission = Array.from(new Set(searchAdmission));
                    return uniqueAdmission;
                }

                // คณะทั้งหมด
                // const facultyResult = Array.from(new Set(allData.map(uni => uni.faculty)));
            })
    }
}