# Over The Horizon

An interactive web demonstration of Earth's curvature and ship visibility over the horizon.

## Overview

Over The Horizon is an educational web application that demonstrates how ships gradually disappear from bottom to top as they sail away from an observer due to Earth's curvature. This project provides an interactive visualization that allows users to adjust parameters such as observer height, ship height, and distance to see the effects on visibility.

## Features

- **Interactive Controls**: Adjust observer height, ship height, and distance in real-time
- **Realistic Ship Rendering**: Detailed ship model with proper proportions and components
- **Telescope View**: Magnified view that appears when the ship reaches the horizon
- **Smoke Effects**: Particle-based smoke animation from ship funnels
- **Mathematical Accuracy**: Calculations based on Earth's actual curvature
- **3D Surface Plot**: Visual representation of the mathematical relationship between parameters
- **Responsive Design**: Works on desktop and mobile devices
- **Educational Information**: Explanations of the science behind the horizon effect

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/zartyblartfast/overthehorizon.git
   ```

2. Open the project directory:
   ```
   cd overthehorizon
   ```

3. Since this is a pure HTML/CSS/JavaScript application, no build process is required. Simply open `index.html` in a web browser to run the application locally.

## Usage

1. **Observer Height**: Adjust the slider to change the height of the observer (1.0 to 3.0 meters)
2. **Ship Height**: Adjust the slider to change the height of the ship (35 to 100 meters)
3. **Distance**: Adjust the slider to change the distance of the ship from shore (0 to 20 kilometers)
4. **Refraction Factor**: Toggle atmospheric refraction effects on or off
5. **Telescope View**: Toggle the telescope view on or off
6. **Animation**: Toggle automatic animation of the ship sailing away

As the ship sails beyond the horizon distance (calculated based on observer height), it will begin to disappear from the bottom up, demonstrating Earth's curvature.

## How It Works

The application uses these key mathematical formulas:

1. **Horizon Distance Calculation**:
   ```
   d0(h) = √(2 * R * 0.001 * h)
   ```
   Where:
   - d0 is the distance to the horizon in kilometers
   - h is the observer's eye height in meters
   - R is the Earth's radius (7320 km)
   - 0.001 is a conversion factor

2. **Ship Visibility Distance**:
   ```
   d1(H) = √(2 * R * 0.001 * H)
   ```
   Where:
   - d1 is the maximum distance the ship can be seen
   - H is the height of the ship in meters

The application renders the ship with appropriate scaling based on distance and implements a "sinking" effect when the ship goes beyond the horizon.

## Technical Details

The visualization is based on precise mathematical calculations that model:

1. The curvature of the Earth (using a radius of 7320 km)
2. The horizon distance for an observer at a given height
3. The visible portion of a ship at a given distance
4. The effects of atmospheric refraction (default factor: 1.33)

All calculations are derived from the principles of spherical geometry and implemented in JavaScript. The original mathematical formulas were adapted from a Mathematica notebook created by the Wolfram Demonstrations Project. A detailed [consistency check](docs/mathematica-javascript-consistency-check.md) confirms the mathematical accuracy of the implementation.

## Technical Implementation

The project is built using:
- HTML5 Canvas for rendering
- JavaScript for calculations and interactivity
- CSS for styling and responsive design
- Plotly.js for the 3D surface plot

The codebase is organized into modules:
- `js/math/` - Mathematical calculations and constants
- `js/rendering/` - Canvas rendering functions
- `js/ui/` - User interface components and controls

## Documentation

Detailed documentation is available in the `docs/` directory:
- [Project Specification](docs/over-the-horizon-specification.md)
- [Technical Implementation Guide](docs/technical-implementation-guide.md)
- [Telescope View Technical Details](docs/telescope-view-technical-details.md)
- [Mathematica Formulas](docs/mathematica-formulas/)

## Recent Changes

- Added smoke animation from ship funnels
- Implemented contact menu with email, tip link, X.com, accreditation, and long line of sight views
- Added QR code for Buy Me a Coffee support
- Fixed reset button functionality
- Improved mobile responsiveness

## Contact and Support

- Email: beyondhorizoncalc@gmail.com
- Twitter/X: [@BeyondHorizon_1](https://x.com/BeyondHorizon_1)
- Support: [Buy Me a Coffee](https://buymeacoffee.com/beyondhorizon)

## Accreditation

This project is based on the "Ship Sailing Over The Horizon" demonstration from the Wolfram Demonstrations Project:
[https://demonstrations.wolfram.com/ShipSailingOverTheHorizon](https://demonstrations.wolfram.com/ShipSailingOverTheHorizon)

## License

MIT License - See LICENSE file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
