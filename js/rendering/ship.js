/**
 * ship.js
 * Handles the rendering of the ship model for the Over The Horizon demonstration
 */

// Constants for ship dimensions and colors
const SHIP_COLORS = {
  HULL: '#2C3E50',          // Darker blue-gray for hull
  HULL_SHADOW: '#1A2530',   // Darker shadow
  HULL_HIGHLIGHT: '#3D5A73', // Lighter highlight for hull
  WATERLINE: '#000000',     // Black waterline
  DECK: '#95A5A6',          // Lighter gray for deck
  FUNNEL_BASE: '#34495E',   // Darker blue-gray for funnel base
  FUNNEL_BAND: '#E74C3C',   // Brighter red for funnel band
  FUNNEL_TOP: '#222222',    // Black funnel top
  MAST: '#000000',          // Black mast
  SUPERSTRUCTURE: '#ECF0F1', // Light color for superstructure
  SUPERSTRUCTURE_WINDOWS: '#3498DB', // Blue for windows
  BRIDGE: '#BDC3C7',        // Light gray for bridge
  SMOKE: 'rgba(200, 200, 200, 0.5)' // Semi-transparent gray for smoke
};

// Simple smoke effect variables
let smokeOffset = 0;
// Flag to track if smoke has been rendered in the current frame
let smokeRenderedThisFrame = false;

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
  drawSimpleSmoke(ctx); // Add smoke after funnels
  drawMastsAndAntennas(ctx);
  
  // Restore context state
  ctx.restore();
}

/**
 * Draws the ship's hull
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 */
function drawHull(ctx) {
  // Main hull
  ctx.fillStyle = SHIP_COLORS.HULL;
  ctx.beginPath();
  ctx.moveTo(-50, 0);        // Start at stern at waterline
  ctx.lineTo(50, 0);         // To bow at waterline
  ctx.lineTo(65, -5);        // Up to bow point (more pronounced)
  ctx.lineTo(65, -10);       // Up to deck level at bow (keeping deck level)
  ctx.lineTo(-40, -10);      // Back to deck at stern
  ctx.lineTo(-55, -5);       // Up to stern point (more pronounced)
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
  
  // Hull highlight (adds dimension)
  ctx.fillStyle = SHIP_COLORS.HULL_HIGHLIGHT;
  ctx.beginPath();
  ctx.moveTo(-40, -8);
  ctx.lineTo(65, -8);       // Extended to the bow
  ctx.lineTo(65, -10);      // Up to deck level at bow
  ctx.lineTo(-40, -10);     // Back to deck at stern
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
  ctx.lineTo(65, -10);       // To bow deck (extended to meet the bow point)
  ctx.lineTo(65, -11);       // Down to deck edge at bow
  ctx.lineTo(-40, -11);      // Back to deck edge at stern
  ctx.closePath();
  ctx.fill();
}

/**
 * Draws the ship's superstructure
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 */
function drawSuperstructure(ctx) {
  // Main superstructure block - moved forward
  ctx.fillStyle = SHIP_COLORS.SUPERSTRUCTURE;
  ctx.beginPath();
  ctx.rect(-20, -25, 50, 14); // Moved 10 units forward (was -30)
  ctx.fill();
  
  // Bridge (higher part of superstructure at the forward part)
  ctx.fillStyle = SHIP_COLORS.BRIDGE;
  ctx.beginPath();
  ctx.rect(15, -32, 15, 7); // Moved 10 units forward (was 5)
  ctx.fill();
  
  // Windows on main superstructure (more evenly spaced)
  ctx.fillStyle = SHIP_COLORS.SUPERSTRUCTURE_WINDOWS;
  for (let i = -15; i < 25; i += 6) { // Adjusted starting point (was -25)
    ctx.beginPath();
    ctx.rect(i, -22, 4, 3);
    ctx.fill();
  }
  
  // Window on bridge (side view) - moved to the front of the bridge
  ctx.beginPath();
  ctx.rect(26, -30, 3, 3); // Moved 10 units forward (was 16)
  ctx.fill();
  
  // Bridge wing visible from side view (just a small protrusion)
  ctx.fillStyle = SHIP_COLORS.BRIDGE;
  ctx.beginPath();
  ctx.rect(28, -30, 3, 3); // Moved 10 units forward (was 18)
  ctx.fill();
}

