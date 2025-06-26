export interface NavigationStep {
    id: string;
    label: string;
    isEnabled: boolean;
    action?: () => void;
} 