import React, { useId } from "react";

const YoutubeIcon = (props: React.SVGProps<SVGSVGElement>) => {
  // Criar um ID único para cada instância do ícone
  const uniqueId = useId();
  const gradientId = `youtube-gradient-${uniqueId}`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="currentColor"
      {...props}
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FF0000" />
          <stop offset="100%" stopColor="#FF0000" />
        </linearGradient>
      </defs>
      <path
        d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z" 
        fill={`url(#${gradientId})`}
      />
      <path
        d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z"
        fill="#FFFFFF"
      />
    </svg>
  );
};

export default YoutubeIcon;
