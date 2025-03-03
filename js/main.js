/**
 * main.js
 * Main entry point for the Over The Horizon demonstration
 */

import { setupCanvas } from './rendering/canvas.js';
import { renderNormalView } from './rendering/normalView.js';
import { drawTelescopeView, renderShipInTelescopeView } from './rendering/telescopeView.js';
import { setupControls } from './ui/controls.js';
import { AnimationController } from './ui/animation.js';
import { 
  DEFAULT_OBSERVER_HEIGHT, 
  DEFAULT_SHIP_HEIGHT 
} from './math/constants.js';
import { calculateMaxVisibleDistance } from './math/horizon.js';

// Application state
const state = {
  observerHeight: DEFAULT_OBSERVER_HEIGHT,
  shipHeight: DEFAULT_SHIP_HEIGHT,
  shipDistance: 0,
  maxDistance: calculateMaxVisibleDistance(DEFAULT_OBSERVER_HEIGHT, DEFAULT_SHIP_HEIGHT), // Calculated dynamically
  telescopeEnabled: false,
  animationEnabled: false
};

// Canvas contexts
let mainCtx;
let telescopeCtx;

// Animation controller
let animationController;

/**
 * Initializes the application
 */
function init() {
  // Set up main canvas
  const mainCanvas = setupCanvas('main-view', 800, 600);
  if (mainCanvas) {
    mainCtx = mainCanvas.ctx;
  } else {
    console.error('Failed to set up main canvas');
    return;
  }
  
  // Set up telescope canvas
  const telescopeCanvas = setupCanvas('telescope-view', 300, 300);
  if (telescopeCanvas) {
    telescopeCtx = telescopeCanvas.ctx;
  } else {
    console.error('Failed to set up telescope canvas');
    return;
  }
  
  // Set up UI controls
  setupControls(state, handleStateChange);
  
  // Create animation controller
  animationController = new AnimationController(state, handleStateChange);
  
  // Initial render
  render();
  
  // Add event listener for telescope view targeting
  mainCanvas.canvas.addEventListener('click', handleMainCanvasClick);
}

/**
 * Handles state changes
 * @param {Object} newState - Updated state
 */
function handleStateChange(newState) {
  // Update animation controller
  if (animationController) {
    animationController.updateState(newState);
  }
  
  // Render with new state
  render();
}

/**
 * Handles clicks on the main canvas for telescope targeting
 * @param {MouseEvent} event - Mouse event
 */
function handleMainCanvasClick(event) {
  if (!state.telescopeEnabled) {
    return;
  }
  
  const rect = event.target.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  
  // Update telescope view to center on clicked point
  drawTelescopeView(telescopeCtx, mainCtx, x, y);
}

/**
 * Renders the application
 */
function render() {
  // Render normal view
  renderNormalView(mainCtx, state);
  
  // Render telescope view if enabled
  if (state.telescopeEnabled) {
    // Get ship position in main view
    const shipX = mainCtx.canvas.width / 2;
    const shipY = mainCtx.canvas.height / 3; // Horizon Y position
    
    // Render telescope view centered on ship
    drawTelescopeView(telescopeCtx, mainCtx, shipX, shipY);
  }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Export state and functions for debugging
window.appState = state;
window.appRender = render;
