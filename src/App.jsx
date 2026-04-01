import React, { useState, useEffect, useRef } from 'react';
import ChatBubble from './components/ChatBubble';

function App() {
  const [params, setParams] = useState({
    skin: 'cocoa',
    title: 'User',
    msg: '성공적으로 실행되었습니다.',
    isPngRequest: false
  });

  const captureRef = useRef(null);
  const path = window.location.pathname;

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    let skin = searchParams.get('skin') || 'cocoa';
    let title = searchParams.get('title') || '';
    let msg = searchParams.get('msg') || '';
    let isPng = false;

    if (msg.toLowerCase().endsWith('.png')) {
      msg = msg.slice(0, -4);
      isPng = true;
    }

    setParams({ skin, title, msg, isPngRequest: isPng });
  }, []);

  const handleDownload = async () => {
    try {
      const url = `/api/chat.png?skin=${params.skin}&title=${encodeURIComponent(params.title)}&msg=${encodeURIComponent(params.msg)}.png`;
      const response = await fetch(url);
      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `chat-${params.skin}.png`;
      link.href = imageUrl;
      link.click();
      URL.revokeObjectURL(imageUrl);
    } catch (err) {
      console.error('Image capture failed:', err);
    }
  };

  // 1. "이미지만 나오게" (Automatic Redirect to API)
  if (params.isPngRequest) {
    const searchParams = new URLSearchParams(window.location.search);
    window.location.href = `/api/chat.png?${searchParams.toString()}`;
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0B] text-zinc-500 font-mono text-xs uppercase tracking-widest animate-pulse">
        Generating Binary Image...
      </div>
    );
  }

  // 2. /chat (Preview Mode)
  if (path === '/chat' || (path === '/' && new URLSearchParams(window.location.search).has('msg'))) {
    return (
      <div className="min-h-screen w-full bg-[#0A0A0B] flex flex-col items-center justify-center p-6 antialiased">
        <div className="bg-[#121214] p-10 md:p-16 rounded-[48px] shadow-2xl flex flex-col items-center max-w-full border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
          <div className="mb-14 overflow-hidden rounded-2xl shadow-[0_30px_60px_-12px_rgba(0,0,0,0.5)]" ref={captureRef}>
            <ChatBubble skin={params.skin} title={params.title} msg={params.msg} />
          </div>

          <button
            onClick={handleDownload}
            className="group px-14 py-6 bg-white text-black font-black rounded-3xl shadow-xl transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-3 text-xl"
          >
            Download PNG
            <svg className="w-6 h-6 transition-transform group-hover:translate-y-0.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
          </button>

          <div className="mt-10 flex gap-6 text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
            <span>Skin: {params.skin}</span>
            <span className="opacity-30">•</span>
            <span>Format: PNG</span>
          </div>
        </div>
        <a href="/" className="mt-12 text-zinc-600 hover:text-zinc-400 text-xs font-bold transition-colors uppercase tracking-widest">← Back to Dashboard</a>
      </div>
    );
  }

  // 3. Main Dashboard (Gallery)
  const variants = [
    { id: 'cocoa', title: '알림봇', msg: '라이트 테마 예시입니다.' },
    { id: 'cocoadark', title: 'Admin', msg: '다크 테마 예시입니다.' },
    { id: 'discord', title: 'System', msg: '게임 IRC 스타일의 깔끔한 말풍선입니다.' }
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-zinc-100 font-sans selection:bg-blue-500/30 overflow-x-hidden">
      {/* Header Section */}
      <header className="max-w-6xl mx-auto pt-48 pb-28 px-10 text-center md:text-left">
        <p className="font-mono text-sm uppercase tracking-[0.6em] text-zinc-600 mb-6 font-bold">DynamicImageMaker</p>
        <h1 className="text-[12rem] md:text-[14rem] font-black tracking-[-0.08em] mb-10 text-white leading-[0.8]">
          DIM<span className="text-blue-600 inline-block animate-pulse">.</span>
        </h1>
        <p className="text-3xl text-zinc-500 max-w-2xl font-bold tracking-tight leading-snug">
          메시지를 이미지로 바꿉니다.<br />
          <span className="text-zinc-400"></span>
        </p>
      </header>

      {/* Gallery Section */}
      <main className="max-w-6xl mx-auto px-10 py-24 grid grid-cols-1 md:grid-cols-3 gap-14">
        {variants.map((v) => (
          <div key={v.id} className="group flex flex-col items-center md:items-stretch animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="mb-6 flex items-center justify-between px-2 w-full">
              <span className="text-xs font-black text-zinc-500 uppercase tracking-[0.4em]">{v.id}</span>
            </div>

            <div className="relative w-full h-[260px] bg-[#121214] rounded-[50px] border border-white/5 flex items-center justify-center overflow-hidden transition-all duration-500 group-hover:border-white/10 group-hover:bg-[#18181B] shadow-2xl">
              <div className="transform scale-[0.52] origin-center pointer-events-none">
                <ChatBubble skin={v.id} title={v.title} msg={v.msg} />
              </div>
            </div>

            <div className="mt-8 flex gap-4 w-full">
              <a
                href={`/chat?skin=${v.id}&title=${encodeURIComponent(v.title)}&msg=${encodeURIComponent(v.msg)}`}
                className="flex-[1.5] text-center text-sm bg-zinc-100 text-black py-5 rounded-[24px] font-black hover:bg-white transition-all active:scale-[0.96]"
              >
                미리보기
              </a>
              <a
                href={`/chat?skin=${v.id}&title=${encodeURIComponent(v.title)}&msg=${encodeURIComponent(v.msg)}.png`}
                className="flex-1 text-center text-[11px] bg-zinc-800 text-zinc-400 py-5 rounded-[24px] font-black hover:bg-zinc-700 transition-all border border-white/5 uppercase tracking-tighter"
              >
                Link Only
              </a>
            </div>
          </div>
        ))}
      </main>

      {/* Guide Section */}
      <section className="max-w-6xl mx-auto px-10 pb-48">
        <div className="bg-[#121214] rounded-[70px] p-16 md:p-24 border border-white/5 relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-96 h-96 bg-blue-500/5 blur-[150px] rounded-full"></div>

          <h3 className="text-4xl font-black mb-16 flex items-center gap-6">
            <span className="w-12 h-1.5 bg-blue-600 rounded-full"></span>
            사용 가이드
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
            <div className="space-y-16">
              <div>
                <h4 className="text-white text-lg font-black mb-6">01. 주소 만들기</h4>
                <p className="text-zinc-400 text-lg leading-relaxed mb-8">
                  주소 뒤에 <code className="text-blue-500 font-mono">.png</code>를 붙이면 웹 페이지가 아닌 <strong className="text-white">순수 이미지 데이터</strong>가 나옵니다. 마크다운이나 외부 봇 연동 시 반드시 붙여주세요.
                </p>
                <div className="bg-black/50 p-6 rounded-3xl border border-white/5">
                  <p className="text-zinc-500 text-xs font-bold mb-3 uppercase tracking-widest text-blue-500">이미지 직통 주소</p>
                  <code className="text-zinc-300 text-sm block break-all font-mono leading-relaxed mb-4">
                    https://dim.vercel.app/api/chat.png?skin=cocoa&title="이름또는제목"&msg=내용.png
                  </code>
                  <p className="text-zinc-500 text-[11px] font-medium leading-relaxed">
                    * skin 파라미터에는 <span className="text-zinc-300">cocoadark, cocoa, discord</span> 중 하나를 선택하세요.
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-white text-lg font-black mb-6">02. 이미지 가져가기</h4>
                <p className="text-zinc-400 text-lg leading-relaxed">
                  나온 이미지를 <strong className="text-white">마우스 오른쪽 클릭</strong>하여 저장하거나, 주소를 복사해서 블로그나 커뮤니티에 붙여넣으세요.
                </p>
              </div>
            </div>

            <div className="flex flex-col bg-blue-600/5 p-12 rounded-[50px] border border-blue-500/10">
              <h4 className="text-blue-500 text-sm font-black uppercase tracking-widest mb-8">AI 챗봇 활용법 (크랙 등)</h4>
              <p className="text-zinc-300 text-md font-bold mb-6">
                AI에게 아래 내용을 복사해서 알려주면, AI가 말풍선 이미지로 답변해줍니다.
              </p>

              <div className="bg-black/60 p-8 rounded-3xl border border-white/10 font-mono text-[11px] leading-relaxed text-zinc-400 select-all cursor-pointer group hover:border-blue-500/30 transition-colors">
                <p className="mb-2 text-zinc-500">// 아래 내용을 채팅창에 복사하세요</p>
                너는 이제부터 답변할 때 아래 마크다운 양식을 사용해서 말풍선 이미지를 먼저 보여줘.<br /><br />
                양식: ![](https://dim.vercel.app/api/chat.png?skin=cocoadark&title=이름or제목&msg=내용.png)<br /><br />
                - skin: cocoa, cocoadark, discord 중 어울리는 것 선택<br />
                - title: 캐릭터 이름을 넣고 싶으면 넣고, 없으면 비워둬.<br />
                - msg 부분에 답변 채팅 내용을 넣어서 출력해. (.png 꼭 붙일 것)
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
