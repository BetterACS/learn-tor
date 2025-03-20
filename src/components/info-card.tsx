import Image from 'next/image';
import clsx from 'clsx';
import { University } from '@/db/models';

interface InfoCardProps {
  university: string;
  faculty: string;
  major: string;
  logo: string;
  image: string;
  rounds: { name: string; quota: string }[];
  all_data: University;
  onAddToCompare: (item: { all_data: University }) => void;
}

export default function InfoCard({
  university,
  faculty,
  major,
  logo,
  image,
  rounds,
  all_data,
  onAddToCompare,
}: InfoCardProps) {
  const handleAddClick = () => {
    onAddToCompare({ all_data });
  };
  
  return (
    <div className="relative flex flex-col w-full bg-monochrome-50 shadow-lg rounded-lg overflow-hidden">
      <div className="relative flex items-center">
        <div className="relative w-[120px] h-full">
          <Image
            src={image}
            alt={`Image of ${university}`}
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div className="w-full md:w-1/2 flex flex-col items-start pl-4">
          <p className="text-headline-6 text-monochrome-950">{major}</p>
          <p className="text-body-large text-monochrome-700">{faculty}</p>
          <p className="text-body-small text-monochrome-600">{university}</p>

          <div className="w-full mt-2">
            {rounds.map((round, index) => (
              <div key={round.name} className="flex justify-start items-center mb-2 mt-2 ml-3 last:mb-0">
                <span className="text-body-large font-medium text-monochrome-700">{round.name}</span>
                <span className="text-body-large text-monochrome-600 ml-1">{round.quota}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute top-5 right-5 flex items-center space-x-2">
          <Image
            src={logo}
            alt={`${university} logo`}
            width={25}
            height={25}
            className="rounded-full"
          />
        </div>
      </div>
      <div className="absolute bottom-4 right-4">
        <button
          className={clsx("p-2 bg-monochrome-50 rounded-md", "hover:bg-monochrome-100 transition")}
          onClick={handleAddClick}
        >
          <Image
            src="/images/uni-pic/add.avif"
            alt="Add"
            width={20}
            height={20}
          />
        </button>
      </div>
    </div>
  );
}