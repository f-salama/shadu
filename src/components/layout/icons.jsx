// Small set of shared line icons used across the sidebar and quick-link cards.
export const Icon = {
  dashboard: (
    <path d="M4 13h6V4H4v9Zm0 7h6v-5H4v5Zm10 0h6V11h-6v9Zm0-16v5h6V4h-6Z" strokeLinejoin="round" />
  ),
  history: (
    <>
      <path d="M4 4v6h6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4.5 14a8.5 8.5 0 1 0 2.3-6.7L4 10" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 8v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  results: (
    <>
      <path d="M6 3.5h9L19 8v12.5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-16a1 1 0 0 1 1-1Z" strokeLinejoin="round" />
      <path d="M14 3.5V8h5" strokeLinejoin="round" />
      <path d="M8.5 13h7M8.5 16.5h7M8.5 9.5h3" strokeLinecap="round" />
    </>
  ),
  practice: (
    <>
      <path d="M12 3v3.2M12 17.8V21M4.2 12H7M17 12h2.8" strokeLinecap="round" />
      <circle cx="12" cy="12" r="4.5" />
    </>
  ),
  profile: (
    <>
      <circle cx="12" cy="8" r="3.4" />
      <path d="M5 20c1-3.5 4-5.4 7-5.4s6 1.9 7 5.4" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path
        d="M19.4 13.5a1.7 1.7 0 0 0 .34 1.87l.06.06a2.06 2.06 0 1 1-2.92 2.92l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.55V19.7a2.06 2.06 0 1 1-4.12 0v-.09a1.7 1.7 0 0 0-1.1-1.55 1.7 1.7 0 0 0-1.87.34l-.06.06a2.06 2.06 0 1 1-2.92-2.92l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.55-1H4.3a2.06 2.06 0 1 1 0-4.12h.09a1.7 1.7 0 0 0 1.55-1.1 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2.06 2.06 0 1 1 2.92-2.92l.06.06a1.7 1.7 0 0 0 1.87.34H10.5a1.7 1.7 0 0 0 1-1.55V4.3a2.06 2.06 0 1 1 4.12 0v.09a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.87-.34l.06-.06a2.06 2.06 0 1 1 2.92 2.92l-.06.06a1.7 1.7 0 0 0-.34 1.87V10.5a1.7 1.7 0 0 0 1.55 1h.09a2.06 2.06 0 1 1 0 4.12h-.09a1.7 1.7 0 0 0-1.55 1Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
  logout: (
    <>
      <path d="M9 21H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m15 17 5-5-5-5M20 12H9" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  chevron: <path d="m15 6-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />,
  print: (
    <>
      <path d="M6 9V3h12v6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 18H4a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 14h12v7H6z" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  bell: (
    <>
      <path d="M12 3.5c-3 0-5 2.2-5 5.5v3.2L5.5 15h13L17 12.2V9c0-3.3-2-5.5-5-5.5Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 18a2 2 0 0 0 4 0" strokeLinecap="round" />
    </>
  ),
};

export function IconSvg({ name, size = 20, ...rest }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.7" {...rest}>
      {Icon[name]}
    </svg>
  );
}
