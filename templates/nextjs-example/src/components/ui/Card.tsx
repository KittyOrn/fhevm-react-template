import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export function Card({ children, title, className = '' }: CardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-lg p-8 ${className}`}>
      {title && <h2 className="text-2xl font-bold text-gray-800 mb-6">{title}</h2>}
      {children}
    </div>
  );
}
