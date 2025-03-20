import { publicProcedure } from "@/server/trpc";
import { z } from 'zod'
import { connectDB } from "@/server/db";
import { TcasCalculatorModel, UserModel, UniversityModel } from "@/db/models";

export default function saveResult(){
    return{
        saveResult: publicProcedure
            .input(
                z.object({
                    email: z.string(),
                    institution: z.string(),
                    campus: z.string(),
                    faculty: z.string(),
                    program: z.string(),
                    course_type: z.string(),
                    admission_type: z.string(),
                  })
            )
            .mutation(async ({input}) => {
                await connectDB();
                const { email, institution, faculty, admission_type, campus, program, course_type } = input;
                const user = await UserModel.findOne({ email: email });
                if (!user) {
                    return {status:400,data:{ message: "User not found" }};
                }
                const user_id = user._id;
                
                const universities = await UniversityModel.find({
                    institution,
                    campus,
                    faculty,
                    program,
                    course_type,
                    "round_3.admission_type": admission_type,
                  });
                console.log(universities);
                if (universities.length === 0) {
                    return { status: 400, data: { message: "University not found" } };
                }
                const searchAdmissionDetails = universities.map(uni => {
                    if (Array.isArray(uni.round_3)) {
                        const roundMatch = uni.round_3.filter((round: any) =>
                            round.admission_type === admission_type
                        );
                        return {
                            institution: uni.institution,
                            faculty: uni.faculty,
                            program: uni.program,
                            course_type: uni.course_type,
                            admission_type: admission_type,
                            campus: uni.campus,
                            round_3: roundMatch
                        };
                    }
                    return null;
                });

                const inputInstitution = searchAdmissionDetails[0]?.institution || "";
                const inputCampus = searchAdmissionDetails[0]?.campus || "";
                const inputFaculty = searchAdmissionDetails[0]?.faculty || "";
                const inputProgram = searchAdmissionDetails[0]?.program || "";
                const inputCourse_type = searchAdmissionDetails[0]?.course_type || "";
                const inputAdmission_type = searchAdmissionDetails[0]?.admission_type || "";
                const inputScoreCalculationFormula = searchAdmissionDetails[0]?.round_3[0]?.score_calculation_formula || {};
                const inputMinimumCriteria = searchAdmissionDetails[0]?.round_3[0]?.minimum_criteria || {};
                const inputAdmitted = searchAdmissionDetails[0]?.round_3[0]?.admitted || "";
                try{
                    await TcasCalculatorModel.create({
                        user_id: user_id,
                        institution: inputInstitution,
                        campus: inputCampus,
                        faculty: inputFaculty,
                        program: inputProgram,
                        course_type: inputCourse_type,
                        admission_type: inputAdmission_type,
                        score_calculation_formula: inputScoreCalculationFormula,
                        minimum_criteria: inputMinimumCriteria,
                        admitted: inputAdmitted,
                        chance: 100,// รอคำนวณ
                    });
                    return { status: 200, data: { message: "Save result success" } };
                }catch(error){
                    console.error("Error save result:", error);
                    return { status: 500, data: { message: "Internal Server Error" } };
                }
                

                // return { status: 200, data: {searchAdmissionDetails,message: "Save result success"}};
                
            })
    };
}