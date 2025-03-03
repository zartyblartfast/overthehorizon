# Over The Horizon - Technical Implementation Guide

## Architecture Overview

This document provides detailed technical specifications for implementing the "Ship Sailing over the Horizon" demonstration as a web application. It focuses on the core algorithms, data structures, and rendering techniques required.

## Core Components

### 1. Constants and Mathematical Model

```javascript
// Earth radius in kilometers
const R = 7320;

// Calculate distance to horizon based on observer height (h in meters)
function d0(h) {
  return Math.sqrt(2 * R * 0.001 * h);
}

// Calculate maximum visible distance based on ship height (H in meters)
function d1(H) {
  return Math.sqrt(2 * R * 0.001 * H);
}
```

### 2. Ship Model Implementation

The ship model is a critical component that requires careful implementation to match the original Mathematica demonstration. Based on analysis of the original code, the ship should be implemented with the following specifications:

#### Ship Structure Components

1. **Hull**:
   - Gray-colored hull with appropriate width-to-height proportions
   - Black waterline area (lower portion of hull)
   - Slightly curved shape that tapers toward bow and stern

2. **Main Superstructure**:
   - Multi-level structure rising from the deck
   - Rectangular bridge/cabin section
   - Different height levels to create a stepped appearance

3. **Funnels/Smokestacks**:
   - Two prominent cylindrical funnels
   - Gray base color with red bands near the top
   - Positioned at different points along the superstructure

4. **Masts and Antennas**:
   - Vertical masts extending from the superstructure
   - Angled support lines
   - Thin antenna elements at the highest points

#### Implementation Approach

```javascript
/**
 * Draws the complete ship at the specified position and scale
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} x - X position (center of ship)
 * @param {number} y - Y position (waterline)
 * @param {number} scale - Scale factor for ship size
 */
function drawShip(ctx, x, y, scale) {
  // Save current context state
  ctx.save();
  
  // Move to ship position and apply scale
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  
  // Draw hull
  drawHull(ctx);
  
  // Draw superstructure
  drawSuperstructure(ctx);
  
  // Draw funnels
  drawFunnels(ctx);
  
  // Draw masts and antennas
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
  ctx.fillStyle = '#555555';
  ctx.beginPath();
  ctx.moveTo(-50, 0);        // Start at stern at waterline
  ctx.lineTo(50, 0);         // To bow at waterline
  ctx.lineTo(40, -10);       // Up to deck at bow
  ctx.lineTo(-40, -10);      // Back to deck at stern
  ctx.closePath();
  ctx.fill();
  
  // Waterline (black)
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.moveTo(-50, 0);        // Start at stern at waterline
  ctx.lineTo(50, 0);         // To bow at waterline
  ctx.lineTo(50, 5);         // Down below waterline at bow
  ctx.lineTo(-50, 5);        // Back below waterline at stern
  ctx.closePath();
  ctx.fill();
}

/**
 * Draws the ship's superstructure
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 */
function drawSuperstructure(ctx) {
  // Main deck structure
  ctx.fillStyle = '#555555';
  ctx.fillRect(-25, -10, 50, -15);  // Main deck structure
  
  // Bridge structure
  ctx.fillRect(-12, -25, 25, -10);  // Bridge/cabin
  
  // Additional structures
  ctx.fillRect(-15, -35, 10, -5);   // Upper structure
}

/**
 * Draws the ship's funnels
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 */
function drawFunnels(ctx) {
  // First funnel
  ctx.fillStyle = '#555555';
  ctx.beginPath();
  ctx.arc(-10, -35, 5, 0, Math.PI * 2);
  ctx.fill();
  
  // First funnel red band
  ctx.fillStyle = '#DD0000';
  ctx.beginPath();
  ctx.arc(-10, -40, 5, 0, Math.PI * 2);
  ctx.fill();
  
  // Second funnel
  ctx.fillStyle = '#555555';
  ctx.beginPath();
  ctx.arc(10, -35, 5, 0, Math.PI * 2);
  ctx.fill();
  
  // Second funnel red band
  ctx.fillStyle = '#DD0000';
  ctx.beginPath();
  ctx.arc(10, -40, 5, 0, Math.PI * 2);
  ctx.fill();
}

/**
 * Draws the ship's masts and antennas
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 */
function drawMastsAndAntennas(ctx) {
  // Main mast
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, -25);
  ctx.lineTo(0, -60);
  ctx.stroke();
  
  // Secondary mast
  ctx.beginPath();
  ctx.moveTo(-20, -25);
  ctx.lineTo(-20, -45);
  ctx.stroke();
  
  // Support lines
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.moveTo(0, -60);
  ctx.lineTo(15, -25);
  ctx.moveTo(0, -60);
  ctx.lineTo(-15, -25);
  ctx.stroke();
}

/**
 * Draws the ship with sinking effect
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} x - X position (center of ship)
 * @param {number} y - Y position (waterline)
 * @param {number} scale - Scale factor for ship size
 * @param {number} sinkAmount - Sinking amount (negative value)
 */
function drawShipWithSinking(ctx, x, y, scale, sinkAmount) {
  // Save current context state
  ctx.save();
  
  // Move to ship position and apply scale
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  
  // Apply clipping to simulate sinking
  ctx.beginPath();
  ctx.rect(0, 0, ctx.canvas.width, y - sinkAmount * scale);
  ctx.clip();
  
  // Draw the ship
  drawShip(ctx, 0, 0, 1);
  
  // Restore context state
  ctx.restore();
}

// Calculate ship scale based on distance
const shipScale = baseScale * (1 / (1 + distance * 0.1));

// Calculate ship vertical position relative to horizon
const shipY = horizonY - (R * Math.pow(distance, 2)) / (2 * h);
```

