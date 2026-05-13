/**
 * * Resets the highlight on a map layer by restoring its previous style and closing any tooltip.
*
* @param {string} highlightedProp - The name of the global property storing the highlighted layer.
* @param {string} layerProp - The name of the layer property (unused in this function but may be used elsewhere).
*/
export function resetLayerHighlight(highlightedProp, layerProp) {
  const highlighted = window[highlightedProp];
 
  if (highlighted) {
    // Restore the style that was saved before highlighting
    restorePreviousStyle(highlighted);
 
    highlighted.closeTooltip?.();
    window[highlightedProp] = null;
  }
}

/**
 * Applies a highlight style to a map layer and restores any previously highlighted layer.
 *
 * Saves the current layer's style, applies a new highlight style using the specified color,
 * brings the layer to the front, and updates the global `window.highlighted` reference.
 *
 * @param {Object} layer - The map layer to highlight.
 * @param {string} highlightColor - The color used for highlighting the layer.
 */
export function switchHighlight(layer, highlightColor) {
  if (window.highlighted) {
    restorePreviousStyle(window.highlighted);
  }
  savePreviousStyle(layer);
  layer.setStyle({
    weight: 4,
    color: highlightColor,
    fillColor: highlightColor,
    fillOpacity: 0.5
  });

  layer.bringToFront();
  window.highlighted = layer;
}

/**
 * Saves the current style of a map layer for later restoration.
 *
 * Stores a shallow copy of the layer's style options in a custom `_previousStyle` property
 * if it hasn't already been saved.
 *
 * @param {Object} layer - The map layer whose style should be saved.
 */
export function savePreviousStyle(layer) {
  if (!layer._previousStyle) {
    layer._previousStyle = { ...layer.options }; // shallow copy of style options
  }
}

/**
 * Restores the previously saved style of a map layer.
 *
 * Applies the saved style from the `_previousStyle` property and removes it afterward
 * to prevent persistent memory usage.
 *
 * @param {Object} layer - The map layer whose style should be restored.
 */
export function restorePreviousStyle(layer) {
  if (layer._previousStyle) {
    layer.setStyle(layer._previousStyle);
    delete layer._previousStyle; // clean up so it doesn’t persist forever
  }
}

/**
 * Toggles the visibility of a target container and hides other specified containers.
 *
 * Removes the `.visible` class from all containers listed in `containersToHide`,
 * then toggles the `.visible` class on the target container.
 *
 * @param {string} containerToToggle - CSS selector for the container to toggle.
 * @param {Array<string>} containersToHide - Array of CSS selectors for containers to hide.
 */
export function toggleContainer(containerToToggle, containersToHide) {
  // Hide all other containers by removing .visible class
  containersToHide.forEach(selector => {
    const container = document.querySelector(selector);
    if (container) {
      container.classList.remove('visible');
    }
  });

  // Toggle the target container's visibility
  const container = document.querySelector(containerToToggle);
  if (container) {
    container.classList.toggle('visible');
  }
}

window.mapCenter = [49, -84]

const rootStyles = getComputedStyle(document.documentElement);

export const colors = {
  background: rootStyles.getPropertyValue('--background-color').trim,
  primary: rootStyles.getPropertyValue('--primary-accent').trim(),
  secondary: rootStyles.getPropertyValue('--secondary-accent').trim(),
};

/**
 * Scales a hex color's brightness based on a given fraction.
 *
 * Normalizes 3-digit hex codes to 6-digit, converts to RGB, scales each channel
 * by 20% of the input fraction, and returns the resulting color in hex format.
 *
 * @param {string} hexColor - A valid 3- or 6-digit hex color string (e.g., '#abc' or '#aabbcc').
 * @param {number} fraction - A scaling factor used to adjust brightness (typically between 0 and 1).
 * @returns {string} A new hex color string representing the scaled color.
 * @throws {Error} If the input is not a valid hex color format.
 */
export function scaleHexColor(hexColor, fraction) {
  // Ensure the hex color starts with #
  if (!hexColor.startsWith('#') || (hexColor.length !== 7 && hexColor.length !== 4)) {
    throw new Error('Invalid hex color format');
  }

  // Normalize 3-digit hex to 6-digit
  if (hexColor.length === 4) {
    hexColor = '#' + hexColor.slice(1).split('').map(c => c + c).join('');
  }

  // Convert hex to RGB
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);

  // Calculate scaling factor: 80% of the input fraction
  const scale = 0.2 * fraction;

  // Scale RGB values
  const newR = Math.round(r * scale);
  const newG = Math.round(g * scale);
  const newB = Math.round(b * scale);

  // Convert back to hex, padded to 2 digits
  const toHex = v => v.toString(16).padStart(2, '0');

  return `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`;
}

/**
 * Determines the minimum zoom level for a map based on the current window width.
 *
 * Returns a zoom level optimized for different screen sizes, from mobile to ultra-wide displays.
 *
 * @returns {number} The recommended minimum zoom level.
 */
export function getResponsiveMinZoom() {
  const width = window.innerWidth;
  if (width >= 3000) return 7.2;     // Ultra-wide displays
  if (width >= 1920) return 6.5;     // Large desktops
  if (width >= 1440) return 5.45;     // Standard desktops
  if (width >= 1024) return 5.4;     // Tablets
  return 5.0;                        // Mobile
}

