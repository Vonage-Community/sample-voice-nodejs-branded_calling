export function fetchAndDisplaySettings() {
    fetch("/settings")
        .then((response) => response.json())
        .then(({ sip_trunk_link,  sip_uri, configured_correctly }) => {
            document.getElementById("sip-uri").innerText = sip_uri;
            document.getElementById('edit-sip-uri').style = "display:block";
            document.getElementById('edit-sip-uri').onclick = function () {
                window.open(sip_trunk_link, '_blank');
            }
            
            if (!configured_correctly) {
                const linkElement = document.createElement('a');
                linkElement.href = sip_trunk_link;
                linkElement.innerText = "⚠️ Your SIP Domain is not currently linked to this Vonage Application.";
                linkElement.target = "_blank";


                document.getElementById('config-warning').appendChild(linkElement)
                document.getElementById('config-warning').style = "display:block";
            }
        });
}