# 🎨 Theming Guide

Complete guide to customizing the appearance of your onboarding flows.

## Theme Configuration

```tsx
interface ThemeConfig {
  primaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  borderRadius?: string;
  fontFamily?: string;
  overlayColor?: string;
  spotlightPadding?: number;
  mode?: 'light' | 'dark' | 'auto';
}
```

## Basic Theme

```tsx
flowEngine.registerFlow({
  id: 'my-flow',
  name: 'My Flow',
  steps: [...],
  theme: {
    primaryColor: '#3b82f6',
    borderRadius: '12px',
    mode: 'light',
  },
});
```

## Dark Theme

```tsx
theme: {
  mode: 'dark',
  primaryColor: '#60a5fa',
  backgroundColor: '#1f2937',
  textColor: '#f9fafb',
  overlayColor: 'rgba(0, 0, 0, 0.8)',
}
```

## Auto Theme (System Preference)

```tsx
theme: {
  mode: 'auto', // Automatically switches based on system preference
  primaryColor: '#3b82f6',
}
```

The engine will automatically detect the user's system preference and apply the appropriate colors.

## Custom Brand Theme

```tsx
theme: {
  primaryColor: '#8b5cf6',
  backgroundColor: '#ffffff',
  textColor: '#1f2937',
  borderRadius: '16px',
  fontFamily: 'Inter, -apple-system, sans-serif',
  overlayColor: 'rgba(139, 92, 246, 0.1)',
  spotlightPadding: 12,
  mode: 'light',
}
```

## Preset Themes

### Modern Blue
```tsx
theme: {
  primaryColor: '#3b82f6',
  borderRadius: '12px',
  mode: 'auto',
}
```

### Vibrant Purple
```tsx
theme: {
  primaryColor: '#8b5cf6',
  borderRadius: '16px',
  mode: 'auto',
}
```

### Professional Green
```tsx
theme: {
  primaryColor: '#10b981',
  borderRadius: '8px',
  mode: 'light',
}
```

### Elegant Dark
```tsx
theme: {
  mode: 'dark',
  primaryColor: '#60a5fa',
  backgroundColor: '#111827',
  textColor: '#f3f4f6',
  borderRadius: '12px',
  overlayColor: 'rgba(0, 0, 0, 0.9)',
}
```

## Per-Component Theming

You can apply different themes to different components:

### Checklist with Custom Theme
```tsx
<Checklist
  items={[...]}
  theme={{
    primaryColor: '#10b981',
    mode: 'dark',
    borderRadius: '12px',
  }}
/>
```

## Theme Properties Explained

### primaryColor
The main accent color used for buttons, progress bars, and highlights.

### backgroundColor
Background color for tooltips, modals, and checklists. Auto-adjusts in dark mode if not specified.

### textColor
Text color for all content. Auto-adjusts in dark mode if not specified.

### borderRadius
Border radius for all UI elements. Use larger values for a more modern look.

### fontFamily
Custom font family. Defaults to system fonts.

### overlayColor
Color of the spotlight overlay. Use semi-transparent colors.

### spotlightPadding
Padding around highlighted elements in spotlight mode (in pixels).

### mode
- `'light'`: Always use light theme
- `'dark'`: Always use dark theme
- `'auto'`: Follow system preference (recommended)

## Responsive Theming

The engine automatically handles responsive design. All components adapt to different screen sizes.

## Accessibility

When customizing themes, ensure:
- Sufficient color contrast (WCAG AA minimum)
- Text remains readable in both light and dark modes
- Interactive elements are clearly visible

## Examples

See [examples.md](./examples.md) for complete themed examples.
