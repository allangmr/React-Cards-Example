import { fn } from '@storybook/test';

import type { UseProductVisualizerReturn } from './useProductVisualizer';

import stubData from "./structure.json";
import type { Layer, VisualizerConfig } from '~probuilder/features/steps/types/ProductVisualizer';

// Type for availableItems in stubData
interface StubVisualizerItem {
  id: string;
  visualizerImageUrl: string;
  zIndex: string | number;
}

const defaultConfig: VisualizerConfig = {
  baseVisualizerPath: '/src/assets/images/single-wood-doors',
  handingVisualizer: 'left',
  visualizerImage: '/assets/door.png',
};

export type ProductVisualizerMockState =
  | 'empty'
  | 'singleLayer'
  | 'multipleLayers'
  | 'loading'
  | 'withErrors'
  | 'allErrors';

export interface ProductVisualizerMockConfig {
  state?: ProductVisualizerMockState;
  error?: Error;
  overrides?: Partial<UseProductVisualizerReturn>;
}

// Image cache para mantener vivas las instancias de imagen por layer.id
const imageCache: Record<string, HTMLImageElement> = {};

/**
 * Initialize an image element with una URL pública y espera a que cargue.
 */
function initializeImage(src: string, id: string): HTMLImageElement {
  if (imageCache[id]) {
    return imageCache[id];
  }

  const img = new window.Image();

  // Create a promise to handle image loading
  const loadPromise = new Promise<void>((resolve) => {
    img.onload = () => {
      img.onload = null;
      resolve();
    };
  });

  // Start loading the image
  img.src = src;

  // Store both the image and its loading promise
  imageCache[id] = img;

  // Wait for image to load if it's not already loaded
  if (!img.complete || !img.naturalWidth) {
    loadPromise.then(() => {
      // Image is now loaded and ready to use
    });
  }

  return img;
}

/**
 * Maps stub items to layer objects
 */
function mapStubItemsToLayers(items: StubVisualizerItem[]): Layer[] {
  return items.map((item) => ({
    id: item.id,
    imageUrl: item.visualizerImageUrl.replace('{baseVisualizerPath}', defaultConfig.baseVisualizerPath),
    zIndex: Number(item.zIndex) || 1,
    isVisible: true,
    hasError: false,
  }));
}

/**
 * Get stub visualizer items from stubData.layout
 * Traverse stubData.layout to collect all selected/available items with a visualizerImage
 */
function getStubVisualizerItemsFromStubData(): StubVisualizerItem[] {
  const items: StubVisualizerItem[] = [];

  if (!stubData?.layout) return items;

  stubData.layout.forEach((step) => {
    if (!step.availableOptions) return;

    step.availableOptions.forEach((option) => {
      if (!option.availableItems) return;

      option.availableItems.forEach((item) => {
        if (item.visualizerImageUrl && !item.visualizerImageUrl.includes('/fake/path')) {
          items.push({
            id: item.id,
            visualizerImageUrl: item.visualizerImageUrl,
            zIndex: item.zIndex || 1
          });
        }
      });
    });
  });

  return items;
}

/**
 * Returns a mocked ProductVisualizer state for Storybook/testing.
 * Allows scenario selection and field overrides.
 */
