/**
 * animation.js
 * Handles animation for the Over The Horizon demonstration
 */

/**
 * Animation controller for the ship's movement
 */
class AnimationController {
  /**
   * Creates a new animation controller
   * @param {Object} state - The application state object
   * @param {Function} onStateChange - Callback function when state changes
   */
  constructor(state, onStateChange) {
    this.state = state;
    this.onStateChange = onStateChange;
    this.animationId = null;
    this.lastTimestamp = 0;
    this.animationSpeed = 5; // km per second
    this.maxDistance = state.maxDistance || 50;
    this.direction = 1; // 1 = moving away, -1 = moving towards
  }
  
  /**
   * Starts the animation
   */
  start() {
    if (this.animationId === null) {
      this.lastTimestamp = performance.now();
      this.animationId = requestAnimationFrame(this.animate.bind(this));
    }
  }
  
  /**
   * Stops the animation
   */
  stop() {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }
  
  /**
   * Animation frame callback
   * @param {number} timestamp - Current timestamp
   */
  animate(timestamp) {
    // Calculate time delta in seconds
    const deltaTime = (timestamp - this.lastTimestamp) / 1000;
    this.lastTimestamp = timestamp;
    
    // Update ship distance
    this.state.shipDistance += this.animationSpeed * deltaTime * this.direction;
    
    // Check if we need to reverse direction
    if (this.state.shipDistance >= this.maxDistance) {
      this.state.shipDistance = this.maxDistance;
      this.direction = -1;
    } else if (this.state.shipDistance <= 0) {
      this.state.shipDistance = 0;
      this.direction = 1;
    }
    
    // Update UI
    const shipDistanceSlider = document.getElementById('ship-distance-slider');
    const shipDistanceValue = document.getElementById('ship-distance-value');
    
    if (shipDistanceSlider) {
      shipDistanceSlider.value = this.state.shipDistance;
    }
    
    if (shipDistanceValue) {
      shipDistanceValue.textContent = `${this.state.shipDistance.toFixed(1)} km`;
    }
    
    // Notify state change
    this.onStateChange(this.state);
    
    // Continue animation if enabled
    if (this.state.animationEnabled) {
      this.animationId = requestAnimationFrame(this.animate.bind(this));
    } else {
      this.animationId = null;
    }
  }
  
  /**
   * Updates the animation state
   * @param {Object} state - New state
   */
  updateState(state) {
    this.state = state;
    
    // Start or stop animation based on state
    if (state.animationEnabled && this.animationId === null) {
      this.start();
    } else if (!state.animationEnabled && this.animationId !== null) {
      this.stop();
    }
  }
}

// Export classes
export {
  AnimationController
};
