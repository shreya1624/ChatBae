import React from 'react';

export const NewChatIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const SearchIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

export const SendIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
  </svg>
);

const AvatarMysticOrb: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" className={className} fill="none">
        <defs>
            <radialGradient id="orb-gradient" cx="50%" cy="50%" r="50%" fx="25%" fy="25%">
                <stop offset="0%" stopColor="#fbcfe8" />
                <stop offset="100%" stopColor="#a78bfa" />
            </radialGradient>
        </defs>
        <circle cx="20" cy="20" r="18" fill="url(#orb-gradient)" />
        <circle cx="20" cy="20" r="12" fill="#d1d5db" opacity="0.2" />
        <path d="M16 14.5L14.5 13L13 14.5L14.5 16L16 14.5Z" fill="#fff" opacity="0.8" />
        <path d="M27 24.5L25.5 23L24 24.5L25.5 26L27 24.5Z" fill="#fff" opacity="0.8" />
        <path d="M13 27L11.5 25.5L10 27L11.5 28.5L13 27Z" fill="#fff" opacity="0.5" />
    </svg>
);

const AvatarWinkingHeart: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" className={className} fill="none">
        <circle cx="20" cy="20" r="18" fill="#4b5563" />
        <path d="M26 18C26 19.1046 25.1046 20 24 20C22.8954 20 22 19.1046 22 18C22 16.8954 22.8954 16 24 16C25.1046 16 26 16.8954 26 18Z" fill="#fff" />
        <path d="M15 16H19V18H15V16Z" fill="#fff" />
        <path d="M14 24.08C16.14 26.22 18.86 26.22 21 24.08" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
        <path d="M30.5 13.5C31.25 12 30 11 29 11.5C28 12 28.5 14 30.5 13.5Z" fill="#f472b6"/>
    </svg>
);

const AvatarCoolCat: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" className={className} fill="none">
        <circle cx="20" cy="20" r="18" fill="#fde68a" />
        <path d="M13 13L10 10" stroke="#a16207" strokeWidth="2" strokeLinecap="round"/>
        <path d="M27 13L30 10" stroke="#a16207" strokeWidth="2" strokeLinecap="round"/>
        <path d="M11 21C11 18.2386 13.2386 16 16 16H24C26.7614 16 29 18.2386 29 21V22H11V21Z" fill="#1f2937" />
        <path d="M18 25C18 24.4477 18.4477 24 19 24H21C21.5523 24 22 24.4477 22 25V26H18V25Z" fill="#f0abfc" />
    </svg>
);

const AvatarLofiBot: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" className={className} fill="none">
        <circle cx="20" cy="20" r="18" fill="#374151" />
        <rect x="10" y="14" width="20" height="12" rx="2" fill="#d1d5db" />
        <rect x="13" y="18" width="14" height="4" fill="#111827" />
        <rect x="14" y="19" width="4" height="2" fill="#a78bfa" />
        <rect x="22" y="19" width="4" height="2" fill="#a78bfa" />
        <rect x="8" y="16" width="4" height="8" rx="2" fill="#9ca3af" />
        <rect x="28" y="16" width="4" height="8" rx="2" fill="#9ca3af" />
    </svg>
);

const AvatarGeometricFox: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" className={className} fill="none">
        <circle cx="20" cy="20" r="18" fill="#f97316" />
        <path d="M20 10L10 20L20 30L30 20L20 10Z" fill="#ffedd5" />
        <path d="M20 10L10 20H30L20 10Z" fill="#fff" />
        <path d="M15 20L20 22L25 20L20 26L15 20Z" fill="#1e293b" />
    </svg>
);

const AvatarCosmicDiamond: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" className={className} fill="none">
        <defs>
            <linearGradient id="diamond-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#d946ef" />
            </linearGradient>
        </defs>
        <path d="M20 4L36 16V24L20 36L4 24V16L20 4Z" fill="#1f2937" />
        <path d="M20 6.5L33.5 16V24L20 33.5L6.5 24V16L20 6.5Z" fill="url(#diamond-gradient)" />
        <path d="M20 6.5L12 16H28L20 6.5Z" fill="#fff" fillOpacity="0.5" />
        <path d="M20 33.5L4 16H36L20 33.5Z" fill="#000" fillOpacity="0.2" />
    </svg>
);

export const userAvatarMap: Record<string, React.FC<{ className?: string }>> = {
    'mystic_orb': AvatarMysticOrb,
    'winking_heart': AvatarWinkingHeart,
    'cool_cat': AvatarCoolCat,
    'lofi_bot': AvatarLofiBot,
    'geometric_fox': AvatarGeometricFox,
    'cosmic_diamond': AvatarCosmicDiamond,
};

