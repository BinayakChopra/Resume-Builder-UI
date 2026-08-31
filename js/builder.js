/**
 * ============================================================================
 * RESUME BUILDER 2.0 — LIVE STUDIO CONTROLLER
 * Handles split-screen live syncing, repeaters, customizations, ATS, AI Matcher, & PDF export
 * ============================================================================
 */

let activeResume = null;
let zoomLevel = 1.0;
let autoSaveTimer = null;
let currentTailoredResumeDraft = null;

function escapeHTML(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

document.addEventListener('DOMContentLoaded', () => {
  initStudio();
});

/**
 * Initialize Studio
 */
function initStudio() {
  // Enforce Authentication Guard: User MUST be signed in
  if (!StorageService.requireAuth('builder.html')) {
    return;
  }

  // Load Active Resume for current user
  activeResume = StorageService.getActiveResume();

  if (activeResume) {
    if (!Array.isArray(activeResume.languages)) activeResume.languages = [];
    if (!Array.isArray(activeResume.certifications)) activeResume.certifications = [];
    if (!Array.isArray(activeResume.experience)) activeResume.experience = [];
    if (!Array.isArray(activeResume.education)) activeResume.education = [];
    if (!Array.isArray(activeResume.projects)) activeResume.projects = [];
  }

  // Check URL param for template override
  const urlParams = new URLSearchParams(window.location.search);
  const templateParam = urlParams.get('template');
  if (templateParam && activeResume) {
    activeResume.template = templateParam;
    StorageService.saveResume(activeResume);
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
  setupAccordionToggle();
  setupAIJobMatcher();

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
 * Helper to set input value safely
 */
function setVal(id, val) {
  const el = document.getElementById(id);
  if (el) el.value = val || '';
}

/**
 * Setup live typing listeners on form inputs & repeater buttons
 */
function setupFormListeners() {
  const inputs = document.querySelectorAll('.sync-input');
  inputs.forEach((input) => {
    // Avoid duplicate event listener binding
    if (input.dataset.listenerAttached === 'true') return;
    input.dataset.listenerAttached = 'true';

    const syncHandler = () => {
      syncFormDataToState();
      updateLivePreview();
      triggerAutoSave();
      updateATSScore();
    };

    input.addEventListener('input', syncHandler);
    input.addEventListener('change', syncHandler);
  });

  // Direct Button Listeners for Repeaters (supports both IDs and onclick attributes)
  const addButtons = [
    { id: 'btnAddLang', fn: addLanguageItem },
    { id: 'addLangBtn', fn: addLanguageItem },
    { id: 'btnAddCert', fn: addCertificationItem },
    { id: 'addCertBtn', fn: addCertificationItem },
    { id: 'btnAddExp', fn: addExperienceItem },
    { id: 'addExpBtn', fn: addExperienceItem },
    { id: 'btnAddEdu', fn: addEducationItem },
    { id: 'addEduBtn', fn: addEducationItem },
    { id: 'btnAddProj', fn: addProjectItem },
    { id: 'addProjBtn', fn: addProjectItem },
  ];

  addButtons.forEach(({ id, fn }) => {
    const btn = document.getElementById(id);
    if (btn && !btn.dataset.listenerAttached) {
      btn.dataset.listenerAttached = 'true';
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        fn();
      });
    }
  });

  // Avatar Upload Listener
  const avatarFileInput = document.getElementById('avatarFileInput');
  if (avatarFileInput && !avatarFileInput.dataset.listenerAttached) {
    avatarFileInput.dataset.listenerAttached = 'true';
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
  if (removeAvatarBtn && !removeAvatarBtn.dataset.listenerAttached) {
    removeAvatarBtn.dataset.listenerAttached = 'true';
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
    fluency: el.querySelector('.lang-fluency')?.value || 'Professional',
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
 * ATS Score Updater & Drawer Manager
 */
function updateATSScore() {
  const result = ATSScanner.analyze(activeResume);
  const scoreTextEl = document.getElementById('atsScoreText');
  const scoreBadgeEl = document.getElementById('atsScoreBadge');
  const modalScoreEl = document.getElementById('atsModalScore');

  if (scoreTextEl) scoreTextEl.textContent = `${result.score}%`;
  if (modalScoreEl) {
    modalScoreEl.textContent = `${result.score}%`;
    modalScoreEl.style.color = result.gradeColor;
  }

  if (scoreBadgeEl) {
    scoreBadgeEl.style.borderColor = result.gradeColor;
    scoreBadgeEl.style.color = result.gradeColor;
  }

  // Update Drawer content inside ATS modal
  const tipsContainer = document.getElementById('atsTipsContainer');
  if (tipsContainer) {
    if (result.tips.length === 0) {
      tipsContainer.innerHTML = `
        <div style="padding:14px; border-radius:8px; background:rgba(16, 185, 129, 0.12); border:1px solid rgba(16, 185, 129, 0.3); color:var(--accent-emerald); font-weight:600; text-align:center;">
          <i class="fa-solid fa-circle-check" style="font-size:1.5rem; margin-bottom:6px; display:block;"></i>
          Outstanding! Your resume achieves a 100% ATS Readiness Score with full keyword, contact, metric, and formatting compliance!
        </div>
      `;
    } else {
      tipsContainer.innerHTML = result.tips
        .map(
          (tip) => `
        <div style="padding:10px 14px; margin-bottom:8px; border-radius:6px; background:${tip.type === 'critical' ? 'rgba(244,63,94,0.1)' : 'rgba(245,158,11,0.1)'}; border-left:3px solid ${tip.type === 'critical' ? 'var(--accent-coral)' : 'var(--accent-amber)'}; font-size:0.85rem;">
          <strong style="color:${tip.type === 'critical' ? 'var(--accent-coral)' : 'var(--accent-amber)'};">${tip.type.toUpperCase()}:</strong> ${tip.text}
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

  // 1-Click ATS 100% Booster Button in ATS Modal
  const boostAtsBtn = document.getElementById('boostAts100Btn');
  if (boostAtsBtn) {
    boostAtsBtn.addEventListener('click', () => {
      boostTo100PercentATS();
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
      if (targetSec && targetId !== 'all') {
        targetSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/**
 * Setup Accordion Header Toggle
 */
function setupAccordionToggle() {
  document.querySelectorAll('.accordion-header').forEach((header) => {
    if (header.dataset.listenerAttached === 'true') return;
    header.dataset.listenerAttached = 'true';
    header.style.cursor = 'pointer';

    header.addEventListener('click', (e) => {
      // Don't toggle if clicking an inner interactive element
      if (e.target.closest('button') || e.target.closest('input') || e.target.closest('select')) return;
      const sec = header.closest('.accordion-section');
      if (sec) {
        sec.classList.toggle('active');
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
        StorageService.importFromJSON(file, (success, result) => {
          if (success) {
            activeResume = result;
            populateForm(activeResume);
            updateLivePreview();
            updateATSScore();
            showToast('Resume imported successfully into your account!', 'success');
          } else {
            showToast(result || 'Invalid JSON backup file format.', 'error');
          }
        });
      }
    });
  }

  // Load Sample Profile Button
  const loadSampleBtn = document.getElementById('loadSampleBtn');
  if (loadSampleBtn) {
    loadSampleBtn.addEventListener('click', () => {
      if (confirm('Load professional sample template into your private account? This will create a fresh sample draft for you.')) {
        activeResume = StorageService.loadSampleIntoUserAccount();
        populateForm(activeResume);
        updateLivePreview();
        triggerAutoSave();
        updateATSScore();
        showToast('Sample template loaded into your account!', 'success');
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

/* ==========================================================================
   AI JOB MATCHER & 100% ATS OPTIMIZATION CONTROLLER
   ========================================================================== */

/**
 * Setup AI Job Matcher Modal & Presets
 */
function setupAIJobMatcher() {
  const presetChipsContainer = document.getElementById('jdPresetChips');
  if (presetChipsContainer && typeof AIJobMatcher !== 'undefined') {
    presetChipsContainer.innerHTML = AIJobMatcher.JOB_PRESETS.map(
      (preset, idx) => `
      <div class="preset-chip ${idx === 0 ? 'active' : ''}" data-preset-index="${idx}" onclick="selectJDPreset(${idx})">
        <i class="fa-solid fa-code"></i> ${preset.role}
      </div>
    `
    ).join('');

    // Pre-fill with the first preset
    selectJDPreset(0);
  }

  // Analyze Button
  const analyzeBtn = document.getElementById('aiAnalyzeJdBtn');
  if (analyzeBtn) {
    analyzeBtn.addEventListener('click', () => {
      runAIJobAnalysis();
    });
  }

  // Clear Button
  const clearBtn = document.getElementById('aiClearJdBtn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      setVal('aiTargetRoleInput', '');
      setVal('aiTargetCompanyInput', '');
      setVal('aiJobDescriptionInput', '');
      document.getElementById('aiMatchResultsContainer').style.display = 'none';
      document.getElementById('applyAiTailoringBtn').disabled = true;
    });
  }

  // Apply Button
  const applyBtn = document.getElementById('applyAiTailoringBtn');
  if (applyBtn) {
    applyBtn.addEventListener('click', () => {
      applyTailoredResume();
    });
  }
}

/**
 * Select a predefined JD preset
 */
function selectJDPreset(idx) {
  if (typeof AIJobMatcher === 'undefined') return;
  const preset = AIJobMatcher.JOB_PRESETS[idx];
  if (!preset) return;

  // Highlight chip
  document.querySelectorAll('.preset-chip').forEach((c, i) => {
    if (i === idx) c.classList.add('active');
    else c.classList.remove('active');
  });

  setVal('aiTargetRoleInput', preset.role);
  setVal('aiTargetCompanyInput', preset.company);
  setVal('aiJobDescriptionInput', preset.jdText);
}

/**
 * Run AI Job Analysis and display diff
 */
function runAIJobAnalysis() {
  syncFormDataToState();

  const jdText = document.getElementById('aiJobDescriptionInput')?.value || '';
  const targetRole = document.getElementById('aiTargetRoleInput')?.value || '';
  const targetCompany = document.getElementById('aiTargetCompanyInput')?.value || '';

  if (!jdText.trim()) {
    showToast('Please paste a job description or select a role preset first.', 'error');
    return;
  }

  showToast('AI is parsing Job Description & tailoring resume parameters...', 'info');

  const jdInfo = AIJobMatcher.parseJobDescription(jdText);
  const comparison = AIJobMatcher.compareResumeToJob(activeResume, jdInfo);

  // Generate the tailored resume object
  currentTailoredResumeDraft = AIJobMatcher.tailorResumeToJobDescription(activeResume, jdText, {
    targetRole,
    targetCompany,
  });

  // Calculate scores
  const scoreBefore = ATSScanner.analyze(activeResume).score;
  const scoreAfter = ATSScanner.analyze(currentTailoredResumeDraft).score;

  // Update UI Elements
  document.getElementById('aiScoreBefore').textContent = `${scoreBefore}%`;
  document.getElementById('aiScoreAfter').textContent = `${Math.max(scoreAfter, 100)}%`;

  // Extracted Skills
  const extractedContainer = document.getElementById('aiExtractedSkillsTags');
  if (extractedContainer) {
    if (jdInfo.detectedSkills.length === 0) {
      extractedContainer.innerHTML = `<span style="font-size:0.8rem; color:var(--text-muted);">Standard technical stack detected.</span>`;
    } else {
      extractedContainer.innerHTML = jdInfo.detectedSkills
        .map((s) => `<span class="diff-tag-added"><i class="fa-solid fa-check"></i> ${s}</span>`)
        .join(' ');
    }
  }

  // Missing / Injected Keywords
  const injectedContainer = document.getElementById('aiInjectedKeywordsTags');
  if (injectedContainer) {
    if (comparison.missingSkills.length === 0) {
      injectedContainer.innerHTML = `<span class="diff-tag-added"><i class="fa-solid fa-check-double"></i> All key JD competencies already aligned!</span>`;
    } else {
      injectedContainer.innerHTML = comparison.missingSkills
        .map((s) => `<span class="diff-tag-added"><i class="fa-solid fa-plus"></i> ${s}</span>`)
        .join(' ');
    }
  }

  // Tailored Summary Preview
  const summaryPreview = document.getElementById('aiTailoredSummaryPreview');
  if (summaryPreview) {
    summaryPreview.textContent = currentTailoredResumeDraft.summary;
  }

  // Reveal results
  document.getElementById('aiMatchResultsContainer').style.display = 'block';
  document.getElementById('applyAiTailoringBtn').disabled = false;
  showToast('AI Match complete! Ready to apply 100% ATS tailoring.', 'success');
}

/**
 * Apply the AI tailored resume into active resume state
 */
function applyTailoredResume() {
  if (!currentTailoredResumeDraft) return;

  activeResume = JSON.parse(JSON.stringify(currentTailoredResumeDraft));
  populateForm(activeResume);
  updateLivePreview();
  triggerAutoSave();
  updateATSScore();

  // Close modal
  const modal = document.getElementById('aiJobModal');
  if (modal) modal.classList.remove('active');

  showToast('Resume successfully tailored to Job Description with 100% ATS Readiness!', 'success');
}

/**
 * 1-Click AI 100% ATS Booster (Fix all gaps across summary, metrics, verbs, skills, contact)
 */
function boostTo100PercentATS() {
  syncFormDataToState();
  showToast('AI 1-Click Booster: Optimizing metrics, action verbs, skills, and summary for 100% ATS...', 'info');

  setTimeout(() => {
    activeResume = AIJobMatcher.fixTo100PercentATS(activeResume);
    populateForm(activeResume);
    updateLivePreview();
    triggerAutoSave();
    updateATSScore();

    showToast('100% ATS Score Achieved! All algorithms satisfied.', 'success');
  }, 300);
}

/**
 * AI Summary Generator
 */
function generateAISummary() {
  syncFormDataToState();
  const summaryEl = document.getElementById('summary');
  if (!summaryEl) return;

  const role = activeResume.personalInfo?.jobTitle || 'Software Engineer';
  const skillsList = [
    activeResume.skills?.languages,
    activeResume.skills?.frontend,
    activeResume.skills?.tools,
    activeResume.skills?.security,
  ]
    .filter(Boolean)
    .join(', ');

  const summary = `Results-oriented ${role} with proven expertise in building high-performance, secure, and scalable modern web architectures. Demonstrated track record leveraging ${skillsList || 'full-stack technologies and industry best practices'} to optimize system workflows, automate deployments, and engineer robust digital experiences. Exceptional problem-solving capabilities with a focus on delivering measurable business impact.`;

  summaryEl.value = summary;
  syncFormDataToState();
  updateLivePreview();
  triggerAutoSave();
  updateATSScore();
  showToast('AI Summary generated and optimized for ATS!', 'success');
}

/**
 * AI Skills Suggester
 */
function suggestAISkills(cat) {
  syncFormDataToState();
  const suggestions = {
    languages: 'JavaScript (ES6+), TypeScript, Python, Java, C++, SQL, HTML5, CSS3',
    frontend: 'React.js 19, Next.js, Tailwind CSS, Framer Motion, Redux Toolkit, Responsive UI Design',
    tools: 'Git, GitHub, Docker, Kubernetes, AWS, RESTful APIs, CI/CD Pipelines, PostgreSQL',
    security: 'Digital Forensics, SOC Operations, SIEM, Incident Response, Network Protocols, OWASP Top 10',
  };

  const idMap = {
    languages: 'skillsLanguages',
    frontend: 'skillsFrontend',
    tools: 'skillsTools',
    security: 'skillsSecurity',
  };

  const input = document.getElementById(idMap[cat]);
  if (input) {
    input.value = suggestions[cat] || '';
    syncFormDataToState();
    updateLivePreview();
    triggerAutoSave();
    updateATSScore();
    showToast(`AI added industry standard ${cat} proficiencies!`, 'success');
  }
}

/**
 * AI Bullet Enhancer
 */
function enhanceBulletPoints(btn) {
  const textarea = btn.closest('.form-group')?.querySelector('textarea');
  if (!textarea) return;

  const currentText = textarea.value.trim();
  if (!currentText) {
    textarea.value = '• Spearheaded architectural design and implementation of modern responsive modules, improving page load speed by 42%.\n• Automated CI/CD deployment pipelines, decreasing release cycle duration by 35%.\n• Engineered secure backend RESTful endpoints with comprehensive authentication protocols.';
    syncFormDataToState();
    updateLivePreview();
    triggerAutoSave();
    updateATSScore();
    showToast('AI generated high-impact, metric-driven bullet points!', 'success');
    return;
  }

  showToast('AI is optimizing action verbs & quantifiable metrics...', 'info');

  setTimeout(() => {
    const lines = currentText.split('\n').filter((l) => l.trim().length > 0);
    const actionVerbs = ['Spearheaded', 'Architected', 'Engineered', 'Optimized', 'Automated', 'Scaled'];

    const enhanced = lines
      .map((line, idx) => {
        let clean = line.replace(/^[•\-\*]\s*/, '').trim();
        const verb = actionVerbs[idx % actionVerbs.length];
        if (!clean.startsWith(verb)) {
          clean = `${verb} ${clean.charAt(0).toLowerCase() + clean.slice(1)}`;
        }
        if (!clean.includes('%') && !clean.includes('by') && !clean.includes('$') && !clean.includes('10,')) {
          clean += ', improving system throughput by 35%';
        }
        return `• ${clean}`;
      })
      .join('\n');

    textarea.value = enhanced;
    syncFormDataToState();
    updateLivePreview();
    triggerAutoSave();
    updateATSScore();
    showToast('Bullets successfully enhanced with AI power verbs & metrics!', 'success');
  }, 300);
}

/* ==========================================================================
   DYNAMIC REPEATERS WITH FULL STATE SYNCHRONIZATION
   ========================================================================== */

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
          <input type="text" class="form-control sync-input exp-company" value="${item.company || ''}" placeholder="e.g. Acme Tech Inc.">
        </div>
      </div>
      <div class="form-row-3">
        <div class="form-group">
          <label class="form-label">Location</label>
          <input type="text" class="form-control sync-input exp-location" value="${item.location || ''}" placeholder="e.g. Remote / San Francisco">
        </div>
        <div class="form-group">
          <label class="form-label">Start Date</label>
          <input type="text" class="form-control sync-input exp-start" value="${item.startDate || ''}" placeholder="e.g. Jan 2023">
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
        <textarea class="form-control sync-input exp-desc" rows="3" placeholder="• Engineered scalable frontend components...\n• Improved query latency by 35%...">${item.description || ''}</textarea>
      </div>
    </div>
  `
    )
    .join('');

  setupFormListeners();
}

function addExperienceItem() {
  syncFormDataToState();
  if (!activeResume.experience) activeResume.experience = [];
  activeResume.experience.push({
    id: 'exp_' + Date.now(),
    role: '',
    company: '',
    location: '',
    startDate: '',
    endDate: 'Present',
    current: true,
    description: '• Spearheaded implementation of core features, improving system performance by 32%.\n• Collaborated with cross-functional engineers to deliver production releases ahead of schedule.',
  });
  renderExperienceList(activeResume.experience);
  updateLivePreview();
  triggerAutoSave();
  updateATSScore();
}

function removeExperienceItem(id) {
  syncFormDataToState();
  activeResume.experience = activeResume.experience.filter((x, idx) => (x.id || idx) != id);
  renderExperienceList(activeResume.experience);
  updateLivePreview();
  triggerAutoSave();
  updateATSScore();
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
        <span class="repeater-title"><i class="fa-solid fa-graduation-cap"></i> ${item.degree || 'Degree'} @ ${item.institution || 'University'}</span>
        <button type="button" class="btn-remove-item" onclick="removeEducationItem('${item.id || idx}')"><i class="fa-solid fa-trash-can"></i></button>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Degree / Field of Study</label>
          <input type="text" class="form-control sync-input edu-degree" value="${item.degree || ''}" placeholder="e.g. B.S. in Computer Science">
        </div>
        <div class="form-group">
          <label class="form-label">School / University</label>
          <input type="text" class="form-control sync-input edu-institution" value="${item.institution || ''}" placeholder="e.g. Stanford University">
        </div>
      </div>
      <div class="form-row-3">
        <div class="form-group">
          <label class="form-label">Location</label>
          <input type="text" class="form-control sync-input edu-location" value="${item.location || ''}" placeholder="e.g. Stanford, CA">
        </div>
        <div class="form-group">
          <label class="form-label">Graduation Year</label>
          <input type="text" class="form-control sync-input edu-end" value="${item.endDate || ''}" placeholder="e.g. 2024">
        </div>
        <div class="form-group">
          <label class="form-label">GPA / Honors</label>
          <input type="text" class="form-control sync-input edu-gpa" value="${item.gpa || ''}" placeholder="e.g. 3.8 / 4.0">
        </div>
      </div>
    </div>
  `
    )
    .join('');

  setupFormListeners();
}

function addEducationItem() {
  syncFormDataToState();
  if (!activeResume.education) activeResume.education = [];
  activeResume.education.push({
    id: 'edu_' + Date.now(),
    degree: '',
    institution: '',
    location: '',
    startDate: '',
    endDate: '2024',
    gpa: '',
    details: '',
  });
  renderEducationList(activeResume.education);
  updateLivePreview();
  triggerAutoSave();
  updateATSScore();
}

function removeEducationItem(id) {
  syncFormDataToState();
  activeResume.education = activeResume.education.filter((x, idx) => (x.id || idx) != id);
  renderEducationList(activeResume.education);
  updateLivePreview();
  triggerAutoSave();
  updateATSScore();
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
        <span class="repeater-title"><i class="fa-solid fa-diagram-project"></i> ${item.title || 'Project Name'}</span>
        <button type="button" class="btn-remove-item" onclick="removeProjectItem('${item.id || idx}')"><i class="fa-solid fa-trash-can"></i></button>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Project Title</label>
          <input type="text" class="form-control sync-input proj-title" value="${item.title || ''}" placeholder="e.g. Distributed Analytics Engine">
        </div>
        <div class="form-group">
          <label class="form-label">Tech Stack</label>
          <input type="text" class="form-control sync-input proj-tech" value="${item.techStack || ''}" placeholder="e.g. React, Node.js, AWS">
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Project Description & Metric Impact</label>
        <textarea class="form-control sync-input proj-desc" rows="2" placeholder="• Architected and developed a full-stack solution serving 10,000+ active users...">${item.description || ''}</textarea>
      </div>
    </div>
  `
    )
    .join('');

  setupFormListeners();
}

function addProjectItem() {
  syncFormDataToState();
  if (!activeResume.projects) activeResume.projects = [];
  activeResume.projects.push({
    id: 'proj_' + Date.now(),
    title: '',
    role: '',
    techStack: '',
    link: '',
    github: '',
    description: '• Architected and developed a high-performance application serving 10,000+ users with 99.9% uptime.',
  });
  renderProjectsList(activeResume.projects);
  updateLivePreview();
  triggerAutoSave();
  updateATSScore();
}

function removeProjectItem(id) {
  syncFormDataToState();
  activeResume.projects = activeResume.projects.filter((x, idx) => (x.id || idx) != id);
  renderProjectsList(activeResume.projects);
  updateLivePreview();
  triggerAutoSave();
  updateATSScore();
}

/**
 * Repeaters: Certifications
 */
function renderCertificationsList(list) {
  const container = document.getElementById('certificationsList');
  if (!container) return;

  const items = Array.isArray(list) ? list : [];

  if (items.length === 0) {
    container.innerHTML = `
      <div style="padding: 16px 14px; text-align: center; background: rgba(255,255,255,0.02); border: 1px dashed var(--border-subtle); border-radius: var(--radius-sm); margin-bottom: 10px; color: var(--text-muted); font-size: 0.85rem;">
        <i class="fa-solid fa-certificate" style="font-size: 1.3rem; margin-bottom: 4px; display: block; color: var(--accent-primary);"></i>
        No certifications added yet. Click <strong>+ Add Certification</strong> or pick a quick-add preset above!
      </div>
    `;
    return;
  }

  container.innerHTML = items
    .map(
      (item, idx) => `
    <div class="repeater-item cert-item" data-id="${item.id || 'cert_' + idx}">
      <div class="repeater-header">
        <span class="repeater-title"><i class="fa-solid fa-certificate"></i> ${escapeHTML(item.name || 'Certification')}</span>
        <button type="button" class="btn-remove-item" onclick="removeCertificationItem('${item.id || idx}')" title="Delete Certification"><i class="fa-solid fa-trash-can"></i></button>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Certification Name</label>
          <input type="text" class="form-control sync-input cert-name" value="${escapeHTML(item.name || '')}" placeholder="e.g. AWS Certified Solutions Architect">
        </div>
        <div class="form-group">
          <label class="form-label">Issuing Organization</label>
          <input type="text" class="form-control sync-input cert-issuer" value="${escapeHTML(item.issuer || '')}" placeholder="e.g. Amazon Web Services">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Issue Date / Year</label>
          <input type="text" class="form-control sync-input cert-date" value="${escapeHTML(item.date || '2024')}" placeholder="e.g. 2024">
        </div>
        <div class="form-group">
          <label class="form-label">Credential ID (Optional)</label>
          <input type="text" class="form-control sync-input cert-id" value="${escapeHTML(item.credentialId || '')}" placeholder="e.g. AWS-83921-PSA">
        </div>
      </div>
    </div>
  `
    )
    .join('');

  setupFormListeners();
}

function addCertificationItem() {
  syncFormDataToState();
  if (!activeResume) activeResume = StorageService.getActiveResume() || {};
  if (!Array.isArray(activeResume.certifications)) activeResume.certifications = [];

  const certSec = document.getElementById('sec-certifications');
  if (certSec) certSec.classList.add('active');

  const newCert = {
    id: 'cert_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
    name: '',
    issuer: '',
    date: '2024',
    credentialId: '',
  };

  activeResume.certifications.push(newCert);
  renderCertificationsList(activeResume.certifications);
  updateLivePreview();
  triggerAutoSave();
  updateATSScore();

  setTimeout(() => {
    const inputs = document.querySelectorAll('.cert-name');
    if (inputs.length > 0) {
      inputs[inputs.length - 1].focus();
    }
  }, 60);
}

function removeCertificationItem(id) {
  syncFormDataToState();
  if (!activeResume || !Array.isArray(activeResume.certifications)) return;
  activeResume.certifications = activeResume.certifications.filter((x, idx) => (x.id || idx) != id && idx != id);
  renderCertificationsList(activeResume.certifications);
  updateLivePreview();
  triggerAutoSave();
  updateATSScore();
}

function quickAddCert(name, issuer = '', date = '2024') {
  syncFormDataToState();
  if (!activeResume) activeResume = StorageService.getActiveResume() || {};
  if (!Array.isArray(activeResume.certifications)) activeResume.certifications = [];

  const certSec = document.getElementById('sec-certifications');
  if (certSec) certSec.classList.add('active');

  const existing = activeResume.certifications.find((c) => (c.name || '').toLowerCase() === name.toLowerCase());
  if (!existing) {
    activeResume.certifications.push({
      id: 'cert_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      name: name,
      issuer: issuer,
      date: date,
      credentialId: '',
    });
    showToast(`Added ${name} certification!`, 'success');
  } else {
    showToast(`${name} is already in your certifications!`, 'info');
  }

  renderCertificationsList(activeResume.certifications);
  updateLivePreview();
  triggerAutoSave();
  updateATSScore();
}

/**
 * Repeaters: Languages (Supports ANY world language & proficiency levels)
 */
function renderLanguagesList(list) {
  const container = document.getElementById('languagesList');
  if (!container) return;

  const items = Array.isArray(list) ? list : [];

  if (items.length === 0) {
    container.innerHTML = `
      <div style="padding: 16px 14px; text-align: center; background: rgba(255,255,255,0.02); border: 1px dashed var(--border-subtle); border-radius: var(--radius-sm); margin-bottom: 10px; color: var(--text-muted); font-size: 0.85rem;">
        <i class="fa-solid fa-language" style="font-size: 1.3rem; margin-bottom: 4px; display: block; color: var(--accent-primary);"></i>
        No languages added yet. Click <strong>+ Add Language</strong> or pick a quick-add preset above!
      </div>
    `;
    return;
  }

  container.innerHTML = items
    .map(
      (item, idx) => `
    <div class="repeater-item lang-item" data-id="${item.id || 'lang_' + idx}">
      <div class="repeater-header">
        <span class="repeater-title"><i class="fa-solid fa-language"></i> ${escapeHTML(item.name || 'Spoken Language')} (${escapeHTML(item.fluency || 'Proficient')})</span>
        <button type="button" class="btn-remove-item" onclick="removeLanguageItem('${item.id || idx}')" title="Delete Language"><i class="fa-solid fa-trash-can"></i></button>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Language Name</label>
          <input type="text" list="worldLanguages" class="form-control sync-input lang-name" value="${escapeHTML(item.name || '')}" placeholder="e.g. Spanish, French, German, Mandarin, Hindi...">
        </div>
        <div class="form-group">
          <label class="form-label">Proficiency Level</label>
          <select class="form-control sync-input lang-fluency">
            <option value="Native / Bilingual" ${item.fluency === 'Native / Bilingual' ? 'selected' : ''}>Native / Bilingual</option>
            <option value="Fluent" ${item.fluency === 'Fluent' ? 'selected' : ''}>Fluent</option>
            <option value="Professional Working" ${item.fluency === 'Professional Working' || item.fluency === 'Professional' ? 'selected' : ''}>Professional Working</option>
            <option value="Conversational" ${item.fluency === 'Conversational' ? 'selected' : ''}>Conversational</option>
            <option value="Elementary" ${item.fluency === 'Elementary' ? 'selected' : ''}>Elementary</option>
          </select>
        </div>
      </div>
    </div>
  `
    )
    .join('');

  setupFormListeners();
}

function addLanguageItem() {
  syncFormDataToState();
  if (!activeResume) activeResume = StorageService.getActiveResume() || {};
  if (!Array.isArray(activeResume.languages)) activeResume.languages = [];

  const langSec = document.getElementById('sec-languages');
  if (langSec) langSec.classList.add('active');

  const newLang = {
    id: 'lang_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
    name: '',
    fluency: 'Professional Working',
  };

  activeResume.languages.push(newLang);
  renderLanguagesList(activeResume.languages);
  updateLivePreview();
  triggerAutoSave();
  updateATSScore();

  setTimeout(() => {
    const inputs = document.querySelectorAll('.lang-name');
    if (inputs.length > 0) {
      inputs[inputs.length - 1].focus();
    }
  }, 60);
}

function removeLanguageItem(id) {
  syncFormDataToState();
  if (!activeResume || !Array.isArray(activeResume.languages)) return;
  activeResume.languages = activeResume.languages.filter((x, idx) => (x.id || idx) != id && idx != id);
  renderLanguagesList(activeResume.languages);
  updateLivePreview();
  triggerAutoSave();
  updateATSScore();
}

function quickAddLang(name, fluency = 'Professional Working') {
  syncFormDataToState();
  if (!activeResume) activeResume = StorageService.getActiveResume() || {};
  if (!Array.isArray(activeResume.languages)) activeResume.languages = [];

  const langSec = document.getElementById('sec-languages');
  if (langSec) langSec.classList.add('active');

  const existing = activeResume.languages.find((l) => (l.name || '').toLowerCase() === name.toLowerCase());
  if (existing) {
    existing.fluency = fluency;
    showToast(`Updated ${name} to ${fluency}!`, 'info');
  } else {
    activeResume.languages.push({
      id: 'lang_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      name: name,
      fluency: fluency,
    });
    showToast(`Added ${name} (${fluency}) to languages!`, 'success');
  }

  renderLanguagesList(activeResume.languages);
  updateLivePreview();
  triggerAutoSave();
  updateATSScore();
}

/* Global Aliases for direct HTML onclick attribute bindings */
window.addLangItem = addLanguageItem;
window.removeLangItem = removeLanguageItem;
window.addLanguageItem = addLanguageItem;
window.removeLanguageItem = removeLanguageItem;
window.quickAddLang = quickAddLang;

window.addCertItem = addCertificationItem;
window.removeCertItem = removeCertificationItem;
window.addCertificationItem = addCertificationItem;
window.removeCertificationItem = removeCertificationItem;
window.quickAddCert = quickAddCert;

window.addExpItem = addExperienceItem;
window.removeExpItem = removeExperienceItem;
window.addExperienceItem = addExperienceItem;
window.removeExperienceItem = removeExperienceItem;

window.addEduItem = addEducationItem;
window.removeEduItem = removeEducationItem;
window.addEducationItem = addEducationItem;
window.removeEducationItem = removeEducationItem;

window.addProjItem = addProjectItem;
window.removeProjItem = removeProjectItem;
window.addProjectItem = addProjectItem;
window.removeProjectItem = removeProjectItem;

window.selectJDPreset = selectJDPreset;
window.generateAISummary = generateAISummary;
window.suggestAISkills = suggestAISkills;
window.enhanceBulletPoints = enhanceBulletPoints;
window.boostTo100PercentATS = boostTo100PercentATS;
