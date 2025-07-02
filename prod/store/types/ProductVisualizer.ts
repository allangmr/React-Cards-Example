export interface VisualizerLayer {
  id: string;
  imageUrl: string;
  zIndex: number;
  isLoaded?: boolean;
  hasError?: boolean;
}

export interface VisualizerConfig {
  baseVisualizerPath: string;
  handingVisualizer: string;
  visualizerImage: string;
}

export interface ProductVisualizerState {
  layers: VisualizerLayer[];
  config: {
    baseVisualizerPath: string;
    handingVisualizer: string;
    showWatermark: boolean;
  };
  isLoading: boolean;
  hasErrors: boolean;
}

export interface SelectedOption {
  id: string;
  isSelected: boolean;
  visualizerImage: {
    src: string;
  };
  zIndex: string | null;
  label?: string;
  value?: string;
}

export interface CanvasImageLayer {
  image: HTMLImageElement;
  zIndex: number;
  id: string;
}

export interface WatermarkConfig {
  src: string;
  opacity?: number;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
}

export interface ProductVisualizerProps {
  className?: string;
  width?: number;
  height?: number;
  showWatermark?: boolean;
  onImageError?: (layerId: string, error: Error) => void;
  onLayersLoaded?: (loadedLayers: VisualizerLayer[]) => void;
} 