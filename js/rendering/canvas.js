/**
 * canvas.js
 * Handles canvas setup and basic rendering functions for the Over The Horizon demonstration
 */

/**
 * Sets up a canvas element with the specified dimensions
 * @param {string} canvasId - ID of the canvas element
 * @param {number} width - Width of the canvas in pixels
 * @param {number} height - Height of the canvas in pixels
 * @returns {Object} - Canvas and context objects
 */
function setupCanvas(canvasId, width, height) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) {
    console.error(`Canvas element with ID "${canvasId}" not found.`);
    return null;
  }
  
  // Set canvas dimensions
  canvas.width = width;
  canvas.height = height;
  
  // Get 2D rendering context with willReadFrequently set to true
  // This optimizes for multiple getImageData operations
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  
  return { canvas, ctx };
}

/**
 * Clears the canvas
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 */
function clearCanvas(ctx) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

/**
 * Draws the sea and horizon
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} horizonY - Y-coordinate of the horizon line
 */
function drawSeaAndHorizon(ctx, horizonY) {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  
  // Draw sky (light blue gradient)
  const skyGradient = ctx.createLinearGradient(0, 0, 0, horizonY);
  skyGradient.addColorStop(0, '#87CEEB'); // Sky blue at top
  skyGradient.addColorStop(1, '#E0F6FF'); // Light blue at horizon
  
  ctx.fillStyle = skyGradient;
  ctx.fillRect(0, 0, width, horizonY);
  
  // Draw sea (dark blue gradient)
  const seaGradient = ctx.createLinearGradient(0, horizonY, 0, height);
  seaGradient.addColorStop(0, '#0077BE'); // Medium blue at horizon
  seaGradient.addColorStop(1, '#004080'); // Dark blue at bottom
  
  ctx.fillStyle = seaGradient;
  ctx.fillRect(0, horizonY, width, height - horizonY);
  
  // Draw horizon line
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, horizonY);
  ctx.lineTo(width, horizonY);
  ctx.stroke();
}

/**
 * Draws distance markers on the sea
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} horizonY - Y-coordinate of the horizon line
 * @param {number} maxDistance - Maximum distance to show in kilometers
 * @param {number} interval - Interval between distance markers in kilometers
 */
function drawDistanceMarkers(ctx, horizonY, maxDistance, interval) {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  
  // Set text properties
  ctx.font = '12px Arial';
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  
  // Calculate horizon position (middle of canvas width)
  const horizonX = width / 2;
  
  // Draw markers
  for (let distance = interval; distance <= maxDistance; distance += interval) {
    // Calculate y position based on distance (simplified for demonstration)
    // In a real implementation, this would use the proper mathematical model
    const y = horizonY + (distance / maxDistance) * (height - horizonY) * 0.8;
    
    // Draw marker line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(horizonX - 50, y);
    ctx.lineTo(horizonX + 50, y);
    ctx.stroke();
    
    // Draw distance text
    ctx.fillText(`${distance} km`, horizonX, y + 15);
  }
}

// Export functions
export {
  setupCanvas,
  clearCanvas,
  drawSeaAndHorizon,
  drawDistanceMarkers
};
