import { useSelector } from 'react-redux';
import { useCallback, useEffect, useRef, useState } from 'react';

import { CanvasImageLayer, Layer, WatermarkConfig } from '../types/ProductVisualizer';

import {
  selectHasVisualizerContent,
  selectLoadedVisualizerLayers,
  selectProductVisualizer,
} from "~probuilder/features/steps/selectors/selectProductVisualizer";

export interface UseProductVisualizerReturn {
  layers: Layer[];
  loadedLayers: Layer[];
  config: {
    baseVisualizerPath: string;
    handingVisualizer: string;
    showWatermark: boolean;
  };
  isLoading: boolean;
  hasErrors: boolean;
  hasContent: boolean;
  canvasLayers: CanvasImageLayer[];
  loadImage: (layer: Layer) => Promise;
  renderCanvas: (canvas: HTMLCanvasElement, watermarkConfig?: WatermarkConfig) => Promise<void>;
  clearCanvas: (canvas: HTMLCanvasElement) => void;
  getImageErrors: () => Array<{ layerId: string; error: string }>;
}

const DEFAULT_WATERMARK_CONFIG: WatermarkConfig = {
  src: '/assets/watermark.png',
  opacity: 0.3,
  position: 'center',
};

// Helper for path transformation
/**
 * Replaces tokens in a visualizer image URL template with actual values.
 * @param config An object containing the baseVisualizerPath and handingVisualizer.
 * @param imagePath The image path string with tokens.
 * @returns The transformed image URL string.
 */
function transformVisualizerImagePath(config: { baseVisualizerPath: string; handingVisualizer: string }, imagePath: string): string {
  return imagePath
    .replace(/\{baseVisualizerPath\}/g, config.baseVisualizerPath)
    .replace(/\{handingVisualizer\}/g, config.handingVisualizer);
}

