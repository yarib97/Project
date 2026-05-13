import { toTitleCase } from '../utils.js'

/**
 * Displays the legend UI element with a dynamic gradient scale and title based on the selected load type.
 *
 * This function:
 * - Determines the current value and maximum value for the selected load type (`electricity` or `heat`).
 * - Formats and displays a gradient scale with labeled intervals.
 * - Updates the legend indicator to reflect the current value.
 * - Makes the legend visible on the UI.
 *
 * @param {string} [LoadName=''] - The type of load to display in the legend. Accepted values are `'electricity'` or `'heat'`.
 *
 * @throws Will silently return if the legend element is not found in the DOM.
 */
export function showLegend (LoadName = '') {
  const legend = document.querySelector('.legend');
  const legendTitle = document.querySelector('.legend-title');
  const gradientScale = document.querySelector('#gradient-scale')
  const scale = document.querySelector('.scale')
  const fsaCode = window.highlighted.feature.properties.FSA
  let currentValue

  if (!legend) return;

  let maxValue
  if (LoadName === 'electricity'){
    currentValue = window.electricityLookup[fsaCode]?.Consumption_2021
    maxValue = window.maxElectricity
    legendTitle.innerHTML = `<p><strong>${toTitleCase(LoadName)} [GWh]</strong></p>`
  }else if(LoadName === 'heat'){
    currentValue = window.heatLookup[fsaCode]?.normalized ?? 0
    maxValue = window.maxHeat
    legendTitle.innerHTML = `<p><strong>${toTitleCase(LoadName)} [GWh/km²]</strong></p>`
  }

  function formatNumber(value) {
    if (value >= 1000000) return (value / 1_000_000) + 'M';
    if (value >= 1000) return (value / 1_000) + 'k';
    return value.toString();
  }
  
  let scaleMaxValue = maxValue

  gradientScale.className = `${LoadName}-legend`;
  scale.innerHTML = `
    <span>0</span>
    <span>${formatNumber(0.25 * scaleMaxValue)}</span>
    <span>${formatNumber(0.50 * scaleMaxValue)}</span>
    <span>${formatNumber(0.75 * scaleMaxValue)}</span>
    <span>${formatNumber(scaleMaxValue)}</span>
  `;


  updateLegendIndicator(currentValue, 0, scaleMaxValue, LoadName)
  legend.style.display = 'block';
  }

/**
 * Hides the legend UI element.
 *
 * This function sets the legend's display style to 'none', effectively removing it from view.
 */
export function hideLegend() {
  const legend = document.querySelector('.legend');
  if (legend) legend.style.display = 'none';
}

/**
 * Updates the position and styling of the legend indicator dot based on the current value.
 *
 * This function:
 * - Calculates the relative position of the value within the legend scale.
 * - Applies the appropriate gradient class based on the load type (`heat` or `electricity`).
 * - Moves the indicator dot horizontally to reflect the value's position on the scale.
 *
 * @param {number} value - The current value to be indicated on the legend.
 * @param {number} minValue - The minimum value of the legend scale.
 * @param {number} maxValue - The maximum value of the legend scale.
 * @param {string} loadName - The type of load (`heat` or `electricity`) used to determine styling.
 *
 * @throws Will silently return if required DOM elements (`.legend-indicator` or `#gradient-scale`) are not found.
 */
function updateLegendIndicator(value, minValue, maxValue, loadName) {
  const dot = document.querySelector('.legend-indicator');
  const gradient = document.getElementById('gradient-scale');

  if (!dot || !gradient) return;

  // Remove previous classes and add the new one
  gradient.classList.remove('heat-legend', 'electricity-legend');

  if (loadName === 'heat') {
    gradient.classList.add('heat-legend');
  } else if (loadName === 'electricity') {
    gradient.classList.add('electricity-legend');
  }

  requestAnimationFrame(() => {
    const legendWidth = gradient.offsetWidth;

    const ratio = Math.min(Math.max((value - minValue) / (maxValue - minValue), 0), 1);
    const positionX = ratio * legendWidth;

    dot.style.left = `${positionX}px`;
  });
}
