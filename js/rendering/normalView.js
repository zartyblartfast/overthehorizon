/**
 * normalView.js
 * Handles rendering of the normal (non-telescope) view for the Over The Horizon demonstration
 */

import { drawSeaAndHorizon, drawDistanceMarkers } from './canvas.js';
import { drawShip, calculateShipScale, calculateShipSinking, renderSmoke } from './ship.js';
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
  
  // Draw the dock and cranes at the shore position
  drawDockWithCranes(ctx, shoreX, shoreY);
  
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
    
    // Smoke rendering disabled
    // renderSmoke(ctx, shipX, shipY, shipScale, sinkAmount);
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
    
    // We'll only render smoke in the telescope view to avoid duplication
    // renderSmoke(ctx, shipX, shipY, shipScale, sinkAmount);
  }
  
  // Draw observer information
  drawObserverInfo(ctx, state);
}

/**
 * Draws a dock with cranes at the specified position
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} x - X position of the dock
 * @param {number} y - Y position of the dock (water level)
 */
function drawDockWithCranes(ctx, x, y) {
  ctx.save();
  
  // Original pilings height
  const pilingHeight = 30;
  
  // Adjust dock position so the bottom of the dock's legs align with the ship's waterline
  // This means moving the dock up by the height of the pilings
  const dockYOffset = -pilingHeight; // Move dock up exactly by the height of the pilings
  const dockY = y + dockYOffset;
  
  // Draw dock platform extending to the left edge
  const dockWidth = x - 10; // Make dock extend from near ship position to left edge, with a small gap
  const dockHeight = 10;
  const dockX = 0; // Start at left edge of canvas
  
  // Draw dock platform with perspective
  ctx.fillStyle = '#8B4513'; // Saddle brown for wooden dock
  ctx.beginPath();
  ctx.moveTo(dockX, dockY);
  ctx.lineTo(dockX + dockWidth, dockY);
  ctx.lineTo(dockX + dockWidth - 10, dockY + dockHeight);
  ctx.lineTo(dockX - 10, dockY + dockHeight);
  ctx.closePath();
  ctx.fill();
  
  // Add dock edge detail
  ctx.strokeStyle = '#6B4226';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(dockX, dockY);
  ctx.lineTo(dockX + dockWidth, dockY);
  ctx.stroke();
  
  // Draw dock pilings - keep original height
  ctx.fillStyle = '#6B4226'; // Darker brown for pilings
  const pilingWidth = 8;
  const pilingCount = 6; // Increased number of pilings
  const pilingSpacing = dockWidth / (pilingCount - 1);
  
  for (let i = 0; i < pilingCount; i++) {
    const pilingX = dockX + (i * pilingSpacing);
    ctx.fillRect(pilingX - pilingWidth/2, dockY, pilingWidth, pilingHeight);
  }
  
  // Draw port building on the left side
  ctx.fillStyle = '#D3D3D3'; // Light gray for building
  ctx.fillRect(dockX + 20, dockY - 60, 80, 60);
  
  // Building windows
  ctx.fillStyle = '#4682B4'; // Steel blue for windows
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 4; col++) {
      ctx.fillRect(dockX + 30 + (col * 18), dockY - 50 + (row * 15), 10, 8);
    }
  }
  
  // Building roof
  ctx.fillStyle = '#A52A2A'; // Brown for roof
  ctx.beginPath();
  ctx.moveTo(dockX + 15, dockY - 60);
  ctx.lineTo(dockX + 105, dockY - 60);
  ctx.lineTo(dockX + 100, dockY - 70);
  ctx.lineTo(dockX + 20, dockY - 70);
  ctx.closePath();
  ctx.fill();
  
  // Draw first crane (taller)
  drawCrane(ctx, dockX + dockWidth * 0.3, dockY, 80, 40, '#444444');
  
  // Draw second crane (shorter)
  drawCrane(ctx, dockX + dockWidth * 0.6, dockY, 60, 30, '#555555');
  
  // Add some dock details - mooring bollards
  const bollardCount = 4;
  const bollardSpacing = dockWidth / (bollardCount + 1);
  
  for (let i = 1; i <= bollardCount; i++) {
    const bollardX = dockX + (i * bollardSpacing);
    // Draw bollard
    ctx.fillStyle = '#333333';
    ctx.beginPath();
    ctx.arc(bollardX, dockY - 5, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(bollardX - 4, dockY - 10, 8, 5);
  }
  
  ctx.restore();
}

/**
 * Draws a shipping crane
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} x - X position of the crane base
 * @param {number} y - Y position of the crane base (water level)
 * @param {number} height - Height of the crane
 * @param {number} armLength - Length of the crane arm
 * @param {string} color - Color of the crane
 */
function drawCrane(ctx, x, y, height, armLength, color) {
  ctx.save();
  
  // Crane base
  const baseWidth = 20;
  ctx.fillStyle = color;
  
  // Draw crane tower
  ctx.fillRect(x - baseWidth/2, y - height, baseWidth, height);
  
  // Draw crane arm
  ctx.lineWidth = 5;
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y - height);
  ctx.lineTo(x + armLength, y - height * 0.8);
  ctx.stroke();
  
  // Draw crane cabin
  ctx.fillRect(x - baseWidth/2 - 5, y - height, baseWidth + 10, 15);
  
  // Draw crane cables
  ctx.lineWidth = 1;
  ctx.strokeStyle = '#222222';
  const cableCount = 3;
  const cableSpacing = armLength / (cableCount + 1);
  
  for (let i = 1; i <= cableCount; i++) {
    const cableX = x + (i * cableSpacing);
    const cableY = y - height * 0.8 + (i * (height * 0.05));
    
    ctx.beginPath();
    ctx.moveTo(cableX, cableY);
    ctx.lineTo(cableX, cableY + height * 0.3);
    ctx.stroke();
    
    // Draw small hook or container at the end of some cables
    if (i === 1 || i === cableCount) {
      ctx.fillStyle = i === 1 ? '#2266CC' : '#CC4422';
      ctx.fillRect(cableX - 5, cableY + height * 0.3, 10, 8);
    }
  }
  
  ctx.restore();
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
