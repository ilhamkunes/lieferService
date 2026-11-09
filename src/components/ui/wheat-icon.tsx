export function WheatIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 120"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path d="M20 10v100" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      {[18, 32, 46, 60, 74, 88].map((y, i) => (
        <g key={y}>
          <ellipse
            cx={20 - 9}
            cy={y}
            rx="7"
            ry="4.2"
            transform={`rotate(-35 ${20 - 9} ${y})`}
            fill="currentColor"
            opacity={0.9 - i * 0.07}
          />
          <ellipse
            cx={20 + 9}
            cy={y + 7}
            rx="7"
            ry="4.2"
            transform={`rotate(35 ${20 + 9} ${y + 7})`}
            fill="currentColor"
            opacity={0.9 - i * 0.07}
          />
        </g>
      ))}
      <path d="M20 4l-4 8 4 4 4-4-4-8z" fill="currentColor" />
    </svg>
  );
}
