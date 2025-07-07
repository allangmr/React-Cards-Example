import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { ProductVisualizer, type ProductVisualizerProps } from '~probuilder/components/ProductVisualizer';
import { getMockedProductVisualizer } from '~probuilder/features/steps/hooks/useProductVisualizer.mock';

const meta = {
    title: 'Components/Product Visualizer',
    component: ProductVisualizer,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: `
The ProductVisualizer component renders a dynamic, composite image of a configured product by stacking multiple transparent image layers on an HTML canvas.

**Key Features:**
- Canvas-based rendering for image security
- Z-index based layer ordering
- Watermark overlay support
- Error handling for failed image loads
- Download functionality
- Responsive design`,
            },
        },
    },
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof ProductVisualizer>;

export default meta;
type Story = StoryObj<ProductVisualizerProps>;

/**
 * Helper to generate args for ProductVisualizer stories.
 */
function getArgs(state: Parameters<typeof getMockedProductVisualizer>[0]) {
    return {
        ...getMockedProductVisualizer(state),
        showWatermark: true,
        onImageError: fn(),
        onLayersLoaded: fn(),
    };
}

export const EmptyState: Story = {
    args: getArgs({ state: 'empty' }),
};

export const SingleLayer: Story = {
    args: getArgs({ state: 'singleLayer' }),
};

export const MultipleLayers: Story = {
    args: {
        ...getArgs({
            state: 'multipleLayers',
            overrides: {
                hasContent: true,
                isLoading: false,
                hasErrors: false,
            },
        }),
        width: 500,
        height: 500,
    },
};

export const LoadingState: Story = {
    args: getArgs({ state: 'loading' }),
};

export const WithErrors: Story = {
    args: getArgs({ state: 'withErrors', error: new Error('Failed to load image') }),
};

export const AllErrors: Story = {
    args: getArgs({ state: 'allErrors', error: new Error('All images failed to load') }),
};