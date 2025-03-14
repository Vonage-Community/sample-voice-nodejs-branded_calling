import { fetchAndDisplayBrands } from "./brands-datagrid.js";
import { fetchAndDisplaySettings } from "./settings.js";
import { fetchMarkdown } from "./markdown.js";

export function auth () {
  var apiKey = document.getElementById("apiKey").value;
  var password = document.getElementById("password").value;
  var loginError = document.getElementById("loginError");

  fetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ api_key: apiKey, api_secret: password }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Login failed");
      }
      return response.json();
    })
    .then((data) => {
      if (data.success) {
        sessionStorage.setItem(
          "userSession",
          JSON.stringify({ apiKey, password })
        );
        document.getElementById("loginScreen").style.display = "none";
        document.getElementById("container").style.display = "block";
        fetchAndDisplayBrands();
        fetchAndDisplaySettings();
        fetchMarkdown();
      } else {
        loginError.innerText = "Invalid API Key or Secret";
      }
    })
    .catch((error) => {
      loginError.innerText = error.message;
    });
}


