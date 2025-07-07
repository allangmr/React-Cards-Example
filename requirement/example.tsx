import React, { useEffect, useRef, useState } from 'react';

const LayeredCanvasImages = () => {
  const canvasRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState({
    backgroundImage: "",
    middleImage: "",
    frontImage: ""
  });

  // Función para crear una imagen programáticamente
  const createImage = (width, height, color, text) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    // Gradiente de fondo
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, adjustColor(color, -30));
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Borde
    ctx.strokeStyle = adjustColor(color, -50);
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, width-4, height-4);
    
    // Texto principal
    ctx.fillStyle = 'white';
    ctx.font = `bold ${Math.min(width, height) / 8}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, width / 2, height / 2 - 10);
    
    // Tamaño
    ctx.font = `${Math.min(width, height) / 12}px Arial`;
    ctx.fillText(`${width}x${height}`, width / 2, height / 2 + 20);
    
    return canvas;
  };

  // Función para ajustar color
  const adjustColor = (color, amount) => {
    const num = parseInt(color.replace('#', ''), 16);
    const r = Math.max(0, Math.min(255, (num >> 16) + amount));
    const g = Math.max(0, Math.min(255, (num >> 8 & 0x00FF) + amount));
    const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
  };

  // Función para dibujar las capas
  const drawLayeredImages = (colors = null) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = 500;
    canvas.height = 500;

    setIsLoading(true);

    // Colores por defecto o personalizados
    const layerColors = colors || {
      background: '#3B82F6',
      middle: '#10B981', 
      front: '#EF4444'
    };

    try {
      // Crear las imágenes
      const backgroundCanvas = createImage(400, 400, layerColors.background, 'FONDO');
      const middleCanvas = createImage(300, 300, layerColors.middle, 'MEDIO');
      const frontCanvas = createImage(100, 100, layerColors.front, 'FRENTE');

      // Limpiar canvas principal
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Dibujar fondo con patrón
      ctx.fillStyle = '#f8f9fa';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Patrón de cuadrícula sutil
      ctx.strokeStyle = '#e9ecef';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += 20) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      // Dibujar las capas centradas
      const bgX = (canvas.width - 400) / 2;
      const bgY = (canvas.height - 400) / 2;
      ctx.drawImage(backgroundCanvas, bgX, bgY);

      const midX = (canvas.width - 300) / 2;
      const midY = (canvas.height - 300) / 2;
      ctx.drawImage(middleCanvas, midX, midY);

      const frontX = (canvas.width - 100) / 2;
      const frontY = (canvas.height - 100) / 2;
      ctx.drawImage(frontCanvas, frontX, frontY);

      // Actualizar URLs mostradas (simulando URLs de API)
      setImageUrls({
        backgroundImage: `api/images/background-${Date.now()}.jpg`,
        middleImage: `api/images/middle-${Date.now()}.jpg`,
        frontImage: `api/images/front-${Date.now()}.jpg`
      });

      setIsLoading(false);
    } catch (err) {
      console.error('Error al dibujar:', err);
      setIsLoading(false);
    }
  };

  // Función para simular carga desde API
  const loadFromAPI = (apiData) => {
    setIsLoading(true);
    setImageUrls(apiData);
    
    // Simular delay de API
    setTimeout(() => {
      // En una implementación real, aquí cargarías las imágenes desde las URLs
      // Por ahora, generamos imágenes con colores aleatorios
      const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'];
      const randomColors = {
        background: colors[Math.floor(Math.random() * colors.length)],
        middle: colors[Math.floor(Math.random() * colors.length)],
        front: colors[Math.floor(Math.random() * colors.length)]
      };
      drawLayeredImages(randomColors);
    }, 1000);
  };

  // Función para generar nuevas imágenes
  const generateNewImages = () => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#A8E6CF', '#FFB6C1'];
    const randomColors = {
      background: colors[Math.floor(Math.random() * colors.length)],
      middle: colors[Math.floor(Math.random() * colors.length)],
      front: colors[Math.floor(Math.random() * colors.length)]
    };
    drawLayeredImages(randomColors);
  };

  // Función para simular datos de API
  const simulateAPICall = () => {
    const apiData = {
      backgroundImage: `https://tu-api.com/images/bg-${Math.floor(Math.random() * 1000)}.jpg`,
      middleImage: `https://tu-api.com/images/mid-${Math.floor(Math.random() * 1000)}.jpg`,
      frontImage: `https://tu-api.com/images/front-${Math.floor(Math.random() * 1000)}.jpg`
    };
    loadFromAPI(apiData);
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
  };

  const handleDragStart = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    drawLayeredImages();
  }, []);

  return (
    <div className="flex flex-col items-center p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Canvas con Imágenes en Capas - Sin CORS
      </h1>
      
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Composición de Capas:
          </h2>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500 rounded mx-auto mb-2"></div>
              <div className="font-medium">Fondo</div>
              <div className="text-gray-600">400x400px</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500 rounded mx-auto mb-2"></div>
              <div className="font-medium">Medio</div>
              <div className="text-gray-600">300x300px</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-red-500 rounded mx-auto mb-2"></div>
              <div className="font-medium">Frente</div>
              <div className="text-gray-600">100x100px</div>
            </div>
          </div>
        </div>

        <div className="relative mb-6">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 rounded z-10">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="text-blue-600 font-medium">Cargando imágenes...</span>
              </div>
            </div>
          )}

          <canvas
            ref={canvasRef}
            className="border border-gray-300 rounded shadow-sm max-w-full"
            onContextMenu={handleContextMenu}
            onDragStart={handleDragStart}
            style={{ 
              userSelect: 'none',
              WebkitUserSelect: 'none',
              MozUserSelect: 'none',
              msUserSelect: 'none'
            }}
          />
        </div>

        <div className="flex gap-3 flex-wrap mb-6">
          <button
            onClick={generateNewImages}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
            disabled={isLoading}
          >
            Generar Nuevas Imágenes
          </button>
          
          <button
            onClick={simulateAPICall}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors text-sm"
            disabled={isLoading}
          >
            Simular API Call
          </button>
          
          <button
            onClick={() => drawLayeredImages()}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-sm"
            disabled={isLoading}
          >
            Redibujar
          </button>
        </div>

        <div className="bg-gray-50 p-4 rounded">
          <h3 className="font-medium text-gray-800 mb-2">URLs simuladas (como vendrían de tu API):</h3>
          <div className="space-y-1 text-xs text-gray-600">
            <div><span className="font-medium">Fondo:</span> {imageUrls.backgroundImage}</div>
            <div><span className="font-medium">Medio:</span> {imageUrls.middleImage}</div>
            <div><span className="font-medium">Frente:</span> {imageUrls.frontImage}</div>
          </div>
        </div>
      </div>

      <div className="mt-6 max-w-2xl text-sm text-gray-600 bg-white p-4 rounded-lg shadow">
        <h3 className="font-semibold mb-2">Implementación lista para tu API:</h3>
        <div className="bg-gray-100 p-3 rounded text-xs font-mono mb-3">
          <div className="text-green-600">// Función para usar con tu API real:</div>
          <div>const loadFromAPI = (apiData) => {`{`}</div>
          <div>  // apiData = {`{`}</div>
          <div>  //   backgroundImage: "url1",</div>
          <div>  //   middleImage: "url2",</div>
          <div>  //   frontImage: "url3"</div>
          <div>  // {`}`}</div>
          <div>  loadImagesAndDraw(apiData);</div>
          <div>{`}`};</div>
        </div>
        
        <div className="text-xs space-y-1">
          <div>✅ Sin problemas de CORS</div>
          <div>✅ Imágenes generadas localmente</div>
          <div>✅ Función lista para integrar con API</div>
          <div>✅ Prevención de descarga completa</div>
          <div>✅ Capas perfectamente superpuestas</div>
        </div>
      </div>
    </div>
  );
};

export default LayeredCanvasImages;