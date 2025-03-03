# Telescope View - Technical Implementation Details

This document provides an in-depth analysis of the telescope view feature from the original Mathematica demonstration and detailed specifications for implementing it in JavaScript.

## Telescope View Behavior

**Important Clarification**: The telescope view is a circular area with vertical and horizontal crosshairs that have measurement marks on them. The telescope view has a different shade of blue in the bottom half of the circle to represent the sea, while the top half represents the sky.

When the telescope view first appears (exactly at the horizon distance), the ship is fully visible and positioned precisely on the horizon line. As the distance from the observer increases beyond the horizon, the ship in the telescope view gradually and smoothly starts to disappear from the bottom up. This effect is achieved by the ship representation moving downward, with the blue semi-circle at the bottom of the telescope view masking the lower portions of the ship, creating the impression that the ship is sailing beyond the horizon.

The crosshairs and measurement marks of the telescope remain fully visible at all times, regardless of the ship's position or visibility state.

## Original Implementation Analysis

In the Mathematica notebook, the telescope view is implemented in the `g[h_, H_, d_]` function, which conditionally renders either the normal view or the telescope view based on the distance relative to the horizon.

### Key Components in Original Code

```mathematica
g[h_, H_, d_] := If[
  d < d0[h],
  Ship[...],  (* Normal view *)
  Graphics[{  (* Telescope view *)
    LightBlue,
    Disk[{0, 0}, 1, {0, π}],  (* Sky semi-circle *)
    Inset[
      Ship[
        -5 * UnitStep[d - d0[h]] * ((d - d0[h])/(d1[H] - d0[h])),  (* Sinking effect *)
        .75 * Sqrt[H/50],  (* Ship scale *)
        -.15
      ],
      {-.1, .45 * Sqrt[H/50]}  (* Ship position in telescope *)
    ],
    Blue,
    EdgeForm[Black],
    Rotate[Disk[{0, -1}, 1, {0, π}], π],  (* Sea semi-circle *)
    Black,
    Line[{{0, 1}, {0, -1}}],  (* Vertical crosshair *)
    Line @ Table[{{-.05, k}, {.05, k}}, {k, -.9, .9, .1}],  (* Horizontal ticks *)
    Line @ Table[{{k, -.05}, {k, .05}}, {k, -.9, .9, .1}],  (* Vertical ticks *)
    Thickness[.05],
    Circle[{0, 0}, 1.1]  (* Telescope outer ring *)
  ]
]
```

### Mathematical Analysis

1. **Activation Condition**: 
   The telescope view appears when `d ≥ d0[h]`, where:
   - `d` is the distance from shore in kilometers
   - `d0[h]` is the distance to the horizon based on eye level `h`
   - At exactly `d = d0[h]`, the ship is fully visible and positioned on the horizon line

2. **Ship Sinking Formula**:
   The key formula that controls how much of the ship is below the horizon is:
   ```
   sinkAmount = -5 * UnitStep[d - d0[h]] * ((d - d0[h])/(d1[H] - d0[h]))
   ```
   Where:
   - `UnitStep[d - d0[h]]` ensures sinking only occurs beyond the horizon
   - `(d - d0[h])/(d1[H] - d0[h])` is the normalized distance beyond the horizon
   - The factor `-5` controls the rate of sinking
   - This formula creates the effect of the ship gradually moving downward

3. **Ship Scaling in Telescope**:
   The ship maintains a consistent scale within the telescope view:
   ```
   shipScale = 0.75 * Sqrt[H/50]
   ```
   This ensures the ship size is only dependent on the ship height parameter (H).

## JavaScript Implementation Specification

### 1. Telescope View Rendering Function

```javascript
/**
 * Renders the telescope view showing the ship sinking below the horizon
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @param {number} h - Observer eye level in meters
 * @param {number} H - Ship height in meters
 * @param {number} d - Distance from shore in kilometers
 */
function renderTelescopeView(ctx, width, height, h, H, d) {
  // Calculate key distances
  const horizonDistance = d0(h);
  const maxVisibleDistance = d1(H);
  
  // Calculate telescope dimensions
  const centerX = width * 0.5;
  const centerY = height * 0.6;
  const telescopeRadius = Math.min(width, height) * 0.25;
  
  // 1. Draw telescope frame
  drawTelescopeFrame(ctx, centerX, centerY, telescopeRadius);
  
  // 2. Draw telescope interior (sky and sea)
  drawTelescopeInterior(ctx, centerX, centerY, telescopeRadius);
  
  // 3. Draw telescope crosshairs and measurement ticks
  drawTelescopeGuidelines(ctx, centerX, centerY, telescopeRadius);
  
  // 4. Calculate ship sinking effect
  const sinkAmount = calculateSinkAmount(h, H, d);
  
  // 5. Draw ship with sinking effect
  drawShipInTelescope(ctx, centerX, centerY, telescopeRadius, H, sinkAmount);
}
```

### 2. Telescope Frame and Interior

```javascript
/**
 * Draws the telescope interior (sky and sea)
 */
function drawTelescopeInterior(ctx, centerX, centerY, radius) {
  // Draw sky half-circle (top half)
  ctx.fillStyle = "#87CEEB"; // Light blue
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, Math.PI, Math.PI * 2);
  ctx.fill();
  
  // Draw sea half-circle (bottom half) - this will mask the lower portions of the ship
  ctx.fillStyle = "#1E90FF"; // Darker blue
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI);
  ctx.fill();
  
  // Draw horizon line
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(centerX - radius, centerY);
  ctx.lineTo(centerX + radius, centerY);
  ctx.stroke();
}
```

