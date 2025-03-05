# Distance Calculations

## Relationship Between Observer Height and Maximum Distance

From the Mathematica notebook, we can extract these key relationships:

1. For an observer at height h meters, the horizon distance (in km) is:
   ```
   d0[h] = Sqrt[2 * R * 0.001 * h]
   ```

2. For a ship of height H meters, its horizon distance (in km) is:
   ```
   d1[H] = Sqrt[2 * R * 0.001 * H]
   ```

3. The maximum distance at which the ship is visible is:
   ```
   maxVisibleDistance = d0[h] + d1[H]
   ```

## Numerical Examples

Using Earth radius R = 7320 km:

1. For an observer at minimum height (h = 1 meter):
   ```
   d0[1] = Sqrt[2 * 7320 * 0.001 * 1] ≈ 3.82 km
   ```

2. For a ship of height H = 30 meters:
   ```
   d1[30] = Sqrt[2 * 7320 * 0.001 * 30] ≈ 20.9 km
   ```

3. Maximum visible distance for this scenario:
   ```
   maxVisibleDistance = 3.82 + 20.9 ≈ 24.7 km
   ```

## Current Implementation

The JavaScript implementation correctly calculates these distances:

```javascript
// Calculate horizon distance for observer
function calculateHorizonDistance(observerHeight, earthRadius = EARTH_RADIUS, refractionFactor = 1.0) {
  const observerHeightKm = observerHeight / 1000;
  const effectiveEarthRadius = earthRadius * refractionFactor;
  return Math.sqrt(2 * effectiveEarthRadius * observerHeightKm);
}

// Calculate maximum visible distance
function calculateMaxVisibleDistance(observerHeight, objectHeight, earthRadius = EARTH_RADIUS, refractionFactor = 1.0) {
  const observerHorizonDistance = calculateHorizonDistance(observerHeight, earthRadius, refractionFactor);
  const objectHorizonDistance = calculateHorizonDistance(objectHeight, earthRadius, refractionFactor);
  return observerHorizonDistance + objectHorizonDistance;
}
```

The application dynamically adjusts the maximum distance based on the current parameters:

```javascript
// Round up to the nearest 5 km for a cleaner UI
const roundedMaxDistance = Math.ceil(maxVisibleDistance / 5) * 5;

// Update state and slider max
state.maxDistance = roundedMaxDistance;
shipDistanceSlider.max = roundedMaxDistance;
```

For example, with default values:
- Observer height: 2 meters
- Ship height: 50 meters
- Refraction factor: 1.33

The calculated maximum visible distance would be approximately:
```
d0[2] with refraction = Sqrt[2 * 7320 * 1.33 * 0.001 * 2] ≈ 6.2 km
d1[50] with refraction = Sqrt[2 * 7320 * 1.33 * 0.001 * 50] ≈ 31.2 km
maxVisibleDistance = 6.2 + 31.2 ≈ 37.4 km
```

This would be rounded up to 40 km for the slider maximum.

## Original Source

The formulas presented in this document are derived from the Wolfram Demonstrations Project's "Ship Sailing over the Horizon" demonstration. The original Mathematica notebook can be found in the `/original-source` directory.

For more information about the original source and how it was adapted for this web implementation, please refer to the [Original Source Reference](../original-source-reference.md) documentation.
