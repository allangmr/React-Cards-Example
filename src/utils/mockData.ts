import type { StepConfig } from '../types';

export const mockStepConfigs: StepConfig[] = [
  {
    id: 1,
    title: 'Cerradura',
    description: 'Selecciona el tipo de cerradura para tu puerta',
    isMultiSelect: false,
    options: [
      {
        id: 'lock-1',
        title: 'Cerradura Digital Premium',
        description: 'Cerradura electrónica con código digital, huella dactilar y tarjeta RFID',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
        imageType: 'rounded'
      },
      {
        id: 'lock-2',
        title: 'Cerradura Multipunto Mecánica',
        description: 'Cerradura tradicional con sistema multipunto de alta seguridad',
        image: 'https://images.unsplash.com/photo-1586075010923-59b57a69bbff?w=400&h=400&fit=crop',
        imageType: 'rounded'
      },
      {
        id: 'lock-3',
        title: 'Cerradura Smart Bluetooth',
        description: 'Control por smartphone con Bluetooth y códigos temporales',
        image: 'https://images.unsplash.com/photo-1567449303078-57ad995bd7cc?w=400&h=400&fit=crop',
        imageType: 'rounded'
      }
    ]
  },
  {
    id: 2,
    title: 'Material de la Puerta',
    description: 'Elige el material principal de construcción',
    isMultiSelect: false,
    options: [
      {
        id: 'option-1',
        title: 'Acero Galvanizado',
        description: 'Material resistente a la corrosión, ideal para exteriores',
        image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=400&fit=crop',
        imageType: 'square'
      },
      {
        id: 'option-2',
        title: 'Hierro Forjado',
        description: 'Elegante y resistente, perfecto para diseños clásicos',
        image: 'https://images.unsplash.com/photo-1565538421672-b0de31050be3?w=400&h=400&fit=crop',
        imageType: 'square'
      },
      {
        id: 'option-3',
        title: 'Acero Inoxidable',
        description: 'Máxima resistencia y durabilidad, acabado moderno',
        image: 'https://images.unsplash.com/photo-1558618047-bf5c0d516c8a?w=400&h=400&fit=crop',
        imageType: 'square'
      }
    ]
  },
  {
    id: 3,
    title: 'Refuerzo Militar',
    description: 'Añade capas de seguridad adicionales',
    isMultiSelect: true,
    options: [
      {
        id: 'military-1',
        title: 'Placa Anti-Taladro',
        description: 'Protección contra intentos de perforación',
        image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=500&h=280&fit=crop',
        imageType: 'wide'
      },
      {
        id: 'military-2',
        title: 'Blindaje Perimetral',
        description: 'Refuerzo completo del marco de la puerta',
        image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=500&h=280&fit=crop',
        imageType: 'wide'
      },
      {
        id: 'military-3',
        title: 'Sistema Anti-Palanca',
        description: 'Protección contra herramientas de palanca',
        image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=500&h=280&fit=crop',
        imageType: 'wide'
      }
    ]
  },
  {
    id: 4,
    title: 'Color y Acabado',
    description: 'Personaliza la apariencia de tu puerta',
    isMultiSelect: false,
    options: [
      {
        id: 'color-1',
        title: 'Negro Mate',
        description: 'Elegante acabado negro mate resistente a rayones',
        image: 'https://images.unsplash.com/photo-1568454537842-d933259bb258?w=400&h=400&fit=crop',
        imageType: 'square'
      },
      {
        id: 'color-2',
        title: 'Blanco Perla',
        description: 'Acabado blanco brillante con protección UV',
        image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop',
        imageType: 'square'
      },
      {
        id: 'color-3',
        title: 'Madera Natural',
        description: 'Imitación madera con textura realista',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
        imageType: 'square'
      }
    ]
  },
  {
    id: 5,
    title: 'Accesorios',
    description: 'Complementa tu puerta con accesorios adicionales',
    isMultiSelect: true,
    options: [
      {
        id: 'accessory-1',
        title: 'Mirilla Digital',
        description: 'Cámara integrada con visor LCD',
        image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=400&fit=crop',
        imageType: 'rounded'
      },
      {
        id: 'accessory-2',
        title: 'Timbre Inteligente',
        description: 'Conexión WiFi con notificaciones móviles',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
        imageType: 'rounded'
      },
      {
        id: 'accessory-3',
        title: 'Manija de Seguridad',
        description: 'Manija reforzada con sistema anti-rotura',
        image: 'https://images.unsplash.com/photo-1586298543737-8aaa2d452132?w=400&h=400&fit=crop',
        imageType: 'rounded'
      }
    ]
  }
];