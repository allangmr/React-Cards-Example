# ProductVisualizer Component

The ProductVisualizer component renders a dynamic, composite image of a configured product by stacking multiple transparent image layers on an HTML canvas.

## Features

- 🎨 **Canvas-based rendering** for image security
- 🔄 **Dynamic URL transformation** with token replacement
- 📊 **Z-index based layer ordering**
- 🏷️ **Watermark overlay support**
- ❌ **Error handling** for failed image loads
- 💾 **Download functionality** (without watermark)
- 📱 **Responsive design**
- 🔒 **Security** - uses canvas to prevent direct image asset access

## Usage

```tsx
import ProductVisualizer from './ProductVisualizer';

// Basic usage
<ProductVisualizer 
  width={400} 
  height={400} 
  showWatermark={true} 
/>

// With callbacks
<ProductVisualizer 
  width={600} 
  height={600} 
  showWatermark={false}
  onImageError={(layerId, error) => console.error('Image error:', layerId, error)}
  onLayersLoaded={(layers) => console.log('Loaded layers:', layers)}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `width` | `number` | `400` | Canvas width in pixels |
| `height` | `number` | `400` | Canvas height in pixels |
| `showWatermark` | `boolean` | `true` | Toggle watermark visibility |
| `className` | `string` | `''` | Additional CSS classes |
| `onImageError` | `(layerId: string, error: Error) => void` | - | Callback when image loading fails |
| `onLayersLoaded` | `(layers: VisualizerLayer[]) => void` | - | Callback when layers are loaded |

## States

The component handles several states automatically:

### Empty State
- Shown when no product options are selected
- Displays placeholder content encouraging user interaction

### Loading State
- Shown while images are being downloaded
- Displays animated spinner

### Error State
- Shown when image loading fails
- Gracefully handles partial failures

### Success State
- Renders all loaded layers on canvas
- Shows download button
- Applies watermark if enabled

## URL Transformation

The component automatically transforms tokenized URLs:

```typescript
// Input template
"{baseVisualizerPath}/layer-6-hardware/cdf-mortise-{handingVisualizer}-hand.png"

// Configuration
{
  baseVisualizerPath: "/single-wood-doors",
  handingVisualizer: "left"
}

// Output
"/single-wood-doors/layer-6-hardware/cdf-mortise-left-hand.png"
```

### Supported Tokens

- `{baseVisualizerPath}` - Base path for visualization assets
  - Values: `/single-wood-doors`, `/double-wood-doors`
- `{handingVisualizer}` - Door handing configuration
  - Values: `left`, `right`, `double`

## Storybook Usage

The component includes comprehensive Storybook stories for testing:

### Available Stories

1. **EmptyState** - No product options selected
2. **SingleLayer** - Basic door configuration
3. **MultipleLayers** - Complete product with multiple layers
4. **LoadingState** - Images being downloaded
5. **WithErrors** - Partial loading failures
6. **AllErrors** - Complete loading failure
7. **LargeSize** - High-resolution visualization
8. **SmallSize** - Thumbnail/card size
9. **NoWatermark** - Clean product image
10. **Interactive** - Full controls for testing
11. **MobileView** - Mobile-optimized display

### Storybook Controls

- **Mock Scenario** - Switch between different data states
- **Width/Height** - Adjust canvas dimensions
- **Show Watermark** - Toggle watermark display
- **Callbacks** - Monitor component events

### Running Storybook

```bash
# Start Storybook development server
npm run storybook

# Build Storybook for production
npm run build-storybook
```

## Development

### File Structure

```
ProductVisualizer/
├── ProductVisualizer.tsx          # Main component
├── ProductVisualizer.scss         # Styles
├── ProductVisualizer.stories.tsx  # Storybook stories
├── __tests__/
│   └── ProductVisualizer.test.tsx # Unit tests
└── README.md                      # This file
```

### Testing

The component includes unit tests covering:

- Props validation
- State handling
- Canvas functionality
- URL transformation
- Error handling
- Watermark configuration

```bash
# Run unit tests
npm test ProductVisualizer
```

### Debugging

Enable debug mode by setting hostname to `localhost`. The component will show:

- Layer count and status
- Configuration details
- Error messages
- Loading states

## Integration

### Redux Integration

The component uses these Redux pieces:

- **Selector**: `selectProductVisualizer`
- **Hook**: `useProductVisualizer`
- **Types**: `ProductVisualizerTypes.ts`

### Mock Integration

For testing without Redux:

```tsx
import { createMockUseProductVisualizer } from './useProductVisualizer.mock';

// Use different scenarios
const mockHook = createMockUseProductVisualizer('multipleLayers');
```

## Browser Support

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 11+
- ✅ Edge 79+

### Canvas Requirements

- HTML5 Canvas support
- CORS-enabled images
- JavaScript enabled

## Performance

- Images are cached after loading
- Canvas rendering is optimized
- Graceful degradation for errors
- Responsive scaling maintains quality

## Security

- ✅ Right-click context menu disabled
- ✅ Canvas prevents direct image download
- ✅ Watermark always visible in UI
- ✅ Clean download without watermark 