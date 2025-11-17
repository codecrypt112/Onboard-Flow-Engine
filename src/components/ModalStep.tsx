import React from 'react';
import { Step, ThemeConfig } from '../types';

interface ModalStepProps {
  step: Step;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
  onDismiss?: () => void;
  isFirst: boolean;
  isLast: boolean;
  theme?: ThemeConfig;
}

export const ModalStep: React.FC<ModalStepProps> = ({
  step,
  onNext,
  onPrev,
  onSkip,
  onDismiss,
  isFirst,
  isLast,
  theme,
}) => {
  const isDark = theme?.mode === 'dark' || (theme?.mode === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  
  const primaryColor = theme?.primaryColor || '#3b82f6';
  const bgColor = theme?.backgroundColor || (isDark ? '#1f2937' : '#ffffff');
  const textColor = theme?.textColor || (isDark ? '#f9fafb' : '#1f2937');
  const borderRadius = theme?.borderRadius || '16px';

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: isDark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.5)',
          zIndex: 9998,
          animation: 'fadeIn 0.2s ease-out',
        }}
        onClick={onDismiss}
      />
      
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: '500px',
          backgroundColor: bgColor,
          color: textColor,
          borderRadius,
          boxShadow: isDark
            ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            : '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          padding: '32px',
          zIndex: 9999,
          animation: 'modalSlideIn 0.3s ease-out',
          fontFamily: theme?.fontFamily || '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}
      >
        {onDismiss && (
          <button
            onClick={onDismiss}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'transparent',
              border: 'none',
              color: textColor,
              opacity: 0.5,
              cursor: 'pointer',
              fontSize: '24px',
              padding: '4px',
              lineHeight: 1,
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '0.5'}
          >
            ×
          </button>
        )}
        <h2 style={{ margin: '0 0 16px 0', fontSize: '24px', fontWeight: '700' }}>{step.title}</h2>
        <p style={{ margin: '0 0 32px 0', fontSize: '16px', lineHeight: '1.6', opacity: 0.8 }}>
          {step.content}
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          {!isFirst && (
            <button
              onClick={onPrev}
              style={{
                padding: '12px 24px',
                border: `1px solid ${primaryColor}33`,
                borderRadius: '8px',
                background: 'transparent',
                color: primaryColor,
                cursor: 'pointer',
                fontSize: '15px',
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
                padding: '12px 24px',
                border: 'none',
                borderRadius: '8px',
                background: 'transparent',
                color: textColor,
                cursor: 'pointer',
                fontSize: '15px',
                opacity: 0.6,
              }}
            >
              Skip Tour
            </button>
          )}
          <button
            onClick={onNext}
            style={{
              padding: '12px 28px',
              border: 'none',
              borderRadius: '8px',
              background: primaryColor,
              color: '#ffffff',
              cursor: 'pointer',
              fontSize: '15px',
              fontWeight: '600',
              boxShadow: `0 4px 6px -1px ${primaryColor}44`,
            }}
          >
            {isLast ? 'Get Started' : 'Continue'}
          </button>
        </div>

        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes modalSlideIn {
            from {
              opacity: 0;
              transform: translate(-50%, -48%);
            }
            to {
              opacity: 1;
              transform: translate(-50%, -50%);
            }
          }
        `}</style>
      </div>
    </>
  );
};
