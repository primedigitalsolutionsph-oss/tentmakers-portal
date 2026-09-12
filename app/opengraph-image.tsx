import { ImageResponse } from 'next/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background: '#0B1426',
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ fontSize: 28, color: '#E8A020', letterSpacing: 4, fontWeight: 700 }}>
          TENTMAKERS ECOSYSTEM
        </div>
        <div style={{ fontSize: 68, fontWeight: 800, lineHeight: 1.05, marginTop: 24 }}>
          Members into operators.
        </div>
        <div style={{ fontSize: 28, opacity: 0.7, marginTop: 20 }}>
          Five portfolio companies · One training hub · 4.67M market on Panay Island
        </div>
      </div>
    ),
    { ...size }
  );
}
