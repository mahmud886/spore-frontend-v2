"use client";

export default function SectionTitleSeparator({ className = "" }) {
  // Use a static ID since this is a client-only component
  // This avoids hydration mismatches from useId() differences
  const gradientId0 = "paint0_linear";
  const gradientId1 = "paint1_linear";

  return (
    <svg
      width="10"
      height="50"
      viewBox="0 0 10 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M0 3.75C0 1.67893 1.67893 0 3.75 0V0V46.25C3.75 48.3211 2.07107 50 0 50V50V3.75Z"
        fill={`url(#${gradientId0})`}
      />
      <path
        d="M10 3.75C10 1.67893 8.32107 0 6.25 0V0V46.25C6.25 48.3211 7.92893 50 10 50V50V3.75Z"
        fill={`url(#${gradientId1})`}
      />
      <defs>
        <linearGradient id={gradientId0} x1="5.03744" y1="25" x2="6.0051e-07" y2="25" gradientUnits="userSpaceOnUse">
          <stop stopColor="white" />
          <stop offset="1" stopColor="#C2FF01" />
        </linearGradient>
        <linearGradient id={gradientId1} x1="4.96256" y1="25" x2="10" y2="25" gradientUnits="userSpaceOnUse">
          <stop stopColor="white" />
          <stop offset="1" stopColor="#C2FF01" />
        </linearGradient>
      </defs>
    </svg>
  );
}
