import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { OnboardingProvider, useOnboarding, flowEngine, Checklist } from '../src';

// Register demo flows
flowEngine.registerFlow({
  id: 'welcome-tour',
  name: 'Welcome Tour',
  variant: 'A',
  dismissOnOverlayClick: true,
  steps: [
    {
      id: 'welcome',
      type: 'modal',
      title: 'Welcome! 👋',
      content: 'Let us show you around and help you get started with our amazing platform.',
      skippable: true,
    },
    {
      id: 'create-project',
      type: 'tooltip',
      title: 'Create Your First Project',
      content: 'Click here to create a new project and start building something awesome!',
      target: '#create-button',
      position: 'bottom',
      skippable: true,
    },
    {
      id: 'explore-features',
      type: 'spotlight',
      title: 'Explore Features',
      content: 'Check out all the amazing features we have to offer.',
      target: '.feature-grid',
      position: 'top',
    },
  ],
  theme: {
    primaryColor: '#3b82f6',
    borderRadius: '12px',
    spotlightPadding: 12,
    mode: 'auto',
  },
  onComplete: () => {
    alert('🎉 Tour completed! You\'re all set!');
  },
});

flowEngine.registerFlow({
  id: 'welcome-tour-b',
  name: 'Welcome Tour B',
  variant: 'B',
  dismissOnOverlayClick: false,
  steps: [
    {
      id: 'welcome',
      type: 'modal',
      title: '🚀 Get Started Fast',
      content: 'Quick tour to get you up and running in 30 seconds!',
      skippable: true,
    },
    {
      id: 'create-project',
      type: 'tooltip',
      title: 'Start Building',
      content: 'Create your first project right here!',
      target: '#create-button',
      position: 'right',
      skippable: true,
    },
  ],
  theme: {
    primaryColor: '#10b981',
    borderRadius: '16px',
    mode: 'dark',
  },
  onComplete: () => {
    alert('✅ You\'re ready to go!');
  },
});

function DemoApp() {
  const { startFlow } = useOnboarding();
  const [showChecklist, setShowChecklist] = React.useState(false);

  useEffect(() => {
    const startBtn = document.getElementById('start-tour');
    const checklistBtn = document.getElementById('show-checklist');
    const abTestBtn = document.getElementById('ab-test');

    if (startBtn) {
      startBtn.onclick = () => startFlow('welcome-tour');
    }

    if (checklistBtn) {
      checklistBtn.onclick = () => setShowChecklist(!showChecklist);
    }

    if (abTestBtn) {
      abTestBtn.onclick = () => {
        const variant = Math.random() > 0.5 ? 'A' : 'B';
        const flowId = variant === 'A' ? 'welcome-tour' : 'welcome-tour-b';
        startFlow(flowId, variant);
      };
    }
  }, [startFlow, showChecklist]);

  return (
    <>
      {showChecklist && (
        <Checklist
          title="Getting Started Checklist"
          items={[
            {
              id: '1',
              title: 'Complete the product tour',
              description: 'Learn about key features',
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
              title: 'Customize your settings',
              description: 'Make it your own',
              completed: false,
            },
          ]}
          onItemComplete={(id) => console.log('Completed:', id)}
          theme={{
            primaryColor: '#8b5cf6',
            borderRadius: '12px',
          }}
        />
      )}
    </>
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(
  <OnboardingProvider>
    <DemoApp />
  </OnboardingProvider>
);
