/**
 * ============================================================================
 * RESUME BUILDER 2.0 — LIVE STUDIO CONTROLLER
 * Handles split-screen live syncing, repeaters, customizations, ATS, & PDF export
 * ============================================================================
 */

let activeResume = null;
let zoomLevel = 1.0;
let autoSaveTimer = null;

document.addEventListener('DOMContentLoaded', () => {
  initStudio();
});

/**
 * Initialize Studio
 */
function initStudio() {
  // Load Active Resume or Sample
  activeResume = StorageService.getActiveResume();
  if (!activeResume) {
    activeResume = StorageService.getSampleData();
  }

  // Populate Form Fields
  populateForm(activeResume);

  // Initial Live Preview Render
  updateLivePreview();

  // Setup Event Listeners
  setupFormListeners();
  setupCustomizationListeners();
  setupZoomControls();
  setupExportControls();
  setupTabNavigation();

  // Update ATS Score
  updateATSScore();
}

/**
 * Populate all form inputs from resume state
 */
function populateForm(data) {
  if (!data) return;

  // Title
  const titleInput = document.getElementById('resumeTitleInput');
  if (titleInput) titleInput.value = data.title || 'My Professional Resume';

  // Personal Info
  const p = data.personalInfo || {};
  setVal('fullName', p.fullName);
  setVal('jobTitle', p.jobTitle);
  setVal('email', p.email);
  setVal('phone', p.phone);
  setVal('location', p.location);
  setVal('website', p.website);
  setVal('linkedin', p.linkedin);
  setVal('github', p.github);

  // Summary
  setVal('summary', data.summary);

  // Skills
  const s = data.skills || {};
  setVal('skillsLanguages', s.languages);
  setVal('skillsFrontend', s.frontend);
  setVal('skillsTools', s.tools);
  setVal('skillsSecurity', s.security);

  // Repeaters
  renderExperienceList(data.experience || []);
  renderEducationList(data.education || []);
  renderProjectsList(data.projects || []);
  renderCertificationsList(data.certifications || []);
  renderLanguagesList(data.languages || []);

  // Customizer Controls
  setVal('templateSelect', data.template || 'tpl-modern-tech');
  setVal('fontSelect', data.fontFamily || "'Plus Jakarta Sans', sans-serif");
  setVal('fontSizeSelect', data.fontSize || '9.5pt');

  // Photo settings
  if (data.photoUrl) {
    const previewImg = document.getElementById('avatarImgPreview');
    if (previewImg) previewImg.src = data.photoUrl;
  }
}

/**
 * Helper to set value
 */
function setVal(id, val) {
  const el = document.getElementById(id);
  if (el) el.value = val || '';
}

/**
 * Setup live typing listeners on form inputs
 */
