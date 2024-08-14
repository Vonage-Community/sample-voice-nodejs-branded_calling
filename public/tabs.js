function openTab(evt, tabName) {
    const tabContent = document.getElementsByClassName("tab-content");

    for (let i = 0; i < tabContent.length; i++) {
        tabContent[i].style.display = "none";
    }

    const tabLinks = document.getElementsByClassName("tab-links");
    for (let i = 0; i < tabLinks.length; i++) {
        tabLinks[i].className = tabLinks[i].className.replace(" active", "");
    }

    document.getElementById(tabName).style.display = "block";

    if (evt) {
        evt.currentTarget.className += " active";
    } else {
        Array.from(tabLinks).find((tab) =>
            tab.getAttribute("onclick").includes(tabName)
        ).className += " active";
    }

    window.location.hash = tabName;
}
