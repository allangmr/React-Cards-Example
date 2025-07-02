import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import ProductVisualizer from './ProductVisualizer';

// Mock the hook import - this is the key to make Storybook work with mocked data
const mockUseProductVisualizer = (scenario: string = 'empty') => {
  const mockData = {
    empty: {
      layers: [],
      loadedLayers: [],
      config: { baseVisualizerPath: '/single-wood-doors', handingVisualizer: 'left', showWatermark: true },
      isLoading: false,
      hasErrors: false,
      hasContent: false,
      canvasLayers: [],
    },
    singleLayer: {
      layers: [{
        id: 'door-single',
        imageUrl: 'https://www.cdfdistributors.com/probuilder/media/__sized__/builder_choices/product_choice_door_only-thumbnail-700x700.png',
        zIndex: 100,
        isLoaded: true,
        hasError: false,
      }],
      loadedLayers: [{
        id: 'door-single',
        imageUrl: 'https://www.cdfdistributors.com/probuilder/media/__sized__/builder_choices/product_choice_door_only-thumbnail-700x700.png',
        zIndex: 100,
        isLoaded: true,
        hasError: false,
      }],
      config: { baseVisualizerPath: '/single-wood-doors', handingVisualizer: 'left', showWatermark: true },
      isLoading: false,
      hasErrors: false,
      hasContent: true,
      canvasLayers: [{
        id: 'door-single',
        image: new Image(),
        zIndex: 100,
      }],
    },
    multipleLayers: {
      layers: [
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
      ],
      loadedLayers: [
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
      ],
      config: { baseVisualizerPath: '/single-wood-doors', handingVisualizer: 'left', showWatermark: true },
      isLoading: false,
      hasErrors: false,
      hasContent: true,
      canvasLayers: [
        { id: 'door-base', image: new Image(), zIndex: 100 },
        { id: 'door-hardware', image: new Image(), zIndex: 200 },
        { id: 'door-finish', image: new Image(), zIndex: 300 },
      ],
    },
    loading: {
      layers: [{
        id: 'door-loading',
        imageUrl: 'https://www.cdfdistributors.com/probuilder/media/__sized__/builder_choices/product_choice_door_only-thumbnail-700x700.png',
        zIndex: 100,
        isLoaded: false,
        hasError: false,
      }],
      loadedLayers: [],
      config: { baseVisualizerPath: '/single-wood-doors', handingVisualizer: 'left', showWatermark: true },
      isLoading: true,
      hasErrors: false,
      hasContent: true,
      canvasLayers: [],
    },
    withErrors: {
      layers: [
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
      ],
      loadedLayers: [{
        id: 'door-base',
        imageUrl: 'https://www.cdfdistributors.com/probuilder/media/__sized__/builder_choices/product_choice_doors-thumbnail-350x350.png',
        zIndex: 100,
        isLoaded: true,
        hasError: false,
      }],
      config: { baseVisualizerPath: '/single-wood-doors', handingVisualizer: 'left', showWatermark: true },
      isLoading: false,
      hasErrors: true,
      hasContent: true,
      canvasLayers: [{ id: 'door-base', image: new Image(), zIndex: 100 }],
    },
    allErrors: {
      layers: [{
        id: 'door-hardware-error',
        imageUrl: 'https://invalid-url.com/image.png',
        zIndex: 200,
        isLoaded: false,
        hasError: true,
      }],
      loadedLayers: [],
      config: { baseVisualizerPath: '/single-wood-doors', handingVisualizer: 'left', showWatermark: true },
      isLoading: false,
      hasErrors: true,
      hasContent: true,
      canvasLayers: [],
    },
  };
  
  const selectedData = mockData[scenario] || mockData.empty;

  return {
    ...selectedData,
    loadImage: async () => new Image(),
    renderCanvas: async () => {},
    clearCanvas: () => {},
    downloadImage: () => {},
    getImageErrors: () => selectedData.hasErrors 
      ? [{ layerId: 'door-hardware-error', error: 'Failed to load image: https://invalid-url.com/image.png' }] 
      : [],
  };
};

// Mock the actual hook import for Storybook
const mockModule = {
  useProductVisualizer: mockUseProductVisualizer,
};

// Component wrapper to inject mock data
const ProductVisualizerWithMock = ({ mockScenario = 'empty', ...props }) => {
  // Replace the hook with our mock
  React.useEffect(() => {
    // This simulates the hook behavior for Storybook
    (window as any).__PRODUCT_VISUALIZER_MOCK__ = mockUseProductVisualizer(mockScenario);
  }, [mockScenario]);

  return React.createElement(ProductVisualizer, props);
};

