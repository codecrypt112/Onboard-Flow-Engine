# 💡 Examples

Real-world examples of using the Onboard Flow Engine.

## Basic Product Tour

```tsx
import { flowEngine, useOnboarding } from '@onboard/flow-engine';

// Register the flow
flowEngine.registerFlow({
  id: 'product-tour',
  name: 'Product Tour',
  dismissOnOverlayClick: true,
  steps: [
    {
      id: 'welcome',
      type: 'modal',
      title: 'Welcome to Our App! 👋',
      content: 'Let us show you around in just 2 minutes.',
      skippable: true,
    },
    {
      id: 'dashboard',
      type: 'tooltip',
      title: 'Your Dashboard',
      content: 'This is your main dashboard where you can see all your projects.',
      target: '#dashboard',
      position: 'right',
    },
    {
      id: 'create',
      type: 'spotlight',
      title: 'Create New Project',
      content: 'Click here to create your first project!',
      target: '#create-button',
    },
  ],
  theme: {
    primaryColor: '#3b82f6',
    mode: 'auto',
  },
  onComplete: () => {
    console.log('Tour completed!');
  },
});

// Use in component
function App() {
  const { startFlow } = useOnboarding();
  
  useEffect(() => {
    // Start tour for new users
    const hasSeenTour = localStorage.getItem('hasSeenTour');
    if (!hasSeenTour) {
      startFlow('product-tour');
      localStorage.setItem('hasSeenTour', 'true');
    }
  }, []);
  
  return <YourApp />;
}
```

## Dark Theme Tour

```tsx
flowEngine.registerFlow({
  id: 'dark-tour',
  name: 'Dark Theme Tour',
  dismissOnOverlayClick: false, // Prevent accidental dismissal
  steps: [
    {
      id: 'step-1',
      type: 'modal',
      title: 'Dark Mode Enabled 🌙',
      content: 'Experience our beautiful dark interface.',
    },
    {
      id: 'step-2',
      type: 'tooltip',
      title: 'Settings',
      content: 'Customize your experience here.',
      target: '#settings-button',
      position: 'bottom',
    },
  ],
  theme: {
    mode: 'dark',
    primaryColor: '#60a5fa',
    backgroundColor: '#1f2937',
    textColor: '#f9fafb',
    borderRadius: '12px',
    overlayColor: 'rgba(0, 0, 0, 0.8)',
  },
});
```

## Interactive Checklist

```tsx
import { Checklist } from '@onboard/flow-engine';

function OnboardingChecklist() {
  const [items, setItems] = useState([
    {
      id: '1',
      title: 'Complete your profile',
      description: 'Add your name and photo',
      completed: false,
    },
    {
      id: '2',
      title: 'Create your first project',
      description: 'Start building something amazing',
      completed: false,
    },
    {
      id: '3',
      title: 'Invite team members',
      description: 'Collaborate with your team',
      completed: false,
    },
    {
      id: '4',
      title: 'Explore integrations',
      description: 'Connect your favorite tools',
      completed: false,
    },
  ]);

  const handleComplete = (itemId: string) => {
    setItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      )
    );
    
    // Track completion
    console.log('Item completed:', itemId);
  };

  return (
    <Checklist
      title="Get Started in 4 Steps"
      items={items}
      onItemComplete={handleComplete}
      theme={{
        primaryColor: '#10b981',
        mode: 'auto',
        borderRadius: '12px',
      }}
      collapsible={true}
    />
  );
}
```

## A/B Testing Example

```tsx
import { useABTest, useOnboarding } from '@onboard/flow-engine';

// Register Variant A
flowEngine.registerFlow({
  id: 'onboarding-a',
  name: 'Onboarding A',
  variant: 'A',
  steps: [
    {
      id: 'welcome',
      type: 'modal',
      title: 'Welcome!',
      content: 'Traditional welcome message.',
    },
    // More steps...
  ],
});

// Register Variant B
flowEngine.registerFlow({
  id: 'onboarding-b',
  name: 'Onboarding B',
  variant: 'B',
  steps: [
    {
      id: 'welcome',
      type: 'modal',
      title: '🚀 Let\'s Go!',
      content: 'Exciting welcome message!',
    },
    // More steps...
  ],
});

// Use in component
function ABTestComponent() {
  const { startFlow } = useOnboarding();
  const { variant, results, winningVariant } = useABTest('onboarding');
  
  useEffect(() => {
    const flowId = variant === 'A' ? 'onboarding-a' : 'onboarding-b';
    startFlow(flowId, variant);
  }, [variant]);
  
  // Check results
  console.log('Variant A completions:', results.A);
  console.log('Variant B completions:', results.B);
  console.log('Winner:', winningVariant);
  
  return null;
}
```