### 3. Scene Rendering System

The application should use a layered canvas approach:

```
+-------------------------------------+
| Main View Canvas                    |
|                                     |
|  +-------------------------------+  |
|  | Sky                           |  |
|  +-------------------------------+  |
|  | Horizon Line                  |  |
|  +-------------------------------+  |
|  | Sea                           |  |
|  |                               |  |
|  |  +-------------------------+  |  |
|  |  | Ship (when d < d0)      |  |  |
|  |  +-------------------------+  |  |
|  |                               |  |
|  |  +-------------------------+  |  |
|  |  | Telescope View          |  |  |
|  |  | (when d >= d0)          |  |  |
|  |  +-------------------------+  |  |
|  |                               |  |
|  +-------------------------------+  |
|                                     |
+-------------------------------------+
| Controls Panel                      |
+-------------------------------------+
```

### 4. View Transitions

The application has two main view states:

1. **Normal View** (d < d0(h)):
   - Full sea and sky view
   - Ship visible in its entirety
   - Ship size scales with distance: `scale = (1 - 0.75*d/d0(h)) * sqrt(H/50)`
   - Ship position moves diagonally as distance increases

2. **Telescope View** (d >= d0(h)):
   - Circular telescope overlay appears
   - Ship appears within telescope view
   - Ship gradually sinks below horizon line
   - Sinking amount: `-5 * (d - d0(h))/(d1(H) - d0(h))`

## Detailed Implementation Specifications

### 1. Main View Canvas

```javascript
function renderMainView(ctx, width, height, h, H, d) {
  // Clear canvas
  ctx.clearRect(0, 0, width, height);
  
  // Draw sky (light blue gradient)
  const skyGradient = ctx.createLinearGradient(0, 0, 0, height/2);
  skyGradient.addColorStop(0, "#87CEEB");
  skyGradient.addColorStop(1, "#B0E0E6");
  ctx.fillStyle = skyGradient;
  ctx.fillRect(0, 0, width, height/2);
  
  // Draw sea (darker blue gradient)
  const seaGradient = ctx.createLinearGradient(0, height/2, 0, height);
  seaGradient.addColorStop(0, "#1E90FF");
  seaGradient.addColorStop(1, "#000080");
  ctx.fillStyle = seaGradient;
  ctx.fillRect(0, height/2, width, height/2);
  
  // Draw horizon line
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, height/2);
  ctx.lineTo(width, height/2);
  ctx.stroke();
  
  // Determine which view to show
  const horizonDistance = d0(h);
  if (d < horizonDistance) {
    renderShipNormalView(ctx, width, height, h, H, d);
  } else {
    renderTelescopeView(ctx, width, height, h, H, d);
  }
}
```

### 2. Ship Rendering in Normal View

```javascript
function renderShipNormalView(ctx, width, height, h, H, d) {
  const horizonDistance = d0(h);
  
  // Calculate ship scale based on distance
  const scale = (1 - 0.75 * d / horizonDistance) * Math.sqrt(H / 50);
  
  // Calculate ship position (moves diagonally with distance)
  const x = width * 0.5 + (d / horizonDistance) * width * 0.1;
  const y = height * 0.5 - (d / horizonDistance) * height * 0.05;
  
  // Draw ship at calculated position and scale
  drawShip(ctx, x, y, scale);
}
```

### 3. Telescope View Implementation

```javascript
function renderTelescopeView(ctx, width, height, h, H, d) {
  const horizonDistance = d0(h);
  const maxVisibleDistance = d1(H);
  
  // Calculate telescope position (center of screen)
  const centerX = width * 0.5;
  const centerY = height * 0.6;
  const telescopeRadius = Math.min(width, height) * 0.25;
  
  // Draw telescope outer circle
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = telescopeRadius * 0.05;
  ctx.beginPath();
  ctx.arc(centerX, centerY, telescopeRadius * 1.1, 0, Math.PI * 2);
  ctx.stroke();
  
  // Draw telescope view background
  // Sky half-circle
  ctx.fillStyle = "#87CEEB";
  ctx.beginPath();
  ctx.arc(centerX, centerY, telescopeRadius, Math.PI, Math.PI * 2);
  ctx.fill();
  
  // Sea half-circle
  ctx.fillStyle = "#1E90FF";
  ctx.beginPath();
  ctx.arc(centerX, centerY, telescopeRadius, 0, Math.PI);
  ctx.fill();
  
  // Draw crosshairs
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(centerX - telescopeRadius, centerY);
  ctx.lineTo(centerX + telescopeRadius, centerY);
  ctx.moveTo(centerX, centerY - telescopeRadius);
  ctx.lineTo(centerX, centerY + telescopeRadius);
  ctx.stroke();
  
  // Draw measurement ticks
  drawTelescopeTicks(ctx, centerX, centerY, telescopeRadius);
  
  // Calculate ship sinking effect
  const sinkAmount = -5 * (d - horizonDistance) / (maxVisibleDistance - horizonDistance);
  
  // Draw ship in telescope view
  const shipScale = 0.75 * Math.sqrt(H / 50);
  const shipX = centerX - 0.1 * telescopeRadius;
  const shipY = centerY + 0.45 * telescopeRadius * Math.sqrt(H / 50);
  
  // Draw ship with sinking effect
  drawShipWithSinking(ctx, shipX, shipY, shipScale, sinkAmount);
}
```

