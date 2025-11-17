import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { FlowConfig, OnboardingFlow, FlowProgress } from '../types';
import { flowEngine } from '../core/FlowEngine';
import { TooltipStep } from './TooltipStep';
import { ModalStep } from './ModalStep';
import { Spotlight } from './Spotlight';

interface OnboardingContextValue {
  startFlow: (flowId: string, variant?: 'A' | 'B') => void;
  currentFlow: OnboardingFlow | null;
  progress: FlowProgress | null;
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeFlowId, setActiveFlowId] = useState<string | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState<FlowProgress | null>(null);

  const config = activeFlowId ? flowEngine.getFlow(activeFlowId) : null;
  const currentStep = config?.steps[currentStepIndex];

  const updateProgress = useCallback(() => {
    if (activeFlowId) {
      const p = flowEngine.getProgress(activeFlowId);
      setProgress(p || null);
    }
  }, [activeFlowId]);

  const startFlow = useCallback((flowId: string, variant?: 'A' | 'B') => {
    const flow = flowEngine.getFlow(flowId);
    if (!flow) return;

    const prog = flowEngine.initializeProgress(flowId, variant);
    setActiveFlowId(flowId);
    setCurrentStepIndex(0);
    setProgress(prog);

    flowEngine.trackEvent({
      flowId,
      stepId: flow.steps[0]?.id || '',
      event: 'start',
      timestamp: Date.now(),
      variant,
    });
  }, []);

  const next = useCallback(() => {
    if (!config || !activeFlowId) return;

    if (currentStep) {
      flowEngine.completeStep(activeFlowId, currentStep.id);
      currentStep.onExit?.();
    }

    if (currentStepIndex < config.steps.length - 1) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      config.steps[nextIndex]?.onEnter?.();
      
      flowEngine.trackEvent({
        flowId: activeFlowId,
        stepId: config.steps[nextIndex].id,
        event: 'next',
        timestamp: Date.now(),
        variant: progress?.variant,
      });
    } else {
      complete();
    }
    updateProgress();
  }, [config, activeFlowId, currentStepIndex, currentStep, progress, updateProgress]);

  const prev = useCallback(() => {
    if (!config || !activeFlowId || currentStepIndex === 0) return;

    currentStep?.onExit?.();
    const prevIndex = currentStepIndex - 1;
    setCurrentStepIndex(prevIndex);
    config.steps[prevIndex]?.onEnter?.();

    flowEngine.trackEvent({
      flowId: activeFlowId,
      stepId: config.steps[prevIndex].id,
      event: 'prev',
      timestamp: Date.now(),
      variant: progress?.variant,
    });
    updateProgress();
  }, [config, activeFlowId, currentStepIndex, currentStep, progress, updateProgress]);

  const skip = useCallback(() => {
    if (!activeFlowId || !config) return;

    flowEngine.updateProgress(activeFlowId, { skipped: true, completedAt: Date.now() });
    flowEngine.trackEvent({
      flowId: activeFlowId,
      stepId: currentStep?.id || '',
      event: 'skip',
      timestamp: Date.now(),
      variant: progress?.variant,
    });

    config.onSkip?.();
    setActiveFlowId(null);
    updateProgress();
  }, [activeFlowId, config, currentStep, progress, updateProgress]);

  const complete = useCallback(() => {
    if (!activeFlowId || !config) return;

    flowEngine.updateProgress(activeFlowId, { completed: true, completedAt: Date.now() });
    flowEngine.trackEvent({
      flowId: activeFlowId,
      stepId: currentStep?.id || '',
      event: 'complete',
      timestamp: Date.now(),
      variant: progress?.variant,
    });

    config.onComplete?.();
    setActiveFlowId(null);
    updateProgress();
  }, [activeFlowId, config, currentStep, progress, updateProgress]);

  const goToStep = useCallback((stepId: string) => {
    if (!config) return;
    const index = config.steps.findIndex(s => s.id === stepId);
    if (index !== -1) {
      setCurrentStepIndex(index);
      updateProgress();
    }
  }, [config, updateProgress]);

  const currentFlow: OnboardingFlow | null = activeFlowId ? {
    start: () => startFlow(activeFlowId),
    next,
    prev,
    skip,
    complete,
    goToStep,
    getProgress: () => progress!,
    reset: () => {
      flowEngine.resetProgress(activeFlowId);
      setActiveFlowId(null);
      updateProgress();
    },
  } : null;

  return (
    <OnboardingContext.Provider value={{ startFlow, currentFlow, progress }}>
      {children}
      {activeFlowId && config && currentStep && (
        <>
          {currentStep.target && (
            <Spotlight 
              target={currentStep.target} 
              theme={config.theme}
              onDismiss={config.dismissOnOverlayClick ? skip : undefined}
            />
          )}
          {currentStep.type === 'tooltip' && (
            <TooltipStep
              step={currentStep}
              onNext={next}
              onPrev={prev}
              onSkip={skip}
              onDismiss={config.dismissOnOverlayClick ? skip : undefined}
              isFirst={currentStepIndex === 0}
              isLast={currentStepIndex === config.steps.length - 1}
              theme={config.theme}
            />
          )}
          {currentStep.type === 'modal' && (
            <ModalStep
              step={currentStep}
              onNext={next}
              onPrev={prev}
              onSkip={skip}
              onDismiss={config.dismissOnOverlayClick ? skip : undefined}
              isFirst={currentStepIndex === 0}
              isLast={currentStepIndex === config.steps.length - 1}
              theme={config.theme}
            />
          )}
        </>
      )}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return context;
};
