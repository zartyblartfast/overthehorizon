# Implementation Issues

## Current Implementation of Distance Calculations

After analyzing the JavaScript implementation and comparing it with the Mathematica formulas, the distance calculations are correctly implemented:

1. **Dynamic Maximum Distance**: In `js/main.js`, the maximum distance is calculated dynamically:
   ```javascript
   const state = {
     observerHeight: DEFAULT_OBSERVER_HEIGHT,
     shipHeight: DEFAULT_SHIP_HEIGHT,
     shipDistance: 0,
     maxDistance: calculateMaxVisibleDistance(DEFAULT_OBSERVER_HEIGHT, DEFAULT_SHIP_HEIGHT, undefined, DEFAULT_REFRACTION_FACTOR), // Calculated dynamically
     telescopeEnabled: true,
     animationEnabled: false,
     refractionFactor: DEFAULT_REFRACTION_FACTOR
   };
   ```

2. **Dynamic Slider Range**: In `js/ui/controls.js`, the ship distance slider's maximum value is updated when observer height or ship height changes:
   ```javascript
   function updateMaxDistance(state, shipDistanceSlider) {
     // Calculate maximum visible distance
     const maxVisibleDistance = calculateMaxVisibleDistance(
       state.observerHeight,
       state.shipHeight,
       undefined,
       state.refractionFactor
     );
     
     // Round up to the nearest 5 km for a cleaner UI
     const roundedMaxDistance = Math.ceil(maxVisibleDistance / 5) * 5;
     
     // Update state and slider max
     state.maxDistance = roundedMaxDistance;
     shipDistanceSlider.max = roundedMaxDistance;
     
     // If current distance exceeds new max, adjust it
     if (state.shipDistance > maxVisibleDistance) {
       state.shipDistance = maxVisibleDistance;
       shipDistanceSlider.value = state.shipDistance;
     }
   }
   ```

3. **Horizon Distance Calculation**: The horizon distance calculation in `js/math/horizon.js` correctly implements the Mathematica formula:
   ```javascript
   function calculateHorizonDistance(observerHeight, earthRadius = EARTH_RADIUS, refractionFactor = 1.0) {
     // Convert observer height from meters to kilometers
     const observerHeightKm = observerHeight / 1000;
     
     // Apply refraction factor to Earth radius
     const effectiveEarthRadius = earthRadius * refractionFactor;
     
     // Calculate horizon distance: d = √(2Rh)
     return Math.sqrt(2 * effectiveEarthRadius * observerHeightKm);
   }
   ```

## Enhancements Over Original Mathematica Implementation

1. **Atmospheric Refraction**: The JavaScript implementation adds support for atmospheric refraction, which was not in the original Mathematica notebook:
   ```javascript
   // Default atmospheric refraction factor (k value)
   // k = 1.0: No refraction
   // k = 1.33: Standard atmospheric refraction (33% increase in effective Earth radius)
   const DEFAULT_REFRACTION_FACTOR = 1.33;
   ```

2. **Telescope Visibility Threshold**: The implementation includes a more sophisticated calculation for when the telescope view should appear:
   ```javascript
   function calculateTelescopeVisibilityThreshold(
     observerHeight, 
     shipHeight, 
     telescopeFieldOfView = 5,
     telescopeMagnification = 10,
     earthRadius = EARTH_RADIUS,
     refractionFactor = 1.0
   ) {
     // Calculate the maximum visible distance
     const maxVisibleDistance = calculateMaxVisibleDistance(observerHeight, shipHeight, earthRadius, refractionFactor);
     
     // Calculate the horizon distance for the observer
     const horizonDistance = calculateHorizonDistance(observerHeight, earthRadius, refractionFactor);
     
     // Additional calculations for telescope visibility
     // ...
   }
   ```

## Validation and Edge Cases

The implementation includes proper validation to ensure the ship distance cannot exceed the maximum visible distance:

```javascript
// If current distance exceeds new max, adjust it
if (state.shipDistance > maxVisibleDistance) {
  state.shipDistance = maxVisibleDistance;
  shipDistanceSlider.value = state.shipDistance;
  const shipDistanceValue = document.getElementById('ship-distance-value');
  if (shipDistanceValue) {
    shipDistanceValue.textContent = `${state.shipDistance.toFixed(1)} km`;
  }
}
```

This ensures that the application behaves correctly even when parameters change in ways that would otherwise create invalid states.

## Original Source Reference

The mathematical formulas implemented in this project are based on the Wolfram Demonstrations Project's "Ship Sailing over the Horizon" demonstration. The original Mathematica notebook is located in the `/original-source` directory of this repository.

For a detailed explanation of how the original source was adapted for this web implementation, please see the [Original Source Reference](../original-source-reference.md) documentation.
