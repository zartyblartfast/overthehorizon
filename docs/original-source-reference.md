# Original Source Reference

## Wolfram Demonstrations Project

This project is based on mathematical principles and formulas originally presented in the Wolfram Demonstrations Project:

- **Title**: "Ship Sailing over the Horizon"
- **Version**: 1.0.0
- **Original File**: `Demonstration-Ship-Sailing-over-the-Horizon-1-0-0-definition.nb`
- **Location**: `/original-source` directory in this repository

## Adaptation Process

The Mathematica notebook contains the original mathematical formulas and interactive demonstration that served as the foundation for this web-based implementation. The key mathematical concepts were extracted and translated into JavaScript:

### Key Formulas Adapted

1. **Horizon Distance Calculation**:
   ```
   d0[h_] := Sqrt[2*R*h/1000]
   ```
   Where:
   - `h` is the observer height in meters
   - `R` is the Earth radius in kilometers (7320 km)
   - The result is the horizon distance in kilometers

2. **Ship Visibility Calculation**:
   ```
   d1[H_] := Sqrt[2*R*H/1000]
   ```
   Where:
   - `H` is the ship height in meters
   - The result is the ship's horizon distance in kilometers

3. **Maximum Visible Distance**:
   ```
   maxVisibleDistance = d0[h] + d1[H]
   ```
   This represents the maximum distance at which any part of the ship would be visible.

4. **Visible Portion Calculation**:
   The notebook includes calculations to determine what portion of the ship remains visible at different distances, which was adapted for the rendering logic in our JavaScript implementation.

## Enhancements

Our implementation extends the original Mathematica demonstration with several enhancements:

1. **Atmospheric Refraction**: Added support for atmospheric refraction effects, which increase the effective radius of the Earth (default factor: 1.33)

2. **Telescope View**: Added a simulated telescope view that shows more detail when the ship is partially obscured by the horizon

3. **Interactive Controls**: Enhanced user interface with sliders for all parameters and toggles for different viewing modes

4. **Smoke Effects**: Added realistic smoke animation from the ship's funnels that demonstrates how taller elements remain visible even when the hull has disappeared

## Accessing the Original Source

The original Mathematica notebook (`.nb` file) is included in the local repository in the `/original-source` directory for reference, but is not tracked in the Git repository due to GitHub Pages deployment constraints.

To access and interact with this file, you'll need:

1. Wolfram Mathematica software, or
2. The free [Wolfram Player](https://www.wolfram.com/player/)

If you need access to the original notebook file, please contact the repository maintainer.

## Attribution

The original demonstration was created as part of the Wolfram Demonstrations Project. This web implementation is an independent adaptation that preserves the mathematical principles while making them accessible through a web browser without requiring specialized software.
