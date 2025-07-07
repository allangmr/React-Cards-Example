import { createSelector } from '@reduxjs/toolkit';

import { Option, OptionItem, Step } from '~probuilder/features/steps/types/Step';
import { Layer, ProductVisualizerState, SelectedOption, VisualizerConfig } from '~probuilder/features/steps/types/ProductVisualizer';
import { selectSteps } from "~probuilder/store/rootSlice";

/**
 * Replaces tokens in a visualizer image URL template with actual values.
 */
export function transformVisualizerImagePath(config: VisualizerConfig): string {
  let transformedPath = config.visualizerImage;

  transformedPath = transformedPath.replace(/\{baseVisualizerPath\}/g, config.baseVisualizerPath);
  transformedPath = transformedPath.replace(/\{handingVisualizer\}/g, config.handingVisualizer);

  return transformedPath;
}

/**
 * Pure selector function for extracting all selected options with valid visualizer images.
 * @param steps - Array of Step from the state.
 * @returns Array of SelectedOption.
 */
function selectorAllSelectedOptions(steps: Step[]): SelectedOption[] {
  return steps
    .flatMap((step) =>
      step.availableOptions?.flatMap((option: Option) =>
        option.availableItems?.filter(
          (item: OptionItem) =>
            typeof item.id === 'string' &&
            item.isSelected === true &&
            !!item.visualizerImage?.src &&
            typeof item.visualizerImage.src === 'string' &&
            item.visualizerImage.src.trim() !== ''
        ).map((item: OptionItem) => ({
          id: item.id,
          isSelected: true,
          visualizerImage: { src: item.visualizerImage && typeof item.visualizerImage.src === 'string' ? item.visualizerImage.src : '' },
          zIndex: item.zIndex ?? null,
          label: item.label,
          value: item.value,
        })) || []
      ) || []
    );
}

/**
 * Selector for all selected options with valid visualizer images.
 */
export const selectAllSelectedOptions = createSelector(
  [selectSteps],
  selectorAllSelectedOptions
);

/**
 * Pure selector for visualizer config from state.
 */
function selectorVisualizerConfig(state: { configuration?: VisualizerConfig }): VisualizerConfig {
  return {
    baseVisualizerPath: state.configuration?.baseVisualizerPath || '/single-wood-doors',
    handingVisualizer: state.configuration?.handingVisualizer || 'left',
    visualizerImage: state.configuration?.visualizerImage || '{baseVisualizerPath}/{handingVisualizer}',
  };
}

/**
 * Selector for visualizer config.
 */
export const selectVisualizerConfig = createSelector(
  [(state: { configuration?: VisualizerConfig }) => state],
  selectorVisualizerConfig
);

/**
 * Pure selector for visualizer layers.
 */
function selectorVisualizerLayers(selectedOptions: SelectedOption[], config: VisualizerConfig): Layer[] {
  return selectedOptions
    .filter((option) => option.visualizerImage?.src && option.visualizerImage.src.trim() !== '')
    .map((option) => {
      const transformedUrl = transformVisualizerImagePath({
        baseVisualizerPath: config.baseVisualizerPath,
        handingVisualizer: config.handingVisualizer,
        visualizerImage: option.visualizerImage.src,
      });

      return {
        id: option.id,
        imageUrl: transformedUrl,
        zIndex: option.zIndex ? parseInt(option.zIndex, 10) : 0,
        isVisible: false,
        hasError: false,
      };
    })
    .sort((a, b) => a.zIndex - b.zIndex);
}

/**
 * Selector for visualizer layers.
 */
export const selectVisualizerLayers = createSelector(
  [selectAllSelectedOptions, selectVisualizerConfig],
  selectorVisualizerLayers
);

/**
 * Pure selector for ProductVisualizerState.
 */
function selectorProductVisualizer(layers: Layer[], config: VisualizerConfig): ProductVisualizerState {
  return {
    layers,
    configuration: {
      baseVisualizerPath: config.baseVisualizerPath,
      handingVisualizer: config.handingVisualizer,
      showWatermark: true, // If you want to support showWatermark, add it to VisualizerConfig and pass it here
    },
    isLoading: layers.some((layer) => !layer.isVisible && !layer.hasError),
    hasErrors: layers.some((layer) => layer.hasError),
  };
}

/**
 * Main selector for ProductVisualizer component.
 */
export const selectProductVisualizer = createSelector(
  [selectVisualizerLayers, selectVisualizerConfig],
  selectorProductVisualizer
);

/**
 * Selector to get only successfully loaded layers.
 */
export const selectLoadedVisualizerLayers = createSelector(
  [selectVisualizerLayers],
  (layers) => layers.filter((layer) => layer.isVisible && !layer.hasError)
);

/**
 * Selector to check if visualizer has any content to display.
 */
export const selectHasVisualizerContent = createSelector(
  [selectVisualizerLayers],
  (layers) => layers.length > 0
);

/**
 * Selector for debugging purposes - shows transformation details.
 */
export const selectVisualizerDebugInfo = createSelector(
  [selectAllSelectedOptions, selectVisualizerConfig, selectVisualizerLayers],
  (selectedOptions, config, layers) => ({
    totalSelectedOptions: selectedOptions.length,
    optionsWithVisualizerImages: selectedOptions.filter((opt) => opt.visualizerImage?.src).length,
    config,
    layers: layers.map((layer) => ({
      id: layer.id,
      originalUrl: selectedOptions.find((opt) => opt.id === layer.id)?.visualizerImage?.src,
      transformedUrl: layer.imageUrl,
      zIndex: layer.zIndex,
    })),
  })
);