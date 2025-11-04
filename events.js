function getQueryParam(param) {
  return new URL(window.location.href).searchParams.get(param);
}

// Utility to get pretty event type name
function prettyEventType(type) {
  if (!type) return "All Events";
  // Custom display for your event types
  const mapping = {
    marriage: "Marriage Events",
    concert: "Concert Events",
    corporate: "Corporate Events",
    private: "Private Events"
  };
  return mapping[type.toLowerCase()] || `${type.charAt(0).toUpperCase()}${type.slice(1)} Events`;
}

const backendUrl = window.BACKEND_URL;

document.addEventListener("DOMContentLoaded", () => {
  const eventType = getQueryParam("type") || "all";
  document.getElementById("event-type-title").textContent = prettyEventType(eventType);

  fetch(`${backendUrl}/api/v1/event?type=${eventType}`)
    .then((res) => res.json())
    .then(({ data }) => {
      const container = document.getElementById("events-list");
      container.innerHTML = "";
      if (!data.length) {
        container.innerHTML = "<p>No events found.</p>";
        return;
      }
      data.forEach((event) => {
        const div = document.createElement("div");
        div.className = "event-row";
        div.innerHTML = `
          <div class="event-image">
            <img src="${event.image}" alt="${event.name}" />
          </div>
          <div class="event-info">
            <h2 class="event-name">${event.name}</h2>
            <p class="event-meta">${event.date} • ${event.time} • ${event.location}</p>
            <p class="event-desc">${event.description}</p>
            <button class="details-btn" onclick="location.href='eventDetails.html?id=${event._id}'">View Details</button>
          </div>
        `;
        container.appendChild(div);
      });
    });
});
