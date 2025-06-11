import React from 'react';

interface RadioProps extends React.SVGProps<SVGSVGElement> {
  title?: string;
  titleId?: string;
}

export function Radio({ title, titleId, ...props }: RadioProps): React.ReactElement {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 20 20" 
      fill="none"
      {...props}
    >
      {title && <title id={titleId}>{title}</title>}
      <circle cx="10" cy="10" r="9" stroke="#D0D5DD" strokeWidth="2"/>
    </svg>
  );
} 