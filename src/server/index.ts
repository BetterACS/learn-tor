import apiTest from './api/example';
import register from './api/member-system/register';
import login from './api/member-system/login';
import verified from './api/member-system/verified';
import editUser from './api/member-system/editUser';
import resetVerificationToken from './api/member-system/resetVerificationToken';
import getJWT from './api/getJWT';
import getTopics from './api/forum/getTopics';
import universityQueries from './api/university'
import { createCallerFactory, router } from './trpc';
import createTopic from './api/forum/createTopic';
import queryTopic from './api/forum/queryTopic';
import likeTopic from './api/forum/likeTopic';
import checkLike from './api/forum/checkLike';
import getUser from './api/member-system/getUser';
import getTags from './api/forum/getTags';
import getTopTags from './api/forum/getTags';
import addTags from './api/forum/addTags';
import topicTags from './api/forum/topicTags';
import updateTopic from './api/forum/update';
import updateTags from './api/forum/update';
import checkTopicOwner from './api/forum/getTopics';
import deleteTopic from './api/forum/deleteTopic';
import getSearchTags from './api/forum/getTags';

export const appRouter = router({
	...apiTest(),
    ...register(),
    ...login(),
    ...verified(),
    ...editUser(),
    ...resetVerificationToken(),
    ...getJWT(),
    ...getTopics,
    ...createTopic(),
    ...queryTopic,
    ...likeTopic(),
    ...checkLike(),
    ...getUser(),
    ...universityQueries(),
    ...getTags,
    ...getTopTags,
    ...addTags(),
    ...topicTags(),
    ...updateTopic,
    ...updateTags,
    ...checkTopicOwner,
    ...deleteTopic,
    ...getSearchTags,
});
const createCaller = createCallerFactory(appRouter);

export const caller = createCaller({});
export type AppRouter = typeof appRouter;
