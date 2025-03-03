/**
 * constants.js
 * Mathematical constants for the Over The Horizon demonstration
 */

// Earth radius in kilometers (matching the Mathematica notebook value)
const EARTH_RADIUS = 7320;

// Default observer height in meters
const DEFAULT_OBSERVER_HEIGHT = 2;

// Default ship height in meters
const DEFAULT_SHIP_HEIGHT = 30;

// Ship dimensions in pixels (for rendering)
const SHIP_DIMENSIONS = {
  WIDTH: 100,
  HEIGHT: 70,
  HULL_HEIGHT: 15,
  SUPERSTRUCTURE_HEIGHT: 25,
  MAST_HEIGHT: 30
};

// Export constants
export {
  EARTH_RADIUS,
  DEFAULT_OBSERVER_HEIGHT,
  DEFAULT_SHIP_HEIGHT,
  SHIP_DIMENSIONS
};
