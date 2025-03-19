import { publicProcedure } from "@/server/trpc";
import { z } from 'zod'
import { connectDB } from "@/server/db";
import { TcasCalculatorModel, UserModel, UniversityModel } from "@/db/models";

export default function saveResult(){
    return{
        saveResult: publicProcedure
            .input(
                z.object({
                    email: z.string().email(),
                    institution: z.string(),
                    faculty: z.string(),
                    major: z.string(),
                    admission: z.string(),
                })
            )
            .mutation(async ({input}) => {
                await connectDB();
                const { email, institution, faculty, major, admission } = input;
                const user = await UserModel.findOne({ email: email });
                if (!user) {
                  throw new Error("User not found");
                }
                const user_id = user._id;
                
                const allData = await UniversityModel.find({});
                const searchData = allData.filter(uni =>
                    uni.institution === institution &&
                    uni.faculty === faculty 
                );

                const searchAdmissionDetails = searchData.map(uni => {
                    // ตรวจสอบ round_3 ตรงกับเงื่อนไข
                    const roundMatch = uni.round_3.filter((round: any) =>
                        round.field_major === major && round.description === admission
                    );

                    if (roundMatch.length > 0) {
                        return {
                            institution: uni.institution,
                            campus: uni.campus,
                            faculty: uni.faculty,
                            program: uni.program,
                            course_type: uni.course_type,
                            course_id: uni.course_id,
                            logo: uni.logo,
                            image: uni.image,
                            round_1: uni.round_1,
                            round_2: uni.round_2,
                            round_3: roundMatch,
                            round_4: uni.round_4,
                            view_today: uni.view_today,
                        };
                    }
                    return null;
                }).filter((uni) => uni !== null);

                const program = searchAdmissionDetails[0]?.program || "";
                const course_type = searchAdmissionDetails[0]?.course_type || "";
                const detail = searchAdmissionDetails[0]?.round_3[0]?.detail || "";
                const description = searchAdmissionDetails[0]?.round_3[0]?.description || "";
                const score_calculation_formula = searchAdmissionDetails[0]?.round_3[0]?.score_calculation_formula || "";
                const minimum_criteria = searchAdmissionDetails[0]?.round_3[0]?.minimum_criteria || "";
                const admitted = searchAdmissionDetails[0]?.round_3[0]?.admitted || "";

                await TcasCalculatorModel.create({
                    user_id: user_id,
                    institution: institution,
                    faculty: faculty,
                    program: program,
                    course_type: course_type,
                    major: major,
                    detail: detail,
                    description: description,
                    score_calculation_formula: score_calculation_formula,
                    minimum_criteria: minimum_criteria,
                    admitted: admitted,
                    chance: 100,// รอคำนวณ
                });

                return {message: "Save result success", status: 200, data: searchAdmissionDetails};
                
            })
    };
}