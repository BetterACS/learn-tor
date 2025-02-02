import Image from 'next/image';
import clsx from 'clsx';

interface InfoCardProps {
  university: string;
  faculty: string;
  major: string;
  logo: string;
  image: string;
  rounds: { name: string; quota: string }[];
}

export default function InfoCard({
  university,
  faculty,
  major,
  logo,
  image,
  rounds,
}: InfoCardProps) {
  return (
    <div className="flex flex-col w-full max-w-[520px] bg-monochrome-50 shadow-lg rounded-lg overflow-hidden">

      <div className="relative flex items-center">
        <div className="relative w-[150px] h-[200px]">
          <Image
            src={image}
            alt={`Image of ${university}`}
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div className="w-1/2 flex flex-col items-start pl-4">
          <p className="text-headline-6 text-monochrome-950">{university}</p>
          <p className="text-body-large text-monochrome-700">{faculty}</p>
          <p className="text-body-small text-monochrome-600">{major}</p>

          <div className="w-full mt-2">
            {rounds.map((round, index) => (
              <div key={round.name} className="flex justify-start items-center mb-2 mt-2 ml-3 last:mb-0">
                <span className="text-body-large font-medium text-monochrome-700">{round.name}</span>
                <span className="text-body-large text-monochrome-600 ml-1">{round.quota}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute top-4 right-4 flex items-center space-x-2">
          <Image
            src={logo}
            alt={`${university} logo`}
            width={20}
            height={20}
            className="rounded-full"
          />
          <button
            className={clsx("p-2 bg-monochrome-50 rounded-md", "hover:bg-monochrome-100 transition")}
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
    </div>
  );
}
