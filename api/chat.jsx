import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import fs from 'fs';
import path from 'path';

// 전역 변수에 폰트 캐싱 (서버리스 웜 스타트 시 속도 향상)
let cachedFontData = null;

// Vercel Serverless Function (Node.js)
export default async function handler(req, res) {
  try {
    const { skin = 'cocoa', title = '', msg = '' } = req.query;
    let text = msg;

    // .png 접미사 감지 시 제거 (요청사항)
    if (text.toLowerCase().endsWith('.png')) {
      text = text.slice(0, -4);
    }

    // 폰트 데이터 로드 (캐싱 로직)
    if (!cachedFontData) {
      const fontPath = path.resolve(process.cwd(), 'src/font.ttf');
      cachedFontData = fs.readFileSync(fontPath);
    }

    // 테마별 색상 설정
    const isDark = skin === 'cocoadark';
    const isDiscord = skin === 'discord';

    let bgColor = isDark ? '#2A2A2A' : '#B2C7D9';
    if (isDiscord) bgColor = '#313338';

    // Satori 전용 인라인 스타일 (flexbox 중심) - 688px 최적화
    const markup = (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        width: '688px', // 550px * 1.25
        minHeight: '160px',
        backgroundColor: bgColor,
        padding: '38px',
        fontFamily: '"Pretendard"',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        {isDiscord ? (
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', width: '612px', gap: '20px' }}>
            <div style={{
              display: 'flex',
              width: '55px',
              height: '55px',
              borderRadius: '50%',
              backgroundColor: '#5865F2',
              justifyContent: 'center',
              alignItems: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '22px'
            }}>
              {title ? title.charAt(0).toUpperCase() : '?'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', width: '537px' }}>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline', gap: '10px', marginBottom: '5px' }}>
                <span style={{ color: '#FFFFFF', fontSize: '22px', fontWeight: 'bold' }}>{title || 'User'}</span>
                <span style={{ color: '#949BA4', fontSize: '15px' }}>Today at 12:00 PM</span>
              </div>
              <div style={{ color: '#DBDEE1', fontSize: '22px', lineHeight: '1.5' }}>{text}</div>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', width: '612px', gap: '15px' }}>
             <div style={{
                display: 'flex',
                width: '65px',
                height: '65px',
                borderRadius: '25px',
                backgroundColor: isDark ? '#393939' : '#E2E6EA'
             }} />
             <div style={{ display: 'flex', flexDirection: 'column', width: '532px' }}>
               {title && <span style={{ color: isDark ? '#A4A4A4' : '#4A4A4A', fontSize: '18px', marginBottom: '10px', marginLeft: '5px', fontWeight: 'bold' }}>{title}</span>}
               <div style={{
                 display: 'flex',
                 backgroundColor: isDark ? '#3C3C3C' : '#FFFFFF',
                 color: isDark ? '#FFFFFF' : '#191919',
                 padding: '18px 22px',
                 borderRadius: '25px',
                 borderTopLeftRadius: '5px',
                 fontSize: '21px',
                 lineHeight: '1.5'
               }}>
                 {text}
               </div>
             </div>
          </div>
        )}
      </div>
    );

    // SVG 렌더링 (Satori)
    const svg = await satori(markup, {
      width: 688,
      fonts: [
        {
          name: 'Pretendard',
          data: cachedFontData,
          weight: 700,
          style: 'normal',
        },
      ],
    });

    // PNG 변환 최적화 (Resvg)
    const resvg = new Resvg(svg, {
      background: 'transparent',
      fitTo: { mode: 'width', value: 688 },
      shapeRendering: 2, // 2 = OptimizeSpeed
      imageRendering: 0, // 0 = OptimizeQuality (PNG는 품질 유지 권장, 속도 차이 미미)
      textRendering: 1,  // 1 = OptimizeLegibility
      font: {
        loadSystemFonts: false, // 시스템 폰트 로드 안 함 (속도 향상 핵심)
      }
    });

    const pngData = resvg.render();
    const pngBuffer = pngData.asPng();

    // 바이너리 데이터 응답 및 캐싱 정책 강화
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    return res.status(200).send(pngBuffer);

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
