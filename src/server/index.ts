import apiTest from './api/test';
import { createCallerFactory, router } from './trpc';
export const appRouter = router({
	...apiTest(),
});
const createCaller = createCallerFactory(appRouter);

export const caller = createCaller({});
export type AppRouter = typeof appRouter;
