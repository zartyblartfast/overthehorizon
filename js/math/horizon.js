/**
 * horizon.js
 * Functions for calculating horizon distances and visibility
 */

import { EARTH_RADIUS } from './constants.js';

/**
 * Calculates the distance to the horizon based on observer height
 * @param {number} observerHeight - Height of the observer in meters
 * @param {number} [earthRadius=EARTH_RADIUS] - Radius of the Earth in kilometers
 * @param {number} [refractionFactor=1.0] - Atmospheric refraction factor (k value)
 * @returns {number} - Distance to the horizon in kilometers
 */
function calculateHorizonDistance(observerHeight, earthRadius = EARTH_RADIUS, refractionFactor = 1.0) {
  // Convert observer height from meters to kilometers
  const observerHeightKm = observerHeight / 1000;
  
  // Apply refraction factor to Earth radius
  const effectiveEarthRadius = earthRadius * refractionFactor;
  
  // Calculate horizon distance: d = √(2Rh)
  // Where:
  // - d is the distance to the horizon
  // - R is the radius of the Earth (adjusted for refraction)
  // - h is the height of the observer above sea level
  return Math.sqrt(2 * effectiveEarthRadius * observerHeightKm);
}

/**
 * Calculates the maximum visible distance of an object of a given height
 * @param {number} observerHeight - Height of the observer in meters
 * @param {number} objectHeight - Height of the object in meters
 * @param {number} [earthRadius=EARTH_RADIUS] - Radius of the Earth in kilometers
 * @param {number} [refractionFactor=1.0] - Atmospheric refraction factor (k value)
 * @returns {number} - Maximum visible distance in kilometers
 */
function calculateMaxVisibleDistance(observerHeight, objectHeight, earthRadius = EARTH_RADIUS, refractionFactor = 1.0) {
  // Calculate horizon distance for observer
  const observerHorizonDistance = calculateHorizonDistance(observerHeight, earthRadius, refractionFactor);
  
  // Calculate horizon distance for object
  const objectHorizonDistance = calculateHorizonDistance(objectHeight, earthRadius, refractionFactor);
  
  // Maximum visible distance is the sum of the two horizon distances
  return observerHorizonDistance + objectHorizonDistance;
}

/**
 * Calculates the visible portion of an object at a given distance
 * @param {number} distance - Distance to the object in kilometers
 * @param {number} observerHeight - Height of the observer in meters
 * @param {number} objectHeight - Height of the object in meters
 * @param {number} [earthRadius=EARTH_RADIUS] - Radius of the Earth in kilometers
 * @param {number} [refractionFactor=1.0] - Atmospheric refraction factor (k value)
 * @returns {number} - Visible portion of the object (0-1, where 1 is fully visible)
 */
function calculateVisiblePortion(distance, observerHeight, objectHeight, earthRadius = EARTH_RADIUS, refractionFactor = 1.0) {
  // Calculate horizon distance for observer
  const horizonDistance = calculateHorizonDistance(observerHeight, earthRadius, refractionFactor);
  
  // If object is closer than horizon, it's fully visible
  if (distance <= horizonDistance) {
    return 1;
  }
  
  // Calculate maximum visible distance
  const maxVisibleDistance = calculateMaxVisibleDistance(observerHeight, objectHeight, earthRadius, refractionFactor);
  
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
 * Calculates the minimum height above which an object is visible at a given distance
 * @param {number} distance - Distance to the object in kilometers
 * @param {number} observerHeight - Height of the observer in meters
 * @param {number} [earthRadius=EARTH_RADIUS] - Radius of the Earth in kilometers
 * @param {number} [refractionFactor=1.0] - Atmospheric refraction factor (k value)
 * @returns {number} - Minimum height in meters for visibility
 */
function calculateMinimumVisibleHeight(distance, observerHeight, earthRadius = EARTH_RADIUS, refractionFactor = 1.0) {
  // Calculate horizon distance for observer
  const horizonDistance = calculateHorizonDistance(observerHeight, earthRadius, refractionFactor);
  
  // If distance is less than horizon distance, any height is visible
  if (distance <= horizonDistance) {
    return 0;
  }
  
  // Calculate the remaining distance beyond the horizon
  const distanceBeyondHorizon = distance - horizonDistance;
  
  // Apply the inverse of the horizon distance formula to find the minimum height
  // d = √(2Rh) => h = d²/(2R)
  // Where d is the distance beyond horizon
  const effectiveEarthRadius = earthRadius * refractionFactor;
  const minHeightKm = (distanceBeyondHorizon * distanceBeyondHorizon) / (2 * effectiveEarthRadius);
  
  // Convert from kilometers to meters
  return minHeightKm * 1000;
}

/**
 * Calculates the distance at which a ship should start becoming visible in the telescope view
 * @param {number} observerHeight - Height of the observer in meters
 * @param {number} shipHeight - Height of the ship in meters
 * @param {number} [telescopeFieldOfView=5] - Field of view of the telescope in degrees
 * @param {number} [telescopeMagnification=10] - Magnification factor of the telescope
 * @param {number} [earthRadius=EARTH_RADIUS] - Radius of the Earth in kilometers
 * @param {number} [refractionFactor=1.0] - Atmospheric refraction factor (k value)
 * @returns {number} - Distance at which the ship should start appearing in telescope view in kilometers
 */
function calculateTelescopeVisibilityThreshold(
  observerHeight, 
  shipHeight, 
  telescopeFieldOfView = 5, // Default field of view in degrees
  telescopeMagnification = 10, // Default magnification
  earthRadius = EARTH_RADIUS,
  refractionFactor = 1.0
) {
  // Calculate the maximum visible distance
  const maxVisibleDistance = calculateMaxVisibleDistance(observerHeight, shipHeight, earthRadius, refractionFactor);
  
  // Calculate the horizon distance for the observer
  const horizonDistance = calculateHorizonDistance(observerHeight, earthRadius, refractionFactor);
  
  // Calculate the apparent size of the ship at the maximum visible distance
  // This is a simplified calculation and could be refined
  const shipApparentSize = (shipHeight / 1000) / maxVisibleDistance; // in radians
  
  // Convert telescope field of view to radians
  const telescopeFieldOfViewRadians = (telescopeFieldOfView * Math.PI) / 180;
  
  // Calculate the distance at which the ship would fill a significant portion of the telescope view
  // This is a heuristic and can be adjusted
  const significantPortionOfView = 0.2; // Ship takes up 20% of the view
  const telescopeVisibilityDistance = (shipHeight / 1000) / (significantPortionOfView * telescopeFieldOfViewRadians);
  
  // The ship should start appearing in the telescope view at the minimum of:
  // 1. The maximum visible distance (can't see beyond this)
  // 2. The distance at which it becomes significant in the telescope view
  return Math.min(maxVisibleDistance, telescopeVisibilityDistance);
}

// Export functions
export {
  calculateHorizonDistance,
  calculateMaxVisibleDistance,
  calculateVisiblePortion,
  calculateMinimumVisibleHeight,
  calculateTelescopeVisibilityThreshold
};