/**
 * Converts a string to title case.
 *
 * Capitalizes the first letter of each word and converts the rest to lowercase.
 *
 * @param {string} str - The input string to convert.
 * @returns {string} The converted string in title case.
 */
export function toTitleCase(str) {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Zoom to a target layer and shift the view slightly to the left of its center.
 * @param {L.Map} map - The Leaflet map instance.
 * @param {L.Layer} layer - The Leaflet layer to zoom to.
 * @param {number} zoom - Optional maximum zoom level (default: 11).
 * @param {number} offsetLng - Optional longitude offset for left shift (default: 0.1).
 */
export function fitMapBounds(map, layer, maxZoom = 11, offsetLng = -0.1) {
  if (!map || !layer) return;

  const bounds = layer.getBounds();
  const center = bounds.getCenter();

  // Calculate best zoom level to fit bounds, respecting maxZoom
  const calculatedZoom = Math.min(map.getBoundsZoom(bounds), maxZoom);

  // Shift center to the left by modifying the longitude
  const shiftedCenter = L.latLng(center.lat, center.lng - offsetLng);

  // Single smooth animation
  map.setView(shiftedCenter, calculatedZoom, {
    animate: true,
    duration: 0.5
  });
}

/**
 * Interpolates between two hex colors and returns the result as an RGB string.
 *
 * Converts both hex colors to RGB, then linearly interpolates each channel
 * based on the interpolation factor `t`.
 *
 * @param {string} color1 - The starting hex color (e.g., '#ff0000').
 * @param {string} color2 - The ending hex color (e.g., '#00ff00').
 * @param {number} t - Interpolation factor between 0 and 1.
 * @returns {string} The interpolated color in `rgb(r, g, b)` format.
 */
export function interpolateColor(color1, color2, t) {
  const c1 = parseInt(color1.slice(1), 16);
  const c2 = parseInt(color2.slice(1), 16);

  const r1 = (c1 >> 16) & 0xff;
  const g1 = (c1 >> 8) & 0xff;
  const b1 = c1 & 0xff;

  const r2 = (c2 >> 16) & 0xff;
  const g2 = (c2 >> 8) & 0xff;
  const b2 = c2 & 0xff;

  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);

  return `rgb(${r}, ${g}, ${b})`;
}

/**
 * Normalizes a value within a given range and clamps the result between 0 and 1.
 *
 * Useful for scaling values to a percentage or interpolation factor.
 *
 * @param {number} value - The value to normalize.
 * @param {number} min - The minimum of the range.
 * @param {number} max - The maximum of the range.
 * @returns {number} A normalized value between 0 and 1.
 */


/**
 * Normalizes a numeric value within a given range and clamps the result between 0 and 1.
 *
 * Useful for converting values to a percentage or interpolation factor.
 * Returns 0 if `min` and `max` are equal to avoid division by zero.
 *
 * @param {number} value - The value to normalize.
 * @param {number} min - The minimum of the range.
 * @param {number} max - The maximum of the range.
 * @returns {number} A normalized value between 0 and 1.
 */
export function normalizeValue(value, min, max) {
  if (max === min) return 0; // avoid division by zero
  
  const t = (value - min) / (max - min); // raw normalized value
  const clampedT = Math.min(1, Math.max(0, t)); // clamp between 0 and 1
  
  return clampedT;
}

/**
 * Rounds a numeric value up to a "nice" maximum for axis scaling or display.
 *
 * Determines the magnitude of the value and selects a rounded leading digit
 * from a predefined set (e.g., 1.2, 1.5, 2, 2.5, 5, 10) to produce a clean, readable maximum.
 *
 * @param {number} value - The value to round.
 * @returns {number} A nicely rounded maximum value.
 */
export function niceRoundMax(value) {
  if (value === 0) return 1;

  const magnitude = Math.pow(10, Math.floor(Math.log10(value)));
  const normalized = value / magnitude;

  // More granular "nice" steps
  const niceSteps = [1, 1.2, 1.25, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 8, 10];

  let niceLeading = niceSteps.find(step => normalized <= step);
  if (!niceLeading) niceLeading = 10;

  return niceLeading * magnitude;
}


/**
 * Computes the maximum value from a set of features based on the specified load type.
 *
 * Selects the appropriate property (`consumption2021` for electricity or `normalizedHeat` for heat),
 * finds the maximum finite value across all features, and returns a nicely rounded version of it.
 *
 * @param {Array<Object>} features - Array of GeoJSON-like feature objects with a `properties` field.
 * @param {string} loadName - The type of load to evaluate ('electricity' or 'heat').
 * @returns {number} The nicely rounded maximum value found, or 0 if no valid values exist.
 */
export function computeMaxValue(features, loadName) {

  let loadProperty
  if(loadName.toLowerCase() === "electricity"){
    loadProperty = 'consumption2021'
  }else if(loadName.toLowerCase() === "heat"){
    loadProperty = 'normalizedHeat'
  }
  let max = -Infinity;
  for (const feature of features) {
    const value = parseFloat(feature.properties?.[loadProperty]);
    if (Number.isFinite(value) && value > max) {
      max = value;
    }
  }
  if (max === -Infinity) return 0;

  return niceRoundMax(max);
}