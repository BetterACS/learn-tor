import apiTest from './api/example';
import register from './api/member-system/register';
import login from './api/member-system/login';
import verified from './api/member-system/verified';
import editUser from './api/member-system/editUser';
import resetVerificationToken from './api/member-system/resetVerificationToken';
import getJWT from './api/getJWT';
import universityQueries from './api/university'
import { createCallerFactory, router } from './trpc';
export const appRouter = router({
	...apiTest(),
    ...register(),
    ...login(),
    ...verified(),
    ...editUser(),
    ...resetVerificationToken(),
    ...getJWT(),
    ...universityQueries()
});
const createCaller = createCallerFactory(appRouter);

export const caller = createCaller({});
export type AppRouter = typeof appRouter;
