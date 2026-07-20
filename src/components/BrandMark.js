export function BrandSymbol({
  color = 'currentColor',
  className,
  decorative = false,
  dimensional = false,
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : 'Hadassah interlocking H symbol'}
      aria-hidden={decorative || undefined}
    >
      {dimensional && (
        <defs>
          <linearGradient id="hadassah-gold-top" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f0c15c" />
            <stop offset="0.5" stopColor="#c88a16" />
            <stop offset="1" stopColor="#a96505" />
          </linearGradient>
          <linearGradient id="hadassah-gold-side" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#b46f05" />
            <stop offset="1" stopColor="#e9b94f" />
          </linearGradient>
          <linearGradient id="hadassah-gold-base" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#aa6704" />
            <stop offset="0.55" stopColor="#c98712" />
            <stop offset="1" stopColor="#edbd54" />
          </linearGradient>
          <filter id="hadassah-symbol-shadow" x="-20%" y="-20%" width="145%" height="150%">
            <feDropShadow
              dx="1.5"
              dy="2.5"
              stdDeviation="2"
              floodColor="#2c0911"
              floodOpacity="0.2"
            />
          </filter>
        </defs>
      )}
      <g filter={dimensional ? 'url(#hadassah-symbol-shadow)' : undefined}>
        <path
          d="M4 35C6 16 21 3 40 2H57V36H39V19H24C15 20 8 27 4 35Z"
          fill={dimensional ? 'url(#hadassah-gold-top)' : color}
          stroke={dimensional ? '#f2c866' : color}
          strokeWidth={dimensional ? 1.2 : 0}
          strokeLinejoin="round"
        />
        <path
          d="M4 35C8 26 15 20 24 19V67C12 63 4 50 4 35Z"
          fill={dimensional ? 'url(#hadassah-gold-side)' : color}
          stroke={dimensional ? '#e8b64c' : color}
          strokeWidth={dimensional ? 1.2 : 0}
          strokeLinejoin="round"
        />
        <path
          d="M70 16C86 21 96 34 96 50C96 58 93 65 89 70C85 74 78 77 70 79V16Z"
          fill={dimensional ? 'url(#hadassah-gold-side)' : color}
          stroke={dimensional ? '#f2c866' : color}
          strokeWidth={dimensional ? 1.2 : 0}
          strokeLinejoin="round"
        />
        <path
          d="M39 49H57V66H70C82 63 91 52 96 39C94 64 77 83 57 87H39V49Z"
          fill={dimensional ? 'url(#hadassah-gold-base)' : color}
          stroke={dimensional ? '#f2c866' : color}
          strokeWidth={dimensional ? 1.2 : 0}
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

export function BrandMark({ light = false, dimensional = false, className = '' }) {
  const wordmark = light ? '#f4ecdf' : '#5b1423';
  const classes = ['brand-mark', dimensional && 'brand-mark--dimensional', className]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={classes} aria-label="Hadassah Lifestyle" style={{ color: wordmark }}>
      <BrandSymbol color="#c98b18" dimensional={dimensional} decorative />
      <span className="brand-mark__type" aria-hidden="true">
        <strong>Hadassah</strong>
        <small>Lifestyle</small>
      </span>
    </span>
  );
}
