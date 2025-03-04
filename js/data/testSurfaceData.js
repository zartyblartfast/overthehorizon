/**
 * testSurfaceData.js
 * Test script for the surface data generation functions
 */

import { generateHorizonSurfaceData, getCurrentPositionData } from './surfaceData.js';

// Generate sample data with smaller ranges for testing
const testOptions = {
  heightRange: [1, 20, 5],       // 1m to 20m in steps of 5m
  refractionRange: [1.0, 1.5, 0.1]  // 1.0 to 1.5 in steps of 0.1
};

// Generate the data
const surfaceData = generateHorizonSurfaceData(testOptions);

// Log the data structure
console.log('Surface Data Structure:');
console.log('X-axis (heights):', surfaceData.x);
console.log('Y-axis (refractions):', surfaceData.y);
console.log('Z-axis (distances matrix):');
console.table(surfaceData.z);

// Test the current position data
const currentPosition = getCurrentPositionData(2, 1.33);
console.log('Current Position Data:', currentPosition);

// Calculate some statistics
const allDistances = surfaceData.z.flat();
const minDistance = Math.min(...allDistances);
const maxDistance = Math.max(...allDistances);
const avgDistance = allDistances.reduce((sum, val) => sum + val, 0) / allDistances.length;

console.log('Statistics:');
console.log('Minimum Distance:', minDistance.toFixed(2), 'km');
console.log('Maximum Distance:', maxDistance.toFixed(2), 'km');
console.log('Average Distance:', avgDistance.toFixed(2), 'km');

// Export the data for potential use in browser console
window.surfaceTestData = {
  surfaceData,
  currentPosition,
  stats: {
    minDistance,
    maxDistance,
    avgDistance
  }
};
