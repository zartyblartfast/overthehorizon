/**
 * normalView.js
 * Handles rendering of the normal (non-telescope) view for the Over The Horizon demonstration
 */

import { drawSeaAndHorizon, drawDistanceMarkers } from './canvas.js';
import { drawShip, calculateShipScale, calculateShipSinking } from './ship.js';
import { calculateHorizonDistance, calculateMaxVisibleDistance, calculateVisiblePortion } from '../math/horizon.js';
import { EARTH_RADIUS } from '../math/constants.js';

/**
 * Renders the complete normal view
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {Object} state - Current state of the simulation
 * @param {number} state.observerHeight - Height of observer in meters
 * @param {number} state.shipHeight - Height of ship in meters
 * @param {number} state.shipDistance - Distance of ship in kilometers
 * @param {number} state.maxDistance - Maximum distance to show in kilometers
 */
function renderNormalView(ctx, state) {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  
  // Calculate horizon position (approximately 1/3 from the top of the canvas)
  const horizonY = height / 3;
  
  // Clear canvas and draw sea and horizon
  ctx.clearRect(0, 0, width, height);
  drawSeaAndHorizon(ctx, horizonY);
  
  // Remove distance markers as they can be misleading
  // drawDistanceMarkers(ctx, horizonY, state.maxDistance, 5);
  
  // Calculate horizon distance for observer (d0[h] in Mathematica)
  const horizonDistance = calculateHorizonDistance(state.observerHeight);
  
  // Calculate maximum visible distance (d1[H] in Mathematica)
  const maxVisibleDistance = calculateMaxVisibleDistance(
    state.observerHeight,
    state.shipHeight
  );
  
  // Define the starting position for the ship (when distance = 0)
  const shoreX = width * 0.2; // 20% from the left edge
  const shoreY = height * 0.7; // 70% down from the top (below horizon)
  
  // Define the horizon position (where the ship reaches when distance = horizonDistance)
  const horizonX = width * 0.8; // 80% from the left edge
  
  // Calculate the ship's position and scale
  let shipX, shipY, shipScale, sinkAmount;
  
  // Base scale calculation - consistent for all distances
  const baseScale = Math.sqrt(state.shipHeight / 50);
  
  if (state.shipDistance <= horizonDistance) {
    // Before horizon: ship moves from shore to horizon as distance increases
    const distanceRatio = state.shipDistance / horizonDistance;
    
    // Calculate horizontal position - ship moves from shore to horizon
    shipX = shoreX + (horizonX - shoreX) * distanceRatio;
    
    // Calculate vertical position - ship moves from shore level up to horizon level
    shipY = shoreY - (shoreY - horizonY) * distanceRatio;
    
    // Calculate ship scale - gets smaller as it moves away
    // This matches the Mathematica formula: (1 - 0.75*d/d0[h])*Sqrt[H/50]
    shipScale = (1 - 0.75 * distanceRatio) * baseScale;
    
    // No sinking before horizon
    sinkAmount = 0;
    
    // Draw ship directly (no clipping needed before horizon)
    drawShip(ctx, shipX, shipY, shipScale, sinkAmount);
  } else {
    // Beyond horizon: ship stays at horizon X position but sinks below horizon
    shipX = horizonX; // Fixed at horizon X position
    shipY = horizonY; // Position at horizon level
    
    // Calculate how far beyond the horizon the ship is
    const distanceBeyondHorizon = state.shipDistance - horizonDistance;
    const totalPossibleDistanceBeyondHorizon = maxVisibleDistance - horizonDistance;
    const beyondHorizonRatio = Math.min(1, distanceBeyondHorizon / totalPossibleDistanceBeyondHorizon);
    
    // Scale remains constant beyond horizon at the reduced size it had when it reached the horizon
    // This matches the Mathematica formula: 0.25*Sqrt[H/50]
    shipScale = 0.25 * baseScale;
    
    // Calculate the normalized sinking amount (0-1 range)
    sinkAmount = beyondHorizonRatio;
    
    // Create a clipping region that only shows content above the horizon
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, width, horizonY);
    ctx.clip();
    
    // Draw ship (it will be automatically clipped at the horizon)
    drawShip(ctx, shipX, shipY, shipScale, sinkAmount);
    
    // Restore the canvas state
    ctx.restore();
  }
  
  // Draw observer information
  drawObserverInfo(ctx, state);
}

/**
 * Draws observer information
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {Object} state - Current state of the simulation
 */
function drawObserverInfo(ctx, state) {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  
  // Set text properties
  ctx.font = '14px Arial';
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'left';
  
  // Calculate horizon distance
  const horizonDistance = calculateHorizonDistance(state.observerHeight);
  
  // Draw observer height
  ctx.fillText(`Observer Height: ${state.observerHeight.toFixed(1)} m`, 20, height - 80);
  
  // Draw horizon distance
  ctx.fillText(`Horizon Distance: ${horizonDistance.toFixed(1)} km`, 20, height - 60);
  
  // Draw ship distance
  ctx.fillText(`Ship Distance: ${state.shipDistance.toFixed(1)} km`, 20, height - 40);
  
  // Draw ship height
  ctx.fillText(`Ship Height: ${state.shipHeight.toFixed(1)} m`, 20, height - 20);
  
  // Calculate and draw visibility status
  const visiblePortion = calculateVisiblePortion(
    state.shipDistance,
    state.observerHeight,
    state.shipHeight,
    EARTH_RADIUS
  );
  
  let visibilityStatus;
  if (visiblePortion >= 0.99) {
    visibilityStatus = "Fully Visible";
  } else if (visiblePortion <= 0.01) {
    visibilityStatus = "Not Visible";
  } else {
    visibilityStatus = `${(visiblePortion * 100).toFixed(0)}% Visible`;
  }
  
  ctx.textAlign = 'right';
  ctx.fillText(`Visibility: ${visibilityStatus}`, width - 20, height - 20);
}

// Export functions
export {
  renderNormalView
};
