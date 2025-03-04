/**
 * surfaceData.js
 * Module for generating data for the 3D surface plot visualization
 */

import { calculateHorizonDistance, calculateMaxVisibleDistance } from '../math/horizon.js';
import { EARTH_RADIUS } from '../math/constants.js';

/**
 * Generates data for the horizon distance surface plot
 * @param {Object} options - Configuration options
 * @param {number[]} options.heightRange - Range of observer heights [min, max, step]
 * @param {number[]} options.refractionRange - Range of refraction factors [min, max, step]
 * @returns {Object} - Data for the surface plot
 */
function generateHorizonSurfaceData(options = {}) {
  // Default options
  const {
    heightRange = [1, 100, 5],    // Observer height from 1m to 100m in steps of 5m
    refractionRange = [1.0, 1.5, 0.05]  // Refraction from 1.0 to 1.5 in steps of 0.05
  } = options;
  
  // Generate arrays for x (height) and y (refraction) axes
  const heights = [];
  for (let h = heightRange[0]; h <= heightRange[1]; h += heightRange[2]) {
    heights.push(h);
  }
  
  const refractions = [];
  for (let r = refractionRange[0]; r <= refractionRange[1]; r += refractionRange[2]) {
    refractions.push(parseFloat(r.toFixed(2))); // Ensure consistent decimal precision
  }
  
  // Create z-value matrix (horizon distances)
  const distances = [];
  
  // For each refraction value (y-axis)
  for (let i = 0; i < refractions.length; i++) {
    const refraction = refractions[i];
    const row = [];
    
    // For each height value (x-axis)
    for (let j = 0; j < heights.length; j++) {
      const height = heights[j];
      const distance = calculateHorizonDistance(height, EARTH_RADIUS, refraction);
      row.push(parseFloat(distance.toFixed(2))); // Round to 2 decimal places
    }
    
    distances.push(row);
  }
  
  return {
    x: heights,        // Observer heights (x-axis)
    y: refractions,    // Refraction factors (y-axis)
    z: distances       // Horizon distances (z-axis, 2D matrix)
  };
}

/**
 * Generates data for the maximum visible distance surface plot
 * @param {Object} options - Configuration options
 * @param {number[]} options.observerHeightRange - Range of observer heights [min, max, step]
 * @param {number[]} options.objectHeightRange - Range of object heights [min, max, step]
 * @param {number} options.refractionFactor - Refraction factor to use
 * @returns {Object} - Data for the surface plot
 */
function generateMaxVisibleDistanceSurfaceData(options = {}) {
  // Default options
  const {
    observerHeightRange = [1, 100, 5],  // Observer height from 1m to 100m in steps of 5m
    objectHeightRange = [5, 100, 5],    // Object height from 5m to 100m in steps of 5m
    refractionFactor = 1.33             // Standard refraction
  } = options;
  
  // Generate arrays for x (observer height) and y (object height) axes
  const observerHeights = [];
  for (let h = observerHeightRange[0]; h <= observerHeightRange[1]; h += observerHeightRange[2]) {
    observerHeights.push(h);
  }
  
  const objectHeights = [];
  for (let h = objectHeightRange[0]; h <= objectHeightRange[1]; h += objectHeightRange[2]) {
    objectHeights.push(h);
  }
  
  // Create z-value matrix (max visible distances)
  const distances = [];
  
  // For each object height (y-axis)
  for (let i = 0; i < objectHeights.length; i++) {
    const objectHeight = objectHeights[i];
    const row = [];
    
    // For each observer height (x-axis)
    for (let j = 0; j < observerHeights.length; j++) {
      const observerHeight = observerHeights[j];
      const distance = calculateMaxVisibleDistance(
        observerHeight, 
        objectHeight, 
        EARTH_RADIUS, 
        refractionFactor
      );
      row.push(parseFloat(distance.toFixed(2))); // Round to 2 decimal places
    }
    
    distances.push(row);
  }
  
  return {
    x: observerHeights,  // Observer heights (x-axis)
    y: objectHeights,    // Object heights (y-axis)
    z: distances         // Max visible distances (z-axis, 2D matrix)
  };
}

/**
 * Gets the current position data for marking on the surface plot
 * @param {number} observerHeight - Current observer height
 * @param {number} refractionFactor - Current refraction factor
 * @returns {Object} - Current position data
 */
function getCurrentPositionData(observerHeight, refractionFactor) {
  const distance = calculateHorizonDistance(observerHeight, EARTH_RADIUS, refractionFactor);
  
  return {
    x: observerHeight,
    y: refractionFactor,
    z: parseFloat(distance.toFixed(2))
  };
}

export {
  generateHorizonSurfaceData,
  generateMaxVisibleDistanceSurfaceData,
  getCurrentPositionData
};
