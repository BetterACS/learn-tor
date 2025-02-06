'use client';
import { Post, SortBy } from '@/components/index';
import { trpc } from '@/app/_trpc/client';

export default function PostSection() {
  const { data: posts, isLoading, isError } = trpc.queryTopic.useQuery();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading posts</div>;

  return (
    <div className="h-fit w-full flex flex-col gap-6">
      <div className="flex w-fit gap-2 items-center">
        <p className="text-monochrome-500 text-subtitle-large">
          Sort by:
        </p>
        <SortBy filters={["Newest", "Oldest", "Popular"]} />
      </div>
      <div className="h-fit w-full px-[14vw] flex flex-col gap-6">
        {posts?.map((post) => (
          <Post key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
}
