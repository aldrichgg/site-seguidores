import React, { useId } from "react";

const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => {
  // Criar IDs únicos para cada instância do ícone
  const uniqueId = useId();
  const gradientId = `tiktok-gradient-${uniqueId}`;
  const musicId = `tiktok-music-${uniqueId}`;

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
        <radialGradient id={musicId} cx="50%" cy="50%" r="50%" fx="10%" fy="10%">
          <stop offset="0%" stopColor="#F12B56" />
          <stop offset="35%" stopColor="#F12B56" />
          <stop offset="100%" stopColor="#DE1544" />
        </radialGradient>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#25F4EE" />
          <stop offset="100%" stopColor="#00D2C3" />
        </linearGradient>
      </defs>
      <g>
        <path 
          d="M22.459 6.846a5.793 5.793 0 01-3.346-1.06 5.846 5.846 0 01-2.118-3.323h-3.927v13.003a2.564 2.564 0 01-2.558 2.57A2.564 2.564 0 017.952 15.5a2.564 2.564 0 012.558-2.56c.235 0 .463.033.679.095V9.028a6.553 6.553 0 00-.679-.035 6.546 6.546 0 00-6.545 6.546A6.546 6.546 0 0010.51 22.08a6.546 6.546 0 006.546-6.546v-6.802a9.738 9.738 0 005.424 1.67v-3.927a5.842 5.842 0 01-5.842.37h5.822z" 
          fill="#000000" 
        />
        <path 
          d="M20.062 7.215a5.793 5.793 0 01-3.346-1.06 5.846 5.846 0 01-2.118-3.323H10.67v13.003a2.564 2.564 0 01-2.558 2.57 2.564 2.564 0 01-2.557-2.536 2.564 2.564 0 012.557-2.56c.236 0 .463.033.68.095V9.397a6.553 6.553 0 00-.68-.035 6.546 6.546 0 00-6.544 6.546A6.546 6.546 0 008.113 22.45a6.546 6.546 0 006.546-6.546V9.1a9.738 9.738 0 005.424 1.67V6.845l-.021.37z" 
          fill={`url(#${musicId})`} 
        />
        <path 
          d="M12.338 15.5a2.564 2.564 0 00-2.231-2.542v4.047A2.564 2.564 0 0012.338 15.5z" 
          fill="#000000" 
        />
        <path 
          d="M10.107 9.362v3.596c-.236-.061-.463-.095-.679-.095a2.564 2.564 0 00-2.557 2.56 2.564 2.564 0 002.558 2.536v-4.046A2.564 2.564 0 0110.67 15.5a2.564 2.564 0 01-2.558 2.57V9.328a6.546 6.546 0 006.545 6.546v-6.546a9.738 9.738 0 005.424 1.67V6.844a5.842 5.842 0 01-5.842.37h-4.132z" 
          fill={`url(#${gradientId})`} 
        />
      </g>
    </svg>
  );
};

export default TikTokIcon;
