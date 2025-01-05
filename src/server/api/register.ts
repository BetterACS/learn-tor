import { UserModel } from '@/db/models';
import { connectDB } from '@/server/db';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { publicProcedure } from '../trpc';
import jwt from "jsonwebtoken";

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
						$or: [{ email }, { username }],
					});

					if (existingUser) {
						return {
							status: 400,
							data: {
								message: 'Email or username already exists.',
							},
						};
					}
					const hashedPassword = await bcrypt.hash(password, 12);
					const newUser = new UserModel({
						email: email,
						password: hashedPassword,
						username: username,
					});

					//create token
					const token = jwt.sign(
						{ userId: newUser._id, email },
						process.env.JWT_SECRET,
						{
							expiresIn: '1h',
						}
					);
					newUser.token = token;
		
					console.log('newUser:', newUser);
					await newUser.save();
					return {
						status: 200,
						data: { message: 'create user successfuly' },
					};
				} catch (error) {
					console.error('Error creating user:', error);
					return {
						status: 500,
						data: { message: 'Fail to create user' },
					};
				}
			}),
	};
}
