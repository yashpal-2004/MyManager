// Default pre-populated websites
const DEFAULT_SITES = [
  {
    name: "TrackerByMe",
    url: "https://trackerbyme.vercel.app",
    desc: "Personal tracker app to monitor daily tasks and stats.",
    tag: "Tools",
    theme: "var(--color-pink)"
  },
  {
    name: "5th Sem Notes",
    url: "https://yashpal-2004.github.io/5th_Sem_Notes/index.html",
    desc: "Curated collection of university notes for the 5th semester.",
    tag: "Notes",
    theme: "var(--color-yellow)"
  },
  {
    name: "My Fitness Hub",
    url: "https://my-fitness-hub-q63m.vercel.app/",
    desc: "Fitness logger and tracker for workouts and meal plans.",
    tag: "Fitness",
    theme: "var(--color-blue)"
  },
  {
    name: "DSA Sheet",
    url: "https://dsa-eight-delta.vercel.app/",
    desc: "Structured DSA questions and tracking platform.",
    tag: "DSA",
    theme: "var(--color-cyan)"
  },
  {
    name: "DSA Videos",
    url: "https://yashpal-2004.github.io/A2Z_DSA/",
    desc: "DSA reference videos repository for concept visualisations.",
    tag: "DSA",
    theme: "var(--color-orange)"
  },
  {
    name: "Journal",
    url: "https://journal-gamma-ashen.vercel.app/",
    desc: "Interactive personal online diary and thoughts tracker.",
    tag: "Personal",
    theme: "var(--color-purple)"
  },
  {
    name: "Excalidraw",
    url: "https://excalidraw.com",
    desc: "Virtual whiteboard for sketching diagrams and brainstorming.",
    tag: "Tools",
    theme: "var(--color-teal)"
  },
  {
    name: "Portfolio",
    url: "https://portfoliobyjs.vercel.app",
    desc: "Personal developer portfolio website showcasing projects and skills.",
    tag: "Personal",
    theme: "var(--color-pink)"
  }
];

// App State
let sites = [];
let currentFilter = "all";
let searchQuery = "";
const PROJECT_ICONS = ["globe-2", "layout-dashboard", "notebook-tabs", "book-open", "dumbbell", "activity", "brain", "code-2", "terminal", "graduation-cap", "briefcase-business", "user-round", "house", "heart", "star", "rocket", "lightbulb", "palette", "pen-tool", "camera", "music-2", "gamepad-2", "shopping-bag", "wallet", "calendar-days", "check-square", "chart-no-axes-combined", "database", "cloud", "wrench", "sparkles", "layers-2"];

function iconForSite(site) {
  if (site.icon && PROJECT_ICONS.includes(site.icon)) return site.icon;
  const text = `${site.name} ${site.tag}`.toLowerCase();
  if (/fitness|workout|gym|health/.test(text)) return "dumbbell";
  if (/note|journal|diary|book/.test(text)) return "notebook-tabs";
  if (/dsa|code|dev|program/.test(text)) return "code-2";
  if (/portfolio|personal/.test(text)) return "user-round";
  if (/tracker|task|tool/.test(text)) return "layout-dashboard";
  return "globe-2";
}

function renderIconPicker(selectedIcon = "globe-2") {
  const picker = document.getElementById("icon-picker");
  const iconInput = document.getElementById("site-icon");
  iconInput.value = selectedIcon;
  picker.innerHTML = PROJECT_ICONS.map(icon => `
    <button type="button" class="icon-choice ${icon === selectedIcon ? "selected" : ""}" data-icon="${icon}" aria-label="${icon.replaceAll("-", " ")}" aria-pressed="${icon === selectedIcon}">
      <i data-lucide="${icon}"></i>
    </button>
  `).join("");
  if (window.lucide) window.lucide.createIcons();
  picker.querySelectorAll(".icon-choice").forEach(button => button.addEventListener("click", () => {
    iconInput.value = button.dataset.icon;
    picker.querySelectorAll(".icon-choice").forEach(choice => {
      const isSelected = choice === button;
      choice.classList.toggle("selected", isSelected);
      choice.setAttribute("aria-pressed", String(isSelected));
    });
  }));
}

// DOM Elements
const sitesContainer = document.getElementById("sites-container");
const tagFilters = document.getElementById("tag-filters");
const searchBar = document.getElementById("search-bar");

// Modal Elements
const siteModal = document.getElementById("site-modal");
const siteForm = document.getElementById("site-form");
const addSiteBtn = document.getElementById("add-site-btn");
const modalCloseBtn = document.getElementById("modal-close-btn");
const modalTitle = document.getElementById("modal-title");
const siteIndexInput = document.getElementById("site-index");

