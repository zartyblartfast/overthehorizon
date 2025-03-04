/**
 * canvas-patch.js
 * Patches the Canvas API to optimize for frequent read operations
 */

// Apply the patch when the module is imported
(function patchCanvasForPlotly() {
  // Store the original getContext method
  const originalGetContext = HTMLCanvasElement.prototype.getContext;
  
  // Override the getContext method to set willReadFrequently=true for 2d contexts
  HTMLCanvasElement.prototype.getContext = function(contextType, contextAttributes) {
    // For 2D contexts, set willReadFrequently to true
    if (contextType === '2d') {
      contextAttributes = contextAttributes || {};
      contextAttributes.willReadFrequently = true;
    }
    
    // Call the original method with our modified attributes
    return originalGetContext.call(this, contextType, contextAttributes);
  };
  
  console.log('Canvas getContext patched to optimize for frequent read operations');
})();

// No exports needed as this is a self-executing patch
