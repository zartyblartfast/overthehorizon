/**
 * controls.js
 * Handles user interface controls for the Over The Horizon demonstration
 */

import { DEFAULT_OBSERVER_HEIGHT, DEFAULT_SHIP_HEIGHT } from '../math/constants.js';

/**
 * Sets up the UI controls
 * @param {Object} state - Current state of the simulation
 * @param {Function} onStateChange - Callback function when state changes
 * @returns {Object} - Control elements
 */
function setupControls(state, onStateChange) {
  // Observer height slider
  const observerHeightSlider = document.getElementById('observer-height-slider');
  const observerHeightValue = document.getElementById('observer-height-value');
  
  if (observerHeightSlider && observerHeightValue) {
    observerHeightSlider.value = state.observerHeight || DEFAULT_OBSERVER_HEIGHT;
    observerHeightValue.textContent = `${observerHeightSlider.value} m`;
    
    observerHeightSlider.addEventListener('input', () => {
      state.observerHeight = parseFloat(observerHeightSlider.value);
      observerHeightValue.textContent = `${state.observerHeight} m`;
      onStateChange(state);
    });
  }
  
  // Ship height slider
  const shipHeightSlider = document.getElementById('ship-height-slider');
  const shipHeightValue = document.getElementById('ship-height-value');
  
  if (shipHeightSlider && shipHeightValue) {
    shipHeightSlider.value = state.shipHeight || DEFAULT_SHIP_HEIGHT;
    shipHeightValue.textContent = `${shipHeightSlider.value} m`;
    
    shipHeightSlider.addEventListener('input', () => {
      state.shipHeight = parseFloat(shipHeightSlider.value);
      shipHeightValue.textContent = `${state.shipHeight} m`;
      onStateChange(state);
    });
  }
  
  // Ship distance slider
  const shipDistanceSlider = document.getElementById('ship-distance-slider');
  const shipDistanceValue = document.getElementById('ship-distance-value');
  
  if (shipDistanceSlider && shipDistanceValue) {
    shipDistanceSlider.value = state.shipDistance || 0;
    shipDistanceValue.textContent = `${shipDistanceSlider.value} km`;
    
    shipDistanceSlider.addEventListener('input', () => {
      state.shipDistance = parseFloat(shipDistanceSlider.value);
      shipDistanceValue.textContent = `${state.shipDistance} km`;
      onStateChange(state);
    });
  }
  
  // Telescope toggle
  const telescopeToggle = document.getElementById('telescope-toggle');
  
  if (telescopeToggle) {
    telescopeToggle.checked = state.telescopeEnabled || false;
    
    telescopeToggle.addEventListener('change', () => {
      state.telescopeEnabled = telescopeToggle.checked;
      
      // Show/hide telescope view
      const telescopeView = document.getElementById('telescope-view-container');
      if (telescopeView) {
        telescopeView.style.display = state.telescopeEnabled ? 'block' : 'none';
      }
      
      onStateChange(state);
    });
    
    // Initial telescope view visibility
    const telescopeView = document.getElementById('telescope-view-container');
    if (telescopeView) {
      telescopeView.style.display = state.telescopeEnabled ? 'block' : 'none';
    }
  }
  
  // Animation toggle
  const animationToggle = document.getElementById('animation-toggle');
  
  if (animationToggle) {
    animationToggle.checked = state.animationEnabled || false;
    
    animationToggle.addEventListener('change', () => {
      state.animationEnabled = animationToggle.checked;
      onStateChange(state);
    });
  }
  
  // Reset button
  const resetButton = document.getElementById('reset-button');
  
  if (resetButton) {
    resetButton.addEventListener('click', () => {
      // Reset to default values
      state.observerHeight = DEFAULT_OBSERVER_HEIGHT;
      state.shipHeight = DEFAULT_SHIP_HEIGHT;
      state.shipDistance = 0;
      state.telescopeEnabled = false;
      state.animationEnabled = false;
      
      // Update UI controls
      if (observerHeightSlider) {
        observerHeightSlider.value = state.observerHeight;
        observerHeightValue.textContent = `${state.observerHeight} m`;
      }
      
      if (shipHeightSlider) {
        shipHeightSlider.value = state.shipHeight;
        shipHeightValue.textContent = `${state.shipHeight} m`;
      }
      
      if (shipDistanceSlider) {
        shipDistanceSlider.value = state.shipDistance;
        shipDistanceValue.textContent = `${state.shipDistance} km`;
      }
      
      if (telescopeToggle) {
        telescopeToggle.checked = state.telescopeEnabled;
        
        // Hide telescope view
        const telescopeView = document.getElementById('telescope-view-container');
        if (telescopeView) {
          telescopeView.style.display = 'none';
        }
      }
      
      if (animationToggle) {
        animationToggle.checked = state.animationEnabled;
      }
      
      onStateChange(state);
    });
  }
  
  return {
    observerHeightSlider,
    shipHeightSlider,
    shipDistanceSlider,
    telescopeToggle,
    animationToggle,
    resetButton
  };
}

// Export functions
export {
  setupControls
};
