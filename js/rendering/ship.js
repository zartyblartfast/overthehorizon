/**
 * ship.js
 * Handles the rendering of the ship model for the Over The Horizon demonstration
 */

// Constants for ship dimensions and colors
const SHIP_COLORS = {
  HULL: '#2C3E50',          // Darker blue-gray for hull (was #444444)
  HULL_SHADOW: '#1A2530',   // Darker shadow (was #333333)
  WATERLINE: '#000000',     // Black waterline (unchanged)
  DECK: '#95A5A6',          // Lighter gray for deck (was #666666)
  FUNNEL_BASE: '#34495E',   // Darker blue-gray for funnel base (was #555555)
  FUNNEL_BAND: '#E74C3C',   // Brighter red for funnel band (was #DD0000)
  FUNNEL_TOP: '#222222',    // Black funnel top (unchanged)
  MAST: '#000000',          // Black mast (unchanged)
  SUPERSTRUCTURE: '#ECF0F1', // Much lighter for superstructure (was #777777)
  SUPERSTRUCTURE_WINDOWS: '#3498DB', // Brighter blue for windows (was #AADDFF)
  BRIDGE: '#BDC3C7'         // Light gray for bridge (was #888888)
};

/**
 * Draws the complete ship at the specified position and scale
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} x - X position (center of ship)
 * @param {number} y - Y position (waterline)
 * @param {number} scale - Scale factor for ship size
 * @param {number} [sinkAmount=0] - Amount by which the ship appears to sink (0 = fully visible, 1 = fully hidden)
 */
function drawShip(ctx, x, y, scale, sinkAmount = 0) {
  // Save current context state
  ctx.save();
  
  // Move to ship position and apply scale
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  
  // If sinking effect is needed, apply vertical offset and clipping
  if (sinkAmount > 0) {
    // Ship height in local coordinates (from waterline to top of masts)
    const shipHeight = 70;
    
    // Calculate how much of the ship should be hidden
    // As sinkAmount increases from 0 to 1, more of the ship is hidden from bottom to top
    const hiddenHeight = shipHeight * sinkAmount;
    
    // Apply a vertical offset to move the entire ship down (sinking effect)
    // But don't apply any scaling that would cause compression
    const sinkOffset = hiddenHeight;
    ctx.translate(0, sinkOffset);
    
    // Create a clipping region that only shows the part of the ship above the water
    ctx.beginPath();
    // This rectangle starts at the current water level and extends upward
    ctx.rect(-100, -shipHeight - sinkOffset, 200, shipHeight);
    ctx.clip();
  }
  
  // Draw ship components from bottom to top
  drawHull(ctx);
  drawSuperstructure(ctx);
  drawFunnels(ctx);
  drawMastsAndAntennas(ctx);
  
  // Restore context state
  ctx.restore();
}

/**
 * Draws the ship's hull
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 */
function drawHull(ctx) {
  // Main hull (gray)
  ctx.fillStyle = SHIP_COLORS.HULL;
  ctx.beginPath();
  ctx.moveTo(-50, 0);        // Start at stern at waterline
  ctx.lineTo(50, 0);         // To bow at waterline
  ctx.lineTo(60, -5);        // Up to bow point
  ctx.lineTo(40, -10);       // Down to deck at bow
  ctx.lineTo(-40, -10);      // Back to deck at stern
  ctx.lineTo(-45, -5);       // Up to stern point
  ctx.closePath();
  ctx.fill();
  
  // Hull shadow/detail
  ctx.fillStyle = SHIP_COLORS.HULL_SHADOW;
  ctx.beginPath();
  ctx.moveTo(-50, 0);
  ctx.lineTo(50, 0);
  ctx.lineTo(50, -3);
  ctx.lineTo(-50, -3);
  ctx.closePath();
  ctx.fill();
  
  // Waterline (black)
  ctx.fillStyle = SHIP_COLORS.WATERLINE;
  ctx.beginPath();
  ctx.moveTo(-50, 0);        // Start at stern at waterline
  ctx.lineTo(50, 0);         // To bow at waterline
  ctx.lineTo(50, 2);         // Down below waterline at bow
  ctx.lineTo(-50, 2);        // Back below waterline at stern
  ctx.closePath();
  ctx.fill();
  
  // Deck
  ctx.fillStyle = SHIP_COLORS.DECK;
  ctx.beginPath();
  ctx.moveTo(-40, -10);      // Start at stern deck
  ctx.lineTo(40, -10);       // To bow deck
  ctx.lineTo(40, -11);       // Down to deck edge at bow
  ctx.lineTo(-40, -11);      // Back to deck edge at stern
  ctx.closePath();
  ctx.fill();
}

