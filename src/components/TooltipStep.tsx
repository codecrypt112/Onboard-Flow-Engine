import React, { useEffect, useState } from 'react';
import { Step, ThemeConfig } from '../types';

interface TooltipStepProps {
  step: Step;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
  onDismiss?: () => void;
  isFirst: boolean;
  isLast: boolean;
  theme?: ThemeConfig;
}

export const TooltipStep: React.FC<TooltipStepProps> = ({
  step,
  onNext,
  onPrev,
  onSkip,
  onDismiss,
  isFirst,
  isLast,
  theme,
}) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [arrowPosition, setArrowPosition] = useState<'top' | 'bottom' | 'left' | 'right'>('bottom');

  useEffect(() => {
    if (step.target) {
      const element = document.querySelector(step.target);
      if (element) {
        const rect = element.getBoundingClientRect();
        const tooltipWidth = 320;
        const tooltipHeight = 200;
        const gap = 16;

        let top = 0;
        let left = 0;
        let arrow: typeof arrowPosition = 'bottom';

        switch (step.position) {
          case 'top':
            top = rect.top - tooltipHeight - gap;
            left = rect.left + rect.width / 2 - tooltipWidth / 2;
            arrow = 'bottom';
            break;
          case 'bottom':
            top = rect.bottom + gap;
            left = rect.left + rect.width / 2 - tooltipWidth / 2;
            arrow = 'top';
            break;
          case 'left':
            top = rect.top + rect.height / 2 - tooltipHeight / 2;
            left = rect.left - tooltipWidth - gap;
            arrow = 'right';
            break;
          case 'right':
            top = rect.top + rect.height / 2 - tooltipHeight / 2;
            left = rect.right + gap;
            arrow = 'left';
            break;
          default:
            top = rect.bottom + gap;
            left = rect.left + rect.width / 2 - tooltipWidth / 2;
            arrow = 'top';
        }

        setPosition({ top, left });
        setArrowPosition(arrow);
      }
    }
  }, [step.target, step.position]);

  const isDark = theme?.mode === 'dark' || (theme?.mode === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  
  const primaryColor = theme?.primaryColor || '#3b82f6';
  const bgColor = theme?.backgroundColor || (isDark ? '#1f2937' : '#ffffff');
  const textColor = theme?.textColor || (isDark ? '#f9fafb' : '#1f2937');
  const borderRadius = theme?.borderRadius || '12px';

  const arrowStyles = {
    top: { bottom: '100%', left: '50%', transform: 'translateX(-50%)', borderBottom: `8px solid ${bgColor}` },
    bottom: { top: '100%', left: '50%', transform: 'translateX(-50%)', borderTop: `8px solid ${bgColor}` },
    left: { right: '100%', top: '50%', transform: 'translateY(-50%)', borderRight: `8px solid ${bgColor}` },
    right: { left: '100%', top: '50%', transform: 'translateY(-50%)', borderLeft: `8px solid ${bgColor}` },
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: position.top,
        left: position.left,
        width: '320px',
        backgroundColor: bgColor,
        color: textColor,
        borderRadius,
        boxShadow: isDark 
          ? '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.3)'
          : '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        padding: '24px',
        zIndex: 9999,
        animation: 'slideIn 0.3s ease-out',
        fontFamily: theme?.fontFamily || '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {onDismiss && (
        <button
          onClick={onDismiss}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'transparent',
            border: 'none',
            color: textColor,
            opacity: 0.5,
            cursor: 'pointer',
            fontSize: '20px',
            padding: '4px',
            lineHeight: 1,
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '0.5'}
        >
          ×
        </button>
      )}
      <div
        style={{
          position: 'absolute',
          width: 0,
          height: 0,
          borderLeft: '8px solid transparent',
          borderRight: '8px solid transparent',
          ...arrowStyles[arrowPosition],
        }}
      />
      
      <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', fontWeight: '600' }}>{step.title}</h3>
      <p style={{ margin: '0 0 20px 0', fontSize: '14px', lineHeight: '1.6', opacity: 0.8 }}>
        {step.content}
      </p>

      <div style={{ display: 'flex', gap: '8px', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {!isFirst && (
            <button
              onClick={onPrev}
              style={{
                padding: '8px 16px',
                border: `1px solid ${primaryColor}33`,
                borderRadius: '6px',
                background: 'transparent',
                color: primaryColor,
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
              }}
            >
              Back
            </button>
          )}
          {step.skippable && (
            <button
              onClick={onSkip}
              style={{
                padding: '8px 16px',
                border: 'none',
                borderRadius: '6px',
                background: 'transparent',
                color: textColor,
                cursor: 'pointer',
                fontSize: '14px',
                opacity: 0.6,
              }}
            >
              Skip
            </button>
          )}
        </div>
        <button
          onClick={onNext}
          style={{
            padding: '8px 20px',
            border: 'none',
            borderRadius: '6px',
            background: primaryColor,
            color: '#ffffff',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: `0 4px 6px -1px ${primaryColor}33`,
          }}
        >
          {isLast ? 'Finish' : 'Next'}
        </button>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};