/**
 * Draws the ship's funnels
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 */
function drawFunnels(ctx) {
  // Draw two funnels - moved forward
  drawFunnel(ctx, 0, -25, 8, 15);  // Moved 10 units forward (was -10)
  drawFunnel(ctx, 20, -25, 8, 15); // Moved 10 units forward (was 10)
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
  const bandY = y - height + bandHeight * 2;
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
  
  // Forward mast - moved forward
  ctx.beginPath();
  ctx.moveTo(25, -32); // Moved 10 units forward (was 15)
  ctx.lineTo(25, -60); // Moved 10 units forward (was 15)
  ctx.stroke();
  
  // Antenna on forward mast
  ctx.beginPath();
  ctx.moveTo(25, -60); // Moved 10 units forward (was 15)
  ctx.lineTo(35, -70); // Moved 10 units forward (was 25)
  ctx.stroke();
  
  // Radar on forward mast
  ctx.beginPath();
  ctx.arc(25, -55, 3, 0, Math.PI * 2); // Moved 10 units forward (was 15)
  ctx.stroke();
  
  // Aft mast - moved forward
  ctx.beginPath();
  ctx.moveTo(-5, -32); // Moved 10 units forward (was -15)
  ctx.lineTo(-5, -50); // Moved 10 units forward (was -15)
  ctx.stroke();
  
  // Cross piece on aft mast
  ctx.beginPath();
  ctx.moveTo(-10, -45); // Moved 10 units forward (was -20)
  ctx.lineTo(0, -45);   // Moved 10 units forward (was -10)
  ctx.stroke();
  
  // Small antenna on aft mast
  ctx.beginPath();
  ctx.moveTo(-5, -50);  // Moved 10 units forward (was -15)
  ctx.lineTo(0, -55);   // Moved 10 units forward (was -10)
  ctx.stroke();
}

/**
 * Draws a simple smoke effect from the funnels
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 */
function drawSimpleSmoke(ctx) {
  // Draw smoke from first funnel
  drawSmokeFromFunnel(ctx, 0, -25, -15);
  
  // Draw smoke from second funnel
  drawSmokeFromFunnel(ctx, 20, -25, -15);
}

/**
 * Draws smoke from a single funnel
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} x - X position of funnel center
 * @param {number} y - Y position of funnel base
 * @param {number} height - Height of funnel
 */
function drawSmokeFromFunnel(ctx, x, y, height) {
  const topY = y + height; // Y position of funnel top
  
  // Save context for smoke effect
  ctx.save();
  
  // Use a lighter composite operation for smoke
  ctx.globalCompositeOperation = 'lighter';
  
  // Draw 3 smoke puffs at different heights with animation
  for (let i = 0; i < 3; i++) {
    const puffOffset = i * 7 + smokeOffset;
    const puffX = x + puffOffset * 0.5; // Drift to the right as it rises
    const puffY = topY - puffOffset;    // Rise above the funnel
    const puffSize = 3 + i * 0.8;       // Grow as it rises
    const opacity = Math.max(0, 0.4 - i * 0.15); // Fade as it rises
    
    // Draw smoke puff
    ctx.fillStyle = `rgba(200, 200, 200, ${opacity})`;
    ctx.beginPath();
    ctx.arc(puffX, puffY, puffSize, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // Restore context
  ctx.restore();
}

/**
 * Updates the smoke animation
 * This should be called regularly to animate the smoke
 */
function updateSmoke() {
  smokeOffset = (smokeOffset + 0.2) % 20;
  // Reset the smoke rendered flag at the beginning of each frame
  smokeRenderedThisFrame = false;
}

/**
 * Renders the smoke effect for a ship
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} x - X position (center of ship)
 * @param {number} y - Y position (waterline)
 * @param {number} scale - Scale factor for ship size
 * @param {number} [sinkAmount=0] - Amount by which the ship appears to sink
 * @param {boolean} [isTelescopeView=false] - Whether this is being rendered in the telescope view
 */
function renderSmoke(ctx, x, y, scale, sinkAmount = 0, isTelescopeView = false) {
  // If ship is completely below horizon, don't render smoke
  if (sinkAmount >= 1) {
    return;
  }

  // Mark that smoke has been rendered this frame
  smokeRenderedThisFrame = true;

  // Save context state
  ctx.save();
  
  // Translate to ship position
  ctx.translate(x, y);
  
  // Scale the ship
  ctx.scale(scale, scale);
  
  // Adjust position based on sink amount to keep smoke aligned with funnels
  // As the ship sinks, we need to move the smoke up to match the visible portion of the ship
  const sinkOffset = sinkAmount * 30; // Adjust this value based on ship height
  ctx.translate(0, -sinkOffset);
  
  // Draw the smoke
  drawSimpleSmoke(ctx);
  
  // Restore context state
  ctx.restore();
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
  SHIP_COLORS,
  updateSmoke,
  renderSmoke
};