export const UserAvatar: React.FC<{ iconId: string; className?: string }> = ({ iconId, className }) => {
    const AvatarComponent = userAvatarMap[iconId] || AvatarMysticOrb;
    return <AvatarComponent className={className} />;
};

export const BotIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
    </svg>
);

export const LogoIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className}>
        <defs>
            <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f472b6" /> 
                <stop offset="100%" stopColor="#a78bfa" />
            </linearGradient>
        </defs>
        
        <g className="robot-body">
            {/* Legs */}
            <rect x="8.5" y="18" width="2" height="4" rx="1" fill="#9ca3af" />
            <rect x="13.5" y="18" width="2" height="4" rx="1" fill="#9ca3af" />
            {/* Body */}
            <rect x="7" y="10" width="10" height="8" rx="2" fill="#d1d5db" />
            {/* Head */}
            <rect x="8" y="4" width="8" height="6" rx="2" fill="#d1d5db" />
             {/* Antenna */}
            <line x1="12" y1="4" x2="12" y2="2" stroke="#9ca3af" strokeWidth="1" />
            <circle cx="12" cy="1.5" r="1" fill="#f472b6" />
            {/* Eyes */}
            <circle cx="10.5" cy="7" r="0.75" fill="#4b5563" />
            <circle cx="13.5" cy="7" r="0.75" fill="#4b5563" />
            {/* Arms */}
            <path d="M7 13 C 5.5 13, 5 14, 5.5 15.5" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M17 13 C 18.5 13, 19 14, 18.5 15.5" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </g>
        
        {/* The beating heart */}
        <g className="heart-container" style={{ transformOrigin: '12px 15px' }}>
            <path 
                fill="url(#logo-gradient)" 
                stroke="#fff"
                strokeWidth="0.3"
                d="M12 15.2c-1.5-1.5-3.5-1.1-3.5 0.8 0 1.5 2.5 3 3.5 3.5 1 0 3.5-2 3.5-3.5 0-1.9-2-2.3-3.5-0.8z"
            />
        </g>
    </svg>
);

export const HeartIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-1.344-.688 15.182 15.182 0 01-1.06-1.017c-.82-1.03a15.119 15.119 0 01-2.645-5.188c-1.283-2.645-1.855-4.861-1.855-6.881c0-2.934 2.368-5.304 5.304-5.304 1.764 0 3.37.832 4.342 2.115c.972-1.283 2.578-2.115 4.342-2.115 2.935 0 5.304 2.37 5.304 5.304 0 2.02-.572 4.236-1.855 6.881-1.033 2.176-2.13 3.9-3.486 5.397a14.922 14.922 0 01-1.217.923c-.31.229-.614.448-.916.654a1.737 1.737 0 01-.044.03l-.007.004-.007.003-.002.001a.752.752 0 01-.704 0l-.002-.001z" />
    </svg>
);

export const ShareIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
    </svg>
);

export const EditIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
    </svg>
);

export const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

export const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

export const MicrophoneIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
);

export const ThreeDotsIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h.01M12 12h.01M19 12h.01M5 12a1 1 0 110-2 1 1 0 010 2zm7 0a1 1 0 110-2 1 1 0 010 2zm7 0a1 1 0 110-2 1 1 0 010 2z" />
    </svg>
);

export const PinIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M10.43 2.25a.75.75 0 011.14 0l2.25 2.25c.14.14.22.33.22.53v.92c0 .98.83 1.75 1.83 1.75h1.33c.33 0 .63.16.81.42a2.97 2.97 0 01-1.4 4.88c-.3.1-.5.35-.5.66v2.1c0 .41-.34.75-.75.75H8.25a.75.75 0 01-.75-.75v-2.1c0-.31-.2-.56-.5-.66a2.97 2.97 0 01-1.4-4.88.99.99 0 01.81-.42h1.33c1 0 1.83-.77 1.83-1.75v-.92c0-.2.08-.39.22-.53l2.25-2.25zM10.19 16.5a.75.75 0 00-1.43.44l.19 1.06a.75.75 0 001.43-.44l-.19-1.06zM15.25 16.5a.75.75 0 00-1.43.44l.19 1.06a.75.75 0 001.43-.44l-.19-1.06z" clipRule="evenodd" />
    </svg>
);

export const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

export const QuestionMarkCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const CopyIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
);

export const DownloadIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);

export const MenuIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);

export const SparklesIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.562L16.25 22.5l-.648-1.938a3.375 3.375 0 00-2.662-2.662l-1.938-.648 1.938-.648a3.375 3.375 0 002.662-2.662l.648-1.938.648 1.938a3.375 3.375 0 002.662 2.662l1.938.648-1.938.648a3.375 3.375 0 00-2.662 2.662z" />
    </svg>
);