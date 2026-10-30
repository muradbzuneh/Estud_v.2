const STORAGE_KEY = "estud-resources";

const form = document.getElementById("resource-form");
const list = document.getElementById("resource-list");

function loadResources() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveResources(resources) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(resources));
}

function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderResources() {
  const resources = loadResources();

  if (!resources.length) {
    list.innerHTML = "<li>No resources shared yet.</li>";
    return;
  }

  list.innerHTML = resources
    .map((resource) => {
      const safeTitle = escapeHtml(resource.title);
      const safeSubject = escapeHtml(resource.subject);
      const safeDescription = escapeHtml(resource.description);
      const safeSharedBy = escapeHtml(resource.sharedBy);
      const safeClaimedBy = escapeHtml(resource.claimedBy || "");
      const safeContact = escapeHtml(resource.claimContact || "");
      const safeLink = resource.link ? escapeHtml(resource.link) : "";
      const linkHtml = safeLink
        ? `<p class="resource-meta">Link: <a href="${safeLink}" target="_blank" rel="noopener noreferrer">${safeLink}</a></p>`
        : "";

      const claimSection = resource.claimed
        ? `<p class="claimed">Claimed by ${safeClaimedBy} (${safeContact})</p>`
        : `<form class="claim-form" data-id="${resource.id}">
            <input name="claimer" maxlength="60" required placeholder="Fresh student name" />
            <input name="contact" maxlength="100" required placeholder="Contact" />
            <button type="submit">Claim</button>
          </form>`;

      return `<li class="resource-item">
          <h3>${safeTitle}</h3>
          <p class="resource-meta"><strong>Subject:</strong> ${safeSubject}</p>
          <p>${safeDescription}</p>
          ${linkHtml}
          <p class="resource-meta"><strong>Shared by:</strong> ${safeSharedBy}</p>
          ${claimSection}
        </li>`;
    })
    .join("");
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const resource = {
    id: crypto.randomUUID(),
    title: formData.get("title").toString().trim(),
    subject: formData.get("subject").toString().trim(),
    description: formData.get("description").toString().trim(),
    link: formData.get("link").toString().trim(),
    sharedBy: formData.get("sharedBy").toString().trim(),
    claimed: false,
    claimedBy: "",
    claimContact: "",
  };

  if (!resource.title || !resource.subject || !resource.description || !resource.sharedBy) {
    return;
  }

  const resources = loadResources();
  resources.unshift(resource);
  saveResources(resources);

  form.reset();
  renderResources();
});

list.addEventListener("submit", (event) => {
  if (!(event.target instanceof HTMLFormElement)) {
    return;
  }

  event.preventDefault();
  const claimForm = event.target;
  if (!claimForm.classList.contains("claim-form")) {
    return;
  }

  const id = claimForm.dataset.id;
  const formData = new FormData(claimForm);
  const claimer = formData.get("claimer").toString().trim();
  const contact = formData.get("contact").toString().trim();

  if (!id || !claimer || !contact) {
    return;
  }

  const resources = loadResources().map((resource) => {
    if (resource.id !== id || resource.claimed) {
      return resource;
    }

    return {
      ...resource,
      claimed: true,
      claimedBy: claimer,
      claimContact: contact,
    };
  });

  saveResources(resources);
  renderResources();
});

renderResources();
