export function showError(message) {
  const modal = document.getElementById("errorModal");
  const okBtn = document.getElementById("errorOk");
  const errorMessage = document.getElementById("errMessage");

  errorMessage.innerText = message;
  modal.style.display = "flex";

  okBtn.onclick = function () {
    errorMessage.innerText = "";
    modal.style.display = "none";
  };
}