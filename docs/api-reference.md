# 📖 API Reference

Complete API documentation for the Onboard Flow Engine.

## Core API

### flowEngine

The main engine instance for managing flows.

#### Methods

##### `registerFlow(config: FlowConfig): void`

Register a new onboarding flow.

```tsx
flowEngine.registerFlow({
  id: 'welcome-tour',
  name: 'Welcome Tour',
  steps: [...],
  dismissOnOverlayClick: true,
  theme: {...},
  onComplete: () => {},
  onSkip: () => {},
});
```

##### `getFlow(flowId: string): FlowConfig | undefined`

Get a registered flow configuration.

```tsx
const flow = flowEngine.getFlow('welcome-tour');
```

##### `getProgress(flowId: string): FlowProgress | undefined`

Get the current progress for a flow.

```tsx
const progress = flowEngine.getProgress('welcome-tour');
```

##### `getCompletionRate(flowId: string): number`

Get the completion rate percentage for a flow.

```tsx
const rate = flowEngine.getCompletionRate('welcome-tour');
console.log(`${rate}% completion rate`);
```

##### `getABTestResults(flowId: string): { A: number; B: number }`

Get A/B test results for a flow.

```tsx
const results = flowEngine.getABTestResults('welcome-tour');
console.log(`Variant A: ${results.A}, Variant B: ${results.B}`);
```

##### `getAnalytics(flowId?: string): AnalyticsEvent[]`

Get analytics events, optionally filtered by flow ID.

```tsx
const events = flowEngine.getAnalytics('welcome-tour');
```

##### `resetProgress(flowId: string): void`

Reset progress for a specific flow.

```tsx
flowEngine.resetProgress('welcome-tour');
```

## React Hooks

### useOnboarding()

Main hook for controlling onboarding flows.

```tsx
const { startFlow, currentFlow, progress } = useOnboarding();
```

#### Returns

- `startFlow(flowId: string, variant?: 'A' | 'B'): void` - Start a flow
- `currentFlow: OnboardingFlow | null` - Current active flow instance
- `progress: FlowProgress | null` - Current flow progress

#### Example

```tsx
function MyComponent() {
  const { startFlow } = useOnboarding();
  
  return (
    <button onClick={() => startFlow('welcome-tour')}>
      Start Tour
    </button>
  );
}
```

### useFlow(flowId: string)

Hook for accessing flow data and analytics.

```tsx
const { progress, completionRate, analytics } = useFlow('welcome-tour');
```

#### Returns

- `progress: FlowProgress | null` - Flow progress data
- `completionRate: number` - Completion rate percentage
- `analytics: AnalyticsEvent[]` - Analytics events for the flow

### useABTest(flowId: string)

Hook for A/B testing flows.

```tsx
const { variant, results, winningVariant } = useABTest('welcome-tour');
```

#### Returns

- `variant: 'A' | 'B'` - Randomly assigned variant
- `results: { A: number; B: number }` - Completion counts
- `winningVariant: 'A' | 'B' | null` - Variant with more completions

#### Example

```tsx
function MyComponent() {
  const { startFlow } = useOnboarding();
  const { variant } = useABTest('welcome-tour');
  
  useEffect(() => {
    startFlow('welcome-tour', variant);
  }, []);
}
```

## Components

### OnboardingProvider

Root provider component. Must wrap your app.

```tsx
<OnboardingProvider>
  <App />
</OnboardingProvider>
```

### Checklist

Interactive checklist component.

```tsx
<Checklist
  title="Getting Started"
  items={[
    { id: '1', title: 'Task 1', completed: false },
    { id: '2', title: 'Task 2', completed: true },
  ]}
  onItemComplete={(itemId) => console.log('Completed:', itemId)}
  theme={{ primaryColor: '#10b981' }}
  collapsible={true}
/>
```

#### Props

- `items: ChecklistItem[]` - Array of checklist items
- `title?: string` - Checklist title (default: "Getting Started")
- `theme?: ThemeConfig` - Custom theme
- `onItemComplete?: (itemId: string) => void` - Callback when item is completed
- `collapsible?: boolean` - Whether checklist can be collapsed (default: true)

## Type Definitions

### FlowConfig

```tsx
interface FlowConfig {
  id: string;
  name: string;
  steps: Step[];
  variant?: 'A' | 'B';
  onComplete?: () => void;
  onSkip?: () => void;
  theme?: ThemeConfig;
  dismissOnOverlayClick?: boolean;
}
```

### Step

```tsx
interface Step {
  id: string;
  type: 'tooltip' | 'modal' | 'checklist' | 'spotlight';
  title: string;
  content: string;
  target?: string;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  actions?: StepAction[];
  condition?: () => boolean;
  onEnter?: () => void;
  onExit?: () => void;
  skippable?: boolean;
  dismissible?: boolean;
}
```

### ThemeConfig

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

### FlowProgress

```tsx
interface FlowProgress {
  flowId: string;
  currentStepIndex: number;
  completedSteps: string[];
  skipped: boolean;
  completed: boolean;
  startedAt: number;
  completedAt?: number;
  variant?: 'A' | 'B';
}
```

### ChecklistItem

```tsx
interface ChecklistItem {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  action?: () => void;
}
```

### AnalyticsEvent

```tsx
interface AnalyticsEvent {
  flowId: string;
  stepId: string;
  event: 'start' | 'complete' | 'skip' | 'next' | 'prev' | 'dismiss';
  timestamp: number;
  variant?: 'A' | 'B';
  metadata?: Record<string, any>;
}
```

## Events

The engine automatically tracks these events:

- `start` - Flow started
- `complete` - Step or flow completed
- `skip` - Flow skipped
- `next` - Next step
- `prev` - Previous step
- `dismiss` - Modal/tooltip dismissed

Access events via `flowEngine.getAnalytics()`.
