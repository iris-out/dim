import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import React from 'react';
import fs from 'fs';
import path from 'path';

// 폰트 캐싱용 전역 변수
let cachedFontData = null;

// 로컬용 이미지 생성 미들웨어 (Vercel API 시뮬레이션)
const imageApiPlugin = () => ({
  name: 'local-image-api',
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      if (req.url.startsWith('/api/chat')) {
        try {
          const url = new URL(req.url, `http://${req.headers.host}`);
          const skin = url.searchParams.get('skin') || 'cocoa';
          let title = url.searchParams.get('title') || '';
          let msg = url.searchParams.get('msg') || '';

          if (msg.toLowerCase().endsWith('.png')) msg = msg.slice(0, -4);

          // 폰트 로드 (캐싱 로직 적용)
          if (!cachedFontData) {
            const fontPath = path.resolve(process.cwd(), 'src/font.ttf');
            cachedFontData = fs.readFileSync(fontPath);
          }

          const isDark = skin === 'cocoadark';
          const isDiscord = skin === 'discord';
          const bgColor = isDiscord ? '#313338' : (isDark ? '#2A2A2A' : '#B2C7D9');

          // Satori용 엘리먼트 (688px 최적화)
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
                React.createElement('div', { style: { color: '#DBDEE1', fontSize: '22px', lineHeight: '1.5' } }, msg)
              )
            ) : 
            React.createElement('div', { style: { display: 'flex', flexDirection: 'row', width: '612px', gap: '15px' } }, 
              React.createElement('div', { style: { width: '65px', height: '65px', borderRadius: '25px', backgroundColor: isDark ? '#393939' : '#E2E6EA' } }),
              React.createElement('div', { style: { display: 'flex', flexDirection: 'column', width: '532px' } },
                title && React.createElement('span', { style: { color: isDark ? '#A4A4A4' : '#4A4A4A', fontSize: '18px', marginBottom: '10px', fontWeight: 'bold', marginLeft: '5px' } }, title),
                React.createElement('div', { style: { backgroundColor: isDark ? '#3C3C3C' : 'white', color: isDark ? 'white' : '#191919', padding: '18px 22px', borderRadius: '25px', borderTopLeftRadius: '5px', fontSize: '21px', lineHeight: '1.5' } }, msg)
              )
            )
          );

          const svg = await satori(markup, {
            width: 688,
            fonts: [{ name: 'Pretendard', data: cachedFontData, weight: 700, style: 'normal' }]
          });

          const pngData = new Resvg(svg, { fitTo: { mode: 'width', value: 688 } }).render();
          
          res.setHeader('Content-Type', 'image/png');
          res.end(pngData.asPng());
          return;
        } catch (e) {
          res.statusCode = 500;
          res.end(e.message);
          return;
        }
      }
      next();
    });
  }
});

export default defineConfig({
  plugins: [react(), imageApiPlugin()],
});