### 3. Telescope Crosshairs and Measurement Ticks

```javascript
/**
 * Draws the telescope crosshairs and measurement ticks
 * These remain visible at all times regardless of ship position
 */
function drawTelescopeGuidelines(ctx, centerX, centerY, radius) {
  // Draw vertical crosshair
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(centerX, centerY - radius);
  ctx.lineTo(centerX, centerY + radius);
  ctx.stroke();
  
  // Draw horizontal ticks
  for (let k = -0.9; k <= 0.9; k += 0.1) {
    ctx.beginPath();
    ctx.moveTo(centerX - 0.05 * radius, centerY + k * radius);
    ctx.lineTo(centerX + 0.05 * radius, centerY + k * radius);
    ctx.stroke();
  }
  
  // Draw vertical ticks
  for (let k = -0.9; k <= 0.9; k += 0.1) {
    ctx.beginPath();
    ctx.moveTo(centerX + k * radius, centerY - 0.05 * radius);
    ctx.lineTo(centerX + k * radius, centerY + 0.05 * radius);
    ctx.stroke();
  }
}
```

### 4. Ship Sinking Calculation

```javascript
/**
 * Calculates how much the ship should sink below the horizon
 * @returns {number} Sink amount in the same units as the ship height
 */
function calculateSinkAmount(h, H, d) {
  const horizonDistance = d0(h);
  const maxVisibleDistance = d1(H);
  
  // Only sink if beyond horizon
  if (d <= horizonDistance) {
    return 0; // Ship is exactly on the horizon, fully visible
  }
  
  // Calculate normalized distance beyond horizon
  const normalizedDistance = (d - horizonDistance) / (maxVisibleDistance - horizonDistance);
  
  // Apply sinking formula (matching Mathematica implementation)
  // This creates the effect of the ship gradually moving downward
  return -5 * normalizedDistance;
}
```

### 5. Ship Rendering with Sinking Effect

```javascript
/**
 * Draws the ship in the telescope view with sinking effect
 * The ship appears to gradually disappear from bottom up as it moves beyond the horizon
 */
function drawShipInTelescope(ctx, centerX, centerY, radius, H, sinkAmount) {
  // Calculate ship scale based on height
  const shipScale = 0.75 * Math.sqrt(H / 50);
  
  // Calculate ship position in telescope
  const shipX = centerX - 0.1 * radius;
  const shipY = centerY + 0.45 * radius * Math.sqrt(H / 50);
  
  // Save context state
  ctx.save();
  
  // First draw the ship
  drawShip(ctx, shipX, shipY + sinkAmount * shipScale * radius, shipScale * radius * 0.2);
  
  // Restore context state
  ctx.restore();
  
  // Ensure the sea semi-circle is drawn AFTER the ship to mask the lower portions
  // This creates the effect of the ship sinking below the horizon
  ctx.fillStyle = "#1E90FF"; // Sea color
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI);
  ctx.fill();
  
  // Redraw the horizon line
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(centerX - radius, centerY);
  ctx.lineTo(centerX + radius, centerY);
  ctx.stroke();
  
  // Redraw the crosshairs and measurement ticks to ensure they're always visible
  drawTelescopeGuidelines(ctx, centerX, centerY, radius);
}
```

## Implementation Challenges and Solutions

### 1. Masking for Ship Sinking Effect

**Challenge**: Creating the illusion of the ship gradually sinking below the horizon.

**Solution**: Instead of using clipping, use layering to achieve the sinking effect:

```javascript
// Draw the ship at a position that depends on the sinking amount
drawShip(ctx, shipX, shipY + sinkAmount, shipScale);

// After drawing the ship, draw the sea semi-circle on top to mask the lower portions
ctx.fillStyle = "#1E90FF"; // Sea color
ctx.beginPath();
ctx.arc(centerX, centerY, radius, 0, Math.PI);
ctx.fill();

// Redraw crosshairs and ticks to ensure they remain visible
drawTelescopeGuidelines(ctx, centerX, centerY, radius);
```

This approach ensures that:
1. The ship appears to move downward as distance increases
2. The sea semi-circle masks the lower portions of the ship
3. The crosshairs and measurement marks remain visible at all times

## Testing the Telescope View

To ensure the telescope view functions correctly, test the following scenarios:

1. **Horizon Transition**: 
   - Set distance exactly at the horizon distance
   - Verify telescope view appears correctly
   - Verify ship is fully visible and positioned exactly on the horizon line

2. **Partial Sinking**:
   - Set distance between horizon distance and maximum visible distance
   - Verify ship is partially sunk below horizon (bottom portions masked by the sea)
   - Verify the amount of sinking matches the mathematical model
   - Confirm crosshairs and measurement marks remain fully visible

3. **Complete Disappearance**:
   - Set distance to maximum visible distance
   - Verify ship is completely below horizon (fully masked by the sea)
   - Confirm crosshairs and measurement marks remain fully visible

## Performance Optimization

For optimal performance of the telescope view:

1. **Separate Canvas Layers**:
   - Use one canvas for the static telescope frame and guidelines
   - Use another canvas for the dynamic ship rendering
   - Only redraw the dynamic elements when parameters change

2. **Pre-render Ship Models**:
   - Consider pre-rendering the ship at different sink levels
   - Use the pre-rendered images for better performance

3. **Limit Redraw Frequency**:
   - Use debouncing on slider events to limit redraw frequency
   - Only redraw when values actually change
