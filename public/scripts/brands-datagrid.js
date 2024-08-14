import { showError } from "./utils.js";

export function fetchAndDisplayBrands() {
  const url = "/brands";

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const tableBody = document
        .getElementById("brand-table")
        .getElementsByTagName("tbody")[0];
      tableBody.innerHTML = "";
      if (data.length === 0) {
        let row = tableBody.insertRow();
        let cell = row.insertCell(0);
        cell.colSpan = 2;
        cell.innerText = "No data";
        cell.style.textAlign = "center";
      } else {
        data.forEach((item) => {
          let row = tableBody.insertRow();
          const detailsRow = tableBody.insertRow();
          detailsRow.style.display = "none";

          row.insertCell(0).innerText = item.number;
          row.insertCell(1).innerText = item.brand;

          let removeButton = document.createElement("button");
          removeButton.innerText = "Delete";
          removeButton.className = "btn btn-outline-danger btn-sm";
          removeButton.onclick = function () {
            removeBrand(item);
          };
          row.insertCell(2).appendChild(removeButton);
        });
      }
    })
    .catch((error) => {
      console.error("Error fetching brands:", error);
    });
}

export function createBrand(number, brand) {
  const url = "/brands";

  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ number: number, brand: brand })
  }).then(() => {
    document.getElementById("number").value = "";
    document.getElementById("brand").value = "";
    fetchAndDisplayBrands()
  }).catch((error) => {
    console.error("Error creating brand:", error);
  });
}

export function deleteBrand(item) {
  fetch("/brands", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ number: item.number })
  }).then(() => {
    fetchAndDisplayBrands()
  }).catch((error) => {
    console.error("Error deleting brand:", error);
    showError("Error deleting brand")
  });
}

function removeBrand(item) {
  const modal = document.getElementById("confirmModal");
  const confirmRemoveBtn = document.getElementById("confirmRemove");
  const cancelRemoveBtn = document.getElementById("cancelRemove");

  modal.style.display = "flex";

  confirmRemoveBtn.onclick = function () {
    deleteBrand(item);
    modal.style.display = "none";
  };

  cancelRemoveBtn.onclick = function () {
    modal.style.display = "none";
  };
}