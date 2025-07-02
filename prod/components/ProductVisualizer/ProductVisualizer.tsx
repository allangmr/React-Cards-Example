import React, { useRef, useEffect, useState } from 'react';
import { useProductVisualizer } from '../../store/hooks/useProductVisualizer';
import { ProductVisualizerProps, WatermarkConfig } from '../../store/types/ProductVisualizer';
import './ProductVisualizer.scss';

const ProductVisualizer: React.FC<ProductVisualizerProps> = ({
  className = '',
  width = 400,
  height = 400,
  showWatermark = true,
  onImageError,
  onLayersLoaded,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCanvasReady, setIsCanvasReady] = useState(false);
  
  const {
    layers,
    loadedLayers,
    config,
    isLoading,
    hasErrors,
    hasContent,
    canvasLayers,
    renderCanvas,
    clearCanvas,
    downloadImage,
    getImageErrors,
  } = useProductVisualizer();

  const watermarkConfig: WatermarkConfig = {
    src: '/assets/watermark.png',
    opacity: 0.3,
    position: 'bottom-right',
  };

  // Handle canvas context menu prevention
  const handleContextMenu = (event: React.MouseEvent<HTMLCanvasElement>) => {
    event.preventDefault();
  };

  // Handle download functionality
  const handleDownload = () => {
    if (canvasRef.current && canvasLayers.length > 0) {
      downloadImage(canvasRef.current);
    }
  };

  // Render canvas when layers change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || canvasLayers.length === 0) {
      if (canvas) {
        clearCanvas(canvas);
      }
      setIsCanvasReady(false);
      return;
    }

    const renderLayers = async () => {
      try {
        await renderCanvas(canvas, showWatermark ? watermarkConfig : undefined);
        setIsCanvasReady(true);
      } catch (error) {
        console.error('Error rendering canvas:', error);
        setIsCanvasReady(false);
      }
    };

    renderLayers();
  }, [canvasLayers, renderCanvas, clearCanvas, showWatermark]);

  // Handle image errors
  useEffect(() => {
    const errors = getImageErrors();
    if (errors.length > 0 && onImageError) {
      errors.forEach(({ layerId, error }) => {
        onImageError(layerId, new Error(error));
      });
    }
  }, [getImageErrors, onImageError]);

  // Notify when layers are loaded
  useEffect(() => {
    if (loadedLayers.length > 0 && onLayersLoaded) {
      onLayersLoaded(loadedLayers);
    }
  }, [loadedLayers, onLayersLoaded]);

  // Set canvas dimensions
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = width;
      canvas.height = height;
    }
  }, [width, height]);

  const renderEmptyState = () => (
    <div className="product-visualizer__empty">
      <div className="product-visualizer__empty-icon">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <polyline points="21,15 16,10 5,21"/>
        </svg>
      </div>
      <p className="product-visualizer__empty-text">
        No product visualization available
      </p>
      <p className="product-visualizer__empty-subtext">
        Select options to see your product visualization
      </p>
    </div>
  );

  const renderLoadingState = () => (
    <div className="product-visualizer__loading">
      <div className="product-visualizer__spinner">
        <div className="spinner"></div>
      </div>
      <p className="product-visualizer__loading-text">
        Loading visualization...
      </p>
    </div>
  );

  const renderErrorState = () => (
    <div className="product-visualizer__error">
      <div className="product-visualizer__error-icon">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="10"/>
          <line x1="15" y1="9" x2="9" y2="15"/>
          <line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
      </div>
      <p className="product-visualizer__error-text">
        Error loading visualization
      </p>
      <p className="product-visualizer__error-subtext">
        Some images could not be loaded. Please try again.
      </p>
    </div>
  );

  return (
    <div className={`product-visualizer ${className}`}>
      <div className="product-visualizer__container">
        {!hasContent && renderEmptyState()}
        
        {hasContent && isLoading && !isCanvasReady && renderLoadingState()}
        
        {hasContent && hasErrors && canvasLayers.length === 0 && renderErrorState()}
        
        {hasContent && (
          <div className="product-visualizer__canvas-container">
            <canvas
              ref={canvasRef}
              className="product-visualizer__canvas"
              width={width}
              height={height}
              onContextMenu={handleContextMenu}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
              }}
            />
            
            {isLoading && isCanvasReady && (
              <div className="product-visualizer__overlay">
                <div className="product-visualizer__loading-indicator">
                  <div className="spinner spinner--small"></div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Debug information (only in development) */}
      {typeof window !== 'undefined' && window.location.hostname === 'localhost' && (
        <div className="product-visualizer__debug">
          <details>
            <summary>Debug Info</summary>
            <div className="product-visualizer__debug-content">
              <p><strong>Layers:</strong> {layers.length}</p>
              <p><strong>Loaded Layers:</strong> {canvasLayers.length}</p>
              <p><strong>Is Loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
              <p><strong>Has Errors:</strong> {hasErrors ? 'Yes' : 'No'}</p>
              <p><strong>Config:</strong> {config.baseVisualizerPath} | {config.handingVisualizer}</p>
              
              {layers.length > 0 && (
                <div>
                  <strong>Layer Details:</strong>
                  <ul>
                    {layers.map(layer => (
                      <li key={layer.id}>
                        {layer.id}: z-index {layer.zIndex} 
                        {layer.hasError && ' (ERROR)'}
                        {layer.isLoaded && ' (LOADED)'}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {getImageErrors().length > 0 && (
                <div>
                  <strong>Errors:</strong>
                  <ul>
                    {getImageErrors().map(({ layerId, error }) => (
                      <li key={layerId} style={{ color: 'red' }}>
                        {layerId}: {error}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </details>
        </div>
      )}

      {/* Action buttons */}
      {isCanvasReady && canvasLayers.length > 0 && (
        <div className="product-visualizer__actions">
          <button
            type="button"
            className="product-visualizer__download-btn"
            onClick={handleDownload}
            title="Download visualization"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7,10 12,15 17,10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Download
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductVisualizer; 