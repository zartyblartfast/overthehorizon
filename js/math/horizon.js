/**
 * horizon.js
 * Functions for calculating horizon distances and visibility
 */

import { EARTH_RADIUS } from './constants.js';

/**
 * Calculates the distance to the horizon based on observer height
 * @param {number} observerHeight - Height of the observer in meters
 * @param {number} [earthRadius=EARTH_RADIUS] - Radius of the Earth in kilometers
 * @returns {number} - Distance to the horizon in kilometers
 */
function calculateHorizonDistance(observerHeight, earthRadius = EARTH_RADIUS) {
  // Convert observer height from meters to kilometers
  const observerHeightKm = observerHeight / 1000;
  
  // Calculate horizon distance: d = √(2Rh)
  // Where:
  // - d is the distance to the horizon
  // - R is the radius of the Earth
  // - h is the height of the observer above sea level
  return Math.sqrt(2 * earthRadius * observerHeightKm);
}

/**
 * Calculates the maximum visible distance of an object of a given height
 * @param {number} observerHeight - Height of the observer in meters
 * @param {number} objectHeight - Height of the object in meters
 * @param {number} [earthRadius=EARTH_RADIUS] - Radius of the Earth in kilometers
 * @returns {number} - Maximum visible distance in kilometers
 */
function calculateMaxVisibleDistance(observerHeight, objectHeight, earthRadius = EARTH_RADIUS) {
  // Calculate horizon distance for observer
  const observerHorizonDistance = calculateHorizonDistance(observerHeight, earthRadius);
  
  // Calculate horizon distance for object
  const objectHorizonDistance = calculateHorizonDistance(objectHeight, earthRadius);
  
  // Maximum visible distance is the sum of the two horizon distances
  return observerHorizonDistance + objectHorizonDistance;
}

/**
 * Calculates the visible portion of an object at a given distance
 * @param {number} distance - Distance to the object in kilometers
 * @param {number} observerHeight - Height of the observer in meters
 * @param {number} objectHeight - Height of the object in meters
 * @param {number} [earthRadius=EARTH_RADIUS] - Radius of the Earth in kilometers
 * @returns {number} - Visible portion of the object (0-1, where 1 is fully visible)
 */
function calculateVisiblePortion(distance, observerHeight, objectHeight, earthRadius = EARTH_RADIUS) {
  // Calculate horizon distance for observer
  const horizonDistance = calculateHorizonDistance(observerHeight, earthRadius);
  
  // If object is closer than horizon, it's fully visible
  if (distance <= horizonDistance) {
    return 1;
  }
  
  // Calculate maximum visible distance
  const maxVisibleDistance = calculateMaxVisibleDistance(observerHeight, objectHeight, earthRadius);
  
  // If object is beyond maximum visible distance, it's not visible at all
  if (distance >= maxVisibleDistance) {
    return 0;
  }
  
  // Calculate visible portion based on distance beyond horizon
  const distanceBeyondHorizon = distance - horizonDistance;
  const totalPossibleDistanceBeyondHorizon = maxVisibleDistance - horizonDistance;
  
  return 1 - (distanceBeyondHorizon / totalPossibleDistanceBeyondHorizon);
}

/**
 * Calculates the height above which an object is visible at a given distance
 * @param {number} distance - Distance to the object in kilometers
 * @param {number} observerHeight - Height of the observer in meters
 * @param {number} [earthRadius=EARTH_RADIUS] - Radius of the Earth in kilometers
 * @returns {number} - Minimum height in meters for visibility
 */
function calculateMinimumVisibleHeight(distance, observerHeight, earthRadius = EARTH_RADIUS) {
  // Calculate horizon distance for observer
  const horizonDistance = calculateHorizonDistance(observerHeight, earthRadius);
  
  // If object is closer than horizon, any height is visible
  if (distance <= horizonDistance) {
    return 0;
  }
  
  // Calculate distance beyond horizon
  const distanceBeyondHorizon = distance - horizonDistance;
  
  // Calculate minimum height required for visibility
  // h = d²/(2R)
  // Where:
  // - h is the minimum height
  // - d is the distance beyond horizon
  // - R is the radius of the Earth
  const minHeightKm = Math.pow(distanceBeyondHorizon, 2) / (2 * earthRadius);
  
  // Convert from kilometers to meters
  return minHeightKm * 1000;
}

/**
 * Calculates the distance at which a ship should start becoming visible in the telescope view
 * @param {number} observerHeight - Height of the observer in meters
 * @param {number} shipHeight - Height of the ship in meters
 * @param {number} telescopeFieldOfView - Field of view of the telescope in degrees
 * @param {number} telescopeMagnification - Magnification factor of the telescope
 * @param {number} [earthRadius=EARTH_RADIUS] - Radius of the Earth in kilometers
 * @returns {number} - Distance at which the ship should start appearing in telescope view in kilometers
 */
function calculateTelescopeVisibilityThreshold(
  observerHeight, 
  shipHeight, 
  telescopeFieldOfView = 5, // Default field of view in degrees
  telescopeMagnification = 10, // Default magnification
  earthRadius = EARTH_RADIUS
) {
  // Calculate horizon distance for observer
  const horizonDistance = calculateHorizonDistance(observerHeight, earthRadius);
  
  // Use a simpler approach - base the visibility threshold on the horizon distance
  // but adjust it based on the ship's height
  
  // Start with a base percentage of the horizon distance
  const basePercentage = 0.5; // 50% of horizon distance
  
  // Adjust based on ship height - taller ships should be visible earlier
  // Use a logarithmic scale to handle a wide range of ship heights
  // For the default 30m ship, this will add about 0.15 (15%)
  const shipHeightAdjustment = 0.05 * Math.log10(shipHeight + 1);
  
  // Calculate the visibility threshold
  const visibilityThreshold = horizonDistance * (basePercentage + shipHeightAdjustment);
  
  // Debug logging
  console.log('Simplified telescope visibility calculation:', {
    observerHeight,
    shipHeight,
    horizonDistance,
    basePercentage,
    shipHeightAdjustment,
    visibilityThreshold
  });
  
  return visibilityThreshold;
}

// Export functions
export {
  calculateHorizonDistance,
  calculateMaxVisibleDistance,
  calculateVisiblePortion,
  calculateMinimumVisibleHeight,
  calculateTelescopeVisibilityThreshold
};
