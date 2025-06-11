/**
 * Spacing utility function
 * @param size The spacing size
 * @returns The spacing value in rem
 */
export function spacing(size: string): string {
  const spacingMap: Record<string, string> = {
    '1': '0.25rem',  // 4px
    '2': '0.5rem',   // 8px
    '3': '0.75rem',  // 12px
    '4': '1rem',     // 16px
    '5': '1.25rem',  // 20px
    '6': '1.5rem',   // 24px
  };

  return spacingMap[size] || '1rem';
} 