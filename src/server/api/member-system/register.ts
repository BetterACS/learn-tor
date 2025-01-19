import { UserModel } from '@/db/models';
import { connectDB } from '@/server/db';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { publicProcedure } from '../../trpc';
import jwt from "jsonwebtoken";
import logError from '@/utils/logError';
export default function register() {
	return {
		register: publicProcedure
			.input(
				z.object({
					email: z.string(),
					password: z.string(),
					username: z.string(),
				})
			)
			.mutation(async ({ input }) => {
				const { email, password, username} = input;
				try {
					await connectDB();
					const existingUser = await UserModel.findOne({
						$or: [{ email }],
					});
					if (existingUser) {
						return {
							status: 400,
							data: {
								message: 'Email already exists.',
							},
						};
					}
					const hashedPassword = await bcrypt.hash(password, 12);
					const newUser = await UserModel.create({
						email: email,
						password: hashedPassword,
						username: username,
					});

					await newUser.save();
					return {
						status: 200,
						data: {
						  message: 'User created successfully',
						},
					  };
					  
				} catch (error) {
					console.error('Error creating user:', error);
					logError(error as Error);
					return {
						status: 500,
						data: { message: 'Fail to create user please report to website' },
					};
				}
			}),
	};
}
