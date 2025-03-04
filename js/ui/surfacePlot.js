/**
 * surfacePlot.js
 * Module for creating and managing the 3D surface plot visualization
 */

import { calculateHorizonDistance } from '../math/horizon.js';
import { EARTH_RADIUS } from '../math/constants.js';

// Default plot configuration
const DEFAULT_CONFIG = {
  colorscale: 'Viridis',
  showContours: true,
  showAxesLabels: true,
  // Preset camera position for optimal viewing
  initialCameraPosition: { 
    x: -1.3666647410163115,
    y: 1.984531938143313,
    z: 0.5646773168385305
  },
  height: 500,
  width: null // Set to null to use responsive sizing
};

/**
 * Creates a 3D surface plot showing the relationship between
 * observer height, atmospheric refraction, and horizon distance
 * 
 * @param {string} containerId - ID of the container element
 * @param {Object} surfaceData - Data for the surface plot
 * @param {Object} config - Configuration options
 * @returns {Object} - Plot instance and update methods
 */
function createHorizonSurfacePlot(containerId, surfaceData, config = {}) {
  // Merge default config with provided config
  const plotConfig = { ...DEFAULT_CONFIG, ...config };
  
  // Get the container element
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container element with ID "${containerId}" not found`);
    return null;
  }
  
  // Ensure Plotly is available
  if (typeof Plotly === 'undefined') {
    console.error('Plotly.js is not loaded. Please include the Plotly library.');
    return null;
  }
  
  // Create the surface plot data
  const plotData = [{
    type: 'surface',
    x: surfaceData.x,
    y: surfaceData.y,
    z: surfaceData.z,
    colorscale: plotConfig.colorscale,
    // Remove colorbar (vertical distance scale)
    showscale: false,
    contours: {
      z: {
        show: plotConfig.showContours,
        usecolormap: true,
        highlightcolor: "#42f5ef",
        project: { z: true }
      }
    },
    // Customize hover information to remove "trace 0" text
    hoverinfo: 'x+y+z',
    hovertemplate: 'Observer Height: %{x}m<br>Refraction: %{y}<br>Horizon Distance: %{z} km<extra></extra>'
  }];
  
  // Create the layout
  const layout = {
    title: '', // Remove the title from the chart
    scene: {
      xaxis: {
        title: plotConfig.showAxesLabels ? 'Observer Height (m)' : '',
        gridcolor: '#e0e0e0',
        titlefont: { size: 10 }, // Reduce font size for x-axis label
        tickfont: { size: 9 }    // Reduce font size for x-axis ticks
      },
      yaxis: {
        title: plotConfig.showAxesLabels ? 'Atmospheric Refraction (k)' : '',
        gridcolor: '#e0e0e0',
        titlefont: { size: 10 }, // Reduce font size for y-axis label
        tickfont: { size: 9 }    // Reduce font size for y-axis ticks
      },
      zaxis: {
        title: plotConfig.showAxesLabels ? 'Horizon Distance (km)' : '',
        gridcolor: '#e0e0e0',
        titlefont: { size: 10 }, // Reduce font size for z-axis label
        tickfont: { size: 9 }    // Reduce font size for z-axis ticks
      },
      camera: {
        eye: plotConfig.initialCameraPosition
      },
      aspectratio: {
        x: 1, 
        y: 1, 
        z: 0.7 // Slightly compress the z-axis to help with vertical centering
      }
    },
    margin: { l: 0, r: 0, b: 40, t: 40 }, // Increase both top and bottom margins
    height: plotConfig.height,
    width: plotConfig.width,
    autosize: true,
    showlegend: false, // Hide legend as we'll use our custom legend
    legend: {
      x: 0,
      y: 1
    }
  };
  
  // Configuration for the plot
  const configPlotly = {
    // Remove all built-in reset buttons
    modeBarButtonsToRemove: [
      'toImage', 'sendDataToCloud', 'editInChartStudio', 'zoom3d', 'pan3d', 
      'orbitRotation', 'tableRotation', 'hoverClosest3d', 'resetCameraLastSave3d', 'resetCameraDefault3d'
    ],
    // Remove the custom reset button from the mode bar
    modeBarButtonsToAdd: [],
    displaylogo: false, // Remove Plotly logo
    responsive: true
  };
  
  // Create the plot
  Plotly.newPlot(containerId, plotData, layout, configPlotly);
  
  // Current marker trace index
  let markerTraceIndex = null;
  let xAxisLineIndex = null;
  let zAxisLineIndex = null;
  
  // Store the current custom camera position (if set)
  let customCameraPosition = null;
  
  /**
   * Resets the view to the preset camera position
   */
  function resetView() {
    // Use custom position if set, otherwise use the preset position
    const resetPosition = customCameraPosition || plotConfig.initialCameraPosition;
    Plotly.relayout(containerId, {
      'scene.camera.eye': resetPosition
    });
  }
  
  /**
   * Sets a custom camera position to use for reset
   * @param {Object} position - Camera position with x, y, z coordinates
   */
  function setCustomCameraPosition(position) {
    if (position && typeof position === 'object' && 
        'x' in position && 'y' in position && 'z' in position) {
      customCameraPosition = position;
      return true;
    }
    return false;
  }
  
  /**
   * Gets the current camera position
   * @returns {Object|null} - Current camera position or null if not available
   */
  function getCurrentCameraPosition() {
    const plotDiv = document.getElementById(containerId);
    if (plotDiv && plotDiv._fullLayout && plotDiv._fullLayout.scene && 
        plotDiv._fullLayout.scene.camera) {
      return plotDiv._fullLayout.scene.camera.eye;
    }
    return null;
  }
  
  /**
   * Updates the current position marker on the plot
   * @param {number} observerHeight - Current observer height
   * @param {number} refractionFactor - Current refraction factor
   */
  function updateCurrentPositionMarker(observerHeight, refractionFactor) {
    // Calculate the horizon distance with high precision
    const distance = calculateHorizonDistance(observerHeight, EARTH_RADIUS, refractionFactor);
    
    // Ensure we use the exact same Z value for all elements to avoid rendering differences
    const exactZValue = distance;
    
    // Create marker data
    const markerData = {
      x: [observerHeight],
      y: [refractionFactor],
      z: [exactZValue],
      mode: 'markers',
      type: 'scatter3d',
      marker: {
        size: 8,
        color: 'red',
        symbol: 'circle'
      },
      name: 'Current Settings',
      hoverinfo: 'text',
      hovertemplate: `Observer Height: ${observerHeight}m<br>Refraction: ${refractionFactor}<br>Horizon Distance: ${exactZValue.toFixed(2)}km<extra></extra>`
    };
    
    // Use a fixed endpoint of 100 for both X range and red line
    const fixedEndpointX = 100;
    
    // Create X-axis alignment line (horizontal line along X-axis at current Y,Z)
    const xAxisLine = {
      type: 'scatter3d',
      mode: 'lines',
      name: 'X-Axis Reference',
      x: [0, fixedEndpointX], // Use fixed endpoint of 100
      y: [refractionFactor, refractionFactor],
      z: [exactZValue, exactZValue],
      line: {
        color: 'rgba(255, 0, 0, 0.7)',
        width: 3
      },
      showlegend: false,
      // Hide hover info for reference lines
      hoverinfo: 'none'
    };
    
    // Get the Y range of the surface data
    const minY = surfaceData.y[0];
    const maxY = surfaceData.y[surfaceData.y.length-1];
    
    // Create Z-axis alignment line (horizontal line along Y-axis at the fixed X value)
    const zAxisLine = {
      type: 'scatter3d',
      mode: 'lines',
      name: 'Z-Axis Reference',
      x: [fixedEndpointX, fixedEndpointX], // Use fixed endpoint of 100
      y: [minY, maxY], // Full Y-axis range
      z: [exactZValue, exactZValue], // Same Z as the marker
      line: {
        color: 'rgba(255, 0, 0, 0.7)',
        width: 3
      },
      showlegend: false,
      // Hide hover info for reference lines
      hoverinfo: 'none'
    };
    
    // If traces already exist, update them
    if (markerTraceIndex !== null) {
      Plotly.deleteTraces(containerId, [markerTraceIndex, xAxisLineIndex, zAxisLineIndex]);
    }
    
    // Add the new traces
    Plotly.addTraces(containerId, [markerData, xAxisLine, zAxisLine]);
    markerTraceIndex = 1;
    xAxisLineIndex = 2;
    zAxisLineIndex = 3;
  }
  
  /**
   * Resizes the plot to fit its container
   */
  function resizePlot() {
    Plotly.relayout(containerId, {
      width: container.clientWidth,
      height: plotConfig.height
    });
  }
  
  // Add window resize event listener
  window.addEventListener('resize', resizePlot);
  
  // Return methods for external control
  return {
    updateCurrentPositionMarker,
    resizePlot,
    resetView,
    setCustomCameraPosition,
    getCurrentCameraPosition,
    
    // Method to update the entire plot data
    updatePlotData: function(newSurfaceData) {
      const update = {
        x: [newSurfaceData.x],
        y: [newSurfaceData.y],
        z: [newSurfaceData.z]
      };
      
      Plotly.update(containerId, update, {}, 0);
    },
    
    // Method to destroy the plot and clean up
    destroy: function() {
      window.removeEventListener('resize', resizePlot);
      Plotly.purge(containerId);
    }
  };
}

export { createHorizonSurfacePlot };
