'use client';

import Button from '@/components/button';
import { useRouter } from 'next/navigation';

const NotFound = () => {
  const router = useRouter();
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-black xl:flex items-center justify-center hidden">
        <div className="mx-10 pl-20 flex flex-col gap-4">
          <div className="font-bold text-5xl">Oops...</div>
          <div className="font-medium text-6xl">Page not found</div>
          <div className="font-normal text-3xl">
            ...maybe the page you’re looking for is not found or never existed.
          </div>
          <div>
            <Button
              label="Go back"
              onClick={() => router.back()}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
