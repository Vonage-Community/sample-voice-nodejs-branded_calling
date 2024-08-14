const md = markdownit();

export function fetchMarkdown() {
  fetch("/docs")
    .then((response) => response.text())
    .then((data) => {
        document.getElementById("markdownPage").innerHTML = md.render(data);
    })
    .catch((error) => {
      console.error("Error fetching API docs:", error);
    });
}
