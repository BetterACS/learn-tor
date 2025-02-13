import { z } from "zod";
import { publicProcedure } from "../trpc";
import logError from '@/utils/logError';
import jwt from 'jsonwebtoken';

export default function getJWT() {
    return {
        getJWT: publicProcedure
            .input(
                z.object({
                    email: z.string(),
                })
            )
            .mutation(async ({ input }) => {
                const { email } = input;
                try {
                    if (!email) {
                        return {
                            status: 400,
                            data: { message: "Email is required for create token for reset" },
                        };
                    }

                    if (!process.env.NEXTAUTH_SECRET) {
                        return {
                            status: 500,
                            data: { message: "NEXTAUTH_SECRET is required" },
                        };
                    }

                    const token = jwt.sign({ email }, process.env.NEXTAUTH_SECRET, { expiresIn: '15m' });
                    return { status: 200, data: { message: "Sucessful create a token", token:token } };
                } 
                catch (error) {
                    console.error("Error logging in:", error);
                    logError(error as Error);
                    return {
                        status: 500,
                        data: { message: "Fail to generateToken" },
                    };
                }
            }),
        verifyJWT: publicProcedure
            .input(
                z.object({
                    token: z.string(),
                })
            )
            .mutation(async ({ input }) => {
                const { token } = input;
                try {
                    if (!token) {
                        return {
                            status: 400,
                            data: { message: "Token is required for verification" },
                        };
                    }

                    if (!process.env.NEXTAUTH_SECRET) {
                        return {
                            status: 500,
                            data: { message: "NEXTAUTH_SECRET is required" },
                        };
                    }

                    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET);
                    return { status: 200, data: { message: "Token is valid", decoded } };
                } 
                catch (error) {
                    console.error("Error verifying token:", error);
                    logError(error as Error);
                    return {
                        status: 500,
                        data: { message: "Invalid token" },
                    };
                }
            })
        }
    }
