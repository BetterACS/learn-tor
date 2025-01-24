'use client';
import { PostSection } from '@/components/index';

export default function MyTopic() {
  return (
    <div className="flex flex-col gap-4 divide-y divide-primary-600">
      <div className="flex justify-between text-headline-3 text-primary-600">
        <p>Topic ของฉัน</p>
        <p>4 หัวข้อ</p>
      </div>
      <div className="pt-5">
        <PostSection />
      </div>
    </div>
  )
}