/**
 * ============================================================================
 * RESUME BUILDER 2.0 — TEMPLATE RENDERING ENGINE
 * Generates semantic, vector-crisp HTML for all 6 designer templates
 * ============================================================================
 */

const TemplateEngine = (() => {
  /**
   * Escape HTML utility to prevent XSS
   */
  const escapeHTML = (str) => {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  /**
   * Format multiline bullet points or text
   */
  const formatBullets = (text) => {
    if (!text) return '';
    const lines = text.split('\n').filter((l) => l.trim().length > 0);
    if (lines.length === 0) return '';
    if (lines.length === 1 && !lines[0].startsWith('•') && !lines[0].startsWith('-')) {
      return `<p>${escapeHTML(lines[0])}</p>`;
    }
    const listItems = lines
      .map((line) => `<li>${escapeHTML(line.replace(/^[•\-\*]\s*/, ''))}</li>`)
      .join('');
    return `<ul>${listItems}</ul>`;
  };

  /**
   * Render Skills list into tags
   */
  const renderSkillTags = (skillsObj) => {
    if (!skillsObj) return '';
    const allTags = [];
    Object.keys(skillsObj).forEach((cat) => {
      if (skillsObj[cat]) {
        const parts = skillsObj[cat].split(',').map((s) => s.trim()).filter(Boolean);
        allTags.push(...parts);
      }
    });
    return allTags.map((tag) => `<span class="skill-tag">${escapeHTML(tag)}</span>`).join(' ');
  };

  /**
   * Template 1: Silicon Valley Modern Tech
   */
  const renderModernTech = (data) => {
    const p = data.personalInfo || {};
    const photoHTML = data.photoUrl
      ? `<img src="${data.photoUrl}" class="profile-photo" style="width:${data.photoSize || 90}px; height:${data.photoSize || 90}px; border-radius:${data.photoShape === 'square' ? '8px' : '50%'};" alt="Photo" />`
      : '';

    return `
      <div class="tpl-modern-tech">
        <!-- Sidebar -->
        <aside class="sidebar">
          ${photoHTML}
          <div class="header-name">${escapeHTML(p.fullName || 'Your Name')}</div>
          <div class="header-title">${escapeHTML(p.jobTitle || 'Professional Title')}</div>

          <!-- Contact Information -->
          <div class="section-title"><i class="fa-solid fa-address-card"></i> Contact</div>
          ${p.email ? `<div class="contact-item"><i class="fa-solid fa-envelope"></i> <span>${escapeHTML(p.email)}</span></div>` : ''}
          ${p.phone ? `<div class="contact-item"><i class="fa-solid fa-phone"></i> <span>${escapeHTML(p.phone)}</span></div>` : ''}
          ${p.location ? `<div class="contact-item"><i class="fa-solid fa-location-dot"></i> <span>${escapeHTML(p.location)}</span></div>` : ''}
          ${p.website ? `<div class="contact-item"><i class="fa-solid fa-globe"></i> <a href="${p.website}" target="_blank">${escapeHTML(p.website.replace(/^https?:\/\//, ''))}</a></div>` : ''}
          ${p.linkedin ? `<div class="contact-item"><i class="fa-brands fa-linkedin"></i> <a href="${p.linkedin}" target="_blank">LinkedIn Profile</a></div>` : ''}
          ${p.github ? `<div class="contact-item"><i class="fa-brands fa-github"></i> <a href="${p.github}" target="_blank">GitHub Profile</a></div>` : ''}

          <!-- Skills Section -->
          ${data.skills ? `
            <div class="section-title"><i class="fa-solid fa-code"></i> Skills</div>
            ${data.skills.languages ? `<div style="margin-bottom:8px;"><strong style="font-size:8.5pt; color:var(--tpl-primary);">Languages:</strong><br>${renderSkillTags({ l: data.skills.languages })}</div>` : ''}
            ${data.skills.frontend ? `<div style="margin-bottom:8px;"><strong style="font-size:8.5pt; color:var(--tpl-primary);">Frontend & Web:</strong><br>${renderSkillTags({ f: data.skills.frontend })}</div>` : ''}
            ${data.skills.tools ? `<div style="margin-bottom:8px;"><strong style="font-size:8.5pt; color:var(--tpl-primary);">Tools & Cloud:</strong><br>${renderSkillTags({ t: data.skills.tools })}</div>` : ''}
            ${data.skills.security ? `<div style="margin-bottom:8px;"><strong style="font-size:8.5pt; color:var(--tpl-primary);">Security / Core:</strong><br>${renderSkillTags({ s: data.skills.security })}</div>` : ''}
          ` : ''}

          <!-- Spoken Languages Section -->
          ${data.languages && data.languages.length > 0 ? `
            <div class="section-title"><i class="fa-solid fa-language"></i> Languages</div>
            ${data.languages.map((l) => `<div class="contact-item"><strong>${escapeHTML(l.name)}:</strong> <span>${escapeHTML(l.fluency || 'Proficient')}</span></div>`).join('')}
          ` : ''}
        </aside>

        <!-- Main Body -->
        <main class="main-content">
          <!-- Professional Summary -->
          ${data.summary ? `
            <div class="section-title" style="margin-top:0;"><i class="fa-solid fa-user"></i> Professional Summary</div>
            <p style="margin-bottom:14px;">${escapeHTML(data.summary)}</p>
          ` : ''}

          <!-- Work Experience -->
          ${data.experience && data.experience.length > 0 ? `
            <div class="section-title"><i class="fa-solid fa-briefcase"></i> Work Experience</div>
            ${data.experience.map((exp) => `
              <div class="timeline-item">
                <div style="display:flex; justify-content:space-between; align-items:baseline;">
                  <div class="item-role">${escapeHTML(exp.role)}</div>
                  <div class="item-date">${escapeHTML(exp.startDate)} - ${exp.current ? 'Present' : escapeHTML(exp.endDate)}</div>
                </div>
                <div class="item-company">${escapeHTML(exp.company)} ${exp.location ? `· ${escapeHTML(exp.location)}` : ''}</div>
                <div style="margin-top:4px;">${formatBullets(exp.description)}</div>
              </div>
            `).join('')}
          ` : ''}

          <!-- Projects -->
          ${data.projects && data.projects.length > 0 ? `
            <div class="section-title"><i class="fa-solid fa-diagram-project"></i> Key Projects</div>
            ${data.projects.map((proj) => `
              <div class="timeline-item">
                <div style="display:flex; justify-content:space-between; align-items:baseline;">
                  <div class="item-role">${escapeHTML(proj.title)}</div>
                  ${proj.techStack ? `<div class="item-date" style="color:var(--tpl-accent); font-weight:600;">${escapeHTML(proj.techStack)}</div>` : ''}
                </div>
                <div style="font-size:8.5pt; color:var(--tpl-text-muted); margin-bottom:3px;">
                  ${proj.link ? `<a href="${proj.link}" target="_blank"><i class="fa-solid fa-link"></i> Live Demo</a> ` : ''}
                  ${proj.github ? `<a href="${proj.github}" target="_blank" style="margin-left:8px;"><i class="fa-brands fa-github"></i> Source</a>` : ''}
                </div>
                <div>${formatBullets(proj.description)}</div>
              </div>
            `).join('')}
          ` : ''}

          <!-- Education -->
          ${data.education && data.education.length > 0 ? `
            <div class="section-title"><i class="fa-solid fa-graduation-cap"></i> Education</div>
            ${data.education.map((edu) => `
              <div class="timeline-item">
                <div style="display:flex; justify-content:space-between; align-items:baseline;">
                  <div class="item-role">${escapeHTML(edu.degree)}</div>
                  <div class="item-date">${escapeHTML(edu.startDate)} - ${escapeHTML(edu.endDate)}</div>
                </div>
                <div class="item-company">${escapeHTML(edu.institution)} ${edu.location ? `· ${escapeHTML(edu.location)}` : ''}</div>
                ${edu.gpa ? `<div style="font-size:8.5pt; font-weight:600; color:var(--tpl-text-muted);">GPA / Grade: ${escapeHTML(edu.gpa)}</div>` : ''}
                ${edu.details ? `<div style="font-size:8.5pt; margin-top:2px;">${escapeHTML(edu.details)}</div>` : ''}
              </div>
            `).join('')}
          ` : ''}

          <!-- Certifications -->
          ${data.certifications && data.certifications.length > 0 ? `
            <div class="section-title"><i class="fa-solid fa-certificate"></i> Certifications</div>
            ${data.certifications.map((c) => `
              <div style="margin-bottom:8px; display:flex; justify-content:space-between;">
                <div><strong>${escapeHTML(c.name)}</strong> · <span style="color:var(--tpl-accent);">${escapeHTML(c.issuer)}</span></div>
                <div style="font-size:8.5pt; color:var(--tpl-text-muted);">${escapeHTML(c.date)}</div>
              </div>
            `).join('')}
          ` : ''}
        </main>
      </div>
    `;
  };

  /**
   * Template 2: Executive Minimalist (Clean Single Column)
   */
  const renderExecutive = (data) => {
    const p = data.personalInfo || {};
    return `
      <div class="tpl-executive">
        <header class="header-top">
          <div class="header-name">${escapeHTML(p.fullName || 'Your Name')}</div>
          <div class="header-title">${escapeHTML(p.jobTitle || 'Professional Title')}</div>
          <div class="contact-bar">
            ${p.email ? `<span><i class="fa-solid fa-envelope"></i> ${escapeHTML(p.email)}</span>` : ''}
            ${p.phone ? `<span><i class="fa-solid fa-phone"></i> ${escapeHTML(p.phone)}</span>` : ''}
            ${p.location ? `<span><i class="fa-solid fa-location-dot"></i> ${escapeHTML(p.location)}</span>` : ''}
            ${p.website ? `<span><i class="fa-solid fa-globe"></i> ${escapeHTML(p.website.replace(/^https?:\/\//, ''))}</span>` : ''}
            ${p.linkedin ? `<span><i class="fa-brands fa-linkedin"></i> ${escapeHTML(p.linkedin.replace(/^https?:\/\//, ''))}</span>` : ''}
            ${p.github ? `<span><i class="fa-brands fa-github"></i> ${escapeHTML(p.github.replace(/^https?:\/\//, ''))}</span>` : ''}
          </div>
        </header>

        ${data.summary ? `
          <div class="section-title">Executive Summary</div>
          <p style="margin-bottom:12px;">${escapeHTML(data.summary)}</p>
        ` : ''}

        ${data.experience && data.experience.length > 0 ? `
          <div class="section-title">Professional Experience</div>
          ${data.experience.map((exp) => `
            <div style="margin-bottom:14px;">
              <div class="timeline-header">
                <div><strong style="font-size:10.5pt; color:var(--tpl-primary);">${escapeHTML(exp.role)}</strong> — <span style="font-weight:600; color:var(--tpl-accent);">${escapeHTML(exp.company)}</span></div>
                <div style="font-size:8.5pt; color:var(--tpl-text-muted);">${escapeHTML(exp.startDate)} – ${exp.current ? 'Present' : escapeHTML(exp.endDate)}</div>
              </div>
              <div style="margin-top:3px;">${formatBullets(exp.description)}</div>
            </div>
          `).join('')}
        ` : ''}

        ${data.projects && data.projects.length > 0 ? `
          <div class="section-title">Key Projects & Initiatives</div>
          ${data.projects.map((proj) => `
            <div style="margin-bottom:12px;">
              <div class="timeline-header">
                <div><strong style="font-size:10pt;">${escapeHTML(proj.title)}</strong> ${proj.techStack ? `<span style="font-size:8.5pt; color:var(--tpl-text-muted);">(${escapeHTML(proj.techStack)})</span>` : ''}</div>
                <div style="font-size:8.5pt;">${proj.link ? `<a href="${proj.link}" target="_blank">Demo</a>` : ''}</div>
              </div>
              <div>${formatBullets(proj.description)}</div>
            </div>
          `).join('')}
        ` : ''}

        ${data.education && data.education.length > 0 ? `
          <div class="section-title">Education</div>
          ${data.education.map((edu) => `
            <div style="margin-bottom:10px;">
              <div class="timeline-header">
                <div><strong>${escapeHTML(edu.degree)}</strong>, ${escapeHTML(edu.institution)}</div>
                <div style="font-size:8.5pt; color:var(--tpl-text-muted);">${escapeHTML(edu.startDate)} – ${escapeHTML(edu.endDate)}</div>
              </div>
              ${edu.details ? `<div style="font-size:8.5pt;">${escapeHTML(edu.details)}</div>` : ''}
            </div>
          `).join('')}
        ` : ''}

        ${data.skills ? `
          <div class="section-title">Core Competencies & Technologies</div>
          <div style="font-size:9pt; line-height:1.6;">
            ${data.skills.languages ? `<div><strong>Programming Languages:</strong> ${escapeHTML(data.skills.languages)}</div>` : ''}
            ${data.skills.frontend ? `<div><strong>Frontend & Architecture:</strong> ${escapeHTML(data.skills.frontend)}</div>` : ''}
            ${data.skills.tools ? `<div><strong>Tools & Platforms:</strong> ${escapeHTML(data.skills.tools)}</div>` : ''}
            ${data.skills.security ? `<div><strong>Security & Concepts:</strong> ${escapeHTML(data.skills.security)}</div>` : ''}
          </div>
        ` : ''}

        ${data.languages && data.languages.length > 0 ? `
          <div class="section-title">Languages & Proficiency</div>
          <div style="font-size:9pt; display:flex; flex-wrap:wrap; gap:16px; margin-bottom:8px;">
            ${data.languages.map((l) => `<span><strong>${escapeHTML(l.name)}:</strong> <span style="color:var(--tpl-text-muted);">${escapeHTML(l.fluency || 'Proficient')}</span></span>`).join('')}
          </div>
        ` : ''}

        ${data.certifications && data.certifications.length > 0 ? `
          <div class="section-title">Certifications & Credentials</div>
          ${data.certifications.map((c) => `
            <div style="margin-bottom:6px; display:flex; justify-content:space-between; font-size:9pt;">
              <div><strong>${escapeHTML(c.name)}</strong> — <span style="color:var(--tpl-accent);">${escapeHTML(c.issuer)}</span></div>
              <div style="font-size:8.5pt; color:var(--tpl-text-muted);">${escapeHTML(c.date)}</div>
            </div>
          `).join('')}
        ` : ''}
      </div>
    `;
  };

  /**
   * Template 3: Creative Designer (Header Banner)
   */
  const renderCreative = (data) => {
    const p = data.personalInfo || {};
    const photoHTML = data.photoUrl
      ? `<img src="${data.photoUrl}" class="profile-photo" alt="Avatar" />`
      : '';

    return `
      <div class="tpl-creative">
        <header class="header-banner">
          ${photoHTML}
          <div style="flex:1;">
            <div class="header-name">${escapeHTML(p.fullName || 'Your Name')}</div>
            <div class="header-title">${escapeHTML(p.jobTitle || 'Creative Professional')}</div>
            <div style="display:flex; flex-wrap:wrap; gap:12px; font-size:8.5pt; margin-top:8px; opacity:0.9;">
              ${p.email ? `<span><i class="fa-solid fa-envelope"></i> ${escapeHTML(p.email)}</span>` : ''}
              ${p.phone ? `<span><i class="fa-solid fa-phone"></i> ${escapeHTML(p.phone)}</span>` : ''}
              ${p.location ? `<span><i class="fa-solid fa-location-dot"></i> ${escapeHTML(p.location)}</span>` : ''}
              ${p.linkedin ? `<span><i class="fa-brands fa-linkedin"></i> LinkedIn</span>` : ''}
              ${p.github ? `<span><i class="fa-brands fa-github"></i> GitHub</span>` : ''}
            </div>
          </div>
        </header>

        <div class="body-content">
          <!-- Main Left Column -->
          <div>
            ${data.summary ? `
              <div class="section-title">About Me</div>
              <p style="margin-bottom:14px;">${escapeHTML(data.summary)}</p>
            ` : ''}

            ${data.experience && data.experience.length > 0 ? `
              <div class="section-title">Work Experience</div>
              ${data.experience.map((exp) => `
                <div style="margin-bottom:14px;">
                  <div style="display:flex; justify-content:space-between; align-items:baseline;">
                    <strong style="font-size:10.5pt; color:var(--tpl-primary);">${escapeHTML(exp.role)}</strong>
                    <span style="font-size:8.5pt; color:var(--tpl-text-muted);">${escapeHTML(exp.startDate)} – ${exp.current ? 'Present' : escapeHTML(exp.endDate)}</span>
                  </div>
                  <div style="font-weight:600; color:var(--tpl-accent); font-size:9pt; margin-bottom:4px;">${escapeHTML(exp.company)}</div>
                  <div>${formatBullets(exp.description)}</div>
                </div>
              `).join('')}
            ` : ''}

            ${data.projects && data.projects.length > 0 ? `
              <div class="section-title">Featured Projects</div>
              ${data.projects.map((proj) => `
                <div style="margin-bottom:12px;">
                  <div style="display:flex; justify-content:space-between; align-items:baseline;">
                    <strong>${escapeHTML(proj.title)}</strong>
                    <span style="font-size:8pt; color:var(--tpl-accent); font-weight:600;">${escapeHTML(proj.techStack || '')}</span>
                  </div>
                  <div>${formatBullets(proj.description)}</div>
                </div>
              `).join('')}
            ` : ''}
          </div>

          <!-- Right Column -->
          <div style="border-left:1px solid var(--tpl-border); padding-left:20px;">
            ${data.skills ? `
              <div class="section-title">Skills & Stack</div>
              <div style="margin-bottom:14px;">${renderSkillTags(data.skills)}</div>
            ` : ''}

            ${data.education && data.education.length > 0 ? `
              <div class="section-title">Education</div>
              ${data.education.map((edu) => `
                <div style="margin-bottom:10px;">
                  <strong style="font-size:9.5pt;">${escapeHTML(edu.degree)}</strong>
                  <div style="font-size:8.5pt; color:var(--tpl-accent);">${escapeHTML(edu.institution)}</div>
                  <div style="font-size:8pt; color:var(--tpl-text-muted);">${escapeHTML(edu.startDate)} – ${escapeHTML(edu.endDate)}</div>
                </div>
              `).join('')}
            ` : ''}

            ${data.languages && data.languages.length > 0 ? `
              <div class="section-title">Languages</div>
              <div style="margin-bottom:12px; font-size:8.5pt;">
                ${data.languages.map((l) => `<div style="margin-bottom:4px;"><strong>${escapeHTML(l.name)}:</strong> <span style="color:var(--tpl-text-muted);">${escapeHTML(l.fluency || 'Proficient')}</span></div>`).join('')}
              </div>
            ` : ''}

            ${data.certifications && data.certifications.length > 0 ? `
              <div class="section-title">Certificates</div>
              ${data.certifications.map((c) => `
                <div style="margin-bottom:8px; font-size:8.5pt;">
                  <strong>${escapeHTML(c.name)}</strong><br>
                  <span style="color:var(--tpl-text-muted);">${escapeHTML(c.issuer)} (${escapeHTML(c.date)})</span>
                </div>
              `).join('')}
            ` : ''}
          </div>
        </div>
      </div>
    `;
  };

  /**
   * Template 4: Cyber Dark / Terminal
   */
  const renderCyber = (data) => {
    const p = data.personalInfo || {};
    return `
      <div class="tpl-cyber">
        <header class="terminal-bar">
          <div style="font-size:8pt; color:#64748b; margin-bottom:4px;">// SYSTEM_TERMINAL v2.8.0 :: RESUME_EXEC</div>
          <div class="header-name">${escapeHTML(p.fullName || 'ROOT_USER')}</div>
          <div class="header-title">> ${escapeHTML(p.jobTitle || 'SECURITY_ENGINEER')}</div>
          <div style="display:flex; flex-wrap:wrap; gap:16px; font-size:8.5pt; margin-top:8px; color:#94a3b8;">
            ${p.email ? `<span>[EMAIL] ${escapeHTML(p.email)}</span>` : ''}
            ${p.phone ? `<span>[PHONE] ${escapeHTML(p.phone)}</span>` : ''}
            ${p.location ? `<span>[LOCATION] ${escapeHTML(p.location)}</span>` : ''}
            ${p.github ? `<span>[GITHUB] ${escapeHTML(p.github.replace(/^https?:\/\//, ''))}</span>` : ''}
          </div>
        </header>

        ${data.summary ? `
          <div class="section-title">MISSION_PROFILE</div>
          <p style="color:#cbd5e1; margin-bottom:14px;">${escapeHTML(data.summary)}</p>
        ` : ''}

        ${data.experience && data.experience.length > 0 ? `
          <div class="section-title">DEPLOYED_EXPERIENCE</div>
          ${data.experience.map((exp) => `
            <div style="margin-bottom:14px; border-left:2px solid #00f2fe; padding-left:12px;">
              <div style="display:flex; justify-content:space-between; color:#ffffff;">
                <strong>${escapeHTML(exp.role)} @ ${escapeHTML(exp.company)}</strong>
                <span style="color:#00f2fe; font-size:8pt;">[${escapeHTML(exp.startDate)} -> ${exp.current ? 'NOW' : escapeHTML(exp.endDate)}]</span>
              </div>
              <div style="color:#cbd5e1; font-size:8.5pt; margin-top:4px;">${formatBullets(exp.description)}</div>
            </div>
          `).join('')}
        ` : ''}

        ${data.projects && data.projects.length > 0 ? `
          <div class="section-title">MISSION_PROJECTS</div>
          ${data.projects.map((proj) => `
            <div style="margin-bottom:10px;">
              <div style="color:#00f2fe; font-weight:700;"># ${escapeHTML(proj.title)} <span style="color:#a855f7; font-size:8pt;">(${escapeHTML(proj.techStack || '')})</span></div>
              <div style="color:#cbd5e1; font-size:8.5pt;">${formatBullets(proj.description)}</div>
            </div>
          `).join('')}
        ` : ''}

        ${data.skills ? `
          <div class="section-title">WEAPONRY_&_TECH_STACK</div>
          <div>${renderSkillTags(data.skills)}</div>
        ` : ''}

        ${data.education && data.education.length > 0 ? `
          <div class="section-title">ACADEMIC_CREDENTIALS</div>
          ${data.education.map((edu) => `
            <div style="margin-bottom:8px; font-size:8.5pt; color:#cbd5e1;">
              <strong>${escapeHTML(edu.degree)}</strong> — ${escapeHTML(edu.institution)} <span style="color:#00f2fe;">[${escapeHTML(edu.startDate)}-${escapeHTML(edu.endDate)}]</span>
            </div>
          `).join('')}
        ` : ''}

        ${data.languages && data.languages.length > 0 ? `
          <div class="section-title">SPOKEN_LANGUAGES_&_PROTOCOLS</div>
          <div style="font-size:8.5pt; color:#cbd5e1; margin-bottom:10px; display:flex; flex-wrap:wrap; gap:12px;">
            ${data.languages.map((l) => `<span><strong style="color:#00f2fe;">[${escapeHTML(l.name)}]</strong>: ${escapeHTML(l.fluency || 'Proficient')}</span>`).join('')}
          </div>
        ` : ''}

        ${data.certifications && data.certifications.length > 0 ? `
          <div class="section-title">SECURITY_CERTIFICATIONS</div>
          ${data.certifications.map((c) => `
            <div style="margin-bottom:6px; font-size:8.5pt; color:#cbd5e1;">
              <strong style="color:#38ef7d;">${escapeHTML(c.name)}</strong> — ${escapeHTML(c.issuer)} [${escapeHTML(c.date)}]
            </div>
          `).join('')}
        ` : ''}
      </div>
    `;
  };

  /**
   * Template 5: Ivy League Academic (Serif Single Column)
   */
  const renderAcademic = (data) => {
    const p = data.personalInfo || {};
    return `
      <div class="tpl-academic">
        <header class="header-top">
          <div class="header-name">${escapeHTML(p.fullName || 'Your Name')}</div>
          <div class="header-title">${escapeHTML(p.jobTitle || 'Academic & Research Professional')}</div>
          <div style="display:flex; justify-content:center; flex-wrap:wrap; gap:16px; font-size:9pt; color:var(--tpl-text-muted); margin-top:8px;">
            ${p.email ? `<span>${escapeHTML(p.email)}</span>` : ''}
            ${p.phone ? `<span>${escapeHTML(p.phone)}</span>` : ''}
            ${p.location ? `<span>${escapeHTML(p.location)}</span>` : ''}
            ${p.website ? `<span>${escapeHTML(p.website.replace(/^https?:\/\//, ''))}</span>` : ''}
            ${p.linkedin ? `<span>LinkedIn: ${escapeHTML(p.linkedin.replace(/^https?:\/\//, ''))}</span>` : ''}
          </div>
        </header>

        ${data.summary ? `
          <div class="section-title">Scholarly / Executive Profile</div>
          <p style="margin-bottom:14px; text-align:justify;">${escapeHTML(data.summary)}</p>
        ` : ''}

        ${data.education && data.education.length > 0 ? `
          <div class="section-title">Education & Academic Background</div>
          ${data.education.map((edu) => `
            <div style="margin-bottom:12px;">
              <div style="display:flex; justify-content:space-between;">
                <strong>${escapeHTML(edu.degree)}</strong>
                <span>${escapeHTML(edu.startDate)} – ${escapeHTML(edu.endDate)}</span>
              </div>
              <div style="font-style:italic; color:var(--tpl-accent);">${escapeHTML(edu.institution)} ${edu.location ? `— ${escapeHTML(edu.location)}` : ''}</div>
              ${edu.gpa ? `<div style="font-size:8.5pt;">Academic Distinction / GPA: ${escapeHTML(edu.gpa)}</div>` : ''}
              ${edu.details ? `<div style="font-size:8.5pt; margin-top:2px;">${escapeHTML(edu.details)}</div>` : ''}
            </div>
          `).join('')}
        ` : ''}

        ${data.experience && data.experience.length > 0 ? `
          <div class="section-title">Professional Appointments & Experience</div>
          ${data.experience.map((exp) => `
            <div style="margin-bottom:14px;">
              <div style="display:flex; justify-content:space-between;">
                <strong>${escapeHTML(exp.role)}</strong>
                <span>${escapeHTML(exp.startDate)} – ${exp.current ? 'Present' : escapeHTML(exp.endDate)}</span>
              </div>
              <div style="font-style:italic; margin-bottom:4px;">${escapeHTML(exp.company)}</div>
              <div>${formatBullets(exp.description)}</div>
            </div>
          `).join('')}
        ` : ''}

        ${data.projects && data.projects.length > 0 ? `
          <div class="section-title">Research & Technical Projects</div>
          ${data.projects.map((proj) => `
            <div style="margin-bottom:12px;">
              <div style="display:flex; justify-content:space-between;">
                <strong>${escapeHTML(proj.title)}</strong>
                ${proj.techStack ? `<span style="font-style:italic; font-size:8.5pt;">(${escapeHTML(proj.techStack)})</span>` : ''}
              </div>
              <div>${formatBullets(proj.description)}</div>
            </div>
          `).join('')}
        ` : ''}

        ${data.skills ? `
          <div class="section-title">Technical Proficiencies & Competencies</div>
          <div style="font-size:9pt; line-height:1.6;">
            ${data.skills.languages ? `<div><strong>Programming Languages:</strong> ${escapeHTML(data.skills.languages)}</div>` : ''}
            ${data.skills.frontend ? `<div><strong>Web & Frameworks:</strong> ${escapeHTML(data.skills.frontend)}</div>` : ''}
            ${data.skills.tools ? `<div><strong>Tools & Platforms:</strong> ${escapeHTML(data.skills.tools)}</div>` : ''}
            ${data.skills.security ? `<div><strong>Specializations:</strong> ${escapeHTML(data.skills.security)}</div>` : ''}
          </div>
        ` : ''}

        ${data.languages && data.languages.length > 0 ? `
          <div class="section-title">Languages & Fluency</div>
          <div style="font-size:9pt; display:flex; flex-wrap:wrap; gap:16px; margin-bottom:8px;">
            ${data.languages.map((l) => `<span><strong>${escapeHTML(l.name)}:</strong> ${escapeHTML(l.fluency || 'Proficient')}</span>`).join('')}
          </div>
        ` : ''}

        ${data.certifications && data.certifications.length > 0 ? `
          <div class="section-title">Certifications & Honors</div>
          ${data.certifications.map((c) => `
            <div style="margin-bottom:6px; display:flex; justify-content:space-between; font-size:9pt;">
              <div><strong>${escapeHTML(c.name)}</strong> — ${escapeHTML(c.issuer)}</div>
              <div>${escapeHTML(c.date)}</div>
            </div>
          `).join('')}
        ` : ''}
      </div>
    `;
  };

  /**
   * Template 6: Compact Pro 1-Page
   */
  const renderCompact = (data) => {
    const p = data.personalInfo || {};
    return `
      <div class="tpl-compact">
        <header class="header-top">
          <div>
            <div class="header-name">${escapeHTML(p.fullName || 'Your Name')}</div>
            <div class="header-title">${escapeHTML(p.jobTitle || 'Professional Title')}</div>
          </div>
          <div style="text-align:right; font-size:8pt; color:var(--tpl-text-muted);">
            ${p.email ? `<div>${escapeHTML(p.email)}</div>` : ''}
            ${p.phone ? `<div>${escapeHTML(p.phone)}</div>` : ''}
            ${p.location ? `<div>${escapeHTML(p.location)}</div>` : ''}
          </div>
        </header>

        <div class="grid-layout">
          <div>
            ${data.summary ? `
              <div class="section-title">Summary</div>
              <p style="margin-bottom:8px;">${escapeHTML(data.summary)}</p>
            ` : ''}

            ${data.experience && data.experience.length > 0 ? `
              <div class="section-title">Experience</div>
              ${data.experience.map((exp) => `
                <div style="margin-bottom:8px;">
                  <div style="display:flex; justify-content:space-between;">
                    <strong>${escapeHTML(exp.role)}</strong>
                    <span style="color:var(--tpl-text-muted); font-size:7.5pt;">${escapeHTML(exp.startDate)}–${exp.current ? 'Pres' : escapeHTML(exp.endDate)}</span>
                  </div>
                  <div style="color:var(--tpl-accent); font-weight:600;">${escapeHTML(exp.company)}</div>
                  <div>${formatBullets(exp.description)}</div>
                </div>
              `).join('')}
            ` : ''}

            ${data.projects && data.projects.length > 0 ? `
              <div class="section-title">Projects</div>
              ${data.projects.map((proj) => `
                <div style="margin-bottom:6px;">
                  <strong>${escapeHTML(proj.title)}</strong> ${proj.techStack ? `<span style="font-size:7.5pt; color:var(--tpl-text-muted);">(${escapeHTML(proj.techStack)})</span>` : ''}
                  <div>${formatBullets(proj.description)}</div>
                </div>
              `).join('')}
            ` : ''}
          </div>

          <div>
            ${data.skills ? `
              <div class="section-title">Skills</div>
              <div style="font-size:8pt;">
                ${data.skills.languages ? `<div><strong>Languages:</strong> ${escapeHTML(data.skills.languages)}</div>` : ''}
                ${data.skills.frontend ? `<div><strong>Web & UI:</strong> ${escapeHTML(data.skills.frontend)}</div>` : ''}
                ${data.skills.tools ? `<div><strong>Tools:</strong> ${escapeHTML(data.skills.tools)}</div>` : ''}
                ${data.skills.security ? `<div><strong>Security/Core:</strong> ${escapeHTML(data.skills.security)}</div>` : ''}
              </div>
            ` : ''}

            ${data.education && data.education.length > 0 ? `
              <div class="section-title">Education</div>
              ${data.education.map((edu) => `
                <div style="margin-bottom:6px;">
                  <strong>${escapeHTML(edu.degree)}</strong>
                  <div style="color:var(--tpl-text-muted);">${escapeHTML(edu.institution)}</div>
                  <div style="font-size:7.5pt;">${escapeHTML(edu.startDate)}–${escapeHTML(edu.endDate)}</div>
                </div>
              `).join('')}
            ` : ''}

            ${data.languages && data.languages.length > 0 ? `
              <div class="section-title">Languages</div>
              <div style="font-size:8pt; margin-bottom:6px;">
                ${data.languages.map((l) => `<div><strong>${escapeHTML(l.name)}</strong>: ${escapeHTML(l.fluency || 'Proficient')}</div>`).join('')}
              </div>
            ` : ''}

            ${data.certifications && data.certifications.length > 0 ? `
              <div class="section-title">Certifications</div>
              ${data.certifications.map((c) => `
                <div style="font-size:8pt; margin-bottom:4px;">
                  <strong>${escapeHTML(c.name)}</strong> (${escapeHTML(c.date)})
                </div>
              `).join('')}
            ` : ''}
          </div>
        </div>
      </div>
    `;
  };

  /**
   * Main Render Dispatcher
   */
  const render = (resumeData) => {
    if (!resumeData) return '<div style="padding:40px; text-align:center;">No resume data available.</div>';

    const tpl = resumeData.template || 'tpl-modern-tech';
    let htmlContent = '';

    switch (tpl) {
      case 'tpl-executive':
        htmlContent = renderExecutive(resumeData);
        break;
      case 'tpl-creative':
        htmlContent = renderCreative(resumeData);
        break;
      case 'tpl-cyber':
        htmlContent = renderCyber(resumeData);
        break;
      case 'tpl-academic':
        htmlContent = renderAcademic(resumeData);
        break;
      case 'tpl-compact':
        htmlContent = renderCompact(resumeData);
        break;
      case 'tpl-modern-tech':
      default:
        htmlContent = renderModernTech(resumeData);
        break;
    }

    // Wrap with custom CSS variables
    const customStyles = `
      --tpl-accent: ${resumeData.themeColor || '#4f7df9'};
      --tpl-font: ${resumeData.fontFamily || "'Plus Jakarta Sans', sans-serif"};
      font-size: ${resumeData.fontSize || '9.5pt'};
    `;

    return `<div class="resume-paper ${tpl}" style="${customStyles}">${htmlContent}</div>`;
  };

  return {
    render,
  };
})();

if (typeof window !== 'undefined') window.TemplateEngine = TemplateEngine;
if (typeof globalThis !== 'undefined') globalThis.TemplateEngine = TemplateEngine;

