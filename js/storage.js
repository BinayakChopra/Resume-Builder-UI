/**
 * ============================================================================
 * RESUME BUILDER 2.0 — STORAGE & DATA PERSISTENCE SERVICE
 * LocalStorage management, active session, multi-resume storage, sample seeder
 * ============================================================================
 */

const StorageService = (() => {
  const KEYS = {
    USER_SESSION: 'rb_user_session',
    ACTIVE_RESUME_ID: 'rb_active_resume_id',
    RESUMES_LIST: 'rb_resumes_list',
    USER_SETTINGS: 'rb_user_settings',
  };

  // Sample verified profile data for Binayak Chopra
  const SAMPLE_RESUME_DATA = {
    id: 'sample-binayak-chopra',
    title: 'Software Engineer & Security Analyst Resume',
    template: 'tpl-modern-tech',
    themeColor: '#4f7df9',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: '9.5pt',
    spacing: 'normal',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    photoShape: 'circle',
    photoSize: 90,
    personalInfo: {
      fullName: 'Binayak Chopra',
      jobTitle: 'Frontend Engineer & Security Enthusiast',
      email: 'binayakchopra34@gmail.com',
      phone: '+91 98765 43210',
      location: 'Amritsar, Punjab, India',
      website: 'https://portfolio-binayak.vercel.app',
      linkedin: 'https://linkedin.com/in/binayak-chopra',
      github: 'https://github.com/BinayakChopra',
    },
    summary:
      'Motivated Computer Science Engineering student specializing in modern frontend development and defensive cybersecurity. Experienced in building high-performance, responsive web platforms with React.js, Tailwind CSS, and Docker. Aspiring Cybersecurity Analyst proficient in digital forensics, incident response, and secure software architectures.',
    experience: [
      {
        id: 'exp-1',
        role: 'Full Stack Engineering Intern',
        company: 'CyberSmart Tech Solutions',
        location: 'Remote, India',
        startDate: 'Jun 2025',
        endDate: 'Present',
        current: true,
        description:
          '• Engineered interactive frontend modules using React.js 19 and Tailwind CSS, increasing page load speed by 35%.\n• Designed and containerized scalable web services with Docker and modern CI/CD pipelines.\n• Conducted forensic security assessments and digital artifact inspections across test environments.',
      },
      {
        id: 'exp-2',
        role: 'Lead Frontend Developer',
        company: 'University Developer Student Club',
        location: 'Punjab, India',
        startDate: 'Aug 2024',
        endDate: 'May 2025',
        current: false,
        description:
          '• Mentored 40+ engineering students in modern JavaScript (ES6+), React state architectures, and responsive UI/UX principles.\n• Led development of 3 flagship university project portals with over 5,000 monthly active users.',
      },
    ],
    education: [
      {
        id: 'edu-1',
        degree: 'Bachelor of Technology (B.Tech) in Computer Science & Engineering',
        institution: 'Lovely Professional University (LPU)',
        location: 'Punjab, India',
        startDate: '2024',
        endDate: '2028',
        gpa: '8.8 / 10.0',
        details: 'Specialization in Software Systems, Algorithms, Computer Forensics & Network Security.',
      },
    ],
    skills: {
      languages: 'Java, C++, C, JavaScript (ES6+), HTML5, CSS3, SQL',
      frontend: 'React.js 19, Tailwind CSS, Framer Motion, Web Audio API, Responsive UI/UX',
      tools: 'Git, GitHub, Docker, MySQL, VS Code, XAMPP, Vercel',
      security: 'Digital Forensics, SOC Fundamentals, Network Protocols, Evidence Analysis',
    },
    projects: [
      {
        id: 'proj-1',
        title: 'Next-Gen Resume Builder UI',
        role: 'Full-Stack Creator',
        techStack: 'JavaScript, React/HTML5, CSS3, Docker',
        link: 'https://resume-builder-ui.onrender.com',
        github: 'https://github.com/BinayakChopra/Resume-Builder-UI.git',
        description:
          '• Built an interactive resume studio featuring real-time ATS scoring, multi-template switching, and vector PDF export.\n• Containerized using Docker for production deployment with zero server latency.',
      },
      {
        id: 'proj-2',
        title: '3D Holographic Developer Portfolio',
        role: 'Designer & Architect',
        techStack: 'React 19, Framer Motion, Web Audio API',
        link: 'https://portfolio-binayak.vercel.app',
        github: 'https://github.com/BinayakChopra',
        description:
          '• Engineered a futuristic glassmorphic portfolio with procedural audio synthesis, 3D card physics, and cyber terminal.',
      },
      {
        id: 'proj-3',
        title: 'Calyx — Smart Assistant Engine',
        role: 'Core Developer',
        techStack: 'HTML5, CSS3, JavaScript ES6+',
        link: '',
        github: 'https://github.com/BinayakChopra',
        description:
          '• Designed a responsive virtual assistant interface with voice synthesis and gesture-driven commands.',
      },
    ],
    certifications: [
      {
        id: 'cert-1',
        name: 'Digital Forensics & Incident Response Specialization',
        issuer: 'CyberSec Institute',
        date: '2025',
        credentialId: 'CS-DFIR-2025-9921',
      },
      {
        id: 'cert-2',
        name: 'Certified Database Management Professional',
        issuer: 'Oracle / NPTEL',
        date: '2024',
        credentialId: 'DBMS-NPTEL-8841',
      },
    ],
    languages: [
      { id: 'lang-1', name: 'English', fluency: 'Fluent / Professional' },
      { id: 'lang-2', name: 'Hindi', fluency: 'Native / Bilingual' },
      { id: 'lang-3', name: 'Punjabi', fluency: 'Native / Bilingual' },
    ],
    customSections: [],
    updatedAt: new Date().toISOString(),
  };

  /**
   * Helper to safely read JSON from localStorage
   */
  const getJSON = (key, fallback = null) => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      console.warn(`StorageService read error for ${key}:`, e);
      return fallback;
    }
  };

  /**
   * Helper to safely write JSON to localStorage
   */
  const setJSON = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error(`StorageService write error for ${key}:`, e);
      return false;
    }
  };

  /**
   * Initialize default state on first launch
   */
  const initialize = () => {
    // Check if user session exists, else create guest session
    if (!getUserSession()) {
      setUserSession({
        id: 'user_binayak_demo',
        name: 'Binayak Chopra',
        username: 'binayak',
        email: 'binayakchopra34@gmail.com',
        avatar: 'photo/user.png',
        isGuest: true,
      });
    }

    // Check if resumes list exists, else seed with sample resume
    const resumes = getAllResumes();
    if (!resumes || resumes.length === 0) {
      saveResume(SAMPLE_RESUME_DATA);
      setActiveResumeId(SAMPLE_RESUME_DATA.id);
    }
  };

  // User Session Management
  const getUserSession = () => getJSON(KEYS.USER_SESSION, null);
  const setUserSession = (user) => setJSON(KEYS.USER_SESSION, user);
  const clearUserSession = () => localStorage.removeItem(KEYS.USER_SESSION);

  // Active Resume ID
  const getActiveResumeId = () => localStorage.getItem(KEYS.ACTIVE_RESUME_ID) || SAMPLE_RESUME_DATA.id;
  const setActiveResumeId = (id) => localStorage.setItem(KEYS.ACTIVE_RESUME_ID, id);

  // Resumes CRUD
  const getAllResumes = () => getJSON(KEYS.RESUMES_LIST, []);

  const getResumeById = (id) => {
    const list = getAllResumes();
    return list.find((r) => r.id === id) || null;
  };

  const getActiveResume = () => {
    const activeId = getActiveResumeId();
    const resume = getResumeById(activeId);
    if (resume) return resume;
    // Fallback to first resume or sample data
    const all = getAllResumes();
    if (all.length > 0) return all[0];
    return SAMPLE_RESUME_DATA;
  };

  const saveResume = (resumeData) => {
    if (!resumeData || !resumeData.id) {
      resumeData.id = 'res_' + Date.now();
    }
    resumeData.updatedAt = new Date().toISOString();

    const list = getAllResumes();
    const index = list.findIndex((r) => r.id === resumeData.id);

    if (index >= 0) {
      list[index] = resumeData;
    } else {
      list.unshift(resumeData);
    }

    setJSON(KEYS.RESUMES_LIST, list);
    setActiveResumeId(resumeData.id);
    return resumeData;
  };

  const deleteResume = (id) => {
    let list = getAllResumes();
    list = list.filter((r) => r.id !== id);
    setJSON(KEYS.RESUMES_LIST, list);

    if (getActiveResumeId() === id) {
      if (list.length > 0) {
        setActiveResumeId(list[0].id);
      } else {
        // Create fresh empty one
        const fresh = createNewResume('Untitled Resume');
        setActiveResumeId(fresh.id);
      }
    }
    return list;
  };

  const duplicateResume = (id) => {
    const original = getResumeById(id);
    if (!original) return null;

    const copy = JSON.parse(JSON.stringify(original));
    copy.id = 'res_' + Date.now();
    copy.title = `${original.title} (Copy)`;
    copy.updatedAt = new Date().toISOString();

    const list = getAllResumes();
    list.unshift(copy);
    setJSON(KEYS.RESUMES_LIST, list);
    return copy;
  };

  const createNewResume = (title = 'New Professional Resume', template = 'tpl-modern-tech') => {
    const newResume = {
      id: 'res_' + Date.now(),
      title: title,
      template: template,
      themeColor: '#4f7df9',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: '9.5pt',
      spacing: 'normal',
      photoUrl: '',
      photoShape: 'circle',
      photoSize: 90,
      personalInfo: {
        fullName: 'Your Name',
        jobTitle: 'Professional Title',
        email: 'your.email@example.com',
        phone: '+1 (555) 000-0000',
        location: 'City, Country',
        website: '',
        linkedin: '',
        github: '',
      },
      summary: 'Write a brief 2-3 sentence overview of your key qualifications, strengths, and career highlights.',
      experience: [],
      education: [],
      skills: {
        languages: 'JavaScript, HTML5, CSS3',
        frontend: 'React, Responsive Design',
        tools: 'Git, VS Code',
        security: '',
      },
      projects: [],
      certifications: [],
      languages: [],
      customSections: [],
      updatedAt: new Date().toISOString(),
    };

    saveResume(newResume);
    return newResume;
  };

  const getSampleData = () => JSON.parse(JSON.stringify(SAMPLE_RESUME_DATA));

  // Export & Import
  const exportAsJSON = (resumeData) => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(resumeData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${(resumeData.title || 'resume').replace(/\s+/g, '_')}_backup.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importFromJSON = (jsonString) => {
    try {
      const data = JSON.parse(jsonString);
      if (data && data.personalInfo) {
        data.id = 'res_' + Date.now();
        data.title = data.title ? `${data.title} (Imported)` : 'Imported Resume';
        saveResume(data);
        return data;
      }
      throw new Error('Invalid resume data format');
    } catch (e) {
      console.error('Import failed:', e);
      throw e;
    }
  };

  return {
    initialize,
    getUserSession,
    setUserSession,
    clearUserSession,
    getActiveResumeId,
    setActiveResumeId,
    getAllResumes,
    getResumeById,
    getActiveResume,
    saveResume,
    deleteResume,
    duplicateResume,
    createNewResume,
    getSampleData,
    exportAsJSON,
    importFromJSON,
  };
})();

// Auto-initialize on script load
StorageService.initialize();
