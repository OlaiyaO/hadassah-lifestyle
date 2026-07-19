export function BrandMark({ light = false }) {
  const primary = light ? '#f4ecdf' : '#5b1423';
  const accent = '#e5a84b';

  return (
    <span className="brand-mark" aria-label="Hadassah Lifestyle">
      <svg viewBox="0 0 64 64" role="img" aria-hidden="true">
        <path d="M12 9v46M52 9v46M12 32h40" fill="none" stroke={accent} strokeWidth="5" />
        <path
          d="M22 9c14 5 14 41 0 46M42 9c-14 5-14 41 0 46"
          fill="none"
          stroke={primary}
          strokeWidth="2.5"
        />
      </svg>
      <span className="brand-mark__type">
        <strong>Hadassah</strong>
        <small>Lifestyle</small>
      </span>
    </span>
  );
}
