import React, { useState } from 'react';
import { ChecklistItem, ThemeConfig } from '../types';

interface ChecklistProps {
  items: ChecklistItem[];
  title?: string;
  theme?: ThemeConfig;
  onItemComplete?: (itemId: string) => void;
  collapsible?: boolean;
}

export const Checklist: React.FC<ChecklistProps> = ({
  items,
  title = 'Getting Started',
  theme,
  onItemComplete,
  collapsible = true,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [checklistItems, setChecklistItems] = useState(items);

  const isDark = theme?.mode === 'dark' || (theme?.mode === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  
  const primaryColor = theme?.primaryColor || '#3b82f6';
  const bgColor = theme?.backgroundColor || (isDark ? '#1f2937' : '#ffffff');
  const textColor = theme?.textColor || (isDark ? '#f9fafb' : '#1f2937');
  const borderRadius = theme?.borderRadius || '12px';

  const completedCount = checklistItems.filter(item => item.completed).length;
  const progress = (completedCount / checklistItems.length) * 100;

  const handleToggle = (itemId: string) => {
    setChecklistItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      )
    );
    onItemComplete?.(itemId);
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        width: '360px',
        backgroundColor: bgColor,
        borderRadius,
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        zIndex: 9999,
        fontFamily: theme?.fontFamily || '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        animation: 'slideInRight 0.3s ease-out',
      }}
    >
      <div
        style={{
          padding: '20px',
          borderBottom: collapsed ? 'none' : `1px solid ${primaryColor}11`,
          cursor: collapsible ? 'pointer' : 'default',
        }}
        onClick={() => collapsible && setCollapsed(!collapsed)}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: textColor }}>{title}</h3>
          <span style={{ fontSize: '14px', color: primaryColor, fontWeight: '600' }}>
            {completedCount}/{checklistItems.length}
          </span>
        </div>
        
        <div style={{ position: 'relative', height: '6px', backgroundColor: `${primaryColor}22`, borderRadius: '3px', overflow: 'hidden' }}>
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              height: '100%',
              width: `${progress}%`,
              backgroundColor: primaryColor,
              transition: 'width 0.3s ease',
              borderRadius: '3px',
            }}
          />
        </div>
      </div>

      {!collapsed && (
        <div style={{ padding: '12px' }}>
          {checklistItems.map((item, index) => (
            <div
              key={item.id}
              style={{
                padding: '12px',
                borderRadius: '8px',
                marginBottom: index < checklistItems.length - 1 ? '8px' : 0,
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                backgroundColor: item.completed ? `${primaryColor}11` : 'transparent',
              }}
              onClick={() => handleToggle(item.id)}
              onMouseEnter={(e) => {
                if (!item.completed) {
                  e.currentTarget.style.backgroundColor = `${primaryColor}08`;
                }
              }}
              onMouseLeave={(e) => {
                if (!item.completed) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    border: `2px solid ${item.completed ? primaryColor : `${primaryColor}44`}`,
                    backgroundColor: item.completed ? primaryColor : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'all 0.2s',
                  }}
                >
                  {item.completed && (
                    <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                      <path d="M1 5L4.5 8.5L11 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: '15px',
                      fontWeight: '500',
                      color: textColor,
                      textDecoration: item.completed ? 'line-through' : 'none',
                      opacity: item.completed ? 0.6 : 1,
                    }}
                  >
                    {item.title}
                  </div>
                  {item.description && (
                    <div style={{ fontSize: '13px', color: textColor, opacity: 0.6, marginTop: '4px' }}>
                      {item.description}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};
