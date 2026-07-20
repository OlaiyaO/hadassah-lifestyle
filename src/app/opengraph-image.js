import { ImageResponse } from 'next/og';

export const alt = 'Hadassah Lifestyle - Dress well. Live beautifully.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        background: '#320812',
        color: '#f4ecdf',
        display: 'flex',
        height: '100%',
        overflow: 'hidden',
        padding: '64px 72px',
        position: 'relative',
        width: '100%',
      }}
    >
      <div
        style={{
          border: '1px solid rgba(229, 168, 75, 0.35)',
          inset: 28,
          position: 'absolute',
        }}
      />
      <div
        style={{
          alignItems: 'center',
          display: 'flex',
          flex: 1,
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            justifyContent: 'space-between',
            width: 700,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{
                color: '#e5a84b',
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: 5,
                textTransform: 'uppercase',
              }}
            >
              Hadassah Lifestyle
            </span>
            <span style={{ color: '#c8aa9c', fontSize: 20, marginTop: 16 }}>
              Curated in Abuja, for real life
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              fontFamily: 'Georgia, serif',
              fontSize: 84,
              letterSpacing: -4,
              lineHeight: 0.98,
            }}
          >
            <span>Dress well.</span>
            <span style={{ color: '#e5a84b', fontStyle: 'italic' }}>Live beautifully.</span>
          </div>
          <span style={{ color: '#c8aa9c', fontSize: 22 }}>
            Considered fashion and home pieces for Nigerian women.
          </span>
        </div>
        <div
          style={{
            alignItems: 'center',
            background: '#e5a84b',
            borderRadius: 999,
            color: '#320812',
            display: 'flex',
            height: 310,
            justifyContent: 'center',
            width: 310,
          }}
        >
          <svg height="250" viewBox="0 0 100 100" width="250">
            <g fill="#320812">
              <path d="M4 35C6 16 21 3 40 2H57V36H39V19H24C15 20 8 27 4 35Z" />
              <path d="M4 35C8 26 15 20 24 19V67C12 63 4 50 4 35Z" />
              <path d="M70 16C86 21 96 34 96 50C96 58 93 65 89 70C85 74 78 77 70 79V16Z" />
              <path d="M39 49H57V66H70C82 63 91 52 96 39C94 64 77 83 57 87H39V49Z" />
            </g>
          </svg>
        </div>
      </div>
    </div>,
    size,
  );
}
