/**
 * ============================================================================
 * RESUME BUILDER 2.0 — MASTER APPLICATION CONTROLLER
 * Handles global UI, dynamic auth navigation, modals, toasts, & dashboard
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initGlobalUI();
});

/**
 * Initialize Global App UI
 */
function initGlobalUI() {
  initTheme();
  setupDynamicNav();
  setupModals();
  initDashboard();
  initTemplatesCatalog();
}

/**
 * Theme Management (Light / Dark)
 */
function initTheme() {
  const savedTheme = localStorage.getItem('rb_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  const themeToggleBtn = document.getElementById('themeToggleBtn');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('rb_theme', next);
      updateThemeIcon(next);
    });
  }
}

function updateThemeIcon(theme) {
  const icon = document.getElementById('themeIcon');
  if (icon) {
    icon.className = theme === 'light' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
  }
}

/**
 * Dynamic Header & Navigation (Auth-Aware)
 */
function setupDynamicNav() {
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('mobile-open');
    });
  }

  // Header scroll shadow
  window.addEventListener('scroll', () => {
    const header = document.querySelector('.app-header');
    if (header) {
      if (window.scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  });

  // Render Auth Actions in Header
  renderNavAuth();
}

function renderNavAuth() {
  const navActions = document.querySelector('.nav-actions');
  if (!navActions) return;

  // On the studio page, keep the studio-specific toolbar
  if (document.body.classList.contains('builder-page') || document.getElementById('saveStatusIndicator')) {
    initTheme();
    return;
  }

  const user = StorageService.getUserSession();
  const themeToggleBtn = document.getElementById('themeToggleBtn');

  // Preserve theme toggle button
  let themeBtnHTML = `
    <button class="btn btn-secondary btn-icon" id="themeToggleBtn" title="Toggle Light/Dark Mode">
      <i class="fa-solid ${document.documentElement.getAttribute('data-theme') === 'light' ? 'fa-moon' : 'fa-sun'}" id="themeIcon"></i>
    </button>
  `;

  if (user) {
    // Logged-in state
    const userFirstName = user.name ? user.name.split(' ')[0] : 'User';
    navActions.innerHTML = `
      ${themeBtnHTML}
      <div class="user-menu-dropdown" style="position: relative; display: inline-block;">
        <button type="button" class="btn btn-secondary btn-sm" id="userMenuToggleBtn" style="display: inline-flex; align-items: center; gap: 8px;">
          <img src="${user.avatar || 'photo/user.png'}" style="width: 22px; height: 22px; border-radius: 50%; object-fit: cover;" alt="${user.name}" onerror="this.src='https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'">
          <span style="max-width: 110px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${userFirstName}</span>
          <i class="fa-solid fa-chevron-down" style="font-size: 0.7rem; color: var(--text-muted);"></i>
        </button>
        <div id="userDropdownMenu" class="glass-card" style="display: none; position: absolute; right: 0; top: calc(100% + 8px); width: 220px; padding: 8px; border-radius: var(--radius-md); box-shadow: 0 15px 35px rgba(0,0,0,0.4); z-index: 1000;">
          <div style="padding: 10px 12px; border-bottom: 1px solid var(--border-subtle); margin-bottom: 6px;">
            <div style="font-weight: 700; font-size: 0.9rem; color: var(--text-primary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${user.name}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${user.email}</div>
          </div>
          <a href="dashboard.html" class="btn btn-ghost btn-sm" style="width: 100%; justify-content: flex-start; text-align: left; padding: 8px 12px; font-size: 0.85rem;"><i class="fa-solid fa-folder-open" style="width: 20px;"></i> My Resumes</a>
          <a href="builder.html" class="btn btn-ghost btn-sm" style="width: 100%; justify-content: flex-start; text-align: left; padding: 8px 12px; font-size: 0.85rem;"><i class="fa-solid fa-pen-nib" style="width: 20px;"></i> Resume Studio</a>
          <a href="settings.html" class="btn btn-ghost btn-sm" style="width: 100%; justify-content: flex-start; text-align: left; padding: 8px 12px; font-size: 0.85rem;"><i class="fa-solid fa-gear" style="width: 20px;"></i> Account Settings</a>
          <div style="height: 1px; background: var(--border-subtle); margin: 6px 0;"></div>
          <button type="button" class="btn btn-ghost btn-sm" onclick="handleLogout()" style="width: 100%; justify-content: flex-start; text-align: left; padding: 8px 12px; font-size: 0.85rem; color: var(--accent-coral);"><i class="fa-solid fa-arrow-right-from-bracket" style="width: 20px;"></i> Sign Out</button>
        </div>
      </div>
      <a href="builder.html" class="btn btn-primary btn-sm">
        <i class="fa-solid fa-bolt"></i> Open Studio
      </a>
    `;

    // Dropdown toggle event
    const menuBtn = document.getElementById('userMenuToggleBtn');
    const menuDropdown = document.getElementById('userDropdownMenu');
    if (menuBtn && menuDropdown) {
      menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        menuDropdown.style.display = menuDropdown.style.display === 'none' ? 'block' : 'none';
      });
      document.addEventListener('click', (e) => {
        if (!menuDropdown.contains(e.target) && e.target !== menuBtn) {
          menuDropdown.style.display = 'none';
        }
      });
    }
  } else {
    // Logged-out state
    navActions.innerHTML = `
      ${themeBtnHTML}
      <a href="login.html" class="btn btn-ghost btn-sm">
        <i class="fa-solid fa-arrow-right-to-bracket"></i> Sign In
      </a>
      <a href="login.html?tab=signup" class="btn btn-primary btn-sm">
        <i class="fa-solid fa-user-plus"></i> Get Started
      </a>
    `;
  }

  // Re-bind theme button listener
  initTheme();
}

