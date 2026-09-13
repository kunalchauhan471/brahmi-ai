/**
 * Brahmi AI — Custom Logo
 * A brain formed by two stylized leaves (Brahmi/Bacopa herb, known for memory).
 * Uses the app's primary blue-teal gradient.
 */
export default function BrahmiLogo({ size = 32, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="brahmi-grad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#14b8a6" />
        </linearGradient>
        <linearGradient id="brahmi-leaf-left" x1="8" y1="16" x2="32" y2="56" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
        <linearGradient id="brahmi-leaf-right" x1="56" y1="16" x2="32" y2="56" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#14b8a6" />
          <stop offset="100%" stopColor="#0ea5e9" />
        </linearGradient>
      </defs>

      {/* Left leaf (brain hemisphere) */}
      <path
        d="M32 8 C18 8, 6 18, 6 32 C6 42, 12 50, 20 54 L32 56 L32 8 Z"
        fill="url(#brahmi-leaf-left)"
        opacity="0.9"
      />

      {/* Right leaf (brain hemisphere) */}
      <path
        d="M32 8 C46 8, 58 18, 58 32 C58 42, 52 50, 44 54 L32 56 L32 8 Z"
        fill="url(#brahmi-leaf-right)"
        opacity="0.9"
      />

      {/* Center vein / stem line */}
      <path
        d="M32 12 L32 52"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.6"
      />

      {/* Left brain folds / leaf veins */}
      <path d="M32 20 C24 22, 14 28, 12 34" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.4" />
      <path d="M32 30 C24 32, 16 36, 14 40" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.4" />
      <path d="M32 40 C26 41, 20 44, 18 47" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.4" />

      {/* Right brain folds / leaf veins */}
      <path d="M32 20 C40 22, 50 28, 52 34" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.4" />
      <path d="M32 30 C40 32, 48 36, 50 40" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.4" />
      <path d="M32 40 C38 41, 44 44, 46 47" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.4" />

      {/* Small sparkle / AI dot */}
      <circle cx="32" cy="24" r="3" fill="white" opacity="0.8" />
      <circle cx="32" cy="24" r="1.5" fill="#0ea5e9" />
    </svg>
  )
}
