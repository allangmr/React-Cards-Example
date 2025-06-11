import React from 'react';

interface CheckRadioProps extends React.SVGProps<SVGSVGElement> {
  title?: string;
  titleId?: string;
}

export function CheckRadio({ title, titleId, ...props }: CheckRadioProps): React.ReactElement {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 20 20" 
      fill="none"
      {...props}
    >
      {title && <title id={titleId}>{title}</title>}
      <circle cx="10" cy="10" r="9" stroke="#007BAB" strokeWidth="2"/>
      <circle cx="10" cy="10" r="5" fill="#007BAB"/>
    </svg>
  );
} 