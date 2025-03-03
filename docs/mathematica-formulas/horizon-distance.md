# Horizon Distance Formulas

## Basic Horizon Distance Formula
From the Mathematica notebook, the horizon distance formula appears to be:

```
d0[h] := Sqrt[2 * R * 0.001 * h]
```

Where:
- `d0[h]` is the distance to the horizon in kilometers
- `h` is the observer height in meters
- `R` is the Earth's radius in kilometers (7320 km in the notebook)
- `0.001` is the conversion factor from meters to kilometers for the height

## Maximum Visible Distance Formula
The maximum distance at which an object of height H can be seen:

```
d1[H] := Sqrt[2 * R * 0.001 * H]
```

## Total Maximum Visible Distance
The total maximum distance at which an object of height H can be seen by an observer at height h:

```
maxVisibleDistance = d0[h] + d1[H]
```

This represents the sum of the observer's horizon distance and the object's horizon distance.

## Key Observations
1. The horizon distance is proportional to the square root of the observer height
2. For a minimum observer height (e.g., 1-2 meters), the horizon distance should be relatively small
3. The maximum visible distance depends on both observer height and object height
