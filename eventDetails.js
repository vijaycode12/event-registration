function getQueryParam(param) {
  return new URL(window.location.href).searchParams.get(param);
}

const backendUrl = window.BACKEND_URL;

document.addEventListener("DOMContentLoaded", async () => {
  const eventId = getQueryParam("id");
  const loadingDiv = document.getElementById("loading");
  const detailsBox = document.getElementById("event-details-box");

  if (!eventId) {
    loadingDiv.innerText = "No event selected.";
    return;
  }

  let res;
  try {
    res = await fetch(`${backendUrl}/api/v1/event/${eventId}`);
  } catch {
    loadingDiv.innerText = "Failed to contact server.";
    return;
  }
  const { data: event } = await res.json();

  if (!event) {
    loadingDiv.innerText = "Event not found.";
    return;
  }

  loadingDiv.style.display = "none";
  detailsBox.style.display = "flex";
  document.getElementById("event-img").src = event.image;
  document.getElementById("event-img").alt = event.name;
  document.getElementById("event-type").textContent = event.eventType
    ? event.eventType.charAt(0).toUpperCase() + event.eventType.slice(1)
    : "";
  document.getElementById("event-name").textContent = event.name;
  document.getElementById("event-time").textContent = event.time;
  document.getElementById("event-location").textContent = event.location;
  document.getElementById("event-desc").textContent = event.description;

  const registerBtn = document.getElementById("register-btn");
  registerBtn.onclick = async () => {
     window.location.href = `registration.html?id=${eventId}`;
  };
});
