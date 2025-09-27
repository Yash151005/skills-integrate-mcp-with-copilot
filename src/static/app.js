document.addEventListener("DOMContentLoaded", () => {
  fetch("/activities")
    .then((res) => res.json())
    .then((activities) => {
      const container = document.getElementById("activities-container");
      container.innerHTML = "";
      Object.entries(activities).forEach(([name, info]) => {
        const card = document.createElement("div");
        card.className = "activity-card";
        card.innerHTML = `
          <h2>${name}</h2>
          <p>${info.description}</p>
          <p><strong>Schedule:</strong> ${info.schedule}</p>
          <p class="participants"><strong>Participants (${info.participants.length}/${info.max_participants}):</strong> ${info.participants.join(", ")}</p>
          <button class="register-btn">Register Student</button>
        `;
        card.querySelector(".register-btn").onclick = () => {
          const email = prompt("Enter student email to register:");
          if (email) {
            fetch(`/activities/${encodeURIComponent(name)}/signup?email=${encodeURIComponent(email)}`, {
              method: "POST"
            })
              .then((res) => {
                if (!res.ok) return res.json().then((d) => { throw new Error(d.detail); });
                return res.json();
              })
              .then(() => {
                alert("Student registered!");
                location.reload();
              })
              .catch((err) => alert("Error: " + err.message));
          }
        };
        container.appendChild(card);
      });
    });
});