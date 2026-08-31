/**
 * ============================================================================
 * RESUME BUILDER 2.0 — MULTI-USER STORAGE & AUTHENTICATION SERVICE
 * Complete User Isolation, Account Management, Private Vaults & Security
 * ============================================================================
 */

const StorageService = (() => {
  const KEYS = {
    USERS_REGISTRY: 'rb_users_registry',
    ACTIVE_USER_ID: 'rb_active_user_id',
    THEME: 'rb_theme',
  };

  // Generic Sample Resume Dataset (Available on demand for inspiration)
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

  // Internal keys scoped by User ID
  const getUserResumesKey = (userId) => `rb_user_${userId}_resumes`;
  const getUserActiveResumeKey = (userId) => `rb_user_${userId}_active_res_id`;
  const getUserPlanKey = (userId) => `rb_user_${userId}_plan`;
  const getUserCreditsKey = (userId) => `rb_user_${userId}_ai_credits`;
  const getUserApplicationsKey = (userId) => `rb_user_${userId}_applications`;
  const getUserCoverLettersKey = (userId) => `rb_user_${userId}_cover_letters`;

  /**
   * Get all registered users
   */
  const getUsersRegistry = () => getJSON(KEYS.USERS_REGISTRY, []);

  /**
   * Set registered users
   */
  const setUsersRegistry = (users) => setJSON(KEYS.USERS_REGISTRY, users);

  /**
   * Get currently logged-in user session (returns null if unauthenticated)
   */
  const getUserSession = () => {
    const activeUserId = localStorage.getItem(KEYS.ACTIVE_USER_ID);
    if (!activeUserId) return null;

    const users = getUsersRegistry();
    const user = users.find((u) => u.id === activeUserId);
    if (!user) {
      localStorage.removeItem(KEYS.ACTIVE_USER_ID);
      return null;
    }

    // Return safe user object (excluding plain password if preferred)
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar || 'photo/user.png',
      createdAt: user.createdAt,
    };
  };

  /**
   * Register a new user account
   */
  const registerUser = (name, email, password) => {
    if (!name || !email || !password) {
      return { success: false, error: 'All fields (Name, Email, Password) are required.' };
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    const users = getUsersRegistry();

    // Check if email already registered
    const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      return {
        success: false,
        error: 'An account with this email address already exists. Please sign in instead.',
      };
    }

    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    const userId = 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const newUser = {
      id: userId,
      name: cleanName,
      email: cleanEmail,
      password: password,
      avatar: 'photo/user.png',
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    setUsersRegistry(users);

    // Set active session
    localStorage.setItem(KEYS.ACTIVE_USER_ID, userId);

    // Create an initial private starter resume customized with their name and email
    const starterResume = {
      id: 'res_' + Date.now(),
      title: `${cleanName}'s Professional Resume`,
      template: 'tpl-modern-tech',
      themeColor: '#4f7df9',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: '9.5pt',
      spacing: 'normal',
      photoUrl: '',
      photoShape: 'circle',
      photoSize: 90,
      personalInfo: {
        fullName: cleanName,
        jobTitle: 'Software Engineer / Professional',
        email: cleanEmail,
        phone: '',
        location: '',
        website: '',
        linkedin: '',
        github: '',
      },
      summary: 'Motivated professional with expertise in building scalable solutions and delivering high-impact results.',
      experience: [],
      education: [],
      skills: {
        languages: '',
        frontend: '',
        backend: '',
        tools: '',
      },
      projects: [],
      certifications: [],
      languages: [{ id: 'lang-1', name: 'English', fluency: 'Professional' }],
      customSections: [],
      updatedAt: new Date().toISOString(),
    };

    // Save to this user's private vault
    setJSON(getUserResumesKey(userId), [starterResume]);
    localStorage.setItem(getUserActiveResumeKey(userId), starterResume.id);

    return {
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        avatar: newUser.avatar,
        createdAt: newUser.createdAt,
      },
    };
  };

  /**
   * Log in an existing user
   */
  const loginUser = (email, password) => {
    if (!email || !password) {
      return { success: false, error: 'Please provide both email and password.' };
    }

    const cleanEmail = email.trim().toLowerCase();
    const users = getUsersRegistry();

    const user = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (!user) {
      return { success: false, error: 'No account found with this email. Please create an account.' };
    }

    if (user.password !== password) {
      return { success: false, error: 'Incorrect password. Please try again.' };
    }

    // Set active session
    localStorage.setItem(KEYS.ACTIVE_USER_ID, user.id);

    // Ensure user has at least one resume
    const userResumes = getJSON(getUserResumesKey(user.id), []);
    if (userResumes.length === 0) {
      const initialResume = {
        id: 'res_' + Date.now(),
        title: `${user.name}'s Resume`,
        template: 'tpl-modern-tech',
        themeColor: '#4f7df9',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: '9.5pt',
        spacing: 'normal',
        photoUrl: '',
        photoShape: 'circle',
        photoSize: 90,
        personalInfo: {
          fullName: user.name,
          jobTitle: '',
          email: user.email,
          phone: '',
          location: '',
          website: '',
          linkedin: '',
          github: '',
        },
        summary: '',
        experience: [],
        education: [],
        skills: { languages: '', frontend: '', backend: '', tools: '' },
        projects: [],
        certifications: [],
        languages: [],
        customSections: [],
        updatedAt: new Date().toISOString(),
      };
      setJSON(getUserResumesKey(user.id), [initialResume]);
      localStorage.setItem(getUserActiveResumeKey(user.id), initialResume.id);
    }

    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
    };
  };

  /**
   * 1-Click Demo / Test Account Login (Isolated Demo Vault)
   */
  const loginDemo = () => {
    const demoEmail = 'demo@resumeflow.ai';
    const users = getUsersRegistry();
    let demoUser = users.find((u) => u.email.toLowerCase() === demoEmail);

    if (!demoUser) {
      demoUser = {
        id: 'usr_demo_account',
        name: 'Demo Candidate',
        email: demoEmail,
        password: 'demo_password_123',
        avatar: 'photo/user.png',
        createdAt: new Date().toISOString(),
      };
      users.push(demoUser);
      setUsersRegistry(users);
    }

    localStorage.setItem(KEYS.ACTIVE_USER_ID, demoUser.id);

    // Initialize with a copy of sample data if empty
    const demoResumes = getJSON(getUserResumesKey(demoUser.id), []);
    if (demoResumes.length === 0) {
      const demoCopy = JSON.parse(JSON.stringify(SAMPLE_RESUME_DATA));
      demoCopy.id = 'res_demo_' + Date.now();
      setJSON(getUserResumesKey(demoUser.id), [demoCopy]);
      localStorage.setItem(getUserActiveResumeKey(demoUser.id), demoCopy.id);
    }

    return {
      success: true,
      user: {
        id: demoUser.id,
        name: demoUser.name,
        email: demoUser.email,
        avatar: demoUser.avatar,
        createdAt: demoUser.createdAt,
      },
    };
  };

  /**
   * Log out active user session
   */
  const logoutUser = () => {
    localStorage.removeItem(KEYS.ACTIVE_USER_ID);
    window.location.href = 'login.html';
  };

  /**
   * Auth Guard: Checks if user is signed in. If not, redirects to login.html with return URL.
   */
  const requireAuth = (redirectUrl = window.location.pathname) => {
    const user = getUserSession();
    if (!user) {
      const target = redirectUrl.split('/').pop() || 'builder.html';
      sessionStorage.setItem('rb_auth_redirect', target);
      window.location.href = `login.html?redirect=${encodeURIComponent(target)}`;
      return false;
    }
    return true;
  };

  /**
   * Update active user profile
   */
  const updateUserProfile = (updatedData) => {
    const user = getUserSession();
    if (!user) return false;

    const users = getUsersRegistry();
    const index = users.findIndex((u) => u.id === user.id);
    if (index >= 0) {
      users[index] = { ...users[index], ...updatedData };
      setUsersRegistry(users);
      return true;
    }
    return false;
  };

  // ==========================================================================
  // ACCOUNT-ISOLATED RESUME CRUD (PRIVATE TO ACTIVE USER)
  // ==========================================================================

  /**
   * Get all resumes belonging strictly to the currently logged in user
   */
  const getAllResumes = () => {
    const user = getUserSession();
    if (!user) return [];
    return getJSON(getUserResumesKey(user.id), []);
  };

  /**
   * Get resume by ID within the active user's private vault
   */
  const getResumeById = (id) => {
    const list = getAllResumes();
    return list.find((r) => r.id === id) || null;
  };

  /**
   * Get active resume ID for current user
   */
  const getActiveResumeId = () => {
    const user = getUserSession();
    if (!user) return null;
    return localStorage.getItem(getUserActiveResumeKey(user.id));
  };

  /**
   * Set active resume ID for current user
   */
  const setActiveResumeId = (id) => {
    const user = getUserSession();
    if (!user) return;
    localStorage.setItem(getUserActiveResumeKey(user.id), id);
  };

  /**
   * Get the active resume data for editing in the studio
   */
  const getActiveResume = () => {
    const user = getUserSession();
    if (!user) return null;

    const activeId = getActiveResumeId();
    const list = getAllResumes();

    if (activeId) {
      const found = list.find((r) => r.id === activeId);
      if (found) return found;
    }

    if (list.length > 0) {
      setActiveResumeId(list[0].id);
      return list[0];
    }

    // If none exists, create a fresh private one for this user
    return createNewResume(`${user.name}'s Resume`);
  };

  /**
   * Save / update a resume in active user's private storage
   */
  const saveResume = (resumeData) => {
    const user = getUserSession();
    if (!user || !resumeData) return null;

    if (!resumeData.id) {
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

    setJSON(getUserResumesKey(user.id), list);
    setActiveResumeId(resumeData.id);
    return resumeData;
  };

  /**
   * Delete a resume from active user's private storage
   */
  const deleteResume = (id) => {
    const user = getUserSession();
    if (!user) return [];

    let list = getAllResumes();
    list = list.filter((r) => r.id !== id);
    setJSON(getUserResumesKey(user.id), list);

    if (getActiveResumeId() === id) {
      if (list.length > 0) {
        setActiveResumeId(list[0].id);
      } else {
        const fresh = createNewResume(`${user.name}'s Resume`);
        setActiveResumeId(fresh.id);
      }
    }
    return list;
  };

  /**
   * Duplicate a resume in active user's private storage
   */
  const duplicateResume = (id) => {
    const target = getResumeById(id);
    if (!target) return null;

    const copy = JSON.parse(JSON.stringify(target));
    copy.id = 'res_' + Date.now();
    copy.title = (copy.title || 'Untitled Resume') + ' (Copy)';
    copy.updatedAt = new Date().toISOString();

    const user = getUserSession();
    if (!user) return null;

    const list = getAllResumes();
    list.unshift(copy);
    setJSON(getUserResumesKey(user.id), list);
    return copy;
  };

  /**
   * Create a new blank or template resume in active user's private storage
   */
  const createNewResume = (title = 'My New Resume', template = 'tpl-modern-tech') => {
    const user = getUserSession();
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
        fullName: user ? user.name : '',
        jobTitle: '',
        email: user ? user.email : '',
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
        frontend: '',
        backend: '',
        tools: '',
      },
      projects: [],
      certifications: [],
      languages: [],
      customSections: [],
      updatedAt: new Date().toISOString(),
    };

    if (user) {
      saveResume(newResume);
    }
    return newResume;
  };

  /**
   * Load the professional sample template into the active user's private account
   */
  const loadSampleIntoUserAccount = () => {
    const user = getUserSession();
    if (!user) return null;

    const sampleCopy = JSON.parse(JSON.stringify(SAMPLE_RESUME_DATA));
    sampleCopy.id = 'res_' + Date.now();
    sampleCopy.title = `${user.name}'s Master CV (From Sample)`;
    sampleCopy.personalInfo.fullName = user.name;
    sampleCopy.personalInfo.email = user.email;

    saveResume(sampleCopy);
    setActiveResumeId(sampleCopy.id);
    return sampleCopy;
  };

  /**
   * Export resume as JSON backup
   */
  const exportAsJSON = (resumeData) => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(resumeData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    const filename = (resumeData.title || 'resume').replace(/[^a-z0-9]/gi, '_').toLowerCase() + '_backup.json';
    downloadAnchor.setAttribute('download', filename);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  /**
   * Import resume from JSON file into current user's private vault
   */
  const importFromJSON = (file, callback) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        if (parsed && (parsed.personalInfo || parsed.title)) {
          parsed.id = 'res_' + Date.now();
          parsed.title = (parsed.title || 'Imported Resume') + ' (Imported)';
          const saved = saveResume(parsed);
          callback(true, saved);
        } else {
          callback(false, 'Invalid ResumeFlow JSON format.');
        }
      } catch (err) {
        callback(false, 'Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  /**
   * Get User Subscription Plan
   */
  const getUserPlan = () => {
    const user = getUserSession();
    if (!user) return { plan: 'free', isPro: false, expiresAt: null, planName: 'Free Starter' };
    const planData = getJSON(getUserPlanKey(user.id), {
      plan: 'free',
      isPro: false,
      expiresAt: null,
      planName: 'Free Starter',
    });

    // Check expiration if not lifetime or free
    if (planData.expiresAt && new Date(planData.expiresAt) < new Date()) {
      planData.isPro = false;
      planData.plan = 'free';
      planData.planName = 'Free Starter (Expired)';
      setJSON(getUserPlanKey(user.id), planData);
    }
    return planData;
  };

  /**
   * Upgrade User Plan (7-Day Pass, Pro Monthly, Lifetime)
   */
  const upgradeUserPlan = (planType, options = {}) => {
    const user = getUserSession();
    if (!user) return { success: false, error: 'User must be signed in to upgrade.' };

    let expiresAt = null;
    let planName = 'Pro Monthly';

    if (planType === 'pass' || planType === '7day') {
      const d = new Date();
      d.setDate(d.getDate() + 7);
      expiresAt = d.toISOString();
      planName = '7-Day Fast Pass';
    } else if (planType === 'pro' || planType === 'monthly') {
      const d = new Date();
      d.setMonth(d.getMonth() + 1);
      expiresAt = d.toISOString();
      planName = 'Pro Monthly';
    } else if (planType === 'annual') {
      const d = new Date();
      d.setFullYear(d.getFullYear() + 1);
      expiresAt = d.toISOString();
      planName = 'Pro Annual';
    } else if (planType === 'lifetime') {
      expiresAt = null;
      planName = 'Lifetime Career Pass';
    }

    const newPlan = {
      plan: planType,
      isPro: true,
      planName: planName,
      upgradedAt: new Date().toISOString(),
      expiresAt: expiresAt,
      orderId: 'ORD_' + Math.random().toString(36).substring(2, 9).toUpperCase(),
      amountPaid: options.amount || '$11.99',
    };

    setJSON(getUserPlanKey(user.id), newPlan);
    return { success: true, plan: newPlan };
  };

  /**
   * Check if active user has Pro access
   */
  const isPro = () => {
    const plan = getUserPlan();
    return Boolean(plan && plan.isPro);
  };

  /**
   * Get remaining AI Credits (Free gets 3 free scans/tailors, Pro gets unlimited 9999)
   */
  const getAICredits = () => {
    if (isPro()) return 9999;
    const user = getUserSession();
    if (!user) return 3;
    const credits = getJSON(getUserCreditsKey(user.id), 3);
    return credits;
  };

  /**
   * Deduct 1 AI Credit for free users
   */
  const useAICredit = () => {
    if (isPro()) return { success: true, remaining: 9999, isPro: true };
    const user = getUserSession();
    if (!user) return { success: false, error: 'Sign in to use AI tools.' };

    let current = getAICredits();
    if (current <= 0) {
      return { success: false, error: 'Free AI credits exhausted. Upgrade to Pro for unlimited AI tailoring.' };
    }

    current -= 1;
    setJSON(getUserCreditsKey(user.id), current);
    return { success: true, remaining: current, isPro: false };
  };

  // ==========================================================================
  // JOB APPLICATION KANBAN TRACKER
  // ==========================================================================
  const getApplications = () => {
    const user = getUserSession();
    if (!user) return [];
    return getJSON(getUserApplicationsKey(user.id), []);
  };

  const saveApplication = (appData) => {
    const user = getUserSession();
    if (!user) return null;
    if (!appData.id) appData.id = 'app_' + Date.now();
    appData.updatedAt = new Date().toISOString();

    const list = getApplications();
    const idx = list.findIndex((a) => a.id === appData.id);
    if (idx >= 0) {
      list[idx] = appData;
    } else {
      list.unshift(appData);
    }
    setJSON(getUserApplicationsKey(user.id), list);
    return appData;
  };

  const deleteApplication = (appId) => {
    const user = getUserSession();
    if (!user) return [];
    let list = getApplications();
    list = list.filter((a) => a.id !== appId);
    setJSON(getUserApplicationsKey(user.id), list);
    return list;
  };

  // ==========================================================================
  // AI COVER LETTERS
  // ==========================================================================
  const getCoverLetters = () => {
    const user = getUserSession();
    if (!user) return [];
    return getJSON(getUserCoverLettersKey(user.id), []);
  };

  const saveCoverLetter = (letterData) => {
    const user = getUserSession();
    if (!user) return null;
    if (!letterData.id) letterData.id = 'cl_' + Date.now();
    letterData.updatedAt = new Date().toISOString();

    const list = getCoverLetters();
    const idx = list.findIndex((l) => l.id === letterData.id);
    if (idx >= 0) {
      list[idx] = letterData;
    } else {
      list.unshift(letterData);
    }
    setJSON(getUserCoverLettersKey(user.id), list);
    return letterData;
  };

  const deleteCoverLetter = (letterId) => {
    const user = getUserSession();
    if (!user) return [];
    let list = getCoverLetters();
    list = list.filter((l) => l.id !== letterId);
    setJSON(getUserCoverLettersKey(user.id), list);
    return list;
  };

  return {
    // Auth & User Session
    getUserSession,
    registerUser,
    loginUser,
    loginDemo,
    logoutUser,
    requireAuth,
    updateUserProfile,

    // Subscriptions & Monetization
    getUserPlan,
    upgradeUserPlan,
    isPro,
    getAICredits,
    useAICredit,

    // Job Application Tracker
    getApplications,
    saveApplication,
    deleteApplication,

    // AI Cover Letters
    getCoverLetters,
    saveCoverLetter,
    deleteCoverLetter,

    // Resumes (Account Scoped)
    getAllResumes,
    getResumeById,
    getActiveResumeId,
    setActiveResumeId,
    getActiveResume,
    saveResume,
    deleteResume,
    duplicateResume,
    createNewResume,
    loadSampleIntoUserAccount,
    exportAsJSON,
    importFromJSON,
    getSampleData: () => JSON.parse(JSON.stringify(SAMPLE_RESUME_DATA)),
  };
})();
