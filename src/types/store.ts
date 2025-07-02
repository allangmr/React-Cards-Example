// Store types for door configurator

export interface Tag {
  label: string;
}

export interface AvailableItem {
  id: string;
  label: string;
  value: string;
  imageUrl: string;
  visualizerImageUrl: string;
  zIndex: string;
  isMostPopular: boolean;
  isVisible: boolean;
  isSelected: boolean;
  description: string;
  tag: Tag;
}

export interface AvailableOption {
  id: string;
  title: string;
  subTitle: string;
  type: string; // 'VisualPicker', 'Dropdown', etc.
  availableItems: AvailableItem[];
  selectedItems: AvailableItem[];
}

export interface StepData {
  id: string;
  name: string;
  icon: string;
  active: boolean;
  completed: boolean;
  selectedOptions: any[]; // Can be customized based on specific needs
  availableOptions: AvailableOption[];
}

export interface DoorConfiguratorState {
  steps: StepData[];
  currentStepIndex: number;
  totalPrice: number;
  isLoading: boolean;
}

export interface RootState {
  doorConfigurator: DoorConfiguratorState;
} 