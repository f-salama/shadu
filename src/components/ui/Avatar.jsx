import { avatarOptions } from '../../data/mockData';
import './Avatar.css';

const ICON_PATHS = {
  wave: (
    <path d="M3 12c1.5-3 3-3 4.5 0s3 3 4.5 0 3-3 4.5 0 3 3 4.5 0" strokeLinecap="round" strokeLinejoin="round" />
  ),
  leaf: (
    <path
      d="M6 18c-2-4-1-10 5-13 6-3 10 1 10 1s-1 7-6 10c-3.5 2-7 3-9 2Z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  star: (
    <path
      d="M12 3.5 14.2 9l5.8.4-4.5 3.8 1.5 5.7L12 15.9 6.9 18.9l1.5-5.7-4.5-3.8L9.7 9Z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  drop: <path d="M12 3s6 6.5 6 11a6 6 0 1 1-12 0c0-4.5 6-11 6-11Z" strokeLinecap="round" strokeLinejoin="round" />,
  moon: <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z" strokeLinecap="round" strokeLinejoin="round" />,
  mountain: (
    <path
      d="m3 18 6-9 4 5.5L16 10l5 8H3Z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
};

export default function Avatar({ avatarId, size = 48, className = '' }) {
  const option = avatarOptions.find((a) => a.id === avatarId) || avatarOptions[0];
  const icon = ICON_PATHS[option.id] || ICON_PATHS.wave;

  return (
    <span
      className={`avatar-circle ${className}`}
      style={{ width: size, height: size, background: option.bg, color: option.fg }}
      role="img"
      aria-label={option.label}
    >
      <svg viewBox="0 0 24 24" width={size * 0.55} height={size * 0.55} fill="none" stroke="currentColor" strokeWidth="1.6">
        {icon}
      </svg>
    </span>
  );
}
