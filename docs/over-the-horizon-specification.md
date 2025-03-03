# Over The Horizon - Web Implementation Specification

## Overview

This specification outlines the requirements for converting the Mathematica-based "Ship Sailing over the Horizon" demonstration into a web-based implementation using JavaScript. The demonstration visually simulates how a ship appears to sink below the horizon as it moves further away from an observer due to the Earth's curvature.

## Core Concepts

1. **Earth Curvature Simulation**: The application demonstrates how the Earth's curvature affects the visibility of distant objects.
2. **Distance-based Perspective**: As the ship moves further away, it appears smaller due to perspective.
3. **Horizon Effect**: When the ship reaches the horizon, it begins to disappear hull-first due to the Earth's curvature.
4. **Telescope View**: When the ship approaches the horizon, a magnified "telescope view" appears to show the ship gradually disappearing.

## Visual Components

### 1. Main View

- A fixed view of the sea surface from the observer's perspective
- Blue gradient representing the sea
- Sky representation above the horizon line
- Ship representation that moves diagonally (up and to the right) as distance increases

### 2. Ship Representation

The ship must be rendered with realistic proportions that accurately represent a vessel as viewed from shore. The ship model should closely match the original Mathematica implementation with the following key characteristics:

- **Hull**: A gray hull with appropriate width-to-height proportions, sitting partially submerged in the water
- **Superstructure**: A detailed superstructure rising above the hull, including:
  - Main deck structures (bridge, cabins)
  - Multiple levels of height above the waterline
  - Two prominent funnels/smokestacks with red bands at the top
  - Masts and antennas extending upward
  - Various smaller details like railings and deck equipment

The ship representation is critical for demonstrating the horizon effect, as different parts of the ship should disappear sequentially as it moves beyond the horizon:
1. First, the hull disappears below the horizon
2. Then, lower deck structures
3. Next, the main superstructure elements
4. Finally, only the tops of funnels, masts, and antennas remain visible before the ship completely disappears

This graduated disappearance is what makes the demonstration effective at showing how the Earth's curvature affects visibility. The ship model must have sufficient detail and height differentiation to clearly illustrate this effect.

### 3. Telescope View

- Circular magnified view that appears when the ship approaches the horizon
- Shows detailed view of the ship as it begins to disappear below the horizon
- Includes visual elements mimicking a telescope viewfinder (crosshairs, circular frame)
- Only appears when the ship is at or beyond the horizon distance

## Interactive Controls

### Slider Controls

1. **Eye Level (h)**: 
   - Range: 1.0 to 3.0 meters
   - Default: 1.7 meters
   - Step: 0.1 meters
   - Affects the distance to the horizon (higher eye level = further horizon)

2. **Ship Height (H)**:
   - Range: 35 to 100 meters
   - Default: 50 meters
   - Step: 1 meter
   - Affects the size of the ship and how long it remains visible beyond the horizon

3. **Distance from Shore (d)**:
   - Range: 0 to 20 kilometers
   - Default: 0 kilometers
   - Step: 0.1 kilometers
   - Controls the ship's distance from the observer

### Display Values

- All slider values should be permanently displayed (unlike the .nb file where they were optional)
- Display units should be clearly labeled (meters for heights, kilometers for distance)

## Mathematical Model

### Key Formulas

1. **Horizon Distance Calculation**:
   ```
   d0(h) = √(2 * R * 0.001 * h)
   ```
   Where:
   - d0 is the distance to the horizon in kilometers
   - h is the observer's eye height in meters
   - R is the Earth's radius (7320 km in the original)
   - 0.001 is a conversion factor

2. **Ship Visibility Distance**:
   ```
   d1(H) = √(2 * R * 0.001 * H)
   ```
   Where:
   - d1 is the maximum distance the ship can be seen
   - H is the height of the ship in meters

3. **Ship Scaling with Distance**:
   - When d < d0(h): Ship size scales proportionally with (1 - 0.75*d/d0(h))
   - Ship position moves diagonally as distance increases

4. **Ship Sinking Effect**:
   - When d > d0(h): Ship begins to sink below horizon
   - Sinking amount is proportional to (d - d0(h))/(d1(H) - d0(h))
   - Hull disappears first, followed by progressively higher parts of the ship

## Telescope View Implementation Details

The telescope view is the most technically challenging aspect of the implementation. It should:

1. **Activation Condition**:
   - Only appear when distance d ≥ d0(h) (ship at or beyond horizon)
   - Smoothly transition from normal view to telescope view

2. **Visual Components**:
   - Circular frame with thick border
   - Crosshair lines in the center
   - Measurement tick marks along the axes
   - Blue semi-circle representing the sea
   - Black semi-circle representing the sky

3. **Ship Representation in Telescope**:
   - Ship appears at a fixed position within the telescope view
   - Ship gradually sinks below the horizon line as distance increases
   - Sinking effect calculated using: -5 * UnitStep(d - d0(h)) * ((d - d0(h))/(d1(H) - d0(h)))
   - Ship remains at a fixed size within the telescope view (magnification effect)

4. **Transition Logic**:
   - Use conditional rendering based on the distance value:
     - If d < d0(h): Show normal view with ship scaling with distance
     - If d ≥ d0(h): Show telescope view with ship sinking effect

## Technical Implementation Guidelines

### Canvas-Based Rendering

The implementation should use HTML5 Canvas for rendering the scene:

1. **Main Canvas**: Renders the sea, sky, and ship when distance is less than horizon distance
2. **Telescope Canvas**: Renders the magnified view when ship is at or beyond horizon

### Animation and Transitions

1. **Smooth Transitions**:
   - Smooth transition between normal view and telescope view
   - Continuous animation of ship movement and scaling as distance changes

2. **Responsive Updates**:
   - Scene should update immediately as slider values change
   - No lag or jumpiness in the visualization

### Code Structure

1. **Modular Components**:
   - Separate modules for scene rendering, ship model, and controls
   - Clear separation of mathematical model from rendering code

2. **Responsive Design**:
   - Adapt to different screen sizes while maintaining aspect ratio
   - Ensure controls are usable on both desktop and mobile devices

## Constraints and Limitations

1. **Maintain Original Behavior**:
   - The web implementation should match the behavior of the Mathematica demonstration
   - Do not add or remove features that would diverge from the original

2. **Fixed View Angle**:
   - The view angle of the sea surface is fixed (no pivoting up/down)
   - Ship path remains slightly diagonal (up and to the right) as in the original

3. **Performance Considerations**:
   - Optimize rendering for smooth performance on standard web browsers
   - Consider using WebGL for 3D ship rendering if necessary

## Testing Criteria

The implementation should be tested to ensure:

1. **Visual Accuracy**:
   - Ship appears to sink below horizon at the mathematically correct distance
   - Telescope view activates at the correct distance
   - Ship scaling with distance matches the mathematical model

2. **Interactive Behavior**:
   - All sliders function correctly and update the visualization in real-time
   - Values display correctly and update with slider movement

3. **Edge Cases**:
   - Correct behavior at minimum and maximum slider values
   - Proper handling of transition points (e.g., exactly at horizon distance)

## Future Enhancements (Post-Initial Implementation)

While not part of the initial implementation, these could be considered for future versions:

1. **Educational Annotations**: Add optional explanatory text about the physics involved
2. **Alternative Views**: Toggle between different perspectives or ship models
3. **Atmospheric Refraction**: Add option to simulate atmospheric refraction effects
