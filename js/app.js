/**
 * ============================================================================
 * RESUME BUILDER 2.0 — MASTER APPLICATION CONTROLLER
 * Handles global UI, navigation, dark/light theme, toasts, modals, & dashboard
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
  setupNav();
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
 * Header & Mobile Navigation
 */
function setupNav() {
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

  // User Profile Status in Nav
  const user = StorageService.getUserSession();
  const navUserName = document.getElementById('navUserName');
  const navUserAvatar = document.getElementById('navUserAvatar');
  if (user) {
    if (navUserName) navUserName.textContent = user.name || user.username || 'User';
    if (navUserAvatar && user.avatar) navUserAvatar.src = user.avatar;
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

  renderDashboardCards();

  // Search input
  const searchInput = document.getElementById('searchResumesInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase();
      renderDashboardCards(term);
    });
  }
}

function renderDashboardCards(filterTerm = '') {
  const resumesGrid = document.getElementById('resumesGrid');
  if (!resumesGrid) return;

  const resumes = StorageService.getAllResumes();
  const filtered = resumes.filter((r) => (r.title || '').toLowerCase().includes(filterTerm) || (r.personalInfo?.fullName || '').toLowerCase().includes(filterTerm));

  let cardsHTML = `
    <!-- Create New Resume Card -->
    <div class="glass-card flex-center" style="min-height:260px; cursor:pointer; border:2px dashed var(--border-medium); flex-direction:column; gap:14px; text-align:center; padding:24px;" onclick="handleCreateNewResume()">
      <div style="width:54px; height:54px; border-radius:50%; background:var(--accent-gradient); display:flex; align-items:center; justify-content:center; color:#fff; font-size:1.4rem; box-shadow:0 0 20px rgba(79,125,249,0.4);">
        <i class="fa-solid fa-plus"></i>
      </div>
      <div>
        <h3 style="font-size:1.15rem; margin-bottom:4px;">Create New Resume</h3>
        <p style="font-size:0.85rem; color:var(--text-muted);">Start from a blank canvas or template</p>
      </div>
    </div>
  `;

  if (filtered.length > 0) {
    cardsHTML += filtered
      .map((r) => {
        const atsResult = ATSScanner.analyze(r);
        const updatedDate = r.updatedAt ? new Date(r.updatedAt).toLocaleDateString() : 'Recently';

        return `
        <div class="glass-card" style="padding:24px; display:flex; flex-direction:column; justify-content:space-between; min-height:260px; position:relative;">
          <div>
            <div class="flex-between" style="margin-bottom:12px;">
              <span class="badge badge-primary" style="text-transform:none; font-size:0.75rem;">${r.template || 'Modern Tech'}</span>
              <span class="badge badge-emerald" style="font-size:0.75rem;"><i class="fa-solid fa-shield-halved"></i> ATS ${atsResult.score}%</span>
            </div>
            <h3 style="font-size:1.2rem; margin-bottom:6px; color:var(--text-primary);">${r.title || 'Untitled Resume'}</h3>
            <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:12px;">${r.personalInfo?.fullName || 'No Name'} · ${r.personalInfo?.jobTitle || 'No Title'}</p>
            <div style="font-size:0.8rem; color:var(--text-muted);"><i class="fa-regular fa-clock"></i> Updated: ${updatedDate}</div>
          </div>

          <div style="display:flex; gap:8px; margin-top:20px; border-top:1px solid var(--border-subtle); padding-top:16px;">
            <button class="btn btn-primary btn-sm" style="flex:1;" onclick="handleEditResume('${r.id}')"><i class="fa-solid fa-pen-to-square"></i> Edit</button>
            <button class="btn btn-secondary btn-sm btn-icon" title="Duplicate" onclick="handleDuplicateResume('${r.id}')"><i class="fa-solid fa-copy"></i></button>
            <button class="btn btn-secondary btn-sm btn-icon" title="Export Backup" onclick="handleExportResume('${r.id}')"><i class="fa-solid fa-download"></i></button>
            <button class="btn btn-ghost btn-sm btn-icon" title="Delete" style="color:var(--accent-coral);" onclick="handleDeleteResume('${r.id}')"><i class="fa-solid fa-trash-can"></i></button>
          </div>
        </div>
      `;
      })
      .join('');
  }

  resumesGrid.innerHTML = cardsHTML;
}

function handleCreateNewResume() {
  const newResume = StorageService.createNewResume('My New Resume');
  StorageService.setActiveResumeId(newResume.id);
  window.location.href = 'builder.html';
}

function handleEditResume(id) {
  StorageService.setActiveResumeId(id);
  window.location.href = 'builder.html';
}

function handleDuplicateResume(id) {
  const copy = StorageService.duplicateResume(id);
  if (copy) {
    showToast('Resume duplicated successfully!', 'success');
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
  if (confirm('Are you sure you want to delete this resume?')) {
    StorageService.deleteResume(id);
    showToast('Resume deleted.', 'info');
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
  const active = StorageService.getActiveResume();
  active.template = tplId;
  StorageService.saveResume(active);
  window.location.href = 'builder.html';
}
