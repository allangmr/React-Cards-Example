// Export the main component
export { default as ProductVisualizer } from './ProductVisualizer';
export { default } from './ProductVisualizer';

// Export types for external usage
export type {
  ProductVisualizerProps,
  VisualizerLayer,
  VisualizerConfig,
  ProductVisualizerState,
  CanvasImageLayer,
  WatermarkConfig,
} from '../../store/types/ProductVisualizer';

// Export hook for direct usage
export { useProductVisualizer } from '../../store/hooks/useProductVisualizer';
export type { UseProductVisualizerReturn } from '../../store/hooks/useProductVisualizer';

// Export mock utilities for testing
export {
  createMockUseProductVisualizer,
  mockScenarios,
  transformationTestCases,
} from '../../store/hooks/useProductVisualizer.mock';

// Export selectors for integration
export {
  selectProductVisualizer,
  selectVisualizerLayers,
  selectLoadedVisualizerLayers,
  selectHasVisualizerContent,
  selectVisualizerDebugInfo,
  transformVisualizerImagePath,
} from '../../store/selectors/selectProductVisualizer'; 