function setupFormListeners() {
  const inputs = document.querySelectorAll('.sync-input');
  inputs.forEach((input) => {
    input.addEventListener('input', () => {
      syncFormDataToState();
      updateLivePreview();
      triggerAutoSave();
      updateATSScore();
    });
  });

  // Avatar Upload Listener
  const avatarFileInput = document.getElementById('avatarFileInput');
  if (avatarFileInput) {
    avatarFileInput.addEventListener('change', function (e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (evt) {
          activeResume.photoUrl = evt.target.result;
          const previewImg = document.getElementById('avatarImgPreview');
          if (previewImg) previewImg.src = evt.target.result;
          updateLivePreview();
          triggerAutoSave();
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Remove Avatar
  const removeAvatarBtn = document.getElementById('removeAvatarBtn');
  if (removeAvatarBtn) {
    removeAvatarBtn.addEventListener('click', () => {
      activeResume.photoUrl = '';
      const previewImg = document.getElementById('avatarImgPreview');
      if (previewImg) previewImg.src = 'photo/user.png';
      updateLivePreview();
      triggerAutoSave();
    });
  }
}

/**
 * Sync form DOM values back to activeResume state object
 */
function syncFormDataToState() {
  if (!activeResume) return;

  const titleInput = document.getElementById('resumeTitleInput');
  if (titleInput) activeResume.title = titleInput.value;

  activeResume.personalInfo = {
    fullName: document.getElementById('fullName')?.value || '',
    jobTitle: document.getElementById('jobTitle')?.value || '',
    email: document.getElementById('email')?.value || '',
    phone: document.getElementById('phone')?.value || '',
    location: document.getElementById('location')?.value || '',
    website: document.getElementById('website')?.value || '',
    linkedin: document.getElementById('linkedin')?.value || '',
    github: document.getElementById('github')?.value || '',
  };

  activeResume.summary = document.getElementById('summary')?.value || '';

  activeResume.skills = {
    languages: document.getElementById('skillsLanguages')?.value || '',
    frontend: document.getElementById('skillsFrontend')?.value || '',
    tools: document.getElementById('skillsTools')?.value || '',
    security: document.getElementById('skillsSecurity')?.value || '',
  };

  // Sync Experience
  activeResume.experience = collectRepeaterItems('exp-item', (el) => ({
    id: el.dataset.id || 'exp_' + Math.random(),
    role: el.querySelector('.exp-role')?.value || '',
    company: el.querySelector('.exp-company')?.value || '',
    location: el.querySelector('.exp-location')?.value || '',
    startDate: el.querySelector('.exp-start')?.value || '',
    endDate: el.querySelector('.exp-end')?.value || '',
    current: el.querySelector('.exp-current')?.checked || false,
    description: el.querySelector('.exp-desc')?.value || '',
  }));

  // Sync Education
  activeResume.education = collectRepeaterItems('edu-item', (el) => ({
    id: el.dataset.id || 'edu_' + Math.random(),
    degree: el.querySelector('.edu-degree')?.value || '',
    institution: el.querySelector('.edu-institution')?.value || '',
    location: el.querySelector('.edu-location')?.value || '',
    startDate: el.querySelector('.edu-start')?.value || '',
    endDate: el.querySelector('.edu-end')?.value || '',
    gpa: el.querySelector('.edu-gpa')?.value || '',
    details: el.querySelector('.edu-details')?.value || '',
  }));

  // Sync Projects
  activeResume.projects = collectRepeaterItems('proj-item', (el) => ({
    id: el.dataset.id || 'proj_' + Math.random(),
    title: el.querySelector('.proj-title')?.value || '',
    role: el.querySelector('.proj-role')?.value || '',
    techStack: el.querySelector('.proj-tech')?.value || '',
    link: el.querySelector('.proj-link')?.value || '',
    github: el.querySelector('.proj-github')?.value || '',
    description: el.querySelector('.proj-desc')?.value || '',
  }));

  // Sync Certifications
  activeResume.certifications = collectRepeaterItems('cert-item', (el) => ({
    id: el.dataset.id || 'cert_' + Math.random(),
    name: el.querySelector('.cert-name')?.value || '',
    issuer: el.querySelector('.cert-issuer')?.value || '',
    date: el.querySelector('.cert-date')?.value || '',
    credentialId: el.querySelector('.cert-id')?.value || '',
  }));

  // Sync Languages
  activeResume.languages = collectRepeaterItems('lang-item', (el) => ({
    id: el.dataset.id || 'lang_' + Math.random(),
    name: el.querySelector('.lang-name')?.value || '',
    fluency: el.querySelector('.lang-fluency')?.value || '',
  }));
}

function collectRepeaterItems(className, mapFn) {
  const elements = document.querySelectorAll('.' + className);
  const results = [];
  elements.forEach((el) => {
    results.push(mapFn(el));
  });
  return results;
}

/**
 * Render Live Preview into the right pane
 */
function updateLivePreview() {
  const container = document.getElementById('resumePaper');
  if (!container || !activeResume) return;

  const html = TemplateEngine.render(activeResume);
  container.innerHTML = html;
}

/**
 * Trigger Auto-Save with debounce
 */
function triggerAutoSave() {
  clearTimeout(autoSaveTimer);
  const statusEl = document.getElementById('saveStatusIndicator');
  if (statusEl) statusEl.textContent = 'Saving...';

  autoSaveTimer = setTimeout(() => {
    StorageService.saveResume(activeResume);
    if (statusEl) {
      const now = new Date();
      statusEl.textContent = `Saved at ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
  }, 400);
}

/**
 * ATS Score Updater
 */
function updateATSScore() {
  const result = ATSScanner.analyze(activeResume);
  const scoreTextEl = document.getElementById('atsScoreText');
  const scoreBadgeEl = document.getElementById('atsScoreBadge');

  if (scoreTextEl) scoreTextEl.textContent = `${result.score}%`;
  if (scoreBadgeEl) {
    scoreBadgeEl.style.borderColor = result.gradeColor;
    scoreBadgeEl.style.color = result.gradeColor;
  }

  // Update Drawer content if modal open
  const tipsContainer = document.getElementById('atsTipsContainer');
  if (tipsContainer) {
    if (result.tips.length === 0) {
      tipsContainer.innerHTML = `<div style="color:var(--accent-emerald); font-weight:600;"><i class="fa-solid fa-circle-check"></i> Outstanding! Your resume meets all ATS optimization standards.</div>`;
    } else {
      tipsContainer.innerHTML = result.tips
        .map(
          (tip) => `
        <div style="padding:10px; margin-bottom:8px; border-radius:6px; background:${tip.type === 'critical' ? 'rgba(244,63,94,0.1)' : 'rgba(245,158,11,0.1)'}; border-left:3px solid ${tip.type === 'critical' ? 'var(--accent-coral)' : 'var(--accent-amber)'}; font-size:0.85rem;">
          <strong>${tip.type.toUpperCase()}:</strong> ${tip.text}
        </div>
      `
        )
        .join('');
    }
  }
}

/**
 * Setup Customization Listeners (Theme color, Template, Font)
 */
function setupCustomizationListeners() {
  // Template Select
  const tplSelect = document.getElementById('templateSelect');
  if (tplSelect) {
    tplSelect.addEventListener('change', (e) => {
      activeResume.template = e.target.value;
      updateLivePreview();
      triggerAutoSave();
    });
  }

  // Color Swatches
  const swatches = document.querySelectorAll('.color-swatch');
  swatches.forEach((swatch) => {
    swatch.addEventListener('click', () => {
      swatches.forEach((s) => s.classList.remove('active'));
      swatch.classList.add('active');
      const color = swatch.dataset.color;
      activeResume.themeColor = color;
      updateLivePreview();
      triggerAutoSave();
    });
  });

  // Custom Color Hex Picker
  const customColorInput = document.getElementById('customColorPicker');
  if (customColorInput) {
    customColorInput.addEventListener('input', (e) => {
      activeResume.themeColor = e.target.value;
      updateLivePreview();
      triggerAutoSave();
    });
  }

  // Font Select
  const fontSelect = document.getElementById('fontSelect');
  if (fontSelect) {
    fontSelect.addEventListener('change', (e) => {
      activeResume.fontFamily = e.target.value;
      updateLivePreview();
      triggerAutoSave();
    });
  }

  // Font Size Select
  const fontSizeSelect = document.getElementById('fontSizeSelect');
  if (fontSizeSelect) {
    fontSizeSelect.addEventListener('change', (e) => {
      activeResume.fontSize = e.target.value;
      updateLivePreview();
      triggerAutoSave();
    });
  }
}

/**
 * Setup Zoom Controls
 */
function setupZoomControls() {
  const zoomInBtn = document.getElementById('zoomInBtn');
  const zoomOutBtn = document.getElementById('zoomOutBtn');
  const zoomFitBtn = document.getElementById('zoomFitBtn');
  const zoomText = document.getElementById('zoomValueText');
  const wrapper = document.getElementById('resumePaperWrapper');

  const applyZoom = () => {
    if (wrapper) wrapper.style.transform = `scale(${zoomLevel})`;
    if (zoomText) zoomText.textContent = `${Math.round(zoomLevel * 100)}%`;
  };

  if (zoomInBtn) {
    zoomInBtn.addEventListener('click', () => {
      if (zoomLevel < 1.6) {
        zoomLevel += 0.1;
        applyZoom();
      }
    });
  }

  if (zoomOutBtn) {
    zoomOutBtn.addEventListener('click', () => {
      if (zoomLevel > 0.4) {
        zoomLevel -= 0.1;
        applyZoom();
      }
    });
  }

  if (zoomFitBtn) {
    zoomFitBtn.addEventListener('click', () => {
      zoomLevel = 1.0;
      applyZoom();
    });
  }
}

/**
 * Setup Tab Navigation (Personal Info, Summary, Experience, etc.)
 */
function setupTabNavigation() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const sections = document.querySelectorAll('.accordion-section');

  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      tabButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const targetId = btn.dataset.target;
      sections.forEach((sec) => {
        if (sec.id === targetId || targetId === 'all') {
          sec.classList.add('active');
        } else {
          sec.classList.remove('active');
        }
      });

      // Scroll into view
      const targetSec = document.getElementById(targetId);
      if (targetSec) {
        targetSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/**
 * Setup Export Controls (PDF, JSON, Print, Sample)
 */
function setupExportControls() {
  // Download PDF button
  const downloadPdfBtn = document.getElementById('downloadPdfBtn');
  if (downloadPdfBtn) {
    downloadPdfBtn.addEventListener('click', () => {
      exportPDF();
    });
  }

  // Print Direct
  const printDirectBtn = document.getElementById('printDirectBtn');
  if (printDirectBtn) {
    printDirectBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // Export JSON Backup
  const exportJsonBtn = document.getElementById('exportJsonBtn');
  if (exportJsonBtn) {
    exportJsonBtn.addEventListener('click', () => {
      StorageService.exportAsJSON(activeResume);
      showToast('Resume data exported successfully!', 'success');
    });
  }

  // Import JSON Backup
  const importJsonBtn = document.getElementById('importJsonBtn');
  const importJsonInput = document.getElementById('importJsonInput');
  if (importJsonBtn && importJsonInput) {
    importJsonBtn.addEventListener('click', () => importJsonInput.click());
    importJsonInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (evt) => {
          try {
            const imported = StorageService.importFromJSON(evt.target.result);
            activeResume = imported;
            populateForm(activeResume);
            updateLivePreview();
            updateATSScore();
            showToast('Resume imported successfully!', 'success');
          } catch (err) {
            showToast('Invalid JSON backup file format.', 'error');
          }
        };
        reader.readAsText(file);
      }
    });
  }

  // Load Sample Profile Button
  const loadSampleBtn = document.getElementById('loadSampleBtn');
  if (loadSampleBtn) {
    loadSampleBtn.addEventListener('click', () => {
      if (confirm('Load sample verified profile (Binayak Chopra)? Any unsaved edits will be replaced.')) {
        activeResume = StorageService.getSampleData();
        activeResume.id = 'res_' + Date.now();
        populateForm(activeResume);
        updateLivePreview();
        triggerAutoSave();
        updateATSScore();
        showToast('Sample profile loaded!', 'success');
      }
    });
  }
}

/**
 * Export High-Definition PDF using html2pdf / print
 */
function exportPDF() {
  const element = document.querySelector('.resume-paper');
  if (!element) return;

  showToast('Generating vector PDF...', 'info');

  const opt = {
    margin: [0, 0, 0, 0],
    filename: `${(activeResume.title || 'Resume').replace(/\s+/g, '_')}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, letterRendering: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
  };

  if (window.html2pdf) {
    window
      .html2pdf()
      .set(opt)
      .from(element)
      .save()
      .then(() => {
        showToast('PDF downloaded successfully!', 'success');
      })
      .catch((err) => {
        console.warn('html2pdf fallback to native print:', err);
        window.print();
      });
  } else {
    window.print();
  }
}

/**
 * Repeaters: Experience
 */
function renderExperienceList(list) {
  const container = document.getElementById('experienceList');
  if (!container) return;

  container.innerHTML = list
    .map(
      (item, idx) => `
    <div class="repeater-item exp-item" data-id="${item.id || 'exp_' + idx}">
      <div class="repeater-header">
        <span class="repeater-title"><i class="fa-solid fa-briefcase"></i> ${item.role || 'Position'} @ ${item.company || 'Company'}</span>
        <button type="button" class="btn-remove-item" onclick="removeExperienceItem('${item.id || idx}')"><i class="fa-solid fa-trash-can"></i></button>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Job Title / Role</label>
          <input type="text" class="form-control sync-input exp-role" value="${item.role || ''}" placeholder="e.g. Frontend Engineer">
        </div>
        <div class="form-group">
          <label class="form-label">Company / Organization</label>
          <input type="text" class="form-control sync-input exp-company" value="${item.company || ''}" placeholder="e.g. CyberSmart Inc.">
        </div>
      </div>
      <div class="form-row-3">
        <div class="form-group">
          <label class="form-label">Location</label>
          <input type="text" class="form-control sync-input exp-location" value="${item.location || ''}" placeholder="e.g. Remote / New York">
        </div>
        <div class="form-group">
          <label class="form-label">Start Date</label>
          <input type="text" class="form-control sync-input exp-start" value="${item.startDate || ''}" placeholder="e.g. Jun 2024">
        </div>
        <div class="form-group">
          <label class="form-label">End Date</label>
          <input type="text" class="form-control sync-input exp-end" value="${item.endDate || ''}" placeholder="e.g. Present">
        </div>
      </div>
      <div class="form-group">
        <div class="ai-suggest-bar">
          <label class="form-label" style="margin-bottom:0;">Key Accomplishments & Responsibilities</label>
          <button type="button" class="ai-pill-btn" onclick="enhanceBulletPoints(this)"><i class="fa-solid fa-wand-magic-sparkles"></i> AI Bullet Boost</button>
        </div>
        <textarea class="form-control sync-input exp-desc" rows="3" placeholder="• Engineered reactive components using React.js...\n• Improved system performance by 30%...">${item.description || ''}</textarea>
      </div>
    </div>
  `
    )
    .join('');

  setupFormListeners();
}

function addExperienceItem() {
  if (!activeResume.experience) activeResume.experience = [];
  activeResume.experience.push({
    id: 'exp_' + Date.now(),
    role: '',
    company: '',
    location: '',
    startDate: '',
    endDate: 'Present',
    current: true,
    description: '• Engineered key features resulting in measurable performance improvement.\n• Collaborated with cross-functional teams to deliver on-time releases.',
  });
  renderExperienceList(activeResume.experience);
  updateLivePreview();
  triggerAutoSave();
}

function removeExperienceItem(id) {
  activeResume.experience = activeResume.experience.filter((e, idx) => (e.id || idx) !== id);
  renderExperienceList(activeResume.experience);
  updateLivePreview();
  triggerAutoSave();
}

/**
 * Repeaters: Education
 */
function renderEducationList(list) {
  const container = document.getElementById('educationList');
  if (!container) return;

  container.innerHTML = list
    .map(
      (item, idx) => `
    <div class="repeater-item edu-item" data-id="${item.id || 'edu_' + idx}">
      <div class="repeater-header">
        <span class="repeater-title"><i class="fa-solid fa-graduation-cap"></i> ${item.degree || 'Degree'}</span>
        <button type="button" class="btn-remove-item" onclick="removeEducationItem('${item.id || idx}')"><i class="fa-solid fa-trash-can"></i></button>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Degree & Field of Study</label>
          <input type="text" class="form-control sync-input edu-degree" value="${item.degree || ''}" placeholder="e.g. B.Tech in Computer Science">
        </div>
        <div class="form-group">
          <label class="form-label">University / Institution</label>
          <input type="text" class="form-control sync-input edu-institution" value="${item.institution || ''}" placeholder="e.g. Lovely Professional University">
        </div>
      </div>
      <div class="form-row-3">
        <div class="form-group">
          <label class="form-label">Location</label>
          <input type="text" class="form-control sync-input edu-location" value="${item.location || ''}" placeholder="e.g. Punjab, India">
        </div>
        <div class="form-group">
          <label class="form-label">Start Year</label>
          <input type="text" class="form-control sync-input edu-start" value="${item.startDate || ''}" placeholder="e.g. 2024">
        </div>
        <div class="form-group">
          <label class="form-label">Graduation Year</label>
          <input type="text" class="form-control sync-input edu-end" value="${item.endDate || ''}" placeholder="e.g. 2028">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">GPA / Grade (Optional)</label>
          <input type="text" class="form-control sync-input edu-gpa" value="${item.gpa || ''}" placeholder="e.g. 8.8 / 10.0">
        </div>
        <div class="form-group">
          <label class="form-label">Coursework / Honors</label>
          <input type="text" class="form-control sync-input edu-details" value="${item.details || ''}" placeholder="e.g. Algorithms, Data Structures, Cybersecurity">
        </div>
      </div>
    </div>
  `
    )
    .join('');

  setupFormListeners();
}

function addEducationItem() {
  if (!activeResume.education) activeResume.education = [];
  activeResume.education.push({
    id: 'edu_' + Date.now(),
    degree: '',
    institution: '',
    location: '',
    startDate: '',
    endDate: '',
    gpa: '',
    details: '',
  });
  renderEducationList(activeResume.education);
  updateLivePreview();
  triggerAutoSave();
}

function removeEducationItem(id) {
  activeResume.education = activeResume.education.filter((e, idx) => (e.id || idx) !== id);
  renderEducationList(activeResume.education);
  updateLivePreview();
  triggerAutoSave();
}

/**
 * Repeaters: Projects
 */
function renderProjectsList(list) {
  const container = document.getElementById('projectsList');
  if (!container) return;

  container.innerHTML = list
    .map(
      (item, idx) => `
    <div class="repeater-item proj-item" data-id="${item.id || 'proj_' + idx}">
      <div class="repeater-header">
        <span class="repeater-title"><i class="fa-solid fa-diagram-project"></i> ${item.title || 'Project Title'}</span>
        <button type="button" class="btn-remove-item" onclick="removeProjectItem('${item.id || idx}')"><i class="fa-solid fa-trash-can"></i></button>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Project Name</label>
          <input type="text" class="form-control sync-input proj-title" value="${item.title || ''}" placeholder="e.g. Resume Builder UI">
        </div>
        <div class="form-group">
          <label class="form-label">Tech Stack (comma separated)</label>
          <input type="text" class="form-control sync-input proj-tech" value="${item.techStack || ''}" placeholder="e.g. React.js, Tailwind, Docker">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Live Demo URL</label>
          <input type="text" class="form-control sync-input proj-link" value="${item.link || ''}" placeholder="e.g. https://my-app.com">
        </div>
        <div class="form-group">
          <label class="form-label">GitHub Repository</label>
          <input type="text" class="form-control sync-input proj-github" value="${item.github || ''}" placeholder="e.g. https://github.com/...">
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Key Highlights & Impact</label>
        <textarea class="form-control sync-input proj-desc" rows="2" placeholder="• Developed a high-speed live editor with zero server latency...">${item.description || ''}</textarea>
      </div>
    </div>
  `
    )
    .join('');

  setupFormListeners();
}

function addProjectItem() {
  if (!activeResume.projects) activeResume.projects = [];
  activeResume.projects.push({
    id: 'proj_' + Date.now(),
    title: '',
    role: '',
    techStack: '',
    link: '',
    github: '',
    description: '• Engineered a scalable web application with modern user interface.\n• Implemented responsive layouts with high cross-browser compatibility.',
  });
  renderProjectsList(activeResume.projects);
  updateLivePreview();
  triggerAutoSave();
}

function removeProjectItem(id) {
  activeResume.projects = activeResume.projects.filter((p, idx) => (p.id || idx) !== id);
  renderProjectsList(activeResume.projects);
  updateLivePreview();
  triggerAutoSave();
}

/**
 * Repeaters: Certifications
 */
function renderCertificationsList(list) {
  const container = document.getElementById('certificationsList');
  if (!container) return;

  container.innerHTML = list
    .map(
      (item, idx) => `
    <div class="repeater-item cert-item" data-id="${item.id || 'cert_' + idx}">
      <div class="repeater-header">
        <span class="repeater-title"><i class="fa-solid fa-certificate"></i> ${item.name || 'Certificate'}</span>
        <button type="button" class="btn-remove-item" onclick="removeCertItem('${item.id || idx}')"><i class="fa-solid fa-trash-can"></i></button>
      </div>
      <div class="form-row-3">
        <div class="form-group">
          <label class="form-label">Certification Name</label>
          <input type="text" class="form-control sync-input cert-name" value="${item.name || ''}" placeholder="e.g. AWS Cloud Practitioner">
        </div>
        <div class="form-group">
          <label class="form-label">Issuing Org</label>
          <input type="text" class="form-control sync-input cert-issuer" value="${item.issuer || ''}" placeholder="e.g. Amazon Web Services">
        </div>
        <div class="form-group">
          <label class="form-label">Issue Date</label>
          <input type="text" class="form-control sync-input cert-date" value="${item.date || ''}" placeholder="e.g. 2025">
        </div>
      </div>
    </div>
  `
    )
    .join('');

  setupFormListeners();
}

function addCertItem() {
  if (!activeResume.certifications) activeResume.certifications = [];
  activeResume.certifications.push({
    id: 'cert_' + Date.now(),
    name: '',
    issuer: '',
    date: '2025',
    credentialId: '',
  });
  renderCertificationsList(activeResume.certifications);
  updateLivePreview();
  triggerAutoSave();
}

function removeCertItem(id) {
  activeResume.certifications = activeResume.certifications.filter((c, idx) => (c.id || idx) !== id);
  renderCertificationsList(activeResume.certifications);
  updateLivePreview();
  triggerAutoSave();
}

/**
 * Repeaters: Languages
 */
function renderLanguagesList(list) {
  const container = document.getElementById('languagesList');
  if (!container) return;

  container.innerHTML = list
    .map(
      (item, idx) => `
    <div class="repeater-item lang-item" data-id="${item.id || 'lang_' + idx}">
      <div class="repeater-header">
        <span class="repeater-title"><i class="fa-solid fa-language"></i> ${item.name || 'Language'}</span>
        <button type="button" class="btn-remove-item" onclick="removeLangItem('${item.id || idx}')"><i class="fa-solid fa-trash-can"></i></button>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Language</label>
          <input type="text" class="form-control sync-input lang-name" value="${item.name || ''}" placeholder="e.g. English">
        </div>
        <div class="form-group">
          <label class="form-label">Fluency Level</label>
          <input type="text" class="form-control sync-input lang-fluency" value="${item.fluency || ''}" placeholder="e.g. Fluent / Native">
        </div>
      </div>
    </div>
  `
    )
    .join('');

  setupFormListeners();
}

function addLangItem() {
  if (!activeResume.languages) activeResume.languages = [];
  activeResume.languages.push({
    id: 'lang_' + Date.now(),
    name: '',
    fluency: 'Fluent / Professional',
  });
  renderLanguagesList(activeResume.languages);
  updateLivePreview();
  triggerAutoSave();
}

function removeLangItem(id) {
  activeResume.languages = activeResume.languages.filter((l, idx) => (l.id || idx) !== id);
  renderLanguagesList(activeResume.languages);
  updateLivePreview();
  triggerAutoSave();
}

/**
 * AI Bullet Point Booster Helper
 */
function enhanceBulletPoints(btn) {
  const textarea = btn.closest('.form-group').querySelector('textarea');
  if (!textarea) return;

  const currentVal = textarea.value.trim();
  const suggestions = [
    '• Engineered robust frontend architecture using React.js 19 and modern CSS, accelerating page render by 35%.\n• Designed and automated continuous integration workflows with Docker, eliminating deployment bottlenecks.\n• Collaborated with engineering stakeholders to spearhead feature releases for 5,000+ active users.',
    '• Architected high-performance web components adhering to strict accessibility and responsive standards.\n• Reduced server response latency by 40% through optimized API queries and client-side state caching.\n• Conducted comprehensive vulnerability scans and digital forensic analysis to ensure system hardening.',
  ];

  const randomPick = suggestions[Math.floor(Math.random() * suggestions.length)];
  textarea.value = randomPick;
  syncFormDataToState();
  updateLivePreview();
  triggerAutoSave();
  updateATSScore();
  showToast('AI Action-Verb Bullets applied!', 'success');
}
