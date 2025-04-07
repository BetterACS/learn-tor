'use client';

import { trpc } from '@/app/_trpc/client';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

dayjs.extend(relativeTime);

interface Topic {
  _id: string, 
  img: string, 
  title: string, 
  body: string, 
  created_at: string, 
  n_like: number, 
  user_id: { username: string, avatar: string }, 
  isLiked : boolean,
  n_comment: number
}

export default function TrendingTopic() {
  const TOPIC_LIMIT = 6;

  const { data: trending_topics, isLoading, isError } = trpc.searchQuery.useQuery({
    sortBy: "Popular",
    limit: TOPIC_LIMIT
  });

  return (
    <div className="h-[calc(100vh-5.25rem)] w-full bg-monochrome-50 sticky overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-monochrome-200 top-[5.25rem] flex flex-col items-center p-8 maxlg:px-4 border-l border-monochrome-400 overflow-x-hidden">
      <p className="w-full text-headline-5 text-primary-600">
        Stayed on Trend Topics
      </p>
      {isLoading ? (
        <div className="w-full h-fit flex flex-col divide-y divide-monochrome-200 pt-4 animate-pulse">
          {Array.from({ length: TOPIC_LIMIT }).map((_, index) => (
            <div key={index} className="w-full flex py-4 gap-4 maxlg:gap-2 items-center">
              <div className="w-full h-fit flex items-center gap-4 first:pt-0 last:pb-0">
                <div className="w-full h-fit flex flex-col gap-2">
                  <div className="flex content-center items-center gap-2">
                    <div className="size-10">
                      <div className="w-full h-full rounded-full bg-monochrome-100"></div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="w-fit text-body-large bg-monochrome-100 rounded-md text-transparent">
                        Placeholder
                      </p>
                      <p className="w-fit text-subtitle-small text-transparent bg-monochrome-100 rounded-md ">
                        Placeholrr
                      </p>
                    </div>
                    
                  </div>

                  <div className="flex justify-between items-center w-full gap-2 bg-monochrome-100 rounded-md">
                    <p className="text-body-large self-start text-transparent">Placeholderrrrrrrrrrrrrrrrrrrrrrrrr</p>
                  </div>

                  <p className="w-fit text-body-small text-transparent bg-monochrome-100 rounded-md">
                    Placeholderrrrrrrrr
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full h-fit flex flex-col divide-y divide-monochrome-200 pt-4">
          {trending_topics?.data.map((item: Topic, index: number) => (
            <Link 
              href={{ pathname: `/forum/${item._id}`,
                      query: JSON.stringify(item)}} 
              key={index}
              className="w-full flex py-4 gap-4 maxlg:gap-2 items-center"
            >
              <div className="w-full h-fit flex items-center gap-4 first:pt-0 last:pb-0">
                <div className="w-full h-fit flex flex-col gap-2">
                  <div className="flex content-center items-center gap-2">
                    <div className="size-10">
                      <img src={item.user_id.avatar || '/images/profile.avif'} className="w-full h-full object-cover rounded-full"/>
                    </div>
                    <div>
                      <p className="text-body-large">
                      {item.user_id.username}
                      </p>
                      <p className="text-subtitle-small text-monochrome-400">
                        {dayjs(item.created_at).fromNow()}
                      </p>
                    </div>
                    
                  </div>

                  <div className="flex justify-between items-center gap-2">
                    <p className="text-body-large self-start">{item.title}</p>
                  </div>

                  <p className="text-body-small text-monochrome-500">
                    {item.n_like} likes • {item.n_comment} comments
                  </p>
                </div>
              </div>
              {item.img &&
              <div className="w-[9rem] min-w-[9rem] maxlg:min-w-[6rem] maxlg:w-[6rem] h-[7rem] min-h-[7rem] maxlg:h-[5rem] maxlg:min-h-[5rem] flex items-center bg-monochrome-950 rounded-lg">
                <img src={item.img} alt="image" className="w-full h-full rounded-lg object-contain" />
              </div>
              }
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}