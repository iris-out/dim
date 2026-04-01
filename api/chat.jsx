import React from 'react';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import fs from 'fs';
import path from 'path';

// 전역 변수에 폰트 캐싱
let cachedFontData = null;

export default async function handler(req, res) {
  try {
    const { skin = 'cocoa', title = '', msg = '' } = req.query;
    let text = msg;

    if (text.toLowerCase().endsWith('.png')) {
      text = text.slice(0, -4);
    }

    // 폰트 로드 (Vercel 서버리스 환경에서 절대 경로 보장)
    if (!cachedFontData) {
      const fontPath = path.resolve(process.cwd(), 'src/font.ttf');
      cachedFontData = fs.readFileSync(fontPath);
    }

    const isDark = skin === 'cocoadark';
    const isDiscord = skin === 'discord';
    let bgColor = isDark ? '#2A2A2A' : '#B2C7D9';
    if (isDiscord) bgColor = '#313338';

    // React.createElement로 변경하여 JSX 의존성 제거
    const markup = React.createElement('div', {
      style: {
        display: 'flex',
        flexDirection: 'column',
        width: '688px',
        minHeight: '160px',
        backgroundColor: bgColor,
        padding: '38px',
        fontFamily: '"Pretendard"',
        justifyContent: 'center',
        alignItems: 'center'
      }
    }, isDiscord ? 
      React.createElement('div', { style: { display: 'flex', flexDirection: 'row', width: '612px', gap: '20px' } }, 
        React.createElement('div', { style: { width: '55px', height: '55px', borderRadius: '50%', backgroundColor: '#5865F2', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontWeight: 'bold', fontSize: '22px' } }, title.charAt(0).toUpperCase() || '?'),
        React.createElement('div', { style: { display: 'flex', flexDirection: 'column', width: '537px' } },
          React.createElement('div', { style: { display: 'flex', gap: '10px', marginBottom: '5px' } },
            React.createElement('span', { style: { color: 'white', fontWeight: 'bold', fontSize: '22px' } }, title || 'User'),
            React.createElement('span', { style: { color: '#949BA4', fontSize: '15px', alignSelf: 'flex-end' } }, 'Today at 12:00 PM')
          ),
          React.createElement('div', { style: { color: '#DBDEE1', fontSize: '22px', lineHeight: '1.5' } }, text)
        )
      ) : 
      React.createElement('div', { style: { display: 'flex', flexDirection: 'row', width: '612px', gap: '15px' } }, 
        React.createElement('div', { style: { width: '65px', height: '65px', borderRadius: '25px', backgroundColor: isDark ? '#393939' : '#E2E6EA' } }),
        React.createElement('div', { style: { display: 'flex', flexDirection: 'column', width: '532px' } },
          title && React.createElement('span', { style: { color: isDark ? '#A4A4A4' : '#4A4A4A', fontSize: '18px', marginBottom: '10px', fontWeight: 'bold', marginLeft: '5px' } }, title),
          React.createElement('div', { style: { backgroundColor: isDark ? '#3C3C3C' : 'white', color: isDark ? 'white' : '#191919', padding: '18px 22px', borderRadius: '25px', borderTopLeftRadius: '5px', fontSize: '21px', lineHeight: '1.5' } }, text)
        )
      )
    );

    const svg = await satori(markup, {
      width: 688,
      fonts: [{ name: 'Pretendard', data: cachedFontData, weight: 700, style: 'normal' }]
    });

    const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 688 } });
    const pngBuffer = resvg.render().asPng();

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    return res.status(200).send(pngBuffer);

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