const meta: Meta<typeof ProductVisualizerWithMock> = {
  title: 'Components/ProductVisualizer',
  component: ProductVisualizerWithMock,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The ProductVisualizer component renders a dynamic, composite image of a configured product by stacking multiple transparent image layers on an HTML canvas. 

**Key Features:**
- Canvas-based rendering for image security
- Dynamic URL transformation with token replacement
- Z-index based layer ordering
- Watermark overlay support
- Error handling for failed image loads
- Download functionality (without watermark)
- Responsive design

**Security:** Uses canvas to prevent direct image asset access and includes right-click protection.

**Note:** These stories use mock data to demonstrate different states and configurations.
        `,
      },
    },
  },
  argTypes: {
    mockScenario: {
      control: { type: 'select' },
      options: ['empty', 'singleLayer', 'multipleLayers', 'loading', 'withErrors', 'allErrors'],
      description: 'Mock scenario to display',
      table: { category: 'Mock Controls' },
    },
    className: {
      control: { type: 'text' },
      description: 'Additional CSS classes',
    },
    width: {
      control: { type: 'number', min: 200, max: 800, step: 50 },
      description: 'Canvas width in pixels',
    },
    height: {
      control: { type: 'number', min: 200, max: 800, step: 50 },
      description: 'Canvas height in pixels',
    },
    showWatermark: {
      control: { type: 'boolean' },
      description: 'Toggle watermark visibility',
    },
    onImageError: {
      action: 'onImageError',
      description: 'Callback when image loading fails',
    },
    onLayersLoaded: {
      action: 'onLayersLoaded',
      description: 'Callback when layers are successfully loaded',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ProductVisualizerWithMock>;

/**
 * Default empty state when no product options are selected
 */
export const EmptyState: Story = {
  args: {
    mockScenario: 'empty',
    width: 400,
    height: 400,
    showWatermark: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the empty state when no product visualization is available. Displays placeholder content encouraging user to make selections.',
      },
    },
  },
};

/**
 * Single layer visualization with one product image
 */
export const SingleLayer: Story = {
  args: {
    mockScenario: 'singleLayer',
    width: 400,
    height: 400,
    showWatermark: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Displays a single product layer. This represents the basic door configuration without additional options like hardware or finishes.',
      },
    },
  },
};

/**
 * Multiple layers showing complete product configuration
 */
export const MultipleLayers: Story = {
  args: {
    mockScenario: 'multipleLayers',
    width: 400,
    height: 400,
    showWatermark: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows a complete product visualization with multiple layers (base door, hardware, finish) stacked according to their z-index values.',
      },
    },
  },
};

/**
 * Loading state while images are being fetched
 */
export const LoadingState: Story = {
  args: {
    mockScenario: 'loading',
    width: 400,
    height: 400,
    showWatermark: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Displays loading spinner while product images are being downloaded and processed.',
      },
    },
  },
};

/**
 * Partial error state with some layers failing to load
 */
export const WithErrors: Story = {
  args: {
    mockScenario: 'withErrors',
    width: 400,
    height: 400,
    showWatermark: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows how the component handles partial failures - some layers load successfully while others fail gracefully.',
      },
    },
  },
};

/**
 * Complete error state when all images fail to load
 */
export const AllErrors: Story = {
  args: {
    mockScenario: 'allErrors',
    width: 400,
    height: 400,
    showWatermark: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Displays error state when all product images fail to load. Shows appropriate error messaging.',
      },
    },
  },
};

/**
 * Large canvas size for detailed viewing
 */
export const LargeSize: Story = {
  args: {
    mockScenario: 'multipleLayers',
    width: 600,
    height: 600,
    showWatermark: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Large canvas size for detailed product visualization. Useful for product detail pages or print materials.',
      },
    },
  },
};

/**
 * Small canvas size for thumbnails or cards
 */
export const SmallSize: Story = {
  args: {
    mockScenario: 'singleLayer',
    width: 200,
    height: 200,
    showWatermark: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Compact visualization suitable for product cards, thumbnails, or mobile displays.',
      },
    },
  },
};

/**
 * Configuration without watermark
 */
export const NoWatermark: Story = {
  args: {
    mockScenario: 'singleLayer',
    width: 400,
    height: 400,
    showWatermark: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Product visualization with watermark disabled. Useful for clean product images or downloads.',
      },
    },
  },
};

/**
 * Interactive story for testing different scenarios
 */
export const Interactive: Story = {
  args: {
    mockScenario: 'multipleLayers',
    width: 400,
    height: 400,
    showWatermark: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive story allowing you to test different scenarios, sizes, and configurations using the controls panel. Use the "Mock Scenario" control to switch between different states.',
      },
    },
  },
};

/**
 * Mobile responsive view
 */
export const MobileView: Story = {
  args: {
    mockScenario: 'singleLayer',
    width: 300,
    height: 300,
    showWatermark: true,
    className: 'mobile-view',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Product visualizer optimized for mobile viewing with smaller canvas and responsive layout.',
      },
    },
  },
}; 