function handleLogout() {
  if (confirm('Are you sure you want to sign out?')) {
    StorageService.logoutUser();
  }
}

/**
 * Toast Notifications System
 */
function showToast(message, type = 'info') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  let icon = 'fa-circle-info';
  if (type === 'success') icon = 'fa-circle-check';
  if (type === 'error') icon = 'fa-circle-exclamation';

  toast.innerHTML = `
    <i class="fa-solid ${icon}"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

/**
 * Modal System
 */
function setupModals() {
  document.querySelectorAll('[data-modal-target]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-modal-target');
      openModal(targetId);
    });
  });

  document.querySelectorAll('.modal-close-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-backdrop');
      if (modal) closeModal(modal.id);
    });
  });

  document.querySelectorAll('.modal-backdrop').forEach((backdrop) => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        closeModal(backdrop.id);
      }
    });
  });
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add('active');
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('active');
}

/**
 * Dashboard Page Initialization (`dashboard.html`)
 */
function initDashboard() {
  const resumesGrid = document.getElementById('resumesGrid');
  if (!resumesGrid) return;

  // Enforce authentication guard
  if (!StorageService.requireAuth('dashboard.html')) {
    return;
  }

  const user = StorageService.getUserSession();
  const welcomeUserEl = document.getElementById('dashboardUserGreeting');
  if (welcomeUserEl && user) {
    welcomeUserEl.textContent = `Welcome back, ${user.name}!`;
  }

  renderDashboardCards();

  // Search input
  const searchInput = document.getElementById('searchResumesInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase();
      renderDashboardCards(term);
    });
  }

  // JSON Import Handler
  const importInput = document.getElementById('dashboardImportJson');
  if (importInput) {
    importInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        StorageService.importFromJSON(file, (success, result) => {
          if (success) {
            showToast('Resume imported successfully into your vault!', 'success');
            renderDashboardCards();
          } else {
            showToast(result || 'Failed to import resume.', 'error');
          }
        });
      }
    });
  }
}

function renderDashboardCards(filterTerm = '') {
  const resumesGrid = document.getElementById('resumesGrid');
  if (!resumesGrid) return;

  const resumes = StorageService.getAllResumes();
  const filtered = resumes.filter(
    (r) => (r.title || '').toLowerCase().includes(filterTerm) || (r.personalInfo?.fullName || '').toLowerCase().includes(filterTerm)
  );

  let cardsHTML = `
    <!-- Create New Resume Card -->
    <div class="glass-card flex-center" style="min-height: 260px; cursor: pointer; border: 2px dashed var(--border-medium); flex-direction: column; gap: 14px; text-align: center; padding: 24px; transition: all 0.2s ease;" onclick="handleCreateNewResume()">
      <div style="width: 54px; height: 54px; border-radius: 50%; background: var(--accent-gradient); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 1.4rem; box-shadow: 0 0 20px rgba(79,125,249,0.4);">
        <i class="fa-solid fa-plus"></i>
      </div>
      <div>
        <h3 style="font-size: 1.15rem; margin-bottom: 4px;">Create New Resume</h3>
        <p style="font-size: 0.85rem; color: var(--text-muted);">Start from a fresh blank canvas</p>
      </div>
    </div>
  `;

  if (filtered.length > 0) {
    cardsHTML += filtered
      .map((r) => {
        let atsScore = 85;
        if (typeof ATSScanner !== 'undefined' && ATSScanner.analyze) {
          atsScore = ATSScanner.analyze(r).score;
        }
        const updatedDate = r.updatedAt ? new Date(r.updatedAt).toLocaleDateString() : 'Recently';

        return `
        <div class="glass-card" style="padding: 24px; display: flex; flex-direction: column; justify-content: space-between; min-height: 260px; position: relative;">
          <div>
            <div class="flex-between" style="margin-bottom: 12px;">
              <span class="badge badge-primary" style="text-transform: none; font-size: 0.75rem;">${r.template || 'Modern Tech'}</span>
              <span class="badge badge-emerald" style="font-size: 0.75rem;"><i class="fa-solid fa-shield-halved"></i> ATS ${atsScore}%</span>
            </div>
            <h3 style="font-size: 1.2rem; margin-bottom: 6px; color: var(--text-primary);">${r.title || 'Untitled Resume'}</h3>
            <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 12px;">${r.personalInfo?.fullName || 'No Name'} · ${r.personalInfo?.jobTitle || 'General'}</p>
            <div style="font-size: 0.8rem; color: var(--text-muted);"><i class="fa-regular fa-clock"></i> Updated: ${updatedDate}</div>
          </div>

          <div style="display: flex; gap: 8px; margin-top: 20px; border-top: 1px solid var(--border-subtle); padding-top: 16px;">
            <button class="btn btn-primary btn-sm" style="flex: 1;" onclick="handleEditResume('${r.id}')"><i class="fa-solid fa-pen-to-square"></i> Edit</button>
            <button class="btn btn-secondary btn-sm btn-icon" title="Duplicate" onclick="handleDuplicateResume('${r.id}')"><i class="fa-solid fa-copy"></i></button>
            <button class="btn btn-secondary btn-sm btn-icon" title="Export Backup" onclick="handleExportResume('${r.id}')"><i class="fa-solid fa-download"></i></button>
            <button class="btn btn-ghost btn-sm btn-icon" title="Delete" style="color: var(--accent-coral);" onclick="handleDeleteResume('${r.id}')"><i class="fa-solid fa-trash-can"></i></button>
          </div>
        </div>
      `;
      })
      .join('');
  }

  resumesGrid.innerHTML = cardsHTML;
}

function handleCreateNewResume() {
  if (!StorageService.requireAuth('builder.html')) return;

  const user = StorageService.getUserSession();
  const title = user ? `${user.name}'s New Resume` : 'My New Resume';
  const newResume = StorageService.createNewResume(title);
  StorageService.setActiveResumeId(newResume.id);
  window.location.href = 'builder.html';
}

