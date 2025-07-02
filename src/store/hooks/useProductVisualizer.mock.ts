// Mock function helper for Storybook
const fn = () => {
  const mockFn = (...args: any[]) => mockFn;
  mockFn.mockResolvedValue = (value: any) => mockFn;
  mockFn.mockReturnValue = (value: any) => mockFn;
  return mockFn;
};
import { UseProductVisualizerReturn } from './useProductVisualizer';
import { VisualizerLayer, CanvasImageLayer } from '../types/ProductVisualizer';

// Mock layers for different scenarios
const mockSingleLayer: VisualizerLayer = {
  id: 'door-single',
  imageUrl: 'https://www.cdfdistributors.com/probuilder/media/__sized__/builder_choices/product_choice_door_only-thumbnail-700x700.png',
  zIndex: 100,
  isLoaded: true,
  hasError: false,
};

const mockMultipleLayers: VisualizerLayer[] = [
  {
    id: 'door-base',
    imageUrl: 'https://www.cdfdistributors.com/probuilder/media/__sized__/builder_choices/product_choice_doors-thumbnail-350x350.png',
    zIndex: 100,
    isLoaded: true,
    hasError: false,
  },
  {
    id: 'door-hardware',
    imageUrl: 'https://www.cdfdistributors.com/probuilder/media/__sized__/configurations/config_single_wood-thumbnail-312x342.png',
    zIndex: 200,
    isLoaded: true,
    hasError: false,
  },
  {
    id: 'door-finish',
    imageUrl: 'https://www.cdfdistributors.com/probuilder/media/__sized__/configurations/config_double_wood-thumbnail-312x342.png',
    zIndex: 300,
    isLoaded: true,
    hasError: false,
  },
];

const mockLayersWithErrors: VisualizerLayer[] = [
  {
    id: 'door-base',
    imageUrl: 'https://www.cdfdistributors.com/probuilder/media/__sized__/builder_choices/product_choice_doors-thumbnail-350x350.png',
    zIndex: 100,
    isLoaded: true,
    hasError: false,
  },
  {
    id: 'door-hardware-error',
    imageUrl: 'https://invalid-url.com/image.png',
    zIndex: 200,
    isLoaded: false,
    hasError: true,
  },
];

const mockLoadingLayers: VisualizerLayer[] = [
  {
    id: 'door-loading',
    imageUrl: 'https://www.cdfdistributors.com/probuilder/media/__sized__/builder_choices/product_choice_door_only-thumbnail-700x700.png',
    zIndex: 100,
    isLoaded: false,
    hasError: false,
  },
];

// Mock canvas layers
const mockCanvasLayers: CanvasImageLayer[] = [
  {
    id: 'door-base',
    image: new Image(), // Will be mocked in Storybook
    zIndex: 100,
  },
  {
    id: 'door-hardware',
    image: new Image(),
    zIndex: 200,
  },
];

// Default mock configuration
const defaultMockConfig = {
  baseVisualizerPath: '/single-wood-doors',
  handingVisualizer: 'left',
  showWatermark: true,
};

// Mock scenarios
export const mockScenarios = {
  empty: {
    layers: [],
    loadedLayers: [],
    config: defaultMockConfig,
    isLoading: false,
    hasErrors: false,
    hasContent: false,
    canvasLayers: [],
  },

  singleLayer: {
    layers: [mockSingleLayer],
    loadedLayers: [mockSingleLayer],
    config: defaultMockConfig,
    isLoading: false,
    hasErrors: false,
    hasContent: true,
    canvasLayers: [mockCanvasLayers[0]],
  },

  multipleLayers: {
    layers: mockMultipleLayers,
    loadedLayers: mockMultipleLayers,
    config: defaultMockConfig,
    isLoading: false,
    hasErrors: false,
    hasContent: true,
    canvasLayers: mockCanvasLayers,
  },

  loading: {
    layers: mockLoadingLayers,
    loadedLayers: [],
    config: defaultMockConfig,
    isLoading: true,
    hasErrors: false,
    hasContent: true,
    canvasLayers: [],
  },

  withErrors: {
    layers: mockLayersWithErrors,
    loadedLayers: [mockLayersWithErrors[0]],
    config: defaultMockConfig,
    isLoading: false,
    hasErrors: true,
    hasContent: true,
    canvasLayers: [mockCanvasLayers[0]],
  },

  allErrors: {
    layers: [mockLayersWithErrors[1]],
    loadedLayers: [],
    config: defaultMockConfig,
    isLoading: false,
    hasErrors: true,
    hasContent: true,
    canvasLayers: [],
  },

  doubleDoorsConfig: {
    layers: mockMultipleLayers,
    loadedLayers: mockMultipleLayers,
    config: {
      baseVisualizerPath: '/double-wood-doors',
      handingVisualizer: 'double',
      showWatermark: true,
    },
    isLoading: false,
    hasErrors: false,
    hasContent: true,
    canvasLayers: mockCanvasLayers,
  },

  rightHandingConfig: {
    layers: [mockSingleLayer],
    loadedLayers: [mockSingleLayer],
    config: {
      baseVisualizerPath: '/single-wood-doors',
      handingVisualizer: 'right',
      showWatermark: false,
    },
    isLoading: false,
    hasErrors: false,
    hasContent: true,
    canvasLayers: [mockCanvasLayers[0]],
  },
};

