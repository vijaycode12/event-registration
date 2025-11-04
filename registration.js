document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const eventId = urlParams.get("id");
  const nameInput = document.getElementById("reg-name");
  const emailInput = document.getElementById("reg-email");
  const phoneInput = document.getElementById("reg-phone");
  const eventNameInput = document.getElementById("reg-event-name");
  const eventDateInput = document.getElementById("reg-event-date");
  const eventTimeInput = document.getElementById("reg-event-time");
  const eventLocationInput = document.getElementById("reg-event-location");
  const statusEl = document.getElementById("reg-status");
  const submitBtn = document.getElementById("reg-submit-btn");

  const backendUrl = window.BACKEND_URL;

  try {
    const userRes = await fetch(`${backendUrl}/api/v1/auth/me`, { credentials: "include" });
    const userData = await userRes.json();
    if (userData.success) {
      nameInput.value = userData.user.username || "";
      nameInput.readOnly = false;
      emailInput.value = userData.user.email || "";
      emailInput.readOnly = true;
      
    } else {
      statusEl.textContent = "Cannot fetch user info. Please login.";
    }
  } catch (_) {
    statusEl.textContent = "Cannot fetch user info. Please login.";
  }

  try {
    const eventRes = await fetch(`${backendUrl}/api/v1/event/${eventId}`);
    const eventJson = await eventRes.json();
    const event = eventJson.data;
    if (event) {
      eventNameInput.value = event.name || "";
      eventDateInput.value = event.date || "";
      eventTimeInput.value = event.time || "";
      eventLocationInput.value = event.location || "";
    } else {
      statusEl.textContent = "Event not found.";
    }
  } catch (_) {
    statusEl.textContent = "Error fetching event details.";
  }

  document.getElementById("registration-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    statusEl.textContent = "";
    submitBtn.disabled = true;
    submitBtn.textContent = "Registering...";

    const phone = phoneInput.value.trim();
    const name = nameInput.value.trim();

    if (!phone) {
      statusEl.textContent = "Please enter a phone number.";
      submitBtn.disabled = false;
      submitBtn.textContent = "Register";
      return;
    }

    try {
      const res = await fetch(`${backendUrl}/api/v1/register/${eventId}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone }),
      });

      const json = await res.json();

      if (json.success) {
        statusEl.textContent = "Registration successful! Confirmation sent to the mail";
        statusEl.style.color = "lightgreen";

        setTimeout(()=>{
            window.location.href=`eventDetails.html?id=${eventId}`;
        },3500);
      } else {
        statusEl.textContent = json.message || "Registration failed.";
        statusEl.style.color = "#e84a56";
      }
    } catch {
      statusEl.textContent = "Registration request failed.";
    }

    submitBtn.disabled = false;
    submitBtn.textContent = "Register";
  });
});
