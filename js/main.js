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
  DEFAULT_REFRACTION_FACTOR,
  EARTH_RADIUS
} from './math/constants.js';
import { calculateMaxVisibleDistance, calculateHorizonDistance, calculateTelescopeVisibilityThreshold } from './math/horizon.js';
import { createHorizonSurfacePlot } from './ui/surfacePlot.js';

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

// Surface plot instance
let surfacePlot = null;

// DOM elements
const observerHeightSlider = document.getElementById('observer-height-slider');
const shipHeightSlider = document.getElementById('ship-height-slider');
const shipDistanceSlider = document.getElementById('ship-distance-slider');
const refractionControl = document.getElementById('refraction-control');
const telescopeToggle = document.getElementById('telescope-toggle');
const animationToggle = document.getElementById('animation-toggle');
const resetButton = document.getElementById('reset-button');

// Value display elements
const observerHeightValue = document.getElementById('observer-height-value');
const shipHeightValue = document.getElementById('ship-height-value');
const shipDistanceValue = document.getElementById('ship-distance-value');

// Container elements
const telescopeViewContainer = document.getElementById('telescope-view-container');

// Load surface data for the 3D plot
async function loadSurfaceData() {
  try {
    const response = await fetch('js/data/horizonSurfaceData.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading surface data:', error);
    return null;
  }
}

// Initialize the 3D surface plot
async function initSurfacePlot() {
  const surfaceData = await loadSurfaceData();
  if (!surfaceData) {
    console.error('Failed to load surface data for 3D plot');
    return;
  }
  
  surfacePlot = createHorizonSurfacePlot('surface-plot', surfaceData, {
    height: 400,
    showContours: true
  });
  
  // Initial update of the marker position
  updateSurfacePlot();
}

// Update the 3D surface plot marker
function updateSurfacePlot() {
  if (surfacePlot) {
    surfacePlot.updateCurrentPositionMarker(
      state.observerHeight,
      state.refractionFactor
    );
  }
}

// Update the display values
function updateDisplayValues() {
  observerHeightValue.textContent = `${state.observerHeight} m`;
  shipHeightValue.textContent = `${state.shipHeight} m`;
  shipDistanceValue.textContent = `${state.shipDistance.toFixed(1)} km`;
}

// Update the views
function updateViews() {
  // Update the 3D surface plot
  updateSurfacePlot();
}

// Event listeners
observerHeightSlider.addEventListener('input', () => {
  state.observerHeight = parseFloat(observerHeightSlider.value);
  updateDisplayValues();
  updateViews();
});

shipHeightSlider.addEventListener('input', () => {
  state.shipHeight = parseFloat(shipHeightSlider.value);
  updateDisplayValues();
  updateViews();
});

shipDistanceSlider.addEventListener('input', () => {
  state.shipDistance = parseFloat(shipDistanceSlider.value);
  updateDisplayValues();
  updateViews();
});

refractionControl.addEventListener('change', () => {
  state.refractionFactor = parseFloat(refractionControl.value);
  updateViews();
});

telescopeToggle.addEventListener('change', () => {
  state.telescopeEnabled = telescopeToggle.checked;
  telescopeViewContainer.style.display = state.telescopeEnabled ? 'block' : 'none';
  updateViews();
});

animationToggle.addEventListener('change', () => {
  state.animationEnabled = animationToggle.checked;
  if (state.animationEnabled) {
    startAnimation();
  } else {
    stopAnimation();
  }
});

resetButton.addEventListener('click', () => {
  // Reset all controls to their default values
  observerHeightSlider.value = 2;
  shipHeightSlider.value = 50;
  shipDistanceSlider.value = 0;
  refractionControl.value = 1.33;
  telescopeToggle.checked = false;
  animationToggle.checked = false;
  
  // Update state
  state = {
    observerHeight: 2,
    shipHeight: 50,
    shipDistance: 0,
    refractionFactor: 1.33,
    telescopeEnabled: false,
    animationEnabled: false
  };
  
  // Update UI
  telescopeViewContainer.style.display = 'none';
  stopAnimation();
  updateDisplayValues();
  updateViews();
});

// Animation variables
let animationId = null;
let animationStartTime = null;
const ANIMATION_DURATION = 60000; // 60 seconds for full animation
const MAX_DISTANCE = 50; // Maximum ship distance in km

// Animation function
function animateShip(timestamp) {
  if (!animationStartTime) animationStartTime = timestamp;
  const elapsed = timestamp - animationStartTime;
  
  // Calculate progress (0 to 1)
  const progress = Math.min(elapsed / ANIMATION_DURATION, 1);
  
  // Update ship distance based on progress
  state.shipDistance = progress * MAX_DISTANCE;
  shipDistanceSlider.value = state.shipDistance;
  
  // Update display and views
  updateDisplayValues();
  updateViews();
  
  // Continue animation if enabled and not complete
  if (state.animationEnabled && progress < 1) {
    animationId = requestAnimationFrame(animateShip);
  } else if (progress >= 1) {
    // Animation complete, reset animation toggle
    animationToggle.checked = false;
    state.animationEnabled = false;
  }
}

// Start animation
function startAnimation() {
  // Reset animation start time
  animationStartTime = null;
  
  // Start the animation loop
  animationId = requestAnimationFrame(animateShip);
}

// Stop animation
function stopAnimation() {
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
}

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
  
  // Set initial display values
  updateDisplayValues();
  
  // Initialize the telescope view container visibility
  telescopeViewContainer.style.display = state.telescopeEnabled ? 'block' : 'none';
  
  // Initialize the views
  updateViews();
  
  // Initialize the 3D surface plot
  initSurfacePlot();
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
