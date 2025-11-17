# 🚀 Getting Started

## Installation

```bash
npm install @onboard/flow-engine
```

Or with yarn:

```bash
yarn add @onboard/flow-engine
```

## Basic Setup

### 1. Wrap Your App with OnboardingProvider

```tsx
import { OnboardingProvider } from '@onboard/flow-engine';

function App() {
  return (
    <OnboardingProvider>
      <YourApp />
    </OnboardingProvider>
  );
}
```

### 2. Register Your First Flow

```tsx
import { flowEngine } from '@onboard/flow-engine';

flowEngine.registerFlow({
  id: 'welcome-tour',
  name: 'Welcome Tour',
  dismissOnOverlayClick: true, // Allow users to dismiss by clicking outside
  steps: [
    {
      id: 'step-1',
      type: 'modal',
      title: 'Welcome! 👋',
      content: 'Let us show you around',
      skippable: true,
    },
    {
      id: 'step-2',
      type: 'tooltip',
      title: 'Create New Project',
      content: 'Click here to start a new project',
      target: '#create-button',
      position: 'bottom',
    },
  ],
  theme: {
    primaryColor: '#3b82f6',
    mode: 'auto', // 'light', 'dark', or 'auto'
  },
  onComplete: () => {
    console.log('Tour completed!');
  },
});
```

### 3. Start the Flow

```tsx
import { useOnboarding } from '@onboard/flow-engine';

function WelcomeButton() {
  const { startFlow } = useOnboarding();
  
  return (
    <button onClick={() => startFlow('welcome-tour')}>
      Start Tour
    </button>
  );
}
```

## Step Types

### Tooltip

Contextual tooltips that point to specific elements:

```tsx
{
  id: 'tooltip-step',
  type: 'tooltip',
  title: 'Feature Name',
  content: 'Description of the feature',
  target: '#element-selector',
  position: 'bottom', // 'top' | 'bottom' | 'left' | 'right'
  skippable: true,
}
```

### Modal

Center-screen modals for important messages:

```tsx
{
  id: 'modal-step',
  type: 'modal',
  title: 'Welcome!',
  content: 'Get started with our platform',
  dismissible: true,
}
```

### Spotlight

Highlight elements with an overlay:

```tsx
{
  id: 'spotlight-step',
  type: 'spotlight',
  title: 'Important Feature',
  content: 'This is a key feature',
  target: '#important-element',
}
```

## Dark Mode Support

The engine supports three theme modes:

```tsx
theme: {
  mode: 'light',  // Always light theme
  mode: 'dark',   // Always dark theme
  mode: 'auto',   // Follows system preference
}
```

## Dismissible Overlays

Control whether users can dismiss the tour by clicking outside:

```tsx
flowEngine.registerFlow({
  id: 'my-tour',
  dismissOnOverlayClick: true, // Users can click outside to dismiss
  // ... rest of config
});
```

When enabled:
- Clicking the overlay dismisses the tour
- Close buttons (×) appear on tooltips and modals
- The tour is marked as "skipped" in analytics

## Next Steps

- [API Reference](./api-reference.md) - Complete API documentation
- [Theming Guide](./theming.md) - Customize the look and feel
- [Examples](./examples.md) - More code examples
- [Analytics](./analytics.md) - Track user behavior