## Conditional Steps

```tsx
flowEngine.registerFlow({
  id: 'conditional-tour',
  name: 'Conditional Tour',
  steps: [
    {
      id: 'step-1',
      type: 'modal',
      title: 'Welcome',
      content: 'This step always shows.',
    },
    {
      id: 'step-2',
      type: 'tooltip',
      title: 'Premium Feature',
      content: 'This is only for premium users!',
      target: '#premium-button',
      condition: () => user.isPremium, // Only show if condition is true
    },
    {
      id: 'step-3',
      type: 'modal',
      title: 'Final Step',
      content: 'Thanks for the tour!',
    },
  ],
});
```

## Lifecycle Hooks

```tsx
flowEngine.registerFlow({
  id: 'lifecycle-tour',
  name: 'Lifecycle Tour',
  steps: [
    {
      id: 'step-1',
      type: 'tooltip',
      title: 'Feature A',
      content: 'Check out this feature.',
      target: '#feature-a',
      onEnter: () => {
        console.log('Entered step 1');
        // Highlight element, play sound, etc.
      },
      onExit: () => {
        console.log('Exited step 1');
        // Clean up, track analytics, etc.
      },
    },
  ],
});
```

## Multi-Step Feature Announcement

```tsx
flowEngine.registerFlow({
  id: 'new-feature',
  name: 'New Feature Announcement',
  dismissOnOverlayClick: true,
  steps: [
    {
      id: 'announcement',
      type: 'modal',
      title: '🎉 New Feature Alert!',
      content: 'We just launched an amazing new feature. Let us show you!',
    },
    {
      id: 'feature-location',
      type: 'spotlight',
      title: 'Find It Here',
      content: 'Access the new feature from this menu.',
      target: '#new-feature-menu',
    },
    {
      id: 'how-to-use',
      type: 'tooltip',
      title: 'How to Use',
      content: 'Click here to start using the new feature.',
      target: '#new-feature-button',
      position: 'right',
    },
  ],
  theme: {
    primaryColor: '#8b5cf6',
    mode: 'auto',
  },
  onComplete: () => {
    // Mark feature as seen
    localStorage.setItem('newFeatureSeen', 'true');
  },
});
```

## Analytics Dashboard

```tsx
import { flowEngine } from '@onboard/flow-engine';

function AnalyticsDashboard() {
  const [stats, setStats] = useState({});
  
  useEffect(() => {
    const flowId = 'welcome-tour';
    const completionRate = flowEngine.getCompletionRate(flowId);
    const analytics = flowEngine.getAnalytics(flowId);
    const abResults = flowEngine.getABTestResults(flowId);
    
    setStats({
      completionRate,
      totalStarts: analytics.filter(e => e.event === 'start').length,
      totalCompletions: analytics.filter(e => e.event === 'complete').length,
      totalSkips: analytics.filter(e => e.event === 'skip').length,
      abResults,
    });
  }, []);
  
  return (
    <div>
      <h2>Onboarding Analytics</h2>
      <p>Completion Rate: {stats.completionRate}%</p>
      <p>Total Starts: {stats.totalStarts}</p>
      <p>Total Completions: {stats.totalCompletions}</p>
      <p>Total Skips: {stats.totalSkips}</p>
      <p>A/B Test - Variant A: {stats.abResults?.A}</p>
      <p>A/B Test - Variant B: {stats.abResults?.B}</p>
    </div>
  );
}
```

## Custom Styled Checklist

```tsx
<Checklist
  title="🚀 Launch Checklist"
  items={[
    {
      id: '1',
      title: 'Set up your workspace',
      description: 'Configure your environment',
      completed: true,
    },
    {
      id: '2',
      title: 'Import your data',
      description: 'Bring in your existing data',
      completed: true,
    },
    {
      id: '3',
      title: 'Invite your team',
      description: '5 team members invited',
      completed: false,
    },
  ]}
  theme={{
    primaryColor: '#f59e0b',
    backgroundColor: '#fffbeb',
    textColor: '#78350f',
    borderRadius: '16px',
    mode: 'light',
  }}
/>
```
