'use client';

import { Button } from '@/components/index';
import { useRef, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface SharePopupProps {
  topicId: string
  shareState: boolean;
  setShareState: (shareState: boolean) => void;
}

export default function SharePopup ({ topicId, shareState, setShareState }: SharePopupProps) {
  const PopupRef = useRef<HTMLDivElement>(null);

  const [fullUrl, setFullUrl] = useState("");
  const [copyText, setCopyText] = useState("Copy");

  useEffect(() => {
    if (typeof window !== "undefined" && topicId) {
      const url = `${window.location.origin}/forum/${topicId}`;
      setFullUrl(url);
    }
  }, [topicId]);

  const copyToClipboard = async () => {
    if (fullUrl) await navigator.clipboard.writeText(fullUrl);
    setCopyText('Copied')
    setTimeout(() => setCopyText('Copy'), 2000);
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    }
  }, []);

  const handleClickOutside = (event: MouseEvent) => {
    if (PopupRef.current && !PopupRef.current.contains(event.target as Node)) {
      setShareState(false);
    }
  };

  return (
    <div className={`fixed top-0 left-0 w-screen h-screen z-50 backdrop-filter backdrop-brightness-90 backdrop-blur-[2px] flex justify-center items-center ${shareState ? 'visible opacity-100' : 'invisible opacity-0'} transition-all duration-100`}>
      <div ref={PopupRef} className={`w-[40vw] maxlg:md:w-[70vw] maxmd:w-[90vw] bg-monochrome-50 rounded-lg drop-shadow-xl ${shareState ? 'scale-100' : 'scale-90'} transition-transform duration-100`}>
        <div className="flex flex-col gap-4 py-10 px-10">
          <p className="text-body-large py-3 border border-monochrome-200 rounded-lg overflow-y-auto">{fullUrl}</p>
          <div className="flex justify-between">
            <Button 
              button_name={copyText}
              variant='secondary'
              onClick={copyToClipboard}
              pending={copyText !== 'Copy'}
            />
            <Button 
              button_name='Done'
              variant='primary'
              onClick={() => setShareState(false)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}