// Stats Elements
const statTotal = document.getElementById("stat-total");
const statCategories = document.getElementById("stat-categories");

// Initialize Application
function init() {
  // Load sites from localStorage
  const savedSites = localStorage.getItem("hq_dashboard_websites");
  if (savedSites) {
    sites = JSON.parse(savedSites);
  } else {
    sites = [...DEFAULT_SITES];
    saveSitesToStorage();
  }



  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  renderFilters();
  renderSites();
  updateStats();
  setupEventListeners();
}

// Save functions
function saveSitesToStorage() {
  localStorage.setItem("hq_dashboard_websites", JSON.stringify(sites));
}

// Render dynamic tag filters based on sites categories
function renderFilters() {
  const uniqueTags = new Set(sites.map(site => site.tag));
  
  // Clear any dynamic tag buttons (keep "All")
  tagFilters.innerHTML = `<button class="filter-tag ${currentFilter === 'all' ? 'active' : ''}" data-tag="all">All</button>`;
  
  uniqueTags.forEach(tag => {
    if (tag) {
      const button = document.createElement("button");
      button.className = `filter-tag ${currentFilter === tag ? 'active' : ''}`;
      button.dataset.tag = tag;
      button.textContent = tag;
      tagFilters.appendChild(button);
    }
  });

  // Re-attach tag listeners
  document.querySelectorAll(".filter-tag").forEach(btn => {
    btn.addEventListener("click", (e) => {
      document.querySelectorAll(".filter-tag").forEach(b => b.classList.remove("active"));
      e.target.classList.add("active");
      currentFilter = e.target.dataset.tag;
      renderSites();
    });
  });
}

// Render Website Cards
function renderSites() {
  sitesContainer.innerHTML = "";

  const filteredSites = sites.filter(site => {
    const matchesTag = currentFilter === "all" || site.tag === currentFilter;
    const searchString = `${site.name} ${site.desc} ${site.tag}`.toLowerCase();
    const matchesSearch = searchString.includes(searchQuery.toLowerCase());
    return matchesTag && matchesSearch;
  });

  if (filteredSites.length === 0) {
    const countLabel = document.getElementById("project-count-label");
    if (countLabel) countLabel.textContent = "— 00";
    sitesContainer.innerHTML = `
      <div class="site-card" style="grid-column: 1 / -1; padding: 40px; text-align: center; border-color: var(--color-orange)">
        <h3 style="margin-bottom: 8px;">No Websites Found</h3>
        <p style="font-weight: 600; color: var(--text-muted);">Try a different query or add a new website to get started.</p>
      </div>
    `;
    return;
  }

  const countLabel = document.getElementById("project-count-label");
  if (countLabel) countLabel.textContent = `— ${String(filteredSites.length).padStart(2, "0")}`;

  filteredSites.forEach((site, index) => {
    // Find original index in master sites array
    const originalIndex = sites.indexOf(site);

    const card = document.createElement("div");
    card.className = "site-card animate-site-card";
    card.tabIndex = 0;
    card.setAttribute("role", "link");
    card.setAttribute("aria-label", `Open ${site.name}`);
    card.dataset.url = site.url;
    card.style.borderColor = site.theme || "var(--color-pink)";

    card.innerHTML = `
      <div class="card-header">
        <div class="project-menu-wrap">
          <button class="project-menu-btn" aria-label="Project options for ${site.name}" aria-haspopup="true" aria-expanded="false" data-index="${originalIndex}">
            <i data-lucide="more-horizontal" style="width: 18px; height: 18px;"></i>
          </button>
          <div class="project-menu" hidden>
            <button class="project-menu-item edit-site-btn" data-index="${originalIndex}"><i data-lucide="pencil" style="width:14px;height:14px"></i> Edit</button>
            <button class="project-menu-item delete-site-btn" data-index="${originalIndex}"><i data-lucide="trash-2" style="width:14px;height:14px"></i> Delete</button>
          </div>
        </div>
      </div>
      <div class="card-body">
        <span class="project-icon" aria-hidden="true"><i data-lucide="${iconForSite(site)}"></i></span>
        <h3 class="card-title">${site.name}</h3>
      </div>
    `;

    sitesContainer.appendChild(card);
  });

  // Re-create lucide icons for newly added HTML
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Animation using Motion library if loaded
  if (window.motion) {
    window.motion.animate(
      ".animate-site-card",
      { opacity: [0, 1], y: [24, 0] },
      { delay: window.motion.stagger(0.06), duration: 0.4, easing: "ease-out" }
    );
  }

  // Attach card specific event listeners
  document.querySelectorAll(".project-menu-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const menu = btn.nextElementSibling;
      const shouldOpen = menu.hidden;
      document.querySelectorAll(".project-menu").forEach(item => { item.hidden = true; });
      document.querySelectorAll(".project-menu-btn").forEach(item => item.setAttribute("aria-expanded", "false"));
      menu.hidden = !shouldOpen;
      btn.setAttribute("aria-expanded", String(shouldOpen));
    });
  });

  document.querySelectorAll(".edit-site-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const idx = e.currentTarget.dataset.index;
      openModalForEdit(idx);
    });
  });

  document.querySelectorAll(".delete-site-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const idx = e.currentTarget.dataset.index;
      deleteSite(idx);
    });
  });

  document.querySelectorAll(".site-card").forEach(card => {
    const openProject = () => window.open(card.dataset.url, "_blank", "noopener,noreferrer");
    card.addEventListener("click", (e) => {
      if (e.target.closest("button") || e.target.closest(".project-menu")) return;
      openProject();
    });
    card.addEventListener("keydown", (e) => {
      if (e.target !== card || !["Enter", " "].includes(e.key)) return;
      e.preventDefault();
      openProject();
    });
  });

}

