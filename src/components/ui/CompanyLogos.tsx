import { useState, useEffect } from 'react';

interface Company {
  name: string;
  problem: string;
  icon: string;
}

const COMPANIES: Company[] = [
  {
    name: 'Spotify',
    problem: 'Design a feature to help users discover new music based on mood',
    icon: 'M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm3.75 14.65c-2.35-1.45-5.3-1.75-8.8-.95-.35.1-.65-.15-.75-.45-.1-.35.15-.65.45-.75 3.8-.85 7.1-.5 9.7 1.1.35.15.4.55.25.85-.2.3-.55.4-.85.2zm1-2.7c-2.7-1.6-6.8-2.15-9.95-1.15-.4.1-.85-.1-.95-.5-.1-.4.1-.85.5-.95 3.65-1.1 8.15-.55 11.25 1.35.3.15.45.65.2 1-.2.35-.7.5-1.05.25zm.1-2.8C13.8 9 8.55 8.8 5.2 9.75c-.5.15-1-.15-1.15-.6-.15-.5.15-1 .6-1.15 3.9-1.05 9.7-.85 13.6 1.35.45.25.6.85.35 1.3-.25.35-.85.5-1.3.25z',
  },
  {
    name: 'Netflix',
    problem: 'How would you improve content recommendations for family accounts?',
    icon: 'M4 2h16v20H4V2zm2 2v16h12V4H6zm2 2h8v2H8V6zm0 4h8v2H8v-2zm0 4h8v2H8v-2z',
  },
  {
    name: 'Google',
    problem: 'Design a new feature to reduce carbon footprint in daily commutes',
    icon: 'M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z',
  },
  {
    name: 'Facebook',
    problem: 'How would you design a feature to combat misinformation on Facebook?',
    icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-.29.02-.58.05-.86 2.36-1.05 4.23-2.98 5.21-5.37C11.07 8.33 14.05 10 17.42 10c.78 0 1.53-.09 2.25-.26.21.71.33 1.47.33 2.26 0 4.41-3.59 8-8 8z',
  },
  {
    name: 'YouTube',
    problem: 'How would you improve video discovery for educational content?',
    icon: 'M21.58 7.19c-.23-.86-.91-1.54-1.77-1.77C18.25 5 12 5 12 5s-6.25 0-7.81.42c-.86.23-1.54.91-1.77 1.77C2 8.75 2 12 2 12s0 3.25.42 4.81c.23.86.91 1.54 1.77 1.77C5.75 19 12 19 12 19s6.25 0 7.81-.42c.86-.23 1.54-.91 1.77-1.77C22 15.25 22 12 22 12s0-3.25-.42-4.81zM10 15V9l5.2 3-5.2 3z',
  },
  {
    name: 'Amazon',
    problem: 'How would you improve the search experience for first-time shoppers?',
    icon: 'M13.08 15.86c-3.25.42-6.16-.85-8.65-3.79-.09-.1-.19-.1-.29 0-.1.1-.1.19 0 .29 2.78 3.25 6.07 4.69 9.87 4.32 1.22-.12 2.37-.47 3.45-1.06.13-.07.16-.21.09-.34-.07-.13-.21-.16-.34-.09-.99.53-2.05.84-3.13.95zm1.17-1.45c-.13 0-.24.11-.24.24 0 .13.11.24.24.24 2.24 0 4.31-.93 5.8-2.59.07-.08.07-.19 0-.27-.08-.07-.19-.07-.27 0-1.42 1.58-3.39 2.38-5.53 2.38zm-2.61-10.3c-.35.13-.71.21-1.08.21-.37 0-.73-.08-1.08-.21C8.13 3.88 7 4.77 7 6v8c0 .55.45 1 1 1h8c.55 0 1-.45 1-1V6c0-1.23-1.13-2.12-2.48-1.89z',
  },
  {
    name: 'Airbnb',
    problem: 'Design a feature to build trust between hosts and first-time guests',
    icon: 'M12 2c-1.1 0-2 .9-2 2v2H7c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-3V4c0-1.1-.9-2-2-2zm0 2h.01L12 6h-.01V4H12zm5 4v12H7V8h10zm-9 2v2h8v-2H8zm0 4v2h8v-2H8z',
  },
  {
    name: 'WhatsApp',
    problem: 'How would you reduce spam messages without impacting legitimate users?',
    icon: 'M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0012.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 012.41 5.83c0 4.54-3.7 8.23-8.24 8.23-1.48 0-2.93-.39-4.19-1.15l-.3-.17-3.12.82.83-3.04-.2-.32a8.188 8.188 0 01-1.26-4.38c.01-4.54 3.7-8.24 8.25-8.24M8.53 7.33c-.18 0-.48.06-.73.31-.25.26-.98.96-.98 2.33 0 1.37.99 2.7 1.13 2.89.14.18 1.93 3.06 4.7 4.21 2.77 1.15 2.78.77 3.28.72.5-.05 1.61-.66 1.84-1.3.23-.63.23-1.18.16-1.30-.07-.12-.25-.19-.52-.33-.28-.14-1.61-.79-1.86-.88-.25-.09-.43-.14-.61.14-.18.28-.7.88-.86 1.06-.16.18-.32.21-.59.07-.28-.14-1.17-.43-2.23-1.37-.82-.73-1.37-1.63-1.53-1.91-.16-.28-.02-.43.12-.57.13-.13.28-.33.42-.5.14-.16.19-.28.28-.46.09-.18.05-.33-.02-.46-.07-.14-.62-1.5-.85-2.05-.23-.55-.46-.48-.62-.48-.16 0-.35-.01-.53-.01z',
  },
  {
    name: 'Uber',
    problem: 'Design a feature to improve safety for solo night-time riders',
    icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z',
  },
  {
    name: 'Slack',
    problem: 'How would you reduce notification fatigue for team communication?',
    icon: 'M6 15c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-4c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 12c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-4c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z',
  },
  {
    name: 'Zoom',
    problem: 'Design a feature to improve engagement in large virtual meetings',
    icon: 'M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4zM14 13h-3v3H9v-3H6v-2h3V8h2v3h3v2z',
  },
  {
    name: 'Swiggy',
    problem: 'How would you reduce food delivery time during peak hours?',
    icon: 'M12 2L4 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-8-5zm0 10c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z',
  },
  {
    name: 'Blinkit',
    problem: 'Design a feature to optimize 10-minute grocery delivery routes',
    icon: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm0 13c-2.03 0-4.43-.82-6.14-2.88C7.55 14.8 9.68 14 12 14s4.45.8 6.14 2.12C16.43 18.18 14.03 19 12 19z',
  },
  {
    name: 'Flipkart',
    problem: 'How would you improve product discovery for tier-2 city users?',
    icon: 'M3 3h18v18H3V3zm2 2v14h14V5H5zm2 2h10v2H7V7zm0 4h10v2H7v-2zm0 4h7v2H7v-2z',
  },
  {
    name: 'PhonePe',
    problem: 'Design a feature to increase UPI payment adoption among seniors',
    icon: 'M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h16v12zm-9-6c0-1.66 1.34-3 3-3s3 1.34 3 3-1.34 3-3 3-3-1.34-3-3zM6 9h3v1.5H6V9zm0 2.5h3V13H6v-1.5z',
  },
  {
    name: 'Substack',
    problem: 'How would you help writers grow their subscriber base organically?',
    icon: 'M3 3h18v3H3V3zm0 5h18v3H3V8zm0 5h18v3H3v-3zm0 5h18v3H3v-3z',
  },
  {
    name: 'Booking',
    problem: 'Design a feature to help users plan multi-city trips with optimal routing',
    icon: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
  },
  {
    name: 'Doordash',
    problem: 'Design a feature to help restaurants manage peak delivery demand',
    icon: 'M18.06 23h1.66c.84 0 1.53-.65 1.63-1.47L23 5.05h-5V1h-1.97v4.05h-4.97l.3 2.34c1.71.47 3.31 1.32 4.27 2.26 1.44 1.42 2.43 2.89 2.43 5.29v8.05zM1 22v-1h15.03v1H1zm15.03-7.32c0-2.8-2.6-4.27-5.03-4.27s-5.03 1.47-5.03 4.27V22H16.03v-7.32z',
  },
  {
    name: 'Notion',
    problem: 'How would you increase collaboration features for remote teams?',
    icon: 'M4 2h16c1.1 0 2 .9 2 2v16c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2zm2 3v14h12V5H6zm2 2h8v2H8V7zm0 4h8v2H8v-2zm0 4h5v2H8v-2z',
  },
  {
    name: 'Gemini',
    problem: 'Design a feature to make AI responses more personalized and context-aware',
    icon: 'M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 18c-4 0-7-3-7-7s3-7 7-7 7 3 7 7-3 7-7 7zm-1-11h2v6h-2zm0 8h2v2h-2z',
  },
];

