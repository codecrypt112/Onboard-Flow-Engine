import { useEffect, useState } from 'react';
import { flowEngine } from '../core/FlowEngine';
import { FlowConfig, FlowProgress } from '../types';

export const useFlow = (flowId: string) => {
  const [progress, setProgress] = useState<FlowProgress | null>(null);

  useEffect(() => {
    const p = flowEngine.getProgress(flowId);
    setProgress(p || null);
  }, [flowId]);

  return {
    progress,
    completionRate: flowEngine.getCompletionRate(flowId),
    analytics: flowEngine.getAnalytics(flowId),
  };
};

export const useABTest = (flowId: string) => {
  const [variant, setVariant] = useState<'A' | 'B'>('A');

  useEffect(() => {
    setVariant(Math.random() > 0.5 ? 'A' : 'B');
  }, []);

  const results = flowEngine.getABTestResults(flowId);

  return {
    variant,
    results,
    winningVariant: results.A > results.B ? 'A' : results.B > results.A ? 'B' : null,
  };
};