document.addEventListener("click", (e) => {
  if (e.target.closest(".project-menu-wrap")) return;
  document.querySelectorAll(".project-menu").forEach(menu => { menu.hidden = true; });
  document.querySelectorAll(".project-menu-btn").forEach(btn => btn.setAttribute("aria-expanded", "false"));
});



// Stats calculations
function updateStats() {
  statTotal.textContent = sites.length;
  const categories = new Set(sites.map(site => site.tag));
  statCategories.textContent = categories.size;
}

// Event Listeners setup
function setupEventListeners() {
  // Search bar
  searchBar.addEventListener("input", (e) => {
    searchQuery = e.target.value;
    renderSites();
  });

  // Open Modal for Add
  addSiteBtn.addEventListener("click", () => {
    siteForm.reset();
    siteIndexInput.value = "";
    modalTitle.textContent = "Add Website";
    renderIconPicker("globe-2");
    siteModal.style.display = "flex";
    if (window.motion) {
      window.motion.animate(
        ".modal-content",
        { scale: [0.9, 1], opacity: [0, 1] },
        { duration: 0.25, easing: "ease-out" }
      );
    }
  });

  // Close Modal
  modalCloseBtn.addEventListener("click", closeModal);
  siteModal.addEventListener("click", (e) => {
    if (e.target === siteModal) closeModal();
  });

  // Submit Modal Form (Add/Edit)
  siteForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const index = siteIndexInput.value;
    const name = document.getElementById("site-name").value;
    const url = document.getElementById("site-url").value;
    const desc = document.getElementById("site-desc").value;
    const tag = document.getElementById("site-tag").value;
    const icon = document.getElementById("site-icon").value || "globe-2";
    const existingTheme = index !== "" ? sites[index].theme : undefined;
    const siteData = { name, url, desc, tag, icon, ...(existingTheme ? { theme: existingTheme } : {}) };

    if (index !== "") {
      // Edit
      sites[index] = siteData;
    } else {
      // Add
      sites.push(siteData);
    }

    saveSitesToStorage();
    closeModal();
    renderFilters();
    renderSites();
    updateStats();
  });
}

// Modal functions
function closeModal() {
  if (window.motion) {
    window.motion.animate(
      ".modal-content",
      { scale: [1, 0.9], opacity: [1, 0] },
      { duration: 0.2 }
    ).finished.then(() => {
      siteModal.style.display = "none";
    });
  } else {
    siteModal.style.display = "none";
  }
}

function openModalForEdit(index) {
  const site = sites[index];
  siteIndexInput.value = index;
  document.getElementById("site-name").value = site.name;
  document.getElementById("site-url").value = site.url;
  document.getElementById("site-desc").value = site.desc;
  document.getElementById("site-tag").value = site.tag;
  renderIconPicker(iconForSite(site));
  modalTitle.textContent = "Edit Website";
  siteModal.style.display = "flex";

  if (window.motion) {
    window.motion.animate(
      ".modal-content",
      { scale: [0.9, 1], opacity: [0, 1] },
      { duration: 0.25, easing: "ease-out" }
    );
  }
}

function deleteSite(index) {
  if (confirm(`Are you sure you want to delete ${sites[index].name}?`)) {
    sites.splice(index, 1);
    saveSitesToStorage();
    renderFilters();
    renderSites();
    updateStats();
  }
}

// Initialize on page load
window.addEventListener("DOMContentLoaded", init);
