'use client';
import { PostSection } from '@/components/index';
import { useSession } from "next-auth/react";
import { trpc } from '@/app/_trpc/client';


export default function MyTopic() {
  const { data: session, status } = useSession();
  const { data, isLoading, isError, refetch } = trpc.queryMyBookmark.useQuery({ 
    email: session?.user?.email,
    sortBy: 'Newest',
  });

  return (
    <div className="flex flex-col gap-4 divide-y divide-primary-600">
      <div className="flex justify-between text-headline-3 text-primary-600">
        <p>Bookmark ของฉัน</p>
        {data?.totalResults && (
          <p>{data.totalResults} หัวข้อ</p>
        )}
      </div>
      <div className="pt-5">
        <PostSection myBookmark={true} />
      </div>
    </div>
  )
}