/**
 * telescopeView.js
 * Handles rendering of the telescope view for the Over The Horizon demonstration
 */

import { drawShip } from './ship.js';

/**
 * Constants for telescope view
 */
const TELESCOPE_CONSTANTS = {
  BORDER_COLOR: '#000000',
  BORDER_WIDTH: 5,
  CROSSHAIR_COLOR: '#FF0000',
  CROSSHAIR_WIDTH: 1,
  MAGNIFICATION: 4, // Default magnification factor
  SKY_COLOR: '#87CEEB',
  SEA_COLOR: '#1E90FF',
  HORIZON_COLOR: '#000000',
  HORIZON_WIDTH: 1,
};

/**
 * Draws the telescope view
 * @param {CanvasRenderingContext2D} ctx - Canvas context for telescope view
 * @param {CanvasRenderingContext2D} mainCtx - Canvas context for main view (source)
 * @param {number} shipScale - Scale factor for the ship
 * @param {number} sinkAmount - Amount by which the ship appears to sink (0-1)
 * @param {number} horizonY - Y-coordinate of the horizon line
 * @param {number} visibilityFactor - Factor determining if ship is visible in telescope (0-1)
 * @param {number} [magnification=TELESCOPE_CONSTANTS.MAGNIFICATION] - Magnification factor
 */
function drawTelescopeView(ctx, mainCtx, shipScale, sinkAmount, horizonY, visibilityFactor, magnification = TELESCOPE_CONSTANTS.MAGNIFICATION) {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  const centerX = width / 2;
  
  // Clear telescope view
  ctx.clearRect(0, 0, width, height);
  
  // Draw sky and sea background with circular clipping
  drawTelescopeBackground(ctx, width, height, horizonY);
  
  // Only draw ship if it's close enough to the horizon to be visible in telescope
  if (visibilityFactor > 0) {
    // Apply telescope magnification to ship scale
    const magnifiedShipScale = shipScale * magnification;
    
    // Calculate vertical offset to make ship appear to rise into view
    // When visibilityFactor is 0, ship is completely below view
    // When visibilityFactor is 1, ship is at the horizon
    // Use a very small offset factor to make the transition subtle
    // This ensures the ship's appearance matches the normal view
    const shipHeight = 70 * magnifiedShipScale; // Approximate ship height in pixels
    const verticalOffset = (1 - visibilityFactor) * shipHeight * 0.2; // Reduced offset factor to 0.2
    
    // Render ship with vertical offset to simulate rising into view
    renderShipInTelescopeView(ctx, centerX, horizonY + verticalOffset, magnifiedShipScale, sinkAmount);
  }
  
  // Draw crosshairs
  drawCrosshairs(ctx, width, height);
  
  // Draw telescope border
  drawTelescopeBorder(ctx, width, height);
}

/**
 * Draws the telescope background with sky and sea
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} width - Width of the canvas
 * @param {number} height - Height of the canvas
 * @param {number} horizonY - Y-coordinate of the horizon line
 */
function drawTelescopeBackground(ctx, width, height, horizonY) {
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 2 - TELESCOPE_CONSTANTS.BORDER_WIDTH;
  
  // Save context
  ctx.save();
  
  // Create circular clipping path
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.clip();
  
  // Draw sky (top half)
  ctx.fillStyle = TELESCOPE_CONSTANTS.SKY_COLOR;
  ctx.fillRect(0, 0, width, horizonY);
  
  // Draw sea (bottom half)
  ctx.fillStyle = TELESCOPE_CONSTANTS.SEA_COLOR;
  ctx.fillRect(0, horizonY, width, height - horizonY);
  
  // Draw horizon line
  ctx.strokeStyle = TELESCOPE_CONSTANTS.HORIZON_COLOR;
  ctx.lineWidth = TELESCOPE_CONSTANTS.HORIZON_WIDTH;
  ctx.beginPath();
  ctx.moveTo(centerX - radius, horizonY);
  ctx.lineTo(centerX + radius, horizonY);
  ctx.stroke();
  
  // Restore context
  ctx.restore();
}

/**
 * Draws a circular mask for the telescope view
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} width - Width of the canvas
 * @param {number} height - Height of the canvas
 */
