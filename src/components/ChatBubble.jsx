import React from 'react';

/**
 * ChatBubble Component (Vanilla JS version)
 * Skins: 'cocoa', 'cocoadark', 'discord'
 */
const ChatBubble = ({ skin = 'cocoa', title, msg }) => {
  // 1. 카카오톡 라이트 모드 (cocoa)
  if (skin === 'cocoa') {
    return (
      <div className="flex flex-col w-[688px] font-sans bg-[#B2C7D9] p-8 rounded-xl shadow-sm h-full justify-center antialiased">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-[22px] bg-[#E2E6EA] flex-shrink-0 flex items-center justify-center overflow-hidden shadow-sm">
            <svg className="w-10 h-10 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
          <div className="flex flex-col max-w-[calc(100%-5rem)]">
            {title && <span className="text-[#4A4A4A] text-[16px] mb-2 pl-1 font-semibold">{title}</span>}
            <div className="relative bg-[#FFFFFF] text-[#191919] p-4 px-6 rounded-[24px] rounded-tl-sm text-[18px] leading-relaxed shadow-sm whitespace-pre-wrap break-words">
              {msg}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. 카카오톡 다크 모드 (cocoadark)
  if (skin === 'cocoadark') {
    return (
      <div className="flex flex-col w-[688px] font-sans bg-[#2A2A2A] p-8 rounded-xl shadow-sm h-full justify-center antialiased">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-[22px] bg-[#393939] flex-shrink-0 flex items-center justify-center overflow-hidden shadow-sm">
            <svg className="w-10 h-10 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
          <div className="flex flex-col max-w-[calc(100%-5rem)]">
            {title && <span className="text-[#A4A4A4] text-[16px] mb-2 pl-1 font-semibold">{title}</span>}
            <div className="relative bg-[#3C3C3C] text-[#FFFFFF] p-4 px-6 rounded-[24px] rounded-tl-sm text-[18px] leading-relaxed shadow-sm whitespace-pre-wrap break-words">
              {msg}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. 디스코드 (discord) - BOT/APP 뱃지 제거 버전
  if (skin === 'discord') {
    return (
      <div className="flex flex-col w-[688px] font-sans bg-[#313338] p-6 py-8 rounded-xl h-full justify-center antialiased">
        <div className="flex items-start gap-5">
          <div className="w-12 h-12 rounded-full bg-[#5865F2] flex-shrink-0 flex items-center justify-center overflow-hidden mt-0.5 shadow-md">
             <span className="text-white text-[20px] font-bold">
               {title ? title.charAt(0).toUpperCase() : '?'}
             </span>
          </div>
          <div className="flex flex-col w-full">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-[#FFFFFF] text-[19px] font-bold tracking-tight">
                {title || 'User'}
              </span>
              <span className="text-[#949BA4] text-[14px] ml-1 opacity-80">방금</span>
            </div>
            <div className="text-[#DBDEE1] text-[19px] leading-[1.6] whitespace-pre-wrap break-words">
              {msg}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default ChatBubble;