// Create the mock hook with configurable scenario
export const createMockUseProductVisualizer = (
  scenario: keyof typeof mockScenarios = 'empty'
): (() => UseProductVisualizerReturn) => {
  const mockData = mockScenarios[scenario];

  return () => ({
    ...mockData,
    loadImage: async (layer: any) => new Image(),
    renderCanvas: async (canvas: any, watermarkConfig?: any) => {},
    clearCanvas: (canvas: any) => {},
    downloadImage: (canvas: any, filename?: string) => {},
    getImageErrors: () => mockData.hasErrors 
      ? [{ layerId: 'door-hardware-error', error: 'Failed to load image: https://invalid-url.com/image.png' }] 
      : [],
  });
};

// Default mock (empty state)
export const useProductVisualizer = createMockUseProductVisualizer('empty');

// Export individual scenario hooks for convenience
export const useProductVisualizerSingleLayer = createMockUseProductVisualizer('singleLayer');
export const useProductVisualizerMultipleLayers = createMockUseProductVisualizer('multipleLayers');
export const useProductVisualizerLoading = createMockUseProductVisualizer('loading');
export const useProductVisualizerWithErrors = createMockUseProductVisualizer('withErrors');
export const useProductVisualizerAllErrors = createMockUseProductVisualizer('allErrors');
export const useProductVisualizerDoubleDoorsConfig = createMockUseProductVisualizer('doubleDoorsConfig');
export const useProductVisualizerRightHandingConfig = createMockUseProductVisualizer('rightHandingConfig');

// Export mock parameters for Storybook controls
export const mockParameters = {
  scenario: {
    control: { type: 'select' },
    options: Object.keys(mockScenarios),
    defaultValue: 'empty',
    description: 'Choose different scenarios to test the ProductVisualizer component',
  },
  showWatermark: {
    control: { type: 'boolean' },
    defaultValue: true,
    description: 'Toggle watermark visibility',
  },
  width: {
    control: { type: 'number', min: 200, max: 800, step: 50 },
    defaultValue: 400,
    description: 'Canvas width in pixels',
  },
  height: {
    control: { type: 'number', min: 200, max: 800, step: 50 },
    defaultValue: 400,
    description: 'Canvas height in pixels',
  },
  onImageError: {
    action: 'onImageError',
    description: 'Callback when image loading fails',
  },
  onLayersLoaded: {
    action: 'onLayersLoaded',
    description: 'Callback when layers are successfully loaded',
  },
};

// Mock layer transformation for testing
export const mockLayerTransformation = {
  original: {
    id: 'test-door',
    visualizerImage: {
      src: '{baseVisualizerPath}/layer-6-hardware/cdf-mortise-{handingVisualizer}-hand-satin-chrome.png'
    },
    zIndex: '200',
    isSelected: true,
  },
  transformed: {
    id: 'test-door',
    imageUrl: '/single-wood-doors/layer-6-hardware/cdf-mortise-left-hand-satin-chrome.png',
    zIndex: 200,
    isLoaded: false,
    hasError: false,
  },
};

// Export transformation test cases
export const transformationTestCases = [
  {
    name: 'Single Door Left Hand',
    config: { baseVisualizerPath: '/single-wood-doors', handingVisualizer: 'left' },
    input: '{baseVisualizerPath}/layer-1/door-{handingVisualizer}.png',
    expected: '/single-wood-doors/layer-1/door-left.png',
  },
  {
    name: 'Double Door Configuration',
    config: { baseVisualizerPath: '/double-wood-doors', handingVisualizer: 'double' },
    input: '{baseVisualizerPath}/layer-2/hardware-{handingVisualizer}.png',
    expected: '/double-wood-doors/layer-2/hardware-double.png',
  },
  {
    name: 'Right Hand Configuration',
    config: { baseVisualizerPath: '/single-wood-doors', handingVisualizer: 'right' },
    input: '{baseVisualizerPath}/layer-3/finish-{handingVisualizer}-side.png',
    expected: '/single-wood-doors/layer-3/finish-right-side.png',
  },
]; 