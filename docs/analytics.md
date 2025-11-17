# 📊 Analytics & A/B Testing

Track user behavior and optimize your onboarding flows.

## Analytics Overview

The Flow Engine automatically tracks user interactions with your onboarding flows.

### Tracked Events

- `start` - User starts a flow
- `complete` - User completes a step or flow
- `skip` - User skips the flow
- `next` - User moves to next step
- `prev` - User moves to previous step
- `dismiss` - User dismisses a modal/tooltip

## Getting Analytics Data

### Get All Events

```tsx
import { flowEngine } from '@onboard/flow-engine';

const allEvents = flowEngine.getAnalytics();
console.log(allEvents);
```

### Get Events for Specific Flow

```tsx
const flowEvents = flowEngine.getAnalytics('welcome-tour');
console.log(flowEvents);
```

### Event Structure

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

## Completion Rates

### Get Completion Rate

```tsx
const rate = flowEngine.getCompletionRate('welcome-tour');
console.log(`${rate}% of users completed the tour`);
```

### Calculate Custom Metrics

```tsx
const events = flowEngine.getAnalytics('welcome-tour');

const starts = events.filter(e => e.event === 'start').length;
const completions = events.filter(e => e.event === 'complete').length;
const skips = events.filter(e => e.event === 'skip').length;

const skipRate = (skips / starts) * 100;
const completionRate = (completions / starts) * 100;

console.log(`Skip Rate: ${skipRate}%`);
console.log(`Completion Rate: ${completionRate}%`);
```

## A/B Testing

### Setup A/B Test

Register two variants of your flow:

```tsx
// Variant A - Traditional approach
flowEngine.registerFlow({
  id: 'onboarding-a',
  name: 'Onboarding A',
  variant: 'A',
  steps: [
    {
      id: 'welcome',
      type: 'modal',
      title: 'Welcome',
      content: 'Traditional welcome message.',
    },
    // More steps...
  ],
});

// Variant B - Modern approach
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
```

### Use A/B Test Hook

```tsx
import { useABTest, useOnboarding } from '@onboard/flow-engine';

function MyComponent() {
  const { startFlow } = useOnboarding();
  const { variant, results, winningVariant } = useABTest('onboarding');
  
  useEffect(() => {
    // Randomly assign variant and start appropriate flow
    const flowId = variant === 'A' ? 'onboarding-a' : 'onboarding-b';
    startFlow(flowId, variant);
  }, [variant]);
  
  return (
    <div>
      <p>Current Variant: {variant}</p>
      <p>Variant A Completions: {results.A}</p>
      <p>Variant B Completions: {results.B}</p>
      <p>Winner: {winningVariant || 'Tie'}</p>
    </div>
  );
}
```

### Get A/B Test Results

```tsx
const results = flowEngine.getABTestResults('onboarding');
console.log('Variant A completions:', results.A);
console.log('Variant B completions:', results.B);

if (results.A > results.B) {
  console.log('Variant A is winning!');
} else if (results.B > results.A) {
  console.log('Variant B is winning!');
} else {
  console.log('It\'s a tie!');
}
```

## Analytics Dashboard Example

```tsx
import { flowEngine, useFlow } from '@onboard/flow-engine';

function AnalyticsDashboard() {
  const { completionRate, analytics } = useFlow('welcome-tour');
  
  const stats = useMemo(() => {
    const starts = analytics.filter(e => e.event === 'start').length;
    const completions = analytics.filter(e => e.event === 'complete').length;
    const skips = analytics.filter(e => e.event === 'skip').length;
    const avgTime = calculateAverageTime(analytics);
    
    return { starts, completions, skips, avgTime };
  }, [analytics]);
  
  return (
    <div className="analytics-dashboard">
      <h2>Onboarding Analytics</h2>
      
      <div className="metric">
        <h3>Completion Rate</h3>
        <p>{completionRate.toFixed(1)}%</p>
      </div>
      
      <div className="metric">
        <h3>Total Starts</h3>
        <p>{stats.starts}</p>
      </div>
      
      <div className="metric">
        <h3>Completions</h3>
        <p>{stats.completions}</p>
      </div>
      
      <div className="metric">
        <h3>Skip Rate</h3>
        <p>{((stats.skips / stats.starts) * 100).toFixed(1)}%</p>
      </div>
    </div>
  );
}
```

## Export Analytics Data

```tsx
function exportAnalytics() {
  const events = flowEngine.getAnalytics();
  const json = JSON.stringify(events, null, 2);
  
  // Download as JSON
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'onboarding-analytics.json';
  a.click();
}
```

## Integration with Analytics Services

### Google Analytics

```tsx
flowEngine.registerFlow({
  id: 'welcome-tour',
  steps: [...],
  onComplete: () => {
    // Track completion in Google Analytics
    gtag('event', 'onboarding_complete', {
      event_category: 'engagement',
      event_label: 'welcome_tour',
    });
  },
  onSkip: () => {
    gtag('event', 'onboarding_skip', {
      event_category: 'engagement',
      event_label: 'welcome_tour',
    });
  },
});
```

### Mixpanel

```tsx
flowEngine.registerFlow({
  id: 'welcome-tour',
  steps: [...],
  onComplete: () => {
    mixpanel.track('Onboarding Completed', {
      flow_id: 'welcome-tour',
      timestamp: Date.now(),
    });
  },
});
```

### Custom Analytics

```tsx
// Listen to all events
const events = flowEngine.getAnalytics();
events.forEach(event => {
  // Send to your analytics service
  yourAnalyticsService.track(event.event, {
    flowId: event.flowId,
    stepId: event.stepId,
    timestamp: event.timestamp,
    variant: event.variant,
  });
});
```

## Best Practices

1. **Track Key Metrics**: Focus on completion rate, skip rate, and time to complete
2. **A/B Test Regularly**: Test different approaches to find what works best
3. **Monitor Drop-off Points**: Identify where users abandon the flow
4. **Iterate Based on Data**: Use analytics to improve your onboarding
5. **Respect Privacy**: Only track necessary data and inform users

## Privacy Considerations

The Flow Engine stores data in localStorage by default. Consider:

- Adding a privacy notice
- Providing opt-out options
- Anonymizing user data
- Complying with GDPR/CCPA requirements
