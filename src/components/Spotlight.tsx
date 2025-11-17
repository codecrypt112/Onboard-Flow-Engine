import React, { useEffect, useState } from 'react';
import { ThemeConfig } from '../types';

interface SpotlightProps {
  target: string;
  theme?: ThemeConfig;
  onDismiss?: () => void;
}

export const Spotlight: React.FC<SpotlightProps> = ({ target, theme, onDismiss }) => {
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const element = document.querySelector(target);
    if (element) {
      const r = element.getBoundingClientRect();
      setRect(r);
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [target]);

  if (!rect) return null;

  const padding = theme?.spotlightPadding || 8;
  const overlayColor = theme?.overlayColor || 'rgba(0, 0, 0, 0.7)';

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: onDismiss ? 'auto' : 'none',
        zIndex: 9998,
        cursor: onDismiss ? 'pointer' : 'default',
      }}
      onClick={onDismiss}
    >
      <svg width="100%" height="100%" style={{ position: 'absolute' }}>
        <defs>
          <mask id="spotlight-mask">
            <rect width="100%" height="100%" fill="white" />
            <rect
              x={rect.left - padding}
              y={rect.top - padding}
              width={rect.width + padding * 2}
              height={rect.height + padding * 2}
              rx={theme?.borderRadius || '8'}
              fill="black"
            />
          </mask>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill={overlayColor}
          mask="url(#spotlight-mask)"
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          left: rect.left - padding,
          top: rect.top - padding,
          width: rect.width + padding * 2,
          height: rect.height + padding * 2,
          border: `2px solid ${theme?.primaryColor || '#3b82f6'}`,
          borderRadius: theme?.borderRadius || '8px',
          boxShadow: `0 0 0 4px ${theme?.primaryColor || '#3b82f6'}33`,
          transition: 'all 0.3s ease',
          animation: 'pulse 2s infinite',
        }}
      />
      <style>{`
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 4px ${theme?.primaryColor || '#3b82f6'}33; }
          50% { box-shadow: 0 0 0 8px ${theme?.primaryColor || '#3b82f6'}22; }
        }
      `}</style>
    </div>
  );
};
