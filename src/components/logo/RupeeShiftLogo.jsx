export default function RupeeShiftLogo({ size = 40, className = '' }) {
  return (
    <svg
      viewBox="0 0 40 40"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      width={size}
      height={size}
      className={className}
      aria-label="RupeeShift logo"
    >
      <text x="3" y="30" fontFamily="Georgia, serif" fontSize="28" fontWeight="700" fill="#C8702A">₹</text>
      <path d="M26 8 L33 8 L33 15" stroke="#A05520" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M33 8 L24 17" stroke="#A05520" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  );
}
