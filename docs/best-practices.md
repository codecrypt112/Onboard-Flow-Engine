# ✨ Best Practices

Guidelines for creating effective onboarding experiences.

## General Principles

### Keep It Short
- Limit tours to 3-5 steps
- Each step should take < 10 seconds to read
- Focus on essential features only

### Make It Skippable
- Always allow users to skip
- Don't force users through long tours
- Provide a "Skip Tour" option

```tsx
flowEngine.registerFlow({
  id: 'my-tour',
  dismissOnOverlayClick: true, // Allow dismissal
  steps: [
    {
      id: 'step-1',
      type: 'modal',
      title: 'Welcome',
      content: 'Quick intro',
      skippable: true, // Allow skipping
    },
  ],
});
```

### Progressive Disclosure
- Show features when relevant
- Use conditional steps
- Don't overwhelm new users

```tsx
{
  id: 'advanced-feature',
  type: 'tooltip',
  title: 'Advanced Feature',
  content: 'This is for power users',
  condition: () => user.experienceLevel === 'advanced',
}
```

## Step Design

### Tooltips
- Use for contextual help
- Point to specific UI elements
- Keep content brief (1-2 sentences)

```tsx
{
  id: 'tooltip-step',
  type: 'tooltip',
  title: 'Create Project',
  content: 'Click here to start a new project.',
  target: '#create-button',
  position: 'bottom',
}
```

### Modals
- Use for important announcements
- Ideal for welcome messages
- Include clear call-to-action

```tsx
{
  id: 'modal-step',
  type: 'modal',
  title: 'Welcome! 👋',
  content: 'Let us show you around in 2 minutes.',
}
```

### Spotlights
- Highlight key features
- Draw attention to important elements
- Use sparingly for maximum impact

```tsx
{
  id: 'spotlight-step',
  type: 'spotlight',
  title: 'New Feature',
  content: 'Check out our latest addition!',
  target: '#new-feature',
}
```

## Timing

### When to Show Tours

**Good Times:**
- First login
- After major updates
- When user seems stuck
- On feature launch

**Bad Times:**
- During critical tasks
- When user is actively working
- Too frequently

### Implementation

```tsx
function App() {
  const { startFlow } = useOnboarding();
  
  useEffect(() => {
    const hasSeenTour = localStorage.getItem('hasSeenTour');
    const isFirstLogin = !hasSeenTour;
    
    if (isFirstLogin) {
      // Wait a moment for page to load
      setTimeout(() => {
        startFlow('welcome-tour');
        localStorage.setItem('hasSeenTour', 'true');
      }, 1000);
    }
  }, []);
}
```

## Content Writing

### Clear and Concise
❌ Bad: "This button, when clicked, will allow you to create a new project in your workspace."

✅ Good: "Create a new project here."

### Action-Oriented
❌ Bad: "This is where projects are created."

✅ Good: "Click here to create a project."

### Friendly Tone
❌ Bad: "User must complete profile."

✅ Good: "Let's set up your profile! 😊"

## Theming

### Consistent Branding
```tsx
const brandTheme = {
  primaryColor: '#your-brand-color',
  borderRadius: '12px',
  fontFamily: 'Your Brand Font',
  mode: 'auto',
};

flowEngine.registerFlow({
  id: 'tour',
  theme: brandTheme,
  steps: [...],
});
```

### Accessibility
- Ensure sufficient color contrast
- Use readable font sizes
- Support dark mode
- Test with screen readers

```tsx
theme: {
  mode: 'auto', // Respects user preference
  primaryColor: '#3b82f6', // WCAG AA compliant
  textColor: '#1f2937', // High contrast
}
```

## Performance

### Lazy Load Tours
```tsx
// Only load tour when needed
const loadTour = async () => {
  const { flowEngine } = await import('@onboard/flow-engine');
  flowEngine.registerFlow({...});
};
```

### Optimize Targets
```tsx
// Use specific selectors
target: '#create-button' // ✅ Good

// Avoid complex selectors
target: 'div > div > button.create' // ❌ Slow
```

## Testing

### Test All Scenarios
- New users
- Returning users
- Different screen sizes
- Light and dark modes
- With/without dismissal

### A/B Testing
```tsx
// Test different approaches
const { variant } = useABTest('onboarding');

// Analyze results
const results = flowEngine.getABTestResults('onboarding');
console.log('Winner:', results.A > results.B ? 'A' : 'B');
```

## Analytics

### Track Key Metrics
```tsx
const metrics = {
  completionRate: flowEngine.getCompletionRate('tour'),
  skipRate: calculateSkipRate(),
  avgTimeToComplete: calculateAvgTime(),
  dropOffPoints: findDropOffPoints(),
};
```

### Iterate Based on Data
- Monitor completion rates
- Identify drop-off points
- Test improvements
- Measure impact

## Common Mistakes to Avoid

### ❌ Too Many Steps
Don't create 10+ step tours. Users will skip them.

### ❌ Blocking Critical Actions
Don't prevent users from using the app during onboarding.

### ❌ No Skip Option
Always allow users to skip or dismiss.

### ❌ Poor Timing
Don't show tours when users are busy or focused.

### ❌ Generic Content
Personalize content based on user context.

### ❌ Ignoring Mobile
Test on mobile devices and tablets.

## Checklist Best Practices

### Progressive Checklists
```tsx
<Checklist
  title="Get Started"
  items={[
    { id: '1', title: 'Easy task', completed: false },
    { id: '2', title: 'Medium task', completed: false },
    { id: '3', title: 'Advanced task', completed: false },
  ]}
/>
```

### Celebrate Completion
```tsx
const handleComplete = (itemId) => {
  // Show celebration
  if (allItemsComplete()) {
    showConfetti();
    showSuccessMessage('🎉 All done!');
  }
};
```

## Accessibility Guidelines

### Keyboard Navigation
- Ensure all interactive elements are keyboard accessible
- Support Tab, Enter, and Escape keys
- Provide clear focus indicators

### Screen Readers
- Use semantic HTML
- Provide alt text for images
- Include ARIA labels where needed

### Color Contrast
- Maintain WCAG AA standards (4.5:1 for normal text)
- Test in both light and dark modes
- Don't rely solely on color to convey information

## Mobile Considerations

### Responsive Design
- Test on various screen sizes
- Adjust tooltip positions for mobile
- Use appropriate font sizes

### Touch Targets
- Ensure buttons are large enough (44x44px minimum)
- Provide adequate spacing between interactive elements
- Test on actual devices

## Maintenance

### Regular Updates
- Review analytics monthly
- Update content as features change
- Remove outdated tours
- Test after major updates

### Version Control
```tsx
flowEngine.registerFlow({
  id: 'welcome-tour-v2',
  name: 'Welcome Tour v2',
  // Updated content
});
```

## Resources

- [Getting Started Guide](./getting-started.md)
- [API Reference](./api-reference.md)
- [Examples](./examples.md)
- [Analytics Guide](./analytics.md)
