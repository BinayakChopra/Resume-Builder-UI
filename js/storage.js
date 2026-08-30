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

  // Generic, professional sample resume data (Alex Morgan)
  const SAMPLE_RESUME_DATA = {
    id: 'sample-alex-morgan',
    title: 'Senior Software Engineer & Cloud Architect',
    template: 'tpl-modern-tech',
    themeColor: '#4f7df9',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: '9.5pt',
    spacing: 'normal',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    photoShape: 'circle',
    photoSize: 90,
    personalInfo: {
      fullName: 'Alex Morgan',
      jobTitle: 'Senior Full Stack Engineer & Cloud Architect',
      email: 'alex.morgan@example.com',
      phone: '+1 (555) 234-5678',
      location: 'San Francisco, CA',
      website: 'https://alexmorgan.dev',
      linkedin: 'https://linkedin.com/in/alexmorgan-dev',
      github: 'https://github.com/alexmorgan-dev',
    },
    summary:
      'Results-driven Senior Full Stack Engineer & Cloud Architect with 5+ years of experience engineering high-scale distributed systems, microservices, and reactive web applications. Spearheaded cloud architecture migrations reducing API latency by 42% and automated CI/CD pipelines scaling to 2M+ active users. Passionate about clean code, system reliability, and mentoring engineering teams.',
    experience: [
      {
        id: 'exp-1',
        role: 'Senior Software Engineer',
        company: 'Nexus Cloud Systems',
        location: 'San Francisco, CA',
        startDate: 'Jan 2023',
        endDate: 'Present',
        current: true,
        description:
          '• Architected high-throughput microservices using Node.js, Go, and Kubernetes, reducing server latency by 42% across 2M+ daily active users.\n• Spearheaded the migration from monolithic architecture to event-driven serverless functions on AWS, cutting monthly infrastructure costs by $35,000.\n• Mentored 8 junior and mid-level software engineers on scalable frontend design patterns and automated end-to-end testing.',
      },
      {
        id: 'exp-2',
        role: 'Full Stack Developer',
        company: 'Horizon Tech Labs',
        location: 'Austin, TX',
        startDate: 'Jun 2021',
        endDate: 'Dec 2022',
        current: false,
        description:
          '• Developed responsive, high-accessibility web applications using React.js, TypeScript, and Tailwind CSS, increasing user engagement by 28%.\n• Engineered secure RESTful and GraphQL APIs integrated with PostgreSQL and Redis caching layers.\n• Automated continuous integration and deployment pipelines using GitHub Actions and Docker, reducing release cycle time by 60%.',
      },
    ],
    education: [
      {
        id: 'edu-1',
        degree: 'Bachelor of Science in Computer Science',
        institution: 'University of California, Berkeley',
        location: 'Berkeley, CA',
        startDate: '2017',
        endDate: '2021',
        gpa: '3.9 / 4.0',
        details: 'Dean’s Honor List. Focus on Distributed Systems, Algorithms, Computer Security, and Database Management.',
      },
    ],
    skills: {
      languages: 'TypeScript, JavaScript (ES6+), Python, Go, Java, SQL, HTML5/CSS3',
      frontend: 'React.js, Next.js, Vue.js, Tailwind CSS, Redux Toolkit, Webpack, Vite, UI/UX Design',
      backend: 'Node.js, Express, FastAPI, GraphQL, RESTful APIs, Microservices, gRPC',
      cloud: 'AWS (ECS, Lambda, S3, RDS), Docker, Kubernetes, Terraform, CI/CD, Redis, PostgreSQL, MongoDB',
    },
    projects: [
      {
        id: 'proj-1',
        title: 'CloudScale — Distributed Metrics Engine',
        role: 'Lead Architect',
        techStack: 'Go, React, Docker, Prometheus, Grafana',
        link: 'https://github.com/alexmorgan-dev',
        github: 'https://github.com/alexmorgan-dev/cloudscale',
        description:
          '• Engineered a distributed telemetry engine handling over 50,000 events/sec with sub-millisecond query response.\n• Built an interactive dashboard visualizing real-time cluster health and automated anomaly alerts.',
      },
      {
        id: 'proj-2',
        title: 'AI Document Intelligence Platform',
        role: 'Full-Stack Developer',
        techStack: 'Python, FastAPI, Next.js, OpenAI API, PostgreSQL',
        link: 'https://github.com/alexmorgan-dev',
        github: 'https://github.com/alexmorgan-dev/doc-intelligence',
        description:
          '• Built a high-accuracy document parsing engine extracting structured JSON data from complex multi-page PDF documents.',
      },
    ],
    certifications: [
      {
        id: 'cert-1',
        name: 'AWS Certified Solutions Architect – Professional',
        issuer: 'Amazon Web Services',
        date: '2024',
        credentialId: 'AWS-PSA-882194',
      },
      {
        id: 'cert-2',
        name: 'Certified Kubernetes Administrator (CKA)',
        issuer: 'Cloud Native Computing Foundation (CNCF)',
        date: '2023',
        credentialId: 'CKA-99210-2023',
      },
    ],
    languages: [
      { id: 'lang-1', name: 'English', fluency: 'Native / Bilingual' },
      { id: 'lang-2', name: 'Spanish', fluency: 'Professional Working' },
      { id: 'lang-3', name: 'French', fluency: 'Conversational' },
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
        id: 'user_guest_demo',
        name: 'Guest User',
        username: 'guest',
        email: 'guest@resumeflow.ai',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
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
    const target = getResumeById(id);
    if (!target) return null;

    const copy = JSON.parse(JSON.stringify(target));
    copy.id = 'res_' + Date.now();
    copy.title = (copy.title || 'Untitled') + ' (Copy)';
    copy.updatedAt = new Date().toISOString();

    const list = getAllResumes();
    list.unshift(copy);
    setJSON(KEYS.RESUMES_LIST, list);
    return copy;
  };

  const createNewResume = (title = 'My New Resume', template = 'tpl-modern-tech') => {
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
        fullName: '',
        jobTitle: '',
        email: '',
        phone: '',
        location: '',
        website: '',
        linkedin: '',
        github: '',
      },
      summary: '',
      experience: [],
      education: [],
      skills: {
        languages: '',
        frameworks: '',
        tools: '',
        cloud: '',
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

  const exportAsJSON = (resumeData) => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(resumeData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${(resumeData.personalInfo?.fullName || 'resume').replace(/\s+/g, '_')}_backup.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importFromJSON = (file, callback) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed && typeof parsed === 'object') {
          parsed.id = 'res_' + Date.now();
          parsed.title = (parsed.title || 'Imported Resume') + ' (Imported)';
          saveResume(parsed);
          if (callback) callback(parsed);
        }
      } catch (err) {
        console.error('Failed to parse JSON file:', err);
        alert('Invalid JSON file format.');
      }
    };
    reader.readAsText(file);
  };

  const getSampleResume = () => JSON.parse(JSON.stringify(SAMPLE_RESUME_DATA));

  // Self initialize on load
  initialize();

  return {
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
    exportAsJSON,
    importFromJSON,
    getSampleResume,
  };
})();
