# Implementation Issues

## Current Issues with Distance Calculations

After analyzing the JavaScript implementation and comparing it with the Mathematica formulas, I've identified the following issues:

1. **Fixed Maximum Distance**: In `js/main.js`, the maximum distance is hardcoded to 50 km:
   ```javascript
   const state = {
     observerHeight: DEFAULT_OBSERVER_HEIGHT,
     shipHeight: DEFAULT_SHIP_HEIGHT,
     shipDistance: 0,
     maxDistance: 50, // Maximum distance in kilometers
     telescopeEnabled: false,
     animationEnabled: false
   };
   ```

2. **Distance Slider Range**: In `index.html`, the ship distance slider has a fixed range from 0 to 50 km:
   ```html
   <input type="range" id="ship-distance-slider" min="0" max="50" step="0.1" value="0">
   ```

3. **Horizon Distance Calculation**: The horizon distance calculation in `js/math/horizon.js` appears to be correct:
   ```javascript
   function calculateHorizonDistance(observerHeight, earthRadius = EARTH_RADIUS) {
     const observerHeightKm = observerHeight / 1000;
     return Math.sqrt(2 * earthRadius * observerHeightKm);
   }
   ```

## Recommended Changes

1. **Dynamic Maximum Distance**: The maximum distance should be calculated based on the observer height and ship height, rather than being fixed at 50 km.

2. **Dynamic Slider Range**: The ship distance slider's maximum value should be updated when the observer height or ship height changes.

3. **Validation**: Add validation to ensure the ship distance cannot exceed the maximum visible distance based on the current observer and ship heights.

## Implementation Strategy

1. Calculate the maximum visible distance when the application initializes and whenever the observer height or ship height changes.

2. Update the ship distance slider's maximum value to match this calculated maximum visible distance.

3. If the current ship distance exceeds the new maximum, adjust it to the maximum value.