function drawCircularMask(ctx, width, height) {
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 2 - TELESCOPE_CONSTANTS.BORDER_WIDTH;
  
  // Create clipping path
  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  
  // Apply the clipping path
  ctx.clip();
  
  // Draw semi-transparent black overlay outside the circle
  ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
  ctx.fillRect(0, 0, width, height);
  
  // Restore context
  ctx.restore();
  
  // Draw circle outline
  ctx.strokeStyle = TELESCOPE_CONSTANTS.BORDER_COLOR;
  ctx.lineWidth = TELESCOPE_CONSTANTS.BORDER_WIDTH;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.stroke();
}

/**
 * Draws crosshairs in the telescope view
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} width - Width of the canvas
 * @param {number} height - Height of the canvas
 */
function drawCrosshairs(ctx, width, height) {
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 2 - TELESCOPE_CONSTANTS.BORDER_WIDTH;
  
  // Set crosshair style
  ctx.strokeStyle = TELESCOPE_CONSTANTS.CROSSHAIR_COLOR;
  ctx.lineWidth = TELESCOPE_CONSTANTS.CROSSHAIR_WIDTH;
  
  // Draw horizontal line
  ctx.beginPath();
  ctx.moveTo(centerX - radius, centerY);
  ctx.lineTo(centerX + radius, centerY);
  ctx.stroke();
  
  // Draw vertical line
  ctx.beginPath();
  ctx.moveTo(centerX, centerY - radius);
  ctx.lineTo(centerX, centerY + radius);
  ctx.stroke();
  
  // Draw small circle at center
  ctx.beginPath();
  ctx.arc(centerX, centerY, 2, 0, Math.PI * 2);
  ctx.stroke();
  
  // Draw tick marks
  const tickLength = 5;
  const tickInterval = radius / 4;
  
  for (let i = tickInterval; i <= radius; i += tickInterval) {
    // Horizontal ticks
    ctx.beginPath();
    ctx.moveTo(centerX - i, centerY - tickLength);
    ctx.lineTo(centerX - i, centerY + tickLength);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(centerX + i, centerY - tickLength);
    ctx.lineTo(centerX + i, centerY + tickLength);
    ctx.stroke();
    
    // Vertical ticks
    ctx.beginPath();
    ctx.moveTo(centerX - tickLength, centerY - i);
    ctx.lineTo(centerX + tickLength, centerY - i);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(centerX - tickLength, centerY + i);
    ctx.lineTo(centerX + tickLength, centerY + i);
    ctx.stroke();
  }
}

/**
 * Draws the telescope border
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} width - Width of the canvas
 * @param {number} height - Height of the canvas
 */
function drawTelescopeBorder(ctx, width, height) {
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 2;
  
  // Draw outer border
  ctx.strokeStyle = TELESCOPE_CONSTANTS.BORDER_COLOR;
  ctx.lineWidth = TELESCOPE_CONSTANTS.BORDER_WIDTH * 2;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius - TELESCOPE_CONSTANTS.BORDER_WIDTH, 0, Math.PI * 2);
  ctx.stroke();
}

/**
 * Renders a ship directly in the telescope view with proper masking for horizon
 * @param {CanvasRenderingContext2D} ctx - Canvas context for telescope view
 * @param {number} x - X position of ship in telescope view
 * @param {number} y - Y position of ship in telescope view (horizon line)
 * @param {number} scale - Scale factor for ship size
 * @param {number} sinkAmount - Amount by which the ship appears to sink (0-1)
 */
function renderShipInTelescopeView(ctx, x, y, scale, sinkAmount) {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 2 - TELESCOPE_CONSTANTS.BORDER_WIDTH;
  
  // Save context
  ctx.save();
  
  // Create circular clipping path for telescope view
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.clip();
  
  // Create a second clipping region that only shows content above the horizon
  // This ensures no part of the ship below the horizon is visible
  ctx.beginPath();
  ctx.rect(0, 0, width, y); // Only show content above the horizon line
  ctx.clip();
  
  // Draw ship with the same sinking amount as in the normal view
  // Pass sinkAmount directly without any multiplier to match normal view behavior
  drawShip(ctx, x, y, scale, sinkAmount);
  
  // Restore context
  ctx.restore();
}

// Export functions and constants
export {
  drawTelescopeView,
  renderShipInTelescopeView,
  TELESCOPE_CONSTANTS
};