/**
 * Draws the ship's superstructure
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 */
function drawSuperstructure(ctx) {
  // Main superstructure block
  ctx.fillStyle = SHIP_COLORS.SUPERSTRUCTURE;
  ctx.beginPath();
  ctx.rect(-30, -25, 50, 14);
  ctx.fill();
  
  // Bridge (higher part of superstructure)
  ctx.fillStyle = SHIP_COLORS.BRIDGE;
  ctx.beginPath();
  ctx.rect(-20, -32, 25, 7);
  ctx.fill();
  
  // Windows on main superstructure
  ctx.fillStyle = SHIP_COLORS.SUPERSTRUCTURE_WINDOWS;
  for (let i = -25; i < 15; i += 7) {
    ctx.beginPath();
    ctx.rect(i, -22, 5, 3);
    ctx.fill();
  }
  
  // Windows on bridge
  for (let i = -15; i < 0; i += 7) {
    ctx.beginPath();
    ctx.rect(i, -30, 5, 3);
    ctx.fill();
  }
}

/**
 * Draws the ship's funnels
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 */
function drawFunnels(ctx) {
  // Draw two funnels
  drawFunnel(ctx, -10, -25, 8, 15);
  drawFunnel(ctx, 10, -25, 8, 15);
}

/**
 * Draws a single funnel
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} x - X position of funnel center
 * @param {number} y - Y position of funnel base
 * @param {number} width - Width of funnel
 * @param {number} height - Height of funnel
 */
function drawFunnel(ctx, x, y, width, height) {
  const halfWidth = width / 2;
  
  // Funnel base
  ctx.fillStyle = SHIP_COLORS.FUNNEL_BASE;
  ctx.beginPath();
  ctx.moveTo(x - halfWidth, y);
  ctx.lineTo(x + halfWidth, y);
  ctx.lineTo(x + halfWidth * 0.8, y - height);
  ctx.lineTo(x - halfWidth * 0.8, y - height);
  ctx.closePath();
  ctx.fill();
  
  // Funnel band (red)
  const bandHeight = height * 0.15;
  const bandY = y - height + bandHeight;
  const bandWidthFactor = 0.85;
  
  ctx.fillStyle = SHIP_COLORS.FUNNEL_BAND;
  ctx.beginPath();
  ctx.moveTo(x - halfWidth * bandWidthFactor, bandY + bandHeight);
  ctx.lineTo(x + halfWidth * bandWidthFactor, bandY + bandHeight);
  ctx.lineTo(x + halfWidth * 0.8, bandY);
  ctx.lineTo(x - halfWidth * 0.8, bandY);
  ctx.closePath();
  ctx.fill();
  
  // Funnel top (black)
  ctx.fillStyle = SHIP_COLORS.FUNNEL_TOP;
  ctx.beginPath();
  ctx.ellipse(x, y - height, halfWidth * 0.8, halfWidth * 0.3, 0, 0, Math.PI * 2);
  ctx.fill();
}

/**
 * Draws the ship's masts and antennas
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 */
function drawMastsAndAntennas(ctx) {
  ctx.strokeStyle = SHIP_COLORS.MAST;
  ctx.lineWidth = 1;
  
  // Forward mast
  ctx.beginPath();
  ctx.moveTo(15, -32);
  ctx.lineTo(15, -60);
  ctx.stroke();
  
  // Antenna on forward mast
  ctx.beginPath();
  ctx.moveTo(15, -60);
  ctx.lineTo(25, -70);
  ctx.stroke();
  
  // Aft mast
  ctx.beginPath();
  ctx.moveTo(-15, -32);
  ctx.lineTo(-15, -50);
  ctx.stroke();
  
  // Cross piece on aft mast
  ctx.beginPath();
  ctx.moveTo(-20, -45);
  ctx.lineTo(-10, -45);
  ctx.stroke();
}

/**
 * Calculates the ship's scale based on distance
 * @param {number} distance - Distance of ship from viewer in kilometers
 * @param {number} horizonDistance - Distance to the horizon in kilometers
 * @param {number} baseScale - Base scale factor for the ship
 * @returns {number} - Calculated scale factor
 */
function calculateShipScale(distance, horizonDistance, baseScale) {
  if (distance <= horizonDistance) {
    // Before horizon: ship gets smaller as it approaches the horizon
    const distanceRatio = distance / horizonDistance;
    return (1 - 0.75 * distanceRatio) * baseScale;
  } else {
    // Beyond horizon: ship maintains the scale it had at the horizon
    return 0.25 * baseScale;
  }
}

/**
 * Calculates how much of the ship should be hidden below horizon
 * @param {number} distance - Distance of ship from viewer in kilometers
 * @param {number} horizonDistance - Distance to the horizon in kilometers
 * @param {number} maxVisibleDistance - Maximum distance at which the ship is visible
 * @returns {number} - Amount of ship to hide (0 = fully visible, 1 = fully hidden)
 */
function calculateShipSinking(distance, horizonDistance, maxVisibleDistance) {
  if (distance <= horizonDistance) {
    // Ship is before the horizon, fully visible
    return 0;
  } else {
    // Ship is beyond the horizon, calculate sinking amount
    const distanceBeyondHorizon = distance - horizonDistance;
    const totalPossibleDistanceBeyondHorizon = maxVisibleDistance - horizonDistance;
    
    // Return a value between 0 and 1 representing how much of the ship is hidden
    return Math.min(1, distanceBeyondHorizon / totalPossibleDistanceBeyondHorizon);
  }
}

// Export functions
export {
  drawShip,
  calculateShipScale,
  calculateShipSinking,
  SHIP_COLORS
};
