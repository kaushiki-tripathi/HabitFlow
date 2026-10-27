function WaveTransition() {
  return (
    <div
      className="relative -mt-px h-20 overflow-hidden bg-[#2C261F] sm:h-28"
      aria-hidden="true"
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 -2H1440V103C1360 96 1320 82 1240 79C1160 76 1100 91 1030 95C950 99 895 83 825 82C740 81 680 113 600 116C520 119 455 96 380 91C290 85 235 93 165 76C100 60 52 43 0 32V-2Z"
          fill="#f7e8c5"
        />
      </svg>
    </div>
  );
}

export function WaveTransitionWhite() {
  return (
    <div
      className="relative -mt-px h-20 overflow-hidden bg-[#f7e8c5] sm:h-28"
      aria-hidden="true"
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 -2H1440V75C1300 67 1240 48 1100 52C940 57 900 98 730 101C560 104 500 67 360 68C220 69 160 96 0 82V-2Z"
          fill="#2C261F"
        />
      </svg>
    </div>
  );
}


export default WaveTransition;
