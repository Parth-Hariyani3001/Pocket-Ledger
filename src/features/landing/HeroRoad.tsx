const centerline =
  "M1240 -180C1200 -20 1019 135 942 299C921 345 915 398 925 449C935 499 962 545 1000 579C1039 614 1088 635 1139 639C1358 658 1480 820 1760 900"

export default function HeroRoad() {
  return (
    <svg
      className="site-road"
      viewBox="0 0 1440 780"
      preserveAspectRatio="xMaxYMin slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="site-road-glint"
          gradientUnits="userSpaceOnUse"
          x1="900"
          y1="-80"
          x2="1560"
          y2="720"
        >
          <stop offset="0" stopColor="#f7fcff" stopOpacity="0" />
          <stop offset="0.14" stopColor="#f7fcff" stopOpacity="0" />
          <stop offset="0.2" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="0.27" stopColor="#d7e9f4" stopOpacity="0" />
          <stop offset="0.46" stopColor="#f7fcff" stopOpacity="0" />
          <stop offset="0.54" stopColor="#ffffff" stopOpacity="0.35" />
          <stop offset="0.62" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="0.7" stopColor="#d7e9f4" stopOpacity="0" />
          <stop offset="1" stopColor="#f7fcff" stopOpacity="0" />
        </linearGradient>
        <filter
          id="site-road-shadow-blur"
          x="-35%"
          y="-35%"
          width="170%"
          height="170%"
        >
          <feGaussianBlur stdDeviation="12" />
        </filter>
        <filter
          id="site-road-sheen-blur"
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
        >
          <feGaussianBlur stdDeviation="3.5" />
        </filter>
        <mask id="site-road-reveal" maskUnits="userSpaceOnUse">
          <path
            className="site-road-reveal"
            pathLength={1}
            d={centerline}
            fill="none"
          />
        </mask>
      </defs>
      <g mask="url(#site-road-reveal)">
        <path
          className="site-road-shadow"
          d={centerline}
          transform="translate(16 30)"
        />
        <path className="site-road-curb" d={centerline} />
        <path className="site-road-edge" d={centerline} />
        <path className="site-road-asphalt" d={centerline} />
        <path className="site-road-crown" d={centerline} />
        <g transform="translate(-12 -10)">
          <path className="site-road-sheen" d={centerline} />
          <path className="site-road-lane-reflect" d={centerline} />
          <path className="site-road-glint" d={centerline} />
        </g>
        <path className="site-road-lane" d={centerline} />
      </g>
    </svg>
  )
}
