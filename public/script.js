import { fetchAndDisplayBrands, createBrand } from "./scripts/brands-datagrid.js";
import { fetchAndDisplaySettings } from "./scripts/settings.js";
import { fetchMarkdown } from "./scripts/markdown.js";
import { auth } from "./scripts/auth.js";

function initializeAuth() {
    const userSession = sessionStorage.getItem("userSession");
    if (userSession) {
      document.getElementById("loginScreen").style.display = "none";
      document.getElementById("container").style.display = "block";
  
      fetchAndDisplayBrands();
      fetchAndDisplaySettings();
      fetchMarkdown();
    } else {
      document.getElementById("container").style.display = "none";
      document.getElementById("loginScreen").style.display = "flex";
    }
  }

function initializeListeners() {
  document.getElementById("loginBtn").addEventListener("click", auth);

  document
    .getElementById("createBrandForm")
    .addEventListener("submit", (e) => {
      e.preventDefault();

      createBrand(document.getElementById("number").value, document.getElementById("brand").value);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    initializeAuth();
    initializeListeners();

    document.getElementById("currentOrigin").innerText = window.location.origin;

    const currentTab = window.location.hash.replace("#", "");
    if (currentTab) {
        openTab(null, currentTab);
    } else {
        document.getElementById("defaultOpen").click();
    }
});
