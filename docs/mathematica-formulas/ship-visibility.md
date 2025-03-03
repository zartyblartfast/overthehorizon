# Ship Visibility Calculations

## Ship Scale Formula
Based on the Mathematica code, the ship scale appears to be calculated as:

```
shipScale = (1 - 0.75 * d/d0[h]) * Sqrt[H/50]
```

Where:
- `d` is the current distance to the ship
- `d0[h]` is the horizon distance for the observer height
- `H` is the ship height in meters
- The formula applies when the ship is before the horizon (d ≤ d0[h])

## Ship Scale Beyond Horizon
When the ship is beyond the horizon (d > d0[h]), the scale becomes:

```
shipScale = 0.25 * Sqrt[H/50]
```

## Ship Sinking Calculation
The amount by which the ship appears to sink below the horizon is proportional to:

```
sinkAmount = (d - d0[h]) / (maxVisibleDistance - d0[h])
```

Where:
- `d` is the current distance to the ship
- `d0[h]` is the horizon distance for the observer height
- `maxVisibleDistance` is the maximum distance at which the ship can be seen

This produces a value between 0 (at the horizon) and 1 (at the maximum visible distance).

## Visible Portion Calculation
The visible portion of the ship (from 0 to 1) can be calculated as:

```
visiblePortion = 1 - sinkAmount
```