// eslint-disable-next-line func-style
export const useProductVisualizer = (): UseProductVisualizerReturn => {
  const visualizerState = useSelector(selectProductVisualizer);
  const loadedLayers = useSelector(selectLoadedVisualizerLayers);
  const hasContent = useSelector(selectHasVisualizerContent);

  const [canvasLayers, setCanvasLayers] = useState<CanvasImageLayer[]>([]);
  const [imageErrors, setImageErrors] = useState<Array<{ layerId: string; error: string }>>([]);
  const loadedImagesRef = useRef<Map<string, HTMLImageElement>>(new Map());

  /**
   * Loads an image and handles errors gracefully
   */
  const loadImage = useCallback(async (layer: Layer): Promise => {
    return new Promise((resolve, reject) => {
      // Check if image is already loaded
      const cachedImage = loadedImagesRef.current.get(layer.id);

      if (cachedImage) {
        resolve(cachedImage);

        return;
      }

      const img = new Image();

      img.crossOrigin = 'anonymous'; // Enable CORS for canvas usage

      img.onload = () => {
        loadedImagesRef.current.set(layer.id, img);
        setImageErrors((prev) => prev.filter((error) => error.layerId !== layer.id));
        resolve(img);
      };

      img.onerror = (error) => {
        const errorMessage = `Failed to load image: ${layer.imageUrl}`;

        setImageErrors((prev) => [
          ...prev.filter((error) => error.layerId !== layer.id),
          { layerId: layer.id, error: errorMessage }
        ]);
        reject(new Error(errorMessage));
      };

      img.src = layer.imageUrl;
    });
  }, []);

  /**
   * Loads all images for canvas rendering
   */
  const loadAllImages = useCallback(async () => {
    // Filter for valid imageUrl and sort by zIndex
    const validLayers = visualizerState.layers
      .filter((layer) => !!layer.imageUrl)
      .sort((a, b) => Number(a.zIndex) - Number(b.zIndex));

    const imagePromises = validLayers.map(async (layer) => {
      try {
        // Apply path transformation
        const transformedUrl = transformVisualizerImagePath(visualizerState.configuration, layer.imageUrl);
        const image = await loadImage({ ...layer, imageUrl: transformedUrl });

        return {
          image,
          zIndex: layer.zIndex,
          id: layer.id,
        };
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);

        return null;
      }
    });

    const results = await Promise.allSettled(imagePromises);
    const successfulLayers = results
      .filter((result): result is PromiseFulfilledResult<CanvasImageLayer | null> =>
        result.status === 'fulfilled' && result.value !== null
      )
      .map((result) => result.value as CanvasImageLayer)
      .sort((a, b) => a.zIndex - b.zIndex);

    setCanvasLayers(successfulLayers);
  }, [visualizerState.layers, visualizerState.configuration, loadImage]);

  /**
   * Clears the canvas
   */
  const clearCanvas = useCallback((canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, []);

  /**
   * Loads watermark image
   */
  const loadWatermarkImage = useCallback(async (src: string): Promise => {
    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }, []);

  /**
   * Draws watermark on canvas
   */
  const drawWatermark = useCallback((
    ctx: CanvasRenderingContext2D,
    watermarkImg: HTMLImageElement,
    canvas: HTMLCanvasElement,
    config: WatermarkConfig
  ) => {
    const oldGlobalAlpha = ctx.globalAlpha;

    ctx.globalAlpha = config.opacity || 0.3;

    const watermarkSize = Math.min(canvas.width, canvas.height) * 0.3;
    const aspectRatio = watermarkImg.naturalWidth / watermarkImg.naturalHeight;
    const watermarkWidth = watermarkSize * aspectRatio;
    const watermarkHeight = watermarkSize;

    let x: number, y: number;

    switch (config.position) {
      case 'top-left':
        x = 20;
        y = 20;
        break;
      case 'top-right':
        x = canvas.width - watermarkWidth - 20;
        y = 20;
        break;
      case 'bottom-left':
        x = 20;
        y = canvas.height - watermarkHeight - 20;
        break;
      case 'bottom-right':
        x = canvas.width - watermarkWidth - 20;
        y = canvas.height - watermarkHeight - 20;
        break;
      case 'center':
      default:
        x = (canvas.width - watermarkWidth) / 2;
        y = (canvas.height - watermarkHeight) / 2;
        break;
    }

    ctx.drawImage(watermarkImg, x, y, watermarkWidth, watermarkHeight);
    ctx.globalAlpha = oldGlobalAlpha;
  }, []);

  /**
   * Renders all layers onto the canvas
   */
  const renderCanvas = useCallback(async (
    canvas: HTMLCanvasElement,
    watermarkConfig: WatermarkConfig = DEFAULT_WATERMARK_CONFIG
  ): Promise<void> => {
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // Clear canvas
    clearCanvas(canvas);

    // Set canvas size if not already set
    if (canvas.width === 0 || canvas.height === 0) {
      canvas.width = canvas.offsetWidth || 400;
      canvas.height = canvas.offsetHeight || 400;
    }

    // Draw all image layers with layered effect
    for (let i = 0; i < canvasLayers.length; i++) {
      const layer = canvasLayers[i];
      try {
        // Scale image to fit canvas while maintaining aspect ratio
        const scale = Math.min(
          canvas.width / layer.image.naturalWidth,
          canvas.height / layer.image.naturalHeight
        );

        const scaledWidth = layer.image.naturalWidth * scale;
        const scaledHeight = layer.image.naturalHeight * scale;

        // Create layered positioning - each layer slightly offset to show all layers
        const baseOffsetX = (canvasLayers.length - 1 - i) * 15; // Offset decreases for higher zIndex
        const baseOffsetY = (canvasLayers.length - 1 - i) * 15;

        // Calculate position with offset for layered effect
        const x = (canvas.width - scaledWidth) / 2 - baseOffsetX;
        const y = (canvas.height - scaledHeight) / 2 - baseOffsetY;

        ctx.drawImage(layer.image, x, y, scaledWidth, scaledHeight);

        // Optional: Add a subtle border to each layer for better visualization
        ctx.strokeStyle = `rgba(0, 0, 0, 0.2)`;
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, scaledWidth, scaledHeight);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
      }
    }

    // Draw watermark if enabled
    if (visualizerState.configuration.showWatermark && watermarkConfig.src) {
      try {
        const watermarkImg = await loadWatermarkImage(watermarkConfig.src);

        drawWatermark(ctx, watermarkImg, canvas, watermarkConfig);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(`Failed to load watermark: ${error}`);
      }
    }
  }, [canvasLayers, visualizerState.configuration.showWatermark, clearCanvas, drawWatermark, loadWatermarkImage]);

  /**
   * Gets current image errors
   */
  const getImageErrors = useCallback(() => imageErrors, [imageErrors]);

  // Load images when layers change
  useEffect(() => {
    if (visualizerState.layers.length > 0) {
      loadAllImages();
    } else {
      setCanvasLayers([]);
    }
  }, [visualizerState.layers, loadAllImages]);

  return {
    layers: visualizerState.layers,
    loadedLayers,
    config: visualizerState.configuration,
    isLoading: visualizerState.isLoading,
    hasErrors: visualizerState.hasErrors,
    hasContent,
    canvasLayers,
    loadImage,
    renderCanvas,
    clearCanvas,
    getImageErrors,
  };
};