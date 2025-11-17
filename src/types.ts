export type StepType = 'tooltip' | 'modal' | 'checklist' | 'spotlight';

export interface Position {
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
}

export interface Step {
  id: string;
  type: StepType;
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

export interface StepAction {
  label: string;
  action: 'next' | 'prev' | 'skip' | 'complete' | ((flow: OnboardingFlow) => void);
  variant?: 'primary' | 'secondary' | 'ghost';
}

export interface ChecklistItem {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  action?: () => void;
}

export interface FlowConfig {
  id: string;
  name: string;
  steps: Step[];
  variant?: 'A' | 'B';
  onComplete?: () => void;
  onSkip?: () => void;
  theme?: ThemeConfig;
  dismissOnOverlayClick?: boolean;
}

export interface ThemeConfig {
  primaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  borderRadius?: string;
  fontFamily?: string;
  overlayColor?: string;
  spotlightPadding?: number;
  mode?: 'light' | 'dark' | 'auto';
}

export interface FlowProgress {
  flowId: string;
  currentStepIndex: number;
  completedSteps: string[];
  skipped: boolean;
  completed: boolean;
  startedAt: number;
  completedAt?: number;
  variant?: 'A' | 'B';
}

export interface AnalyticsEvent {
  flowId: string;
  stepId: string;
  event: 'start' | 'complete' | 'skip' | 'next' | 'prev' | 'dismiss';
  timestamp: number;
  variant?: 'A' | 'B';
  metadata?: Record<string, any>;
}

export interface OnboardingFlow {
  start: () => void;
  next: () => void;
  prev: () => void;
  skip: () => void;
  complete: () => void;
  goToStep: (stepId: string) => void;
  getProgress: () => FlowProgress;
  reset: () => void;
}
