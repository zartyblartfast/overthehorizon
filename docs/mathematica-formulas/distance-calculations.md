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

## Problem with Current Implementation

In the current JavaScript implementation, when the observer is at minimum height (1-2 meters), the maximum distance is set to 50 km, which is much too far based on the mathematical calculations.

For an observer at 2 meters height and a ship of 30 meters height:
```
d0[2] = Sqrt[2 * 7320 * 0.001 * 2] ≈ 5.4 km
d1[30] = Sqrt[2 * 7320 * 0.001 * 30] ≈ 20.9 km
maxVisibleDistance = 5.4 + 20.9 ≈ 26.3 km
```

This suggests the maximum distance should be around 26-27 km, not 50 km.
