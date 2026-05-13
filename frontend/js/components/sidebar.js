import { toggleContainer } from "../utils.js";

const btnLayers = document.querySelector('#btn-layers');
const btnLoads = document.querySelector('#btn-loads');
const containerLayers = document.querySelector('#container-layers');
const containerLoads = document.querySelector('#container-loads');

btnLayers.addEventListener('click', (e) => {
  e.stopPropagation(); // Prevent outside click
  toggleContainer('#container-layers', ['#container-loads']);
});

btnLoads.addEventListener('click', (e) => {
  e.stopPropagation(); // Prevent outside click
  toggleContainer('#container-loads', ['#container-layers']);
});

document.addEventListener('click', (e) => {
  const clickedOutsideAll =
    !containerLayers.contains(e.target) &&
    !containerLoads.contains(e.target) &&
    !btnLayers.contains(e.target) &&
    !btnLoads.contains(e.target);

  if (clickedOutsideAll) {
    containerLayers.classList.remove('visible');
    containerLoads.classList.remove('visible');
  }
});