export function getMockedProductVisualizer({
  state = 'singleLayer',
  error,
  overrides = {},
}: ProductVisualizerMockConfig = {}): UseProductVisualizerReturn {
  // Use stubData to generate mockItems
  const stubItems = getStubVisualizerItemsFromStubData();

  // Fallback to hardcoded if stubData is empty
  const mockItems: StubVisualizerItem[] = stubItems.length > 0 ? stubItems : [
    {
      id: 'door-single',
      visualizerImageUrl: 'https://placehold.co/400x400',
      zIndex: 100,
    },
    {
      id: 'door-frame',
      visualizerImageUrl: 'https://placehold.co/300x300',
      zIndex: 200,
    },
    {
      id: 'door-hardware',
      visualizerImageUrl: 'https://placehold.co/200x200',
      zIndex: 300,
    },
  ];

  const layers = (() => {
    switch (state) {
      case 'empty':
        return [];
      case 'singleLayer':
        return mapStubItemsToLayers([mockItems[0]]);
      case 'multipleLayers':
        return mapStubItemsToLayers(mockItems);
      case 'loading':
        return mapStubItemsToLayers([mockItems[0]]).map((layer) => ({ ...layer, isVisible: false }));
      case 'withErrors':
        return mapStubItemsToLayers(mockItems).map((layer, index) => ({
          ...layer,
          isVisible: index === 0,
          hasError: index === 1,
        }));
      case 'allErrors':
        return mapStubItemsToLayers(mockItems).map((layer) => ({
          ...layer,
          isVisible: false,
          hasError: true,
        }));
      default:
        return [];
    }
  })();

  const loadedLayers = layers.filter((layer) => layer.isVisible && !layer.hasError);

  const canvasLayers = loadedLayers.map((layer, idx) => ({
    id: layer.id,
    image: initializeImage(layer.imageUrl, layer.id),
    zIndex: layer.zIndex
  }));

  return {
    layers,
    loadedLayers,
    canvasLayers,
    config: {
      baseVisualizerPath: defaultConfig.baseVisualizerPath,
      handingVisualizer: defaultConfig.handingVisualizer,
      showWatermark: true,
    },
    isLoading: layers.some((layer) => !layer.isVisible && !layer.hasError),
    hasErrors: layers.some((layer) => layer.hasError),
    hasContent: layers.length > 0,
    loadImage: async (layer: Layer) => {
      return new Promise((resolve) => {
        const img = new Image();

        img.onload = () => resolve(img);

        img.src = layer.imageUrl;
      });
    },
    getImageErrors: () => layers.filter((layer) => layer.hasError).map((layer) => ({
      layerId: layer.id,
      error: 'Failed to load image'
    })),
    renderCanvas: async (canvas: HTMLCanvasElement) => {
      const ctx = canvas.getContext('2d');

      if (!ctx || canvasLayers.length === 0) {
        return;
      }

      // Set canvas size to accommodate the largest image plus margins
      canvas.width = 500;
      canvas.height = 500;

      // Clear canvas once at the start
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Sort by zIndex ascending (lowest first)
      const sortedLayers = [...canvasLayers].sort((a, b) => a.zIndex - b.zIndex);

      // Wait for all images to load before starting to draw
      await Promise.all(
        sortedLayers.map((layer) =>
          new Promise<void>((resolve) => {
            if (layer.image.complete && layer.image.naturalWidth) {
              resolve();
            } else {
              /**
               *
               */
              function onLoad (): void {
                layer.image.removeEventListener('load', onLoad);
                resolve();
              }

              layer.image.addEventListener('load', onLoad);
            }
          })
        )
      );

      // Now draw all images in order with layered effect
      for (let i = 0; i < sortedLayers.length; i++) {
        const layer = sortedLayers[i];
        
        // Get the natural dimensions of the image
        const { naturalWidth, naturalHeight } = layer.image;

        // Create layered positioning - each layer slightly offset to show all layers
        const baseOffsetX = (sortedLayers.length - 1 - i) * 15; // Offset decreases for higher zIndex
        const baseOffsetY = (sortedLayers.length - 1 - i) * 15;

        // Calculate position (top-left positioned with offsets for layered effect)
        const x = Math.floor((canvas.width - naturalWidth) / 2 - baseOffsetX);
        const y = Math.floor((canvas.height - naturalHeight) / 2 - baseOffsetY);

        // Draw image at its natural size
        ctx.drawImage(layer.image, x, y);

        // Optional: Add a subtle border to each layer for better visualization
        ctx.strokeStyle = `rgba(0, 0, 0, 0.2)`;
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, naturalWidth, naturalHeight);
      }
    },
    clearCanvas: (canvas: HTMLCanvasElement) => {
      // Mock implementation
      const ctx = canvas.getContext('2d');

      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    },
    ...overrides,
  };
}

// Module-level variable to hold the current mocked visualizer
let currentMockedVisualizer: ReturnType<typeof getMockedProductVisualizer> = getMockedProductVisualizer({ state: 'singleLayer' });

// Setter to update the current mocked visualizer
/**
 *
 */
export function setMockedProductVisualizer(val: ReturnType<typeof getMockedProductVisualizer>) {
  currentMockedVisualizer = val;
}

/**
 * Mock implementation of the useProductVisualizer hook
 */
export const useProductVisualizer = fn(() => {
  // Always return the current mocked visualizer
  return currentMockedVisualizer;
});