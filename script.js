import { weaponsDatabase } from "./weaponsData.js";

// Upgraded custom A-Frame component for drag-to-rotate functionality
AFRAME.registerComponent('drag-rotate', {
  schema: { speed: { default: 15.0 } }, // ⚡ INCREASED DEFAULT SPEED
  init: function () {
    this.ifMouseDown = false;
    this.x_cord = 0;

    // Bind event functions
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);

    // Listen on the window object (more reliable for mobile browsers)
    window.addEventListener('mousedown', this.onMouseDown);
    window.addEventListener('mouseup', this.onMouseUp);
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('touchstart', this.onTouchStart);
    window.addEventListener('touchend', this.onTouchEnd);
    window.addEventListener('touchmove', this.onTouchMove);
  },
  onMouseDown: function (e) { this.ifMouseDown = true; this.x_cord = e.clientX; },
  onMouseUp: function () { this.ifMouseDown = false; },
  onMouseMove: function (e) {
    // ⚡ ONLY rotate if this specific gun's marker is currently visible
    if (this.ifMouseDown && this.el.parentNode.object3D.visible) {
      let temp_x = e.clientX - this.x_cord;
      this.el.object3D.rotation.y += temp_x * this.data.speed / 1000;
      this.x_cord = e.clientX;
    }
  },
  onTouchStart: function (e) { this.ifMouseDown = true; this.x_cord = e.touches[0].clientX; },
  onTouchEnd: function () { this.ifMouseDown = false; },
  onTouchMove: function (e) {
    // ⚡ ONLY rotate if this specific gun's marker is currently visible
    if (this.ifMouseDown && this.el.parentNode.object3D.visible) {
      let temp_x = e.touches[0].clientX - this.x_cord;
      this.el.object3D.rotation.y += temp_x * this.data.speed / 1000;
      this.x_cord = e.touches[0].clientX;
    }
  }
});

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

  if (marker) {
    marker.addEventListener("markerFound", () => {
      infoPanel.style.display = "block";
      updateInfoPanel(gunId);

      // --- NEW FEATURE: AR Text Overlay ---
      const gunData = weaponsDatabase[gunId];
      let textOverlay = marker.querySelector('.ar-text');
      
      // If the text doesn't exist yet, create it
      if (!textOverlay) {
        textOverlay = document.createElement('a-text');
        textOverlay.setAttribute('class', 'ar-text');
        
        // Format the text to show the title and specs
        const floatingText = `${gunData.title}\n\n${gunData.specs.join('\n')}`;
        textOverlay.setAttribute('value', floatingText);
        
        // Positioning: Adjust these coordinates based on where you want the text to float relative to the marker
        textOverlay.setAttribute('position', '50 10 -250'); 
        textOverlay.setAttribute('rotation', '-90 0 0'); // Keeps the text facing the camera for NFT markers
        textOverlay.setAttribute('scale', '40 40 40');
        textOverlay.setAttribute('color', '#00FF00'); // Neon green
        textOverlay.setAttribute('align', 'center');
        
        marker.appendChild(textOverlay);
      }
    });

    marker.addEventListener("markerLost", () => {
      hideInfoPanel();
      hideInfo();
    });
  }
});
