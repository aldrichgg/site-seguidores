import React, { useId } from "react";

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => {
  // Criar um ID único para cada instância do ícone
  const uniqueId = useId();
  const gradientId = `facebook-gradient-${uniqueId}`;

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
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1877F2" />
          <stop offset="100%" stopColor="#0D65D9" />
        </linearGradient>
      </defs>
      <path 
        d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" 
        fill={`url(#${gradientId})`}
      />
      <path
        d="M16.671 15.523l.532-3.47h-3.328v-2.25c0-.949.465-1.874 1.956-1.874h1.513V4.996s-1.374-.235-2.686-.235c-2.741 0-4.533 1.662-4.533 4.669v2.672H7.078v3.47h3.047v8.385a12.137 12.137 0 003.75 0v-8.385h2.796z"
        fill="#FFFFFF"
      />
    </svg>
  );
};

export default FacebookIcon;
