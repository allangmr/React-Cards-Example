import { createSelector } from '@reduxjs/toolkit';
import { VisualizerLayer, VisualizerConfig, ProductVisualizerState, SelectedOption } from '../types/ProductVisualizer';

// Using 'any' for RootState since it's not available in this boilerplate
type RootState = any;

/**
 * Replaces tokens in a visualizer image URL template with actual values.
 */
export const transformVisualizerImagePath = (config: VisualizerConfig): string => {
  let transformedPath = config.visualizerImage;
  
  // Replace {baseVisualizerPath}
  transformedPath = transformedPath.replace(
    /{baseVisualizerPath}/g,
    config.baseVisualizerPath
  );
  
  // Replace {handingVisualizer}
  transformedPath = transformedPath.replace(
    /{handingVisualizer}/g,
    config.handingVisualizer
  );
  
  return transformedPath;
};

/**
 * Extracts all selected options that have valid visualizer images
 */
const selectAllSelectedOptions = createSelector(
  [(state: RootState) => state.steps],
  (steps) => {
    const selectedOptions: SelectedOption[] = [];
    
    steps.forEach(step => {
      step.availableOptions?.forEach(option => {
        option.availableItems?.forEach(item => {
          if (item.isSelected && item.visualizerImage?.src) {
            selectedOptions.push(item);
          }
        });
      });
    });
    
    return selectedOptions;
  }
);

/**
 * Gets the visualizer configuration from the current state
 */
const selectVisualizerConfig = createSelector(
  [(state: RootState) => state],
  (state) => ({
    baseVisualizerPath: state.configuration?.baseVisualizerPath || '/single-wood-doors',
    handingVisualizer: state.configuration?.handingVisualizer || 'left',
    showWatermark: state.configuration?.showWatermark ?? true,
  })
);

/**
 * Transforms selected options into visualizer layers with proper URL transformation and sorting
 */
export const selectVisualizerLayers = createSelector(
  [selectAllSelectedOptions, selectVisualizerConfig],
  (selectedOptions, config) => {
    const layers: VisualizerLayer[] = selectedOptions
      .filter(option => option.visualizerImage?.src && option.visualizerImage.src.trim() !== '')
      .map(option => {
        const transformedUrl = transformVisualizerImagePath({
          baseVisualizerPath: config.baseVisualizerPath,
          handingVisualizer: config.handingVisualizer,
          visualizerImage: option.visualizerImage.src,
        });

        return {
          id: option.id,
          imageUrl: transformedUrl,
          zIndex: option.zIndex ? parseInt(option.zIndex, 10) : 0,
          isLoaded: false,
          hasError: false,
        };
      })
      .sort((a, b) => a.zIndex - b.zIndex); // Sort by zIndex ascending

    return layers;
  }
);

/**
 * Main selector for ProductVisualizer component
 */
export const selectProductVisualizer = createSelector(
  [selectVisualizerLayers, selectVisualizerConfig],
  (layers, config): ProductVisualizerState => ({
    layers,
    config,
    isLoading: layers.some(layer => !layer.isLoaded && !layer.hasError),
    hasErrors: layers.some(layer => layer.hasError),
  })
);

/**
 * Selector to get only successfully loaded layers
 */
export const selectLoadedVisualizerLayers = createSelector(
  [selectVisualizerLayers],
  (layers) => layers.filter(layer => layer.isLoaded && !layer.hasError)
);

/**
 * Selector to check if visualizer has any content to display
 */
export const selectHasVisualizerContent = createSelector(
  [selectVisualizerLayers],
  (layers) => layers.length > 0
);

/**
 * Selector for debugging purposes - shows transformation details
 */
export const selectVisualizerDebugInfo = createSelector(
  [selectAllSelectedOptions, selectVisualizerConfig, selectVisualizerLayers],
  (selectedOptions, config, layers) => ({
    totalSelectedOptions: selectedOptions.length,
    optionsWithVisualizerImages: selectedOptions.filter(opt => opt.visualizerImage?.src).length,
    config,
    layers: layers.map(layer => ({
      id: layer.id,
      originalUrl: selectedOptions.find(opt => opt.id === layer.id)?.visualizerImage?.src,
      transformedUrl: layer.imageUrl,
      zIndex: layer.zIndex,
    })),
  })
); 