import { publicProcedure } from "@/server/trpc";
import { z } from 'zod'
import { connectDB } from "@/server/db";
import { TcasCalculatorModel, UserModel, UniversityModel, ScoreModel } from "@/db/models";
import axios from 'axios';
const TCAS_CAL_API_URL = process.env.TCAS_CAL_API_URL || "";

const api = axios.create({
    baseURL: TCAS_CAL_API_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

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
                    score: z.record(
                        z.string(),
                        z.object({
                          type: z.enum(["single", "special", "max"]),
                          base_subjects: z.string(),
                          weight: z.number(),
                          score: z.number()
                        }).optional()
                    ).optional()
                  })
            )
            .mutation(async ({input}) => {
                await connectDB();
                const { email, institution, faculty, admission_type, campus, program, course_type, score } = input;
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
                const inputMinScore = searchAdmissionDetails[0]?.round_3[0]?.min_score || 0;
                const inputMaxScore = searchAdmissionDetails[0]?.round_3[0]?.max_score || 0;
                const student_school_type = JSON.parse(searchAdmissionDetails[0]?.round_3[0]?.student_school_type.replace(/'/g, '"')) || [];
                const new_culcurate = searchAdmissionDetails[0]?.round_3[0]?.new_culcurate || {};
                const last_years_admitted = searchAdmissionDetails[0]?.round_3[0]?.last_years_admitted || "";
                const last_years_register = searchAdmissionDetails[0]?.round_3[0]?.last_years_register || "";
                const last_years_passed = searchAdmissionDetails[0]?.round_3[0]?.last_years_passed || "";
                const lastscore_score = searchAdmissionDetails[0]?.round_3[0]?.lastscore_score || {};
                let last_year_score_min = 0
                let last_year_score_max = 0
                try{
                    last_year_score_min = searchAdmissionDetails[0]?.round_3[0]?.lastscore_score["ประมวลผลครั้งที่ 2"]["ต่ำ"] || 0;
                    last_year_score_max = searchAdmissionDetails[0]?.round_3[0]?.lastscore_score["ประมวลผลครั้งที่ 2"]["สูง"] || 0;
                }
                catch{
                  
                }
                

                const scoreUser = await ScoreModel.findOne({ user_id: user_id });
                const score_GPAX = (user.GPAX/4)*100 || 0;
                const score_TGAT1 = scoreUser?.TGAT1 || 0;
                const score_TGAT2 = scoreUser?.TGAT2 || 0;
                const score_TGAT3 = scoreUser?.TGAT3 || 0;
                const score_TPAT21 = scoreUser?.TPAT21 || 0;
                const score_TPAT22 = scoreUser?.TPAT22 || 0;
                const score_TPAT23 = scoreUser?.TPAT23 || 0;
                const score_TPAT3 = scoreUser?.TPAT3 || 0;
                const score_TPAT4 = scoreUser?.TPAT4 || 0;
                const score_TPAT5 = scoreUser?.TPAT5 || 0;
                const score_A_MATH1 = scoreUser?.A_MATH1 || 0;
                const score_A_MATH2 = scoreUser?.A_MATH2 || 0;
                const score_A_PHYSIC = scoreUser?.A_PHYSIC || 0;
                const score_A_CHEMISTRY = scoreUser?.A_CHEMISTRY || 0;
                const score_A_BIOLOGY = scoreUser?.A_BIOLOGY || 0;
                const score_A_SCIENCE = scoreUser?.A_SCIENCE || 0;
                const score_A_SOCIAL = scoreUser?.A_SOCIAL || 0;
                const score_A_THAI = scoreUser?.A_THAI || 0;
                const score_A_ENGLISH = scoreUser?.A_ENGLISH || 0;
                const score_A_FRENCH = scoreUser?.A_FRENCH || 0;
                const score_A_GERMANY = scoreUser?.A_GERMANY || 0;
                const score_A_JAPAN = scoreUser?.A_JAPAN || 0;
                const score_A_KOREAN = scoreUser?.A_KOREAN || 0;
                const score_A_CHINESE = scoreUser?.CHINESE || 0;
                const score_A_PALI = scoreUser?.A_PALI || 0;
                const score_A_SPANISH = scoreUser?.A_SPANISH || 0;


                try{
                    const payload = {
                        "institution": inputInstitution || "",
                        "faculty": inputFaculty || "",
                        "program": inputProgram || "",
                        "campus": inputCampus || "",
                        "course_type": inputCourse_type || "",
                        "student_school_type": student_school_type ,//user.lesson_plan,
                        "cur_student_school_type": user.lesson_plan,
                        "admission_type": inputAdmission_type || "",
                        "admitted" : inputAdmitted,
                        "last_years_admitted": last_years_admitted || "",
                        "last_years_register": last_years_register || "",
                        "last_years_passed": last_years_passed || "",
                        "lastscore_score": lastscore_score,
                        "new_culcurate": new_culcurate || {},
                        "score": score || {},
                        "score_GPAX": score_GPAX || 0, 
                        "score_TGAT1": score_TGAT1 || 0,
                        "score_TGAT2": score_TGAT2,
                        "score_TGAT3": score_TGAT3,
                        "score_TPAT21": score_TPAT21,
                        "score_TPAT22": score_TPAT22, 
                        "score_TPAT23": score_TPAT23,
                        "score_TPAT3": score_TPAT3,
                        "score_TPAT4": score_TPAT4,
                        "score_TPAT5": score_TPAT5,
                        "score_A_MATH1": score_A_MATH1,
                        "score_A_MATH2": score_A_MATH2,
                        "score_A_PHYSIC": score_A_PHYSIC,
                        "score_A_CHEMISTRY": score_A_CHEMISTRY,
                        "score_A_BIOLOGY": score_A_BIOLOGY,
                        "score_A_SCIENCE": score_A_SCIENCE,
                        "score_A_SOCIAL": score_A_SOCIAL,
                        "score_A_THAI": score_A_THAI,
                        "score_A_ENGLISH": score_A_ENGLISH,
                        "score_A_FRENCH": score_A_FRENCH,
                        "score_A_GERMANY": score_A_GERMANY,
                        "score_A_JAPAN": score_A_JAPAN,
                        "score_A_KOREAN": score_A_KOREAN,
                        "score_A_CHINESE": score_A_CHINESE,
                        "score_A_PALI": score_A_PALI,
                        "score_A_SPANISH": score_A_SPANISH,
                    }
                    // return { status: 200, data: { payload } };

                    try {            
                        // console.log("json",JSON.stringify(payload, null, 2))

                        const response = await api.post('/recommend', JSON.stringify(payload, null, 2)); // Axios จะแปลง data เป็น JSON ให้อัตโนมัติ
                        // console.log('recommend:', response.data);
                        // console.log('min_score', inputMinScore);
                        // console.log('max_score', inputMaxScore);
                        // console.log('last_year_score_min', last_year_score_min);
                        // console.log('last_year_score_max', last_year_score_max);
                        // console.log('student_school_type', student_school_type);
                        const result = await TcasCalculatorModel.create({
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
                            chance: response.data.chance,
                            calculated_score: response.data.calculated_score,
                            max_score: inputMaxScore,
                            min_score: inputMinScore,
                            last_year_min_score: last_year_score_min,
                            last_year_max_score: last_year_score_max,
                            student_school_type: student_school_type,
                            last_years_admitted : last_years_admitted,
                        });
                        const result_id = result._id;
                        return { status: 200, data: { message: "Save result success", result_id: result_id, result : result } };
                    
                      } catch (error) {
                        return { status: 500, data: { message: "Error in API call time out" } };
                      }
                    


                    
                }catch(error){
                    console.error("Error save result:", error);
                    return { status: 500, data: { message: "Internal Server Error" } };
                }
                

                // return { status: 200, data: {searchAdmissionDetails,message: "Save result success"}};
                
            })
    };
}