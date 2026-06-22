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
    // Sync the new Portfolio website to localStorage if it's missing
    if (!sites.some(s => s.url.includes("portfoliobyjs.vercel.app"))) {
      sites.push({
        name: "Portfolio",
        url: "https://portfoliobyjs.vercel.app",
        desc: "Personal developer portfolio website showcasing projects and skills.",
        tag: "Personal",
        theme: "var(--color-pink)"
      });
      saveSitesToStorage();
    }
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
    sitesContainer.innerHTML = `
      <div class="site-card" style="grid-column: 1 / -1; padding: 40px; text-align: center; border-color: var(--color-orange)">
        <h3 style="margin-bottom: 8px;">No Websites Found</h3>
        <p style="font-weight: 600; color: var(--text-muted);">Try a different query or add a new website to get started.</p>
      </div>
    `;
    return;
  }

  filteredSites.forEach((site, index) => {
    // Find original index in master sites array
    const originalIndex = sites.indexOf(site);

    const card = document.createElement("div");
    card.className = "site-card animate-site-card";
    card.style.borderColor = site.theme || "var(--color-pink)";

    card.innerHTML = `
      <div class="card-header" style="background-color: ${site.theme || 'var(--color-pink)'}">
        <div>
          <span class="card-tag">${site.tag}</span>
        </div>
        <div style="display: flex; gap: 8px;">
          <button class="btn btn-icon-only edit-site-btn" data-index="${originalIndex}" style="padding: 6px; box-shadow: 2px 2px 0px #000; font-size: 0.8rem; border-width: 2px;">
            <i data-lucide="edit-2" style="width: 14px; height: 14px;"></i>
          </button>
          <button class="btn btn-icon-only btn-danger delete-site-btn" data-index="${originalIndex}" style="padding: 6px; box-shadow: 2px 2px 0px #000; font-size: 0.8rem; border-width: 2px;">
            <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
          </button>
        </div>
      </div>
      <div class="card-body">
        <h3 class="card-title">${site.name}</h3>
        <p class="card-desc">${site.desc}</p>
      </div>
      <div class="card-footer">
        <a href="${site.url}" target="_blank" class="btn btn-primary" style="width: 100%;">
          Open Website <i data-lucide="external-link" style="width: 16px; height: 16px;"></i>
        </a>
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
  document.querySelectorAll(".edit-site-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const idx = e.currentTarget.dataset.index;
      openModalForEdit(idx);
    });
  });

  document.querySelectorAll(".delete-site-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const idx = e.currentTarget.dataset.index;
      deleteSite(idx);
    });
  });
}



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
    const theme = document.getElementById("site-theme").value;

    const siteData = { name, url, desc, tag, theme };

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
  document.getElementById("site-theme").value = site.theme || "var(--color-pink)";

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
