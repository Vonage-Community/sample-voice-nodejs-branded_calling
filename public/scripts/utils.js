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

export const getCredentials = () => {
  const userSession = JSON.parse(sessionStorage.getItem("userSession"));

  if (userSession) {
    return {
      "X-API-Key": userSession.apiKey,
      "X-API-Secret": userSession.password,
    };
  }

  return {};
};