### 4. Ship Model with Sinking Effect

```javascript
function drawShipWithSinking(ctx, x, y, scale, sinkAmount) {
  // Save context state
  ctx.save();
  
  // Apply clipping to simulate sinking
  ctx.beginPath();
  ctx.rect(0, 0, ctx.canvas.width, y - sinkAmount * scale);
  ctx.clip();
  
  // Draw the ship
  drawShip(ctx, x, y, scale);
  
  // Restore context state
  ctx.restore();
}

function drawShip(ctx, x, y, scale) {
  // Ship hull
  ctx.fillStyle = "#555555";
  ctx.beginPath();
  // Hull shape points...
  ctx.fill();
  
  // Ship masts and sails
  // Implementation details...
}
```

### 5. Interactive Controls

```javascript
function setupControls(onUpdate) {
  // Eye level slider
  const eyeLevelSlider = document.getElementById('eye-level-slider');
  const eyeLevelValue = document.getElementById('eye-level-value');
  eyeLevelSlider.min = 1.0;
  eyeLevelSlider.max = 3.0;
  eyeLevelSlider.step = 0.1;
  eyeLevelSlider.value = 1.7;
  eyeLevelValue.textContent = eyeLevelSlider.value + ' m';
  
  eyeLevelSlider.addEventListener('input', () => {
    eyeLevelValue.textContent = eyeLevelSlider.value + ' m';
    onUpdate();
  });
  
  // Ship height slider
  // Similar implementation...
  
  // Distance slider
  // Similar implementation...
  
  return {
    getEyeLevel: () => parseFloat(eyeLevelSlider.value),
    getShipHeight: () => parseFloat(shipHeightSlider.value),
    getDistance: () => parseFloat(distanceSlider.value)
  };
}
```

## Critical Algorithms

### 1. Ship Sinking Algorithm

The key to the realistic sinking effect is the clipping of the ship rendering based on the calculated sink amount:

```javascript
// Calculate how much of the ship is below the horizon
function calculateShipVisibility(h, H, d) {
  const horizonDistance = d0(h);
  const maxVisibleDistance = d1(H);
  
  if (d <= horizonDistance) {
    // Ship fully visible
    return 1.0;
  } else if (d >= maxVisibleDistance) {
    // Ship fully invisible
    return 0.0;
  } else {
    // Ship partially visible
    return 1.0 - (d - horizonDistance) / (maxVisibleDistance - horizonDistance);
  }
}
```

### 2. Telescope View Transition

For a smooth transition between normal and telescope view:

```javascript
function calculateTelescopeOpacity(h, d) {
  const horizonDistance = d0(h);
  const transitionRange = 0.5; // km
  
  if (d < horizonDistance - transitionRange) {
    return 0; // No telescope
  } else if (d > horizonDistance) {
    return 1; // Full telescope
  } else {
    // Transition zone
    return (d - (horizonDistance - transitionRange)) / transitionRange;
  }
}
```

## Performance Considerations

1. **Canvas Optimization**:
   - Use multiple canvas layers for static and dynamic elements
   - Only redraw elements that change
   - Consider using `requestAnimationFrame` for smooth animations

2. **Ship Model Complexity**:
   - Balance between visual fidelity and performance
   - Consider pre-rendering ship at different angles/scales
   - Use simplified models at greater distances

3. **Mobile Considerations**:
   - Adjust canvas resolution based on device capabilities
   - Optimize touch controls for slider interaction
   - Consider reduced detail on lower-powered devices

## Browser Compatibility

The implementation should work on:
- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 16+

Polyfills may be needed for:
- Canvas API in older browsers
- ES6 features if not using a transpiler

## Testing Strategy

1. **Unit Tests**:
   - Mathematical functions (d0, d1)
   - Ship positioning and scaling calculations
   - Telescope view transition logic

2. **Visual Regression Tests**:
   - Compare rendered output at specific distances with reference images
   - Test at boundary conditions (exactly at horizon, etc.)

3. **Performance Tests**:
   - Measure frame rate during slider interactions
   - Test on various device capabilities
