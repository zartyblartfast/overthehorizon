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
};

/**
 * Draws the telescope view
 * @param {CanvasRenderingContext2D} ctx - Canvas context for telescope view
 * @param {CanvasRenderingContext2D} mainCtx - Canvas context for main view (source)
 * @param {number} centerX - X-coordinate of center point in main view
 * @param {number} centerY - Y-coordinate of center point in main view
 * @param {number} [magnification=TELESCOPE_CONSTANTS.MAGNIFICATION] - Magnification factor
 */
function drawTelescopeView(ctx, mainCtx, centerX, centerY, magnification = TELESCOPE_CONSTANTS.MAGNIFICATION) {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  
  // Clear telescope view
  ctx.clearRect(0, 0, width, height);
  
  // Calculate source rectangle dimensions
  const sourceWidth = width / magnification;
  const sourceHeight = height / magnification;
  const sourceX = centerX - sourceWidth / 2;
  const sourceY = centerY - sourceHeight / 2;
  
  // Draw magnified view from main canvas
  ctx.drawImage(
    mainCtx.canvas,
    sourceX, sourceY, sourceWidth, sourceHeight,
    0, 0, width, height
  );
  
  // Draw circular mask
  drawCircularMask(ctx, width, height);
  
  // Draw crosshairs
  drawCrosshairs(ctx, width, height);
  
  // Draw telescope border
  drawTelescopeBorder(ctx, width, height);
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
  
  // Create horizon clipping path
  ctx.beginPath();
  ctx.moveTo(0, y);
  ctx.lineTo(width, y);
  ctx.lineTo(width, 0);
  ctx.lineTo(0, 0);
  ctx.closePath();
  ctx.clip();
  
  // Draw ship with sinking effect
  drawShip(ctx, x, y, scale, sinkAmount * 50); // Convert 0-1 sinking to pixel value
  
  // Restore context
  ctx.restore();
  
  // Redraw telescope elements that should be on top
  drawCrosshairs(ctx, width, height);
  drawTelescopeBorder(ctx, width, height);
}

// Export functions and constants
export {
  drawTelescopeView,
  renderShipInTelescopeView,
  TELESCOPE_CONSTANTS
};
