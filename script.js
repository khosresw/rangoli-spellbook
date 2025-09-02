const grid = document.getElementById("stencil-grid");
const loreOutput = document.getElementById("lore-output");
const gridSize = 5;
const loreLog = [];

// Motif shapes
const motifs = {
  sun: `<circle cx="50" cy="50" r="20" fill="#ff9800" stroke="#e65100" stroke-width="2"/>`,
  diamond: `<polygon points="50,30 70,50 50,70 30,50" fill="#1976d2"/>`,
  triangle: `<polygon points="50,30 70,70 30,70" fill="#f57c00"/>`
};

// Lore captions
const loreArchive = {
  sun: "The sun awakens the sacred grid",
  diamond: "The diamond guards the eastern gate",
  triangle: "The triangle channels ancestral fire"
};

// Create grid cells
for (let i = 0; i < gridSize * gridSize; i++) {
  const cell = document.createElement("div");
  cell.classList.add("cell");
  cell.style.position = "relative";
  cell.dataset.index = i + 1;

  const motifKeys = Object.keys(motifs);
  const selectedMotif = motifKeys[i % motifKeys.length];

  cell.addEventListener("click", () => {
    activateCell(cell, selectedMotif);
  });

  grid.appendChild(cell);
}

// Activate cell with motif + stitched tooltip
function activateCell(cell, motifKey) {
  if (cell.querySelector("svg")) return;

  // Create SVG motif
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "60");
  svg.setAttribute("height", "60");
  svg.setAttribute("viewBox", "0 0 100 100");
  svg.style.position = "absolute";
  svg.style.top = "50%";
  svg.style.left = "50%";
  svg.style.transform = "translate(-50%, -50%)";
  svg.style.cursor = "help";
  svg.innerHTML = motifs[motifKey];
  cell.appendChild(svg);

  // Create stitched tooltip
  const tooltip = document.createElement("div");
  tooltip.classList.add("stitched-tooltip");
  tooltip.textContent = loreArchive[motifKey];
  document.body.appendChild(tooltip);

  svg.addEventListener("mouseenter", () => {
    tooltip.style.opacity = "1";
  });

  svg.addEventListener("mousemove", (e) => {
    tooltip.style.left = e.pageX + 12 + "px";
    tooltip.style.top = e.pageY + 12 + "px";
  });

  svg.addEventListener("mouseleave", () => {
    tooltip.style.opacity = "0";
  });

  // Log lore entry
  loreLog.push({
    cell: cell.dataset.index,
    motif: motifKey,
    lore: loreArchive[motifKey],
    timestamp: new Date().toLocaleString()
  });
}

// Export lore log to spellbook page
function exportLoreLog() {
  loreOutput.innerHTML = "";

  loreLog.forEach(entry => {
    const logEntry = document.createElement("div");
    logEntry.classList.add("log-entry");

    logEntry.innerHTML = `
      <div class="cell-id">Cell ${entry.cell}</div>
      <div class="motif-name">Motif: ${entry.motif}</div>
      <div class="lore-text">“${entry.lore}”</div>
      <div class="timestamp">Activated on: ${entry.timestamp}</div>
    `;

    loreOutput.appendChild(logEntry);
  });

  window.scrollTo({ top: loreOutput.offsetTop, behavior: "smooth" });
}