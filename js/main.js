/**
 * main.js
 * Main entry point for the Over The Horizon demonstration
 */

import { setupCanvas } from './rendering/canvas.js';
import { renderNormalView } from './rendering/normalView.js';
import { drawTelescopeView, renderShipInTelescopeView, TELESCOPE_CONSTANTS } from './rendering/telescopeView.js';
import { setupControls } from './ui/controls.js';
import { AnimationController } from './ui/animation.js';
import { 
  DEFAULT_OBSERVER_HEIGHT, 
  DEFAULT_SHIP_HEIGHT,
  DEFAULT_REFRACTION_FACTOR
} from './math/constants.js';
import { calculateMaxVisibleDistance, calculateHorizonDistance, calculateTelescopeVisibilityThreshold } from './math/horizon.js';

// Application state
const state = {
  observerHeight: DEFAULT_OBSERVER_HEIGHT,
  shipHeight: DEFAULT_SHIP_HEIGHT,
  shipDistance: 0,
  maxDistance: calculateMaxVisibleDistance(DEFAULT_OBSERVER_HEIGHT, DEFAULT_SHIP_HEIGHT, undefined, DEFAULT_REFRACTION_FACTOR), // Calculated dynamically
  telescopeEnabled: false,
  animationEnabled: false,
  refractionFactor: DEFAULT_REFRACTION_FACTOR
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
  
  // For now, clicking doesn't change the telescope view
  // The telescope view is always centered on the ship
  // We'll just trigger a re-render
  render();
}

/**
 * Renders the application
 */
function render() {
  // Render normal view
  renderNormalView(mainCtx, state);
  
  // Render telescope view if enabled
  if (state.telescopeEnabled) {
    // Calculate ship parameters for telescope view
    const horizonDistance = calculateHorizonDistance(state.observerHeight, undefined, state.refractionFactor);
    const maxVisibleDistance = calculateMaxVisibleDistance(state.observerHeight, state.shipHeight, undefined, state.refractionFactor);
    
    // Base scale calculation
    const baseScale = Math.sqrt(state.shipHeight / 50);
    
    // Calculate ship position, scale, and sinking amount
    let shipScale, sinkAmount;
    
    // Calculate telescope visibility factor (0-1)
    // Instead of a fixed percentage, use the new function that takes ship height into account
    const visibilityStartDistance = calculateTelescopeVisibilityThreshold(
      state.observerHeight,
      state.shipHeight,
      TELESCOPE_CONSTANTS.FIELD_OF_VIEW,
      TELESCOPE_CONSTANTS.MAGNIFICATION,
      undefined,
      state.refractionFactor
    );
    
    // Debug logging
    console.log('Debug values:', {
      observerHeight: state.observerHeight,
      shipHeight: state.shipHeight,
      shipDistance: state.shipDistance,
      refractionFactor: state.refractionFactor,
      horizonDistance,
      maxVisibleDistance,
      visibilityStartDistance,
      fieldOfView: TELESCOPE_CONSTANTS.FIELD_OF_VIEW,
      magnification: TELESCOPE_CONSTANTS.MAGNIFICATION
    });
    
    let telescopeVisibilityFactor = 0;
    
    if (state.shipDistance < visibilityStartDistance) {
      // Too close to shore, not visible in telescope
      telescopeVisibilityFactor = 0;
    } else if (state.shipDistance <= horizonDistance) {
      // Approaching horizon, gradually becoming visible
      // Map distance from visibilityStartDistance to horizonDistance to a 0-1 range
      telescopeVisibilityFactor = (state.shipDistance - visibilityStartDistance) / (horizonDistance - visibilityStartDistance);
    } else {
      // At or beyond horizon, fully visible in telescope
      telescopeVisibilityFactor = 1;
    }
    
    // Additional debug logging
    console.log('Visibility factor:', telescopeVisibilityFactor);
    
    if (state.shipDistance <= horizonDistance) {
      // Before horizon: ship is fully visible
      shipScale = (1 - 0.75 * (state.shipDistance / horizonDistance)) * baseScale;
      sinkAmount = 0;
    } else {
      // Beyond horizon: ship starts to sink
      shipScale = 0.25 * baseScale;
      
      // Calculate sinking amount (0-1)
      const distanceBeyondHorizon = state.shipDistance - horizonDistance;
      const totalPossibleDistanceBeyondHorizon = maxVisibleDistance - horizonDistance;
      sinkAmount = Math.min(1, distanceBeyondHorizon / totalPossibleDistanceBeyondHorizon);
    }
    
    // Get horizon Y position in the telescope view
    const telescopeHorizonY = telescopeCtx.canvas.height / 2;
    
    // Render telescope view with proper ship rendering
    drawTelescopeView(telescopeCtx, mainCtx, shipScale, sinkAmount, telescopeHorizonY, telescopeVisibilityFactor);
  }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Export state and functions for debugging
window.appState = state;
window.appRender = render;
