import { PropsWithChildren, CSSProperties } from 'react';

type Props = PropsWithChildren & {
  className?: string;
  style?: CSSProperties;
};

export default function Card({ children, className, style }: Props) {
  return <div className={`card fadePop ${className || ''}`} style={style}>{children}</div>;
}