export function CompanyLogos() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [itemsToShow, setItemsToShow] = useState(20);
  
  const hoveredCompany =
    hoveredIndex !== null ? COMPANIES[hoveredIndex] : null;

  useEffect(() => {
    const updateItemCount = () => {
      const width = window.innerWidth;
      if (width < 640) {
        // Mobile: 3 columns × 4 rows = 12 items
        setItemsToShow(12);
      } else if (width < 768) {
        // Small tablet: 4 columns × 4 rows = 16 items
        setItemsToShow(16);
      } else {
        // Desktop: 5 columns × 4 rows = 20 items (all)
        setItemsToShow(20);
      }
    };

    updateItemCount();
    window.addEventListener('resize', updateItemCount);
    return () => window.removeEventListener('resize', updateItemCount);
  }, []);

  const handleTouch = (index: number) => {
    setHoveredIndex(hoveredIndex === index ? null : index);
  };

  const displayedCompanies = COMPANIES.slice(0, itemsToShow);

  return (
    <div className="relative flex flex-col items-center justify-center gap-6">
      {/* Problem Statement Display Area */}
      <div className="w-full min-h-[80px] md:min-h-[100px] flex items-center justify-center px-4">
        {hoveredCompany && (
          <div className="text-center animate-in fade-in slide-in-from-bottom-2 duration-200">
            <p className="text-xs md:text-sm text-gray-300 leading-relaxed max-w-2xl">
              {hoveredCompany.problem}
            </p>
          </div>
        )}
      </div>

      {/* Company Logos Grid - Responsive rows */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-5 sm:gap-6 md:gap-8 p-6 sm:p-8 md:p-10 bg-white/5 border border-white/10 rounded-lg backdrop-blur-sm max-w-5xl w-full mx-4">
        {displayedCompanies.map((company, index) => (
          <div
            key={company.name}
            className="flex items-center justify-center"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onTouchStart={() => handleTouch(index)}
          >
            <div
              className={`w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 rounded-lg bg-gradient-to-br from-white/20 to-white/5 border-2 flex items-center justify-center cursor-pointer transition-all duration-300 touch-manipulation ${
                hoveredIndex === index
                  ? 'scale-110 border-white/50 shadow-lg shadow-white/30'
                  : 'border-white/20 hover:border-white/40'
              }`}
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className={`w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 transition-colors ${
                  hoveredIndex === index ? 'text-white' : 'text-white/80'
                }`}
              >
                <path d={company.icon} />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
