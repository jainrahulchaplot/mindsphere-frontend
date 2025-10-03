import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  isLoading: boolean;
  className?: string;
};

export default function Skeleton({ children, isLoading, className = '' }: Props) {
  if (isLoading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="bg-white/10 rounded-xl h-4 mb-2"></div>
        <div className="bg-white/10 rounded-xl h-3 mb-1"></div>
        <div className="bg-white/10 rounded-xl h-3 w-3/4"></div>
      </div>
    );
  }

  return <>{children}</>;
}
