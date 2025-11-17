import { FlowConfig, FlowProgress, AnalyticsEvent, Step } from '../types';

export class FlowEngine {
  private flows: Map<string, FlowConfig> = new Map();
  private progress: Map<string, FlowProgress> = new Map();
  private analytics: AnalyticsEvent[] = [];
  private storageKey = 'onboarding_flow_progress';

  constructor() {
    this.loadProgress();
  }

  registerFlow(config: FlowConfig): void {
    this.flows.set(config.id, config);
  }

  getFlow(flowId: string): FlowConfig | undefined {
    return this.flows.get(flowId);
  }

  getProgress(flowId: string): FlowProgress | undefined {
    return this.progress.get(flowId);
  }

  initializeProgress(flowId: string, variant?: 'A' | 'B'): FlowProgress {
    const existing = this.progress.get(flowId);
    if (existing && !existing.completed) {
      return existing;
    }

    const progress: FlowProgress = {
      flowId,
      currentStepIndex: 0,
      completedSteps: [],
      skipped: false,
      completed: false,
      startedAt: Date.now(),
      variant,
    };

    this.progress.set(flowId, progress);
    this.saveProgress();
    return progress;
  }

  updateProgress(flowId: string, updates: Partial<FlowProgress>): void {
    const current = this.progress.get(flowId);
    if (!current) return;

    const updated = { ...current, ...updates };
    this.progress.set(flowId, updated);
    this.saveProgress();
  }

  completeStep(flowId: string, stepId: string): void {
    const progress = this.progress.get(flowId);
    if (!progress) return;

    if (!progress.completedSteps.includes(stepId)) {
      progress.completedSteps.push(stepId);
      this.saveProgress();
    }

    this.trackEvent({
      flowId,
      stepId,
      event: 'complete',
      timestamp: Date.now(),
      variant: progress.variant,
    });
  }

  trackEvent(event: AnalyticsEvent): void {
    this.analytics.push(event);
    this.saveAnalytics();
  }

  getAnalytics(flowId?: string): AnalyticsEvent[] {
    if (flowId) {
      return this.analytics.filter(e => e.flowId === flowId);
    }
    return this.analytics;
  }

  getCompletionRate(flowId: string): number {
    const events = this.getAnalytics(flowId);
    const starts = events.filter(e => e.event === 'start').length;
    const completions = events.filter(e => e.event === 'complete').length;
    return starts > 0 ? (completions / starts) * 100 : 0;
  }

  getABTestResults(flowId: string): { A: number; B: number } {
    const events = this.getAnalytics(flowId);
    const variantA = events.filter(e => e.variant === 'A' && e.event === 'complete').length;
    const variantB = events.filter(e => e.variant === 'B' && e.event === 'complete').length;
    return { A: variantA, B: variantB };
  }

  resetProgress(flowId: string): void {
    this.progress.delete(flowId);
    this.saveProgress();
  }

  private saveProgress(): void {
    if (typeof window !== 'undefined') {
      const data = Array.from(this.progress.entries());
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    }
  }

  private loadProgress(): void {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        try {
          const data = JSON.parse(stored);
          this.progress = new Map(data);
        } catch (e) {
          console.error('Failed to load progress:', e);
        }
      }
    }
  }

  private saveAnalytics(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('onboarding_analytics', JSON.stringify(this.analytics));
    }
  }
}

export const flowEngine = new FlowEngine();
