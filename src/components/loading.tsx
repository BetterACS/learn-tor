'use client';

export function LoadingCircle () {
  return <div className="h-full w-full flex justify-center items-center">
    <svg className="animate-spin size-10 -ml-1 mr-3 text-monochrome-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  </div>
}

export function ErrorLoading() {
  return <div>Error loading topic</div>;
}

export function MockupTopicLoadingCard() {
  return (
    <div
    className="h-fit w-full bg-monochrome-50 drop-shadow-[0_0_6px_rgba(0,0,0,0.1)] rounded-xl text-start pt-6 pb-3 px-8"
    >
      <div className="h-full w-full flex flex-col gap-3 animate-pulse">
        {/* Username Section */}
        <div className="flex content-center items-center gap-2">
          <div className="size-10">
            <div className="w-full h-full bg-monochrome-100 rounded-full"/>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-body-large text-transparent bg-monochrome-100 rounded-md w-fit">
              Username
            </p>
            <p className="text-subtitle-small text-transparent bg-monochrome-100 rounded-md w-fit">
              second agooooo
            </p>
          </div>
        </div>
        {/* Body */}
        <div className="flex flex-col gap-2">
          <p className="text-headline-5 text-transparent bg-monochrome-100 rounded-md">
            Lorem ipsum dolor sit amet
          </p>
          <p className='w-fit text-body-large text-transparent bg-monochrome-100 rounded-md'>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus magni doloremque
          </p>
          <p className='w-fit text-body-large text-transparent bg-monochrome-100 rounded-md'>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </p>
        </div>
        <div className="h-[25rem] w-full pb-4">
          <div className="w-full h-full object-cover bg-monochrome-100 rounded-md"/>
        </div>
      </div>
    </div>
  );
}