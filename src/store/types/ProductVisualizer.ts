// Basic visualizer layer interface
export interface VisualizerLayer {
  id: string;
  imageUrl: string;
  zIndex: number;
  isLoaded?: boolean;
  hasError?: boolean;
}

// Configuration for URL transformation
export interface VisualizerConfig {
  baseVisualizerPath: string;
  handingVisualizer: string;
  visualizerImage: string;
}

// Main state interface for the product visualizer
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

// Selected option from Redux store
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

// Canvas image layer for rendering
export interface CanvasImageLayer {
  image: HTMLImageElement;
  zIndex: number;
  id: string;
}

// Watermark configuration
export interface WatermarkConfig {
  src: string;
  opacity?: number;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
}

// Props for ProductVisualizer component
export interface ProductVisualizerProps {
  className?: string;
  width?: number;
  height?: number;
  showWatermark?: boolean;
  onImageError?: (layerId: string, error: Error) => void;
  onLayersLoaded?: (loadedLayers: VisualizerLayer[]) => void;
}

 