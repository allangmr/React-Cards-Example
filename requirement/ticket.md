As a developer, I want to implement a new ProBuilder component, ProductVisualizer. This component will be responsible for displaying a collection of images based on the selections made by a user in the ProBuilder application. The images are to be layered on top of each other based on the options' z-index value. This task will incude:

Implement component based on the specs defined in the parent story and technical design document: 
PB - Product Visualization 

Implement Storybook stories using mock data (we’ll connect to the store and selector in CD-1334: [PB] Steps Product Visualizer - [FED] ProductVisualizer integration
To Do
 

Implement display logic

Rendering the layers

Handling empty visualizerImageUrl values (e.g, ignoring them)

Gracefully handling images that throw an error and not displaying them

Notes: 

The watermark image can be stored to the static assets in the ProBuilder app.

The image paths for the mock can be hardcoded to the DAM assets that Nima is working on. Please reach out to Nima and Julian for more information when working on this ticket.


---


Overview
This document details the technical design for a product visualizer feature. The feature will render a dynamic, composite image of a configured product by stacking multiple transparent image layers. The composition of this image stack is determined in real-time by the user's selected options. The primary goals are to provide an accurate visual representation, ensure a seamless user experience, and protect image assets.

Architecture & Design
Component Architecture
The visualizer will be encapsulated in a dedicated component, named ProductVisualizer.

Canvas Rendering: To prevent direct access to and download of image assets, the visualization will be rendered within an HTML <canvas> element. This approach avoids exposing individual <img> tags in the DOM. The component will draw each image layer onto the canvas in the specified order.

Responsiveness: The visualizer will be responsive. The canvas element will scale to fit its container, but the business logic for layering and visualization will remain consistent across all viewports.

State Management & Data Flow
The ProductVisualizer component will be integrated with the application's global state management system (Redux).

Subscription to Store: The component will subscribe to the Redux store to listen for changes to the user's configuration (selectedOptions).

State Changes: When a user selects, deselects, or edits an option, a Redux action is dispatched, updating the selectedOptions array in the store.

Re-rendering: The ProductVisualizer component, connected to the store, will detect the change in selectedOptions. This will trigger a re-render of the canvas.

Render Cycle: On each re-render, the component will:

Clear the existing canvas.

Filter the list of selectedOptions to include only those with a valid visualizerImageUrl.

Sort the filtered options based on their zIndex.

Iterate through the sorted list and draw each image onto the canvas.

Finally, draw the static watermark image layer on top of the entire stack.

Data Model
The ProductVisualizer component will connect to the Redux store to read the selected option objects, where each object conforms to the following structure:



{
    id: string;
    visualizerImageUrl: string;
    zIndex: string; 
}
visualizerImageUrl: Corresponds to the URL from Logik. A null value signifies a non-visualized option which will be ignored by the renderer.

zIndex: A numeric value used for sorting the image stack.

Image Path Transformation
The image paths used for the visualizer will contain tokenized values that need to be dynamically replaced based on user selections. As part of the product configuration, Logik will dynamically set two fields:

baseVisualizerPath: This field represents the base path that will be substituted within the visualizerImage string.

Expected values: "/single-wood-doors" | "/double-wood-doors"

handingVisualizer: This field represents the handing token that will be replaced within the visualizerImage string.

Expected values: "left" | "right" | "double"

Example visualizerImage path:



{baseVisualizerPath}/layer-6-hardware/cdf-mortise-{handingVisualizer}-hand-satin-chrome.png
Example transformed visualizerImage paths based on baseVisualizerPath and handingVisualizer fields:

/single-wood-doors/layer-6-hardware/cdf-mortise-left-hand-satin-chrome.png

/single-wood-doors/layer-6-hardware/cdf-mortise-right-hand-satin-chrome.png

/double-wood-doors/layer-6-hardware/cdf-mortise-double-hand-satin-chrome.png

Example Implementation to add to the Visualizer selector



interface VisualizerConfig {
  baseVisualizerPath: string;
  handingVisualizer: string;
  visualizerImage: string; // The original string with tokens
}
/**
 * Replaces tokens in a visualizer image URL template with actual values.
 *
 * @param config An object containing the baseVisualizerPath, handingVisualizer,
 * and the visualizerImage.
 * @returns The transformed image URL string.
 */
function transformVisualizerImagePath(config: VisualizerConfig): string {
  let transformedPath = config.visualizerImage;
  // Replace {baseVisualizerPath}
  transformedPath = transformedPath.replace(
    /{baseVisualizerPath}/g,
    config.baseVisualizerPath
  );
  // Replace {handingVisualizer}
  transformedPath = transformedPath.replace(
    /{handingVisualizer}/g,
    config.handingVisualizer
  );
  return transformedPath;
}
Layering & Z-Index Logic
The stacking order of images is critical and will be managed by a zIndex attribute.

Layer Ordering: The layers will be applied according to a predefined order based on the option zIndex. The specific order is defined within Logik, and the frontend will not manage any ordering rules.

Z-Index Inheritance: The zIndex for an image layer is determined by the following rule:

Use the Z-Index value defined at the Option level, if present.

If no option-level Z-Index exists, inherit the Z-Index from the parent Columnset. This ensures all options within a step (like "Hardware Package") share the same base layer position unless explicitly overridden.

This logic should be set as part of the parsing and transforming of data when initializing the configuration and layout.

Additive Layers: All visualized options are additive. Selections will add new layers to the stack. There are no substitutions of images unless an option within a single-select is changed.

Security & User Experience
Right-Click Prevention: An onContextMenu event handler will be attached to the <canvas> element, which will call event.preventDefault() to disable the browser's context menu.

Watermark: A watermark image will be rendered on top of the image stack at all times.

The watermark is a static image asset stored within the ProBuilder application's codebase.

It is only for display in the UI and will not be part of any final merged image generated for external use (e.g., a "download image" feature). The rendering logic must be able to exclude the watermark layer for such cases.

Image Storage
Dynamic Assets: All configurable image layers (visualizerImageUrl, imageUrl) will be hosted in the designated cloud storage solution. The management and naming conventions for these assets are defined in the external PB DAM documentation.

Static Assets: The watermark image will be stored as static assets directly in the frontend application's codebase to ensure availability and version control alignment with the application.