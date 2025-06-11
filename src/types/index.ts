export interface Step {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  isCurrent: boolean;
}

export interface OptionCard {
  id: string;
  title: string;
  description: string;
  image: string;
  imageType: 'rounded' | 'square' | 'wide';
}

export interface Selection {
  stepId: number;
  selectedMaterialIds: string[];
  isMultiSelect: boolean;
}

export interface StepConfig {
  id: number;
  title: string;
  description: string;
  materials: Material[];
  isMultiSelect: boolean;
}

export interface ConfiguratorState {
  currentStep: number;
  steps: Step[];
  stepConfigs: StepConfig[];
  selections: Selection[];
  totalPrice: number;
}

export type ImageType = 'rounded' | 'square' | 'wide'; 