import { weaponsDatabase } from "./weaponsData.js";

let fireAudio = new Audio(); // fire auio
let reloadAudio = new Audio(); // reload audio

const infoPanel = document.getElementById("infoPanel");
const gunTitle = document.getElementById("gunTitle");
const gunDescription = document.getElementById("gunDescription");
const spec1 = document.getElementById("spec1");
const spec2 = document.getElementById("spec2");
const spec3 = document.getElementById("spec3");
const infoButton = document.querySelector(".info-icon");
const shootButton = document.querySelector(".shoot-icon");
const reloadButton = document.querySelector(".reload-icon");
const closeButton = document.querySelector(".close-wrapper");

infoPanel.style.display = "none"; // Hide the info panel initially

infoButton.addEventListener("click", () => {
  infoPanel.classList.add("visible");
});

shootButton.addEventListener("click", () => {
  fireAudio.play();
});

reloadButton.addEventListener("click", () => {
  reloadAudio.play();
});

closeButton.addEventListener("click", () => {
  hideInfoPanel();
});

// Function to update the info panel
function updateInfoPanel(gunId) {
  const gunData = weaponsDatabase[gunId];

  if (gunData) {
    gunTitle.textContent = gunData.title;
    gunDescription.textContent = gunData.description;
    spec1.textContent = gunData.specs[0];
    spec2.textContent = gunData.specs[1];
    spec3.textContent = gunData.specs[2];
    fireAudio.src = gunData.fire;
    reloadAudio.src = gunData.reload;
    infoPanel.classList.add("visible");
  }
}

// Function to hide the info panel
function hideInfoPanel() {
  infoPanel.classList.remove("visible");
}

// Function to remove the info
function hideInfo() {
  gunTitle.textContent = null;
  gunDescription.textContent = null;
  spec1.textContent = null;
  spec2.textContent = null;
  spec3.textContent = null;
  fireAudio.src = "";
  reloadAudio.src = "";
  infoPanel.style.display = "none";
}

Object.keys(weaponsDatabase).forEach((gunId) => {
  let marker = document.getElementById(gunId);

  marker.addEventListener("markerFound", () => {
    infoPanel.style.display = "block";
    updateInfoPanel(gunId);
  });

  marker.addEventListener("markerLost", () => {
    hideInfoPanel();
    hideInfo();
  });
});
