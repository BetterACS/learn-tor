'use client';
import { Post, SortBy } from '@/components/index';
import { trpc } from '@/app/_trpc/client';
import { useEffect } from 'react';

export default function PostSection() {

  const { data: posts, isLoading, isError } = trpc.queryTopic.useQuery();
  const topicTagsMutation = trpc.topicTags.useMutation();

  useEffect(() => {
    if (posts && posts.length > 0) {
      Promise.allSettled(
        posts.map((post) =>
          topicTagsMutation.mutateAsync({ topic_id: post._id })
        )
      ).then((results) => {
        results.forEach((result, index) => {
          if (result.status === "fulfilled") {
            console.log("Tags for post:", posts[index]._id, result.value);
          } else {
            console.error("Error fetching tags for post:", posts[index]._id, result.reason);
          }
        });
      });
    }
  }, [posts]);
  
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
