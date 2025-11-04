'use client';

export default function SplashScreen() {
  return (
    <div className="splash-screen">
      <svg
        className="splash-logo w-24 h-24"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M3.204 7.915l8.792 4.213 8.796-4.213L12 3.702 3.204 7.915z"
        />
        <path
          d="M2.5 9v6l9.5 4.5 9.5-4.5V9l-9.5 4.5L2.5 9z"
        />
         <path d="M18 9.5V13" />
        <path d="M21 11.5c0-1.18-.3-2.26-.8-3.22" />
        <path d="M19.5 13.5c-0.61 1.26-1.89 2-3.5 2s-2.89-0.74-3.5-2" />
      </svg>
    </div>
  );
}
