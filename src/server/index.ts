import apiTest from './api/test';
import register from './api/register';
import { createCallerFactory, router } from './trpc';
export const appRouter = router({
	...apiTest(),
    ...register(),
});
const createCaller = createCallerFactory(appRouter);

export const caller = createCaller({});
export type AppRouter = typeof appRouter;
