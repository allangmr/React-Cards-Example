import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import styles from "./ProductVisualizer.module.scss";

import type { ImageError, Layer, WatermarkConfig } from '~probuilder/features/steps/types/ProductVisualizer';

/**
 * ProductVisualizer (Presentational)
 * Receives all data and methods as props. No hooks/selectors inside.
 */
export function ProductVisualizer({
    className = '',
    width = 400,
    height = 400,
    showWatermark = true,
    onImageError,
    onLayersLoaded,
    layers,
    loadedLayers,
    config,
    isLoading,
    hasErrors,
    hasContent,
    canvasLayers,
    renderCanvas,
    clearCanvas,
    getImageErrors,
}: ProductVisualizerProps): React.ReactElement {
    const canvasRef = useRef(null);
    const [isCanvasReady, setIsCanvasReady] = useState(false);

    const watermarkConfig = useMemo<WatermarkConfig>(() => ({
        src: '/assets/watermark.png',
        opacity: 0.3,
        position: 'bottom-right',
    }), []);

    const handleContextMenu = useCallback((event: React.MouseEvent): void => {
        event.preventDefault();
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;

        if (!canvas || !hasContent || canvasLayers.length === 0) {
            if (canvas) {
                clearCanvas(canvas as HTMLCanvasElement);
            }

            setIsCanvasReady(false);

            return;
        }

        canvas.width = width;
        canvas.height = height;

        /**
         * Render all layers to the canvas.
         */
        async function renderLayers(): Promise<void> {
            try {
                if (canvas) {
                    await renderCanvas(canvas as HTMLCanvasElement, showWatermark ? watermarkConfig : undefined);
                    setIsCanvasReady(true);
                }
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error('Error rendering canvas:', error);
                setIsCanvasReady(false);
                if (onImageError) {
                    onImageError('canvas', error as Error);
                }
            }
        }

        renderLayers();
    }, [canvasLayers, renderCanvas, clearCanvas, showWatermark, watermarkConfig, hasContent, width, height, onImageError]);

    useEffect(() => {
        const errors = getImageErrors();

        if (errors.length > 0 && onImageError) {
            errors.forEach(({ layerId, error }: ImageError) => {
                onImageError(layerId, new Error(error));
            });
        }
    }, [getImageErrors, onImageError]);

    useEffect(() => {
        if (loadedLayers.length > 0 && onLayersLoaded) {
            onLayersLoaded(loadedLayers as Layer[]);
        }
    }, [loadedLayers, onLayersLoaded]);

    useEffect(() => {
        const canvas = canvasRef.current;

        if (canvas) {
            canvas.width = width;
            canvas.height = height;
        }
    }, [width, height]);

    // Debug info for development
    const debugLayers = layers.map((layer: Layer) => ({
        ...layer,
        imageUrl: layer.imageUrl || 'N/A',
        isVisible: layer.isVisible || false,
        hasError: layer.hasError || false
    }));
    const debugCanvasLayers = canvasLayers.map((layer: { id: string; image: HTMLImageElement; zIndex: number }) => ({
        id: layer.id,
        zIndex: layer.zIndex,
        image: layer.image ? 'Image Instance' : 'N/A'
    }));

    return (
        <div className={`${styles['product-visualizer']} ${className}`}>
            <div className={styles['visualizer-container']}>
                {!hasContent && (
                    <div className={styles.empty}>
                        <div className={styles['empty-icon']}>
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                                <circle cx="8.5" cy="8.5" r="1.5"/>
                                <polyline points="21,15 16,10 5,21"/>
                            </svg>
                        </div>
                        <p className={styles['empty-text']}>
                            No product visualization available
                        </p>
                        <p className={styles['empty-subtext']}>
                            Select options to see your product visualization
                        </p>
                    </div>
                )}

                {hasContent && (
                    <div className={styles['canvas-container']}>
                        <canvas
                            ref={canvasRef}
                            className={styles.canvas}
                            width={width}
                            height={height}
                            onContextMenu={handleContextMenu}
                        />
                    </div>
                )}

                {hasContent && isLoading && !isCanvasReady && (
                    <div className={styles.loading}>
                        <div className={styles.spinner}>
                            <div />
                        </div>
                        <p className={styles['loading-text']}>
                            Loading visualization...
                        </p>
                    </div>
                )}

                {hasContent && hasErrors && canvasLayers.length === 0 && (
                    <div className={styles.error}>
                        <div className={styles['error-icon']}>
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <circle cx="12" cy="12" r="10"/>
                                <line x1="15" y1="9" x2="9" y2="15"/>
                                <line x1="9" y1="9" x2="15" y2="15"/>
                            </svg>
                        </div>
                        <p className={styles['error-text']}>
                            Error loading visualization
                        </p>
                        <p className={styles['error-subtext']}>
                            Some images could not be loaded. Please try again.
                        </p>
                    </div>
                )}

                {/* Debug information (only in development) */}
                {typeof window !== 'undefined' && window.location.hostname === 'localhost' && (
                    <div className={styles.debug}>
                        <details>
                            <summary>Debug Info</summary>
                            <div>
                                <p><strong>Layers:</strong> {JSON.stringify(debugLayers, null, 2)}</p>
                                <p><strong>Canvas Layers:</strong> {JSON.stringify(debugCanvasLayers, null, 2)}</p>
                                <p><strong>Is Loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
                                <p><strong>Has Errors:</strong> {hasErrors ? 'Yes' : 'No'}</p>
                                <p><strong>Config:</strong> {config.baseVisualizerPath} | {config.handingVisualizer}</p>
                            </div>
                        </details>
                    </div>
                )}

            </div>
        </div>
    );
}

// All props are required except for className, width, height, showWatermark, onImageError, onLayersLoaded
export interface ProductVisualizerProps {
    className?: string;
    width?: number;
    height?: number;
    showWatermark?: boolean;
    onImageError?: (layerId: string, error: Error) => void;
    onLayersLoaded?: (layers: Layer[]) => void;
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
    canvasLayers: Array<{ id: string; image: HTMLImageElement; zIndex: number }>;
    renderCanvas: (canvas: HTMLCanvasElement, watermarkConfig?: WatermarkConfig) => Promise<void>;
    clearCanvas: (canvas: HTMLCanvasElement) => void;
    getImageErrors: () => Array<{ layerId: string; error: string }>;
}