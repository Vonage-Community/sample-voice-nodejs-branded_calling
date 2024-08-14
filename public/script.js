import { fetchAndDisplayBrands, createBrand } from "./scripts/brands-datagrid.js";
import { fetchAndDisplaySettings } from "./scripts/settings.js";
import { fetchMarkdown } from "./scripts/markdown.js";

function initializePage() {
    document.getElementById("container").style.display = "block";
    fetchAndDisplayBrands();
    fetchAndDisplaySettings();
    fetchMarkdown();
}

function initializeListeners() {
  document
    .getElementById("createBrandForm")
    .addEventListener("submit", (e) => {
      e.preventDefault();

      createBrand(document.getElementById("number").value, document.getElementById("brand").value);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    initializePage();
    initializeListeners();

    document.getElementById("currentOrigin").innerText = window.location.origin;

    const currentTab = window.location.hash.replace("#", "");
    if (currentTab) {
        openTab(null, currentTab);
    } else {
        document.getElementById("defaultOpen").click();
    }
});
