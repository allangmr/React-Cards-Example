import { useSelector } from 'react-redux';
import { useState, useEffect, useCallback, useRef } from 'react';
import {
  selectProductVisualizer,
  selectLoadedVisualizerLayers,
  selectHasVisualizerContent,
} from '../selectors/selectProductVisualizer';
import { VisualizerLayer, CanvasImageLayer, WatermarkConfig } from '../types/ProductVisualizer';

export interface UseProductVisualizerReturn {
  layers: VisualizerLayer[];
  loadedLayers: VisualizerLayer[];
  config: {
    baseVisualizerPath: string;
    handingVisualizer: string;
    showWatermark: boolean;
  };
  isLoading: boolean;
  hasErrors: boolean;
  hasContent: boolean;
  canvasLayers: CanvasImageLayer[];
  loadImage: (layer: VisualizerLayer) => Promise<HTMLImageElement>;
  renderCanvas: (canvas: HTMLCanvasElement, watermarkConfig?: WatermarkConfig) => Promise<void>;
  clearCanvas: (canvas: HTMLCanvasElement) => void;
  downloadImage: (canvas: HTMLCanvasElement, filename?: string) => void;
  getImageErrors: () => Array<{ layerId: string; error: string }>;
}

const DEFAULT_WATERMARK_CONFIG: WatermarkConfig = {
  src: '/assets/watermark.png',
  opacity: 0.3,
  position: 'center',
};

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
  const loadImage = useCallback(async (layer: VisualizerLayer): Promise<HTMLImageElement> => {
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
        setImageErrors(prev => prev.filter(error => error.layerId !== layer.id));
        resolve(img);
      };

      img.onerror = (error) => {
        const errorMessage = `Failed to load image: ${layer.imageUrl}`;
        setImageErrors(prev => [
          ...prev.filter(error => error.layerId !== layer.id),
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
    const imagePromises = visualizerState.layers.map(async (layer) => {
      try {
        const image = await loadImage(layer);
        return {
          image,
          zIndex: layer.zIndex,
          id: layer.id,
        };
      } catch (error) {
        console.warn(`Skipping layer ${layer.id} due to load error:`, error);
        return null;
      }
    });

    const results = await Promise.allSettled(imagePromises);
    const successfulLayers = results
      .filter((result): result is PromiseFulfilledResult<CanvasImageLayer | null> => 
        result.status === 'fulfilled' && result.value !== null
      )
      .map(result => result.value as CanvasImageLayer)
      .sort((a, b) => a.zIndex - b.zIndex);

    setCanvasLayers(successfulLayers);
  }, [visualizerState.layers, loadImage]);

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

    // Draw all image layers
    for (const layer of canvasLayers) {
      try {
        // Scale image to fit canvas while maintaining aspect ratio
        const scale = Math.min(
          canvas.width / layer.image.naturalWidth,
          canvas.height / layer.image.naturalHeight
        );
        
        const scaledWidth = layer.image.naturalWidth * scale;
        const scaledHeight = layer.image.naturalHeight * scale;
        const x = (canvas.width - scaledWidth) / 2;
        const y = (canvas.height - scaledHeight) / 2;

        ctx.drawImage(layer.image, x, y, scaledWidth, scaledHeight);
      } catch (error) {
        console.warn(`Error drawing layer ${layer.id}:`, error);
      }
    }

    // Draw watermark if enabled
    if (visualizerState.config.showWatermark && watermarkConfig.src) {
      try {
        const watermarkImg = await loadWatermarkImage(watermarkConfig.src);
        drawWatermark(ctx, watermarkImg, canvas, watermarkConfig);
      } catch (error) {
        console.warn('Failed to load watermark:', error);
      }
    }
  }, [canvasLayers, visualizerState.config.showWatermark, clearCanvas]);

  /**
   * Loads watermark image
   */
  const loadWatermarkImage = useCallback(async (src: string): Promise<HTMLImageElement> => {
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
   * Downloads canvas as image
   */
  const downloadImage = useCallback((canvas: HTMLCanvasElement, filename = 'product-visualization.png') => {
    // Create a temporary canvas without watermark for download
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;

    // Draw only the product layers (no watermark)
    for (const layer of canvasLayers) {
      const scale = Math.min(
        tempCanvas.width / layer.image.naturalWidth,
        tempCanvas.height / layer.image.naturalHeight
      );
      
      const scaledWidth = layer.image.naturalWidth * scale;
      const scaledHeight = layer.image.naturalHeight * scale;
      const x = (tempCanvas.width - scaledWidth) / 2;
      const y = (tempCanvas.height - scaledHeight) / 2;

      tempCtx.drawImage(layer.image, x, y, scaledWidth, scaledHeight);
    }

    // Download the image
    tempCanvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    });
  }, [canvasLayers]);

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
    config: visualizerState.config,
    isLoading: visualizerState.isLoading,
    hasErrors: visualizerState.hasErrors,
    hasContent,
    canvasLayers,
    loadImage,
    renderCanvas,
    clearCanvas,
    downloadImage,
    getImageErrors,
  };
}; 