function handleEditResume(id) {
  if (!StorageService.requireAuth('builder.html')) return;
  StorageService.setActiveResumeId(id);
  window.location.href = 'builder.html';
}

function handleDuplicateResume(id) {
  const copy = StorageService.duplicateResume(id);
  if (copy) {
    showToast('Resume duplicated successfully in your vault!', 'success');
    renderDashboardCards();
  }
}

function handleExportResume(id) {
  const resume = StorageService.getResumeById(id);
  if (resume) {
    StorageService.exportAsJSON(resume);
    showToast('Backup JSON downloaded!', 'success');
  }
}

function handleDeleteResume(id) {
  if (confirm('Are you sure you want to delete this resume from your private vault?')) {
    StorageService.deleteResume(id);
    showToast('Resume deleted from your vault.', 'info');
    renderDashboardCards();
  }
}

/**
 * Templates Catalog Page (`templates.html`)
 */
function initTemplatesCatalog() {
  const filterBtns = document.querySelectorAll('.template-filter-btn');
  const templateCards = document.querySelectorAll('.template-preview-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const cat = btn.dataset.category;
      templateCards.forEach((card) => {
        if (cat === 'all' || card.dataset.category === cat) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

function useTemplate(tplId) {
  if (!StorageService.requireAuth(`builder.html?template=${tplId}`)) {
    return;
  }

  const active = StorageService.getActiveResume();
  if (active) {
    active.template = tplId;
    StorageService.saveResume(active);
  } else {
    const fresh = StorageService.createNewResume('My Tailored Resume', tplId);
    StorageService.setActiveResumeId(fresh.id);
  }
  window.location.href = 'builder.html';
}
