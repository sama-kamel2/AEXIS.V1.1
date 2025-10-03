import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className = '', hover = false }: CardProps) {
  return (
    <div
      className={`glass-card rounded-xl p-6 ${
        hover ? 'transition-glow cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
