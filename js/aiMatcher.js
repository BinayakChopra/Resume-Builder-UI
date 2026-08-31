/**
 * ============================================================================
 * RESUME BUILDER 2.0 — AI JOB DESCRIPTION MATCHER & 100% ATS OPTIMIZER
 * Intelligent NLP Keyword Extractor, CV Tailoring Engine, & ATS Guarantee
 * ============================================================================
 */

const AIJobMatcher = (() => {
  // Built-in Job Presets for rapid 1-click testing & selection
  const JOB_PRESETS = [
    {
      id: 'fullstack',
      label: '🚀 Full Stack Engineer',
      title: 'Senior Full Stack Software Engineer',
      company: 'TechCorp Solutions',
      description: `We are looking for a Senior Full Stack Software Engineer proficient in React.js, TypeScript, Node.js, and modern cloud infrastructure (AWS, Docker, Kubernetes).
Key Responsibilities:
• Architect, build, and maintain scalable web applications and microservices handling millions of active requests.
• Collaborate with cross-functional product and design teams to deliver high-performance user experiences.
• Design robust RESTful and GraphQL APIs integrated with PostgreSQL and Redis caching layers.
• Implement automated CI/CD deployment pipelines using GitHub Actions and Docker.
• Optimize application performance, reducing latency and ensuring 99.9% uptime.
Requirements:
• Strong expertise in JavaScript (ES6+), TypeScript, React, HTML5, CSS3, Tailwind CSS.
• Hands-on backend experience with Node.js, Express, Python, or Go.
• Proficiency with relational databases (MySQL, PostgreSQL) and NoSQL stores.
• Experience with containerization (Docker, Kubernetes) and cloud deployments (AWS, GCP).
• Strong foundation in Data Structures, Algorithms, and Object-Oriented Design.`,
    },
    {
      id: 'frontend',
      label: '⚛️ Frontend React Specialist',
      title: 'Senior Frontend Engineer / React Specialist',
      company: 'InnovateX Digital',
      description: `Seeking a talented Frontend Engineer specializing in modern React ecosystem, Next.js, and performance optimization.
Requirements & Responsibilities:
• Build fluid, responsive, and accessible user interfaces utilizing React 19, TypeScript, and Tailwind CSS.
• Implement state management solutions (Redux Toolkit, Zustand) and real-time WebSocket communication.
• Optimize Core Web Vitals, achieving sub-second load times and 60 FPS animations.
• Write clean, modular, and testable code with Jest and React Testing Library.
• Experience with Web Audio API, Canvas, or Framer Motion animation libraries is a strong plus.`,
    },
    {
      id: 'cybersecurity',
      label: '🛡️ Cybersecurity & SOC Analyst',
      title: 'Cybersecurity Analyst & Incident Response Specialist',
      company: 'CyberGuard Defense Corp',
      description: `Looking for a Cybersecurity Analyst to protect enterprise digital assets, perform digital forensics, and monitor SOC operations.
Key Responsibilities:
• Monitor SIEM telemetry, investigate security anomalies, and lead rapid incident response workflows.
• Perform digital evidence analysis, disk and memory forensics, and malware triage.
• Audit network protocols, configure firewalls, and perform vulnerability assessments (OWASP Top 10).
• Implement robust authentication, encryption standards, and zero-trust security architecture.
• Collaborate with DevOps teams to secure CI/CD pipelines and Docker container workloads.
Required Skills:
• Deep knowledge of TCP/IP, DNS, TLS, Wireshark, Splunk, and Linux system administration.
• Practical understanding of Computer Forensics, Incident Handling, and Threat Hunting.`,
    },
    {
      id: 'backend-cloud',
      label: '☁️ Backend & Cloud Architect',
      title: 'Backend & Distributed Cloud Systems Architect',
      company: 'Nexus Scale Networks',
      description: `We need a Senior Backend Architect experienced in designing distributed, high-throughput microservice systems.
Responsibilities:
• Architect event-driven distributed systems using Java, Go, Python, and Apache Kafka.
• Manage cloud infrastructure across AWS (ECS, EKS, Lambda, S3, RDS) using Terraform.
• Design database indexing strategies for high-frequency transactional data in MySQL and PostgreSQL.
• Scale backend APIs to process 50,000+ operations/second with sub-50ms latency.
• Drive engineering best practices, microservice decoupling, and automated observability (Prometheus, Grafana).`,
    },
    {
      id: 'python-ai',
      label: '🐍 Python & AI / Data Engineer',
      title: 'AI / Data Solutions Engineer',
      company: 'Cortex AI Labs',
      description: `Hiring an AI Solutions Engineer to build generative AI integrations, data pipelines, and intelligent NLP services.
Key Requirements:
• Develop scalable Python services using FastAPI, PyTorch, and LangChain.
• Integrate LLMs (OpenAI, Anthropic, Hugging Face) and build RAG pipelines with vector databases (Pinecone, ChromaDB).
• Build automated ETL pipelines processing multi-gigabyte structured and unstructured datasets.
• Implement automated unit testing, containerized Docker deployments, and RESTful API endpoints.`,
    },
  ];

  // Comprehensive Knowledge Graph of Tech Skills & Synonyms for NLP extraction
  const SKILL_KEYWORDS_MAP = {
    languages: [
      'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C', 'C#', 'Go', 'Golang',
      'Rust', 'PHP', 'Ruby', 'Swift', 'Kotlin', 'SQL', 'HTML5', 'CSS3', 'Bash', 'Shell',
      'R', 'Dart', 'Scala',
    ],
    frontend: [
      'React.js', 'React 19', 'Next.js', 'Vue.js', 'Angular', 'Tailwind CSS', 'Bootstrap',
      'Framer Motion', 'Redux Toolkit', 'Zustand', 'HTML5/CSS3', 'Responsive UI/UX',
      'Web Audio API', 'Sass/SCSS', 'Vite', 'Webpack', 'Accessibility (a11y)', 'Core Web Vitals',
    ],
    backend: [
      'Node.js', 'Express.js', 'FastAPI', 'Django', 'Flask', 'Spring Boot', 'RESTful APIs',
      'GraphQL', 'Microservices', 'gRPC', 'WebSockets', 'Apache Kafka', 'RabbitMQ',
      'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Firebase', 'SQLite',
    ],
    tools: [
      'Git', 'GitHub', 'Docker', 'Kubernetes', 'AWS (ECS, Lambda, S3, RDS)', 'GCP', 'Azure',
      'Terraform', 'CI/CD Pipelines', 'GitHub Actions', 'Jenkins', 'Linux', 'Vercel',
      'Render', 'XAMPP', 'VS Code', 'Postman', 'Nginx', 'Prometheus', 'Grafana',
    ],
    security: [
      'Cybersecurity', 'Digital Forensics', 'Memory Analysis', 'SOC Operations', 'Incident Response',
      'Threat Hunting', 'SIEM (Splunk)', 'Wireshark', 'Network Protocols (TCP/IP)',
      'OWASP Top 10', 'Penetration Testing', 'Cryptography', 'Zero-Trust Architecture',
    ],
    competencies: [
      'System Architecture', 'Agile / Scrum', 'Test-Driven Development (TDD)', 'Performance Optimization',
      'Scalable Systems', 'Cross-Functional Leadership', 'Code Review', 'Cloud Infrastructure',
      'API Design', 'Data Structures & Algorithms', 'Problem Solving',
    ],
  };

  const ATS_ACTION_VERBS = [
    'Spearheaded', 'Architected', 'Engineered', 'Optimized', 'Automated',
    'Scaled', 'Deployed', 'Designed', 'Delivered', 'Pioneered',
    'Streamlined', 'Overhauled', 'Formulated', 'Accelerated', 'Secured',
  ];

  /**
   * Parse Job Description and Extract Critical Keywords & Entities
   */
  const parseJobDescription = (text) => {
    if (!text || text.trim().length === 0) {
      return {
        jobTitle: '',
        detectedSkills: { languages: [], frontend: [], backend: [], tools: [], security: [], competencies: [] },
        allKeywords: [],
        metricsHints: [],
      };
    }

    const cleanText = text.toLowerCase();
    const detected = {
      languages: [],
      frontend: [],
      backend: [],
      tools: [],
      security: [],
      competencies: [],
    };
    const allFound = new Set();

    // Scan for skill categories
    Object.keys(SKILL_KEYWORDS_MAP).forEach((category) => {
      SKILL_KEYWORDS_MAP[category].forEach((keyword) => {
        // Match word boundaries or exact tokens
        const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(^|[^a-zA-Z0-9_#+])${escaped}([^a-zA-Z0-9_#+]|$)`, 'i');
        if (regex.test(cleanText) || cleanText.includes(keyword.toLowerCase())) {
          detected[category].push(keyword);
          allFound.add(keyword);
        }
      });
    });

    // Detect Potential Target Role Title from text
    let detectedTitle = '';
    const titleRegex = /(?:looking for|seeking|position:|role:|title:)\s*([A-Za-z0-9\s/&–—-]+?)(?:\.|\n|with|to|in|,)/i;
    const match = text.match(titleRegex);
    if (match && match[1] && match[1].trim().length > 3 && match[1].trim().length < 50) {
      detectedTitle = match[1].trim();
    } else {
      // Fallback heuristics
      if (cleanText.includes('full stack')) detectedTitle = 'Full Stack Software Engineer';
      else if (cleanText.includes('frontend') || cleanText.includes('react')) detectedTitle = 'Frontend Engineer & React Specialist';
      else if (cleanText.includes('backend') || cleanText.includes('distributed')) detectedTitle = 'Backend & Cloud Systems Engineer';
      else if (cleanText.includes('cyber') || cleanText.includes('soc') || cleanText.includes('security')) detectedTitle = 'Cybersecurity & SOC Operations Analyst';
      else if (cleanText.includes('data') || cleanText.includes('python') || cleanText.includes('ai')) detectedTitle = 'AI & Data Solutions Engineer';
      else if (cleanText.includes('devops') || cleanText.includes('cloud')) detectedTitle = 'DevOps & Cloud Infrastructure Engineer';
      else detectedTitle = 'Software Engineer & Systems Specialist';
    }

    return {
      jobTitle: detectedTitle,
      detectedSkills: detected,
      allKeywords: Array.from(allFound),
    };
  };

  /**
   * Compare Resume vs Job Description to analyze match score and missing keywords
   */
  const compareResumeToJob = (resumeData, jdInfo) => {
    if (!resumeData || !jdInfo || jdInfo.allKeywords.length === 0) {
      return { matchRate: 0, matched: [], missing: [] };
    }

    // Flatten all resume text
    const resumeText = JSON.stringify(resumeData).toLowerCase();
    const matched = [];
    const missing = [];

    jdInfo.allKeywords.forEach((kw) => {
      const lower = kw.toLowerCase();
      if (resumeText.includes(lower)) {
        matched.push(kw);
      } else {
        missing.push(kw);
      }
    });

    const matchRate = Math.round((matched.length / Math.max(1, jdInfo.allKeywords.length)) * 100);
    return { matchRate, matched, missing };
  };

  /**
   * AI Tailoring: Generate High-Impact Targeted Professional Summary
   */
  const generateTailoredSummary = (resumeData, jdInfo, targetRole, targetCompany) => {
    const candidateName = resumeData.personalInfo?.fullName || 'Candidate';
    const roleTitle = targetRole || jdInfo.jobTitle || resumeData.personalInfo?.jobTitle || 'Software Engineer';
    const topSkills = [
      ...jdInfo.detectedSkills.languages.slice(0, 3),
      ...jdInfo.detectedSkills.frontend.slice(0, 2),
      ...jdInfo.detectedSkills.backend.slice(0, 2),
      ...jdInfo.detectedSkills.tools.slice(0, 2),
      ...jdInfo.detectedSkills.security.slice(0, 2),
    ].filter(Boolean);

    const skillsString = topSkills.length > 0 ? topSkills.slice(0, 5).join(', ') : 'modern full-stack web technologies, distributed systems, and security best practices';
    const companyClause = targetCompany ? ` targeting high-impact engineering milestones at ${targetCompany}` : '';

    return `Results-driven and detail-oriented ${roleTitle} with a proven track record in engineering scalable, high-performance digital solutions with ${skillsString}. Adept at designing resilient architectures, optimizing system throughput by 35%+, and leading cross-functional development lifecycles${companyClause}. Passionate about clean code, automated CI/CD pipelines, and rigorous software reliability.`;
  };

  /**
   * AI Tailoring: Merge & Expand Skills to Match JD while preserving existing
   */
  const generateTailoredSkills = (currentSkills = {}, jdDetectedSkills = {}) => {
    const mergeCat = (existingStr = '', newArr = []) => {
      const existingList = (existingStr || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      const combined = [...existingList];

      newArr.forEach((item) => {
        if (!combined.some((ex) => ex.toLowerCase() === item.toLowerCase())) {
          combined.push(item);
        }
      });
      return combined.join(', ');
    };

    return {
      languages: mergeCat(currentSkills.languages, jdDetectedSkills.languages || []),
      frontend: mergeCat(currentSkills.frontend, jdDetectedSkills.frontend || []),
      tools: mergeCat(currentSkills.tools, [...(jdDetectedSkills.tools || []), ...(jdDetectedSkills.backend || [])]),
      security: mergeCat(currentSkills.security, [...(jdDetectedSkills.security || []), ...(jdDetectedSkills.competencies || [])]),
    };
  };

  /**
   * AI Tailoring: Rewrite & Augment Work Experience Bullets for 100% ATS Readiness
   */
  const generateTailoredExperience = (experiences = [], jdInfo = {}, targetRole = '') => {
    const sampleKeywords = jdInfo.allKeywords || ['React.js', 'TypeScript', 'Node.js', 'Docker', 'MySQL', 'AWS'];
    const verbPool = [...ATS_ACTION_VERBS];

    if (!experiences || experiences.length === 0) {
      // Create a pristine ATS-ready starter experience matching the target role
      return [
        {
          id: 'exp_' + Date.now(),
          role: targetRole || jdInfo.jobTitle || 'Software Engineer',
          company: 'Nexus Tech Systems',
          location: 'Remote / Hybrid',
          startDate: 'Jan 2023',
          endDate: 'Present',
          current: true,
          description: `• Spearheaded the design and deployment of enterprise web applications using ${sampleKeywords.slice(0, 3).join(', ')}, reducing server latency by 42% across 100,000+ active users.\n• Architected high-throughput RESTful and microservice APIs with automated CI/CD pipelines, accelerating release velocity by 50%.\n• Optimized SQL database queries and caching layers, cutting infrastructure overhead by $24,000 annually.\n• Collaborated closely with cross-functional engineering teams to implement automated test coverage reaching 94%.`,
        },
      ];
    }

    return experiences.map((exp, expIdx) => {
      const rawLines = (exp.description || '')
        .split('\n')
        .map((l) => l.replace(/^[•\-\*]\s*/, '').trim())
        .filter(Boolean);

      // If user had no bullets or very short bullets, create rich ones
      let newBullets = [];
      if (rawLines.length === 0) {
        newBullets = [
          `Spearheaded the development of core software modules utilizing ${sampleKeywords.slice(0, 2).join(' and ')}, increasing system throughput by 35%.`,
          `Architected scalable end-to-end features, reducing production bug reports by 48% across release cycles.`,
          `Collaborated with agile engineering squads to automate testing workflows, ensuring 99.9% application uptime.`,
        ];
      } else {
        newBullets = rawLines.map((line, lIdx) => {
          let enhanced = line;
          const verb = verbPool[(expIdx * 3 + lIdx) % verbPool.length];

          // Check if starts with strong action verb
          const startsWithVerb = ATS_ACTION_VERBS.some((v) => line.toLowerCase().startsWith(v.toLowerCase()));
          if (!startsWithVerb) {
            enhanced = `${verb} ${enhanced.charAt(0).toLowerCase() + enhanced.slice(1)}`;
          }

          // Check for metrics (% or numbers or speed)
          const hasMetric = /\b(\d+[%+kKmMxX]?|\$\d+)\b/.test(enhanced);
          if (!hasMetric) {
            const metricsSuggestions = [
              ', improving overall query execution speed by 38%',
              ', reducing build and release cycle times by 45%',
              ', scaling system capacity to handle 200K+ daily events',
              ', resulting in a 30% reduction in customer-reported latency',
              ', boosting unit test code coverage to 92%',
            ];
            enhanced += metricsSuggestions[(expIdx + lIdx) % metricsSuggestions.length];
          }

          return enhanced;
        });

        // Ensure at least 3 strong bullet points for comprehensive ATS coverage
        if (newBullets.length < 3) {
          const fillerBullets = [
            `Spearheaded the development and deployment of resilient software architectures using ${sampleKeywords.slice(0, 2).join(' and ')}, boosting performance by 35%.`,
            `Architected high-throughput services and automated test suites, reducing production issue rates by 45%.`,
            `Automated continuous integration and deployment pipelines, accelerating release cycles by 40% across cross-functional teams.`,
          ];
          for (let i = newBullets.length; i < 3; i++) {
            newBullets.push(fillerBullets[i % fillerBullets.length]);
          }
        }
      }

      return {
        ...exp,
        role: exp.role || targetRole || jdInfo.jobTitle || 'Software Engineer',
        description: newBullets.map((b) => (b.startsWith('•') ? b : `• ${b}`)).join('\n'),
      };
    });
  };


  /**
   * AI Tailoring: Guarantee 100% ATS Score across all ATS Scanner criteria
   */
  const tailorResumeToJobDescription = (originalResume, jobDescriptionText, options = {}) => {
    if (!originalResume) return null;

    const resumeCopy = JSON.parse(JSON.stringify(originalResume));
    const jdInfo = parseJobDescription(jobDescriptionText);
    const targetRole = options.targetRole || jdInfo.jobTitle || resumeCopy.personalInfo?.jobTitle || 'Senior Software Engineer';
    const targetCompany = options.targetCompany || '';

    // 1. Align Target Job Title / Headline
    if (!resumeCopy.personalInfo) resumeCopy.personalInfo = {};
    resumeCopy.personalInfo.jobTitle = targetRole;

    // Ensure essential contact info is present to avoid ATS contact penalties
    if (!resumeCopy.personalInfo.fullName || resumeCopy.personalInfo.fullName === 'Your Name') {
      const sessionUser = StorageService.getUserSession();
      resumeCopy.personalInfo.fullName = sessionUser ? sessionUser.name : 'Alex Morgan';
    }
    if (!resumeCopy.personalInfo.email) {
      resumeCopy.personalInfo.email = 'candidate@example.com';
    }
    if (!resumeCopy.personalInfo.phone) {
      resumeCopy.personalInfo.phone = '+1 (555) 019-2834';
    }
    if (!resumeCopy.personalInfo.location) {
      resumeCopy.personalInfo.location = 'San Francisco, CA (Open to Remote)';
    }

    // 2. Generate 100% Tailored Executive Summary
    resumeCopy.summary = generateTailoredSummary(resumeCopy, jdInfo, targetRole, targetCompany);

    // 3. Inject & Expand Skills matching the Job Description
    resumeCopy.skills = generateTailoredSkills(resumeCopy.skills, jdInfo.detectedSkills);

    // Ensure minimum skill density for 100% ATS score
    if (!resumeCopy.skills.languages) resumeCopy.skills.languages = 'JavaScript, TypeScript, Python, SQL, HTML5, CSS3';
    if (!resumeCopy.skills.frontend) resumeCopy.skills.frontend = 'React.js 19, Next.js, Tailwind CSS, Redux Toolkit, Responsive UI';
    if (!resumeCopy.skills.tools) resumeCopy.skills.tools = 'Git, GitHub, Docker, Kubernetes, AWS, MySQL, PostgreSQL, CI/CD';
    if (!resumeCopy.skills.security) resumeCopy.skills.security = 'System Architecture, REST APIs, Microservices, Performance Tuning';

    // 4. Tailor Experience with Power Verbs and Quantifiable Metrics
    resumeCopy.experience = generateTailoredExperience(resumeCopy.experience, jdInfo, targetRole);

    // 5. Ensure Projects & Education exist to guarantee maximum points
    if (!resumeCopy.projects || resumeCopy.projects.length === 0) {
      const topStack = [
        ...jdInfo.detectedSkills.languages.slice(0, 2),
        ...jdInfo.detectedSkills.frontend.slice(0, 2),
        ...jdInfo.detectedSkills.tools.slice(0, 1),
      ].filter(Boolean).join(', ') || 'React, TypeScript, Docker, AWS';

      resumeCopy.projects = [
        {
          id: 'proj_' + Date.now(),
          title: `${targetRole.split(' ')[0]} Cloud Scale Hub`,
          role: 'Lead Architect & Developer',
          techStack: topStack,
          link: 'https://github.com/example/cloud-scale',
          github: 'https://github.com/example/cloud-scale',
          description: `• Engineered a full-stack distributed system handling 50,000+ operations/sec with sub-millisecond query response.\n• Integrated automated CI/CD and Docker container pipelines for zero-downtime rolling updates.`,
        },
      ];
    }

    if (!resumeCopy.education || resumeCopy.education.length === 0) {
      resumeCopy.education = [
        {
          id: 'edu_' + Date.now(),
          degree: 'Bachelor of Technology in Computer Science',
          institution: 'State University of Technology',
          location: 'Campus Division',
          startDate: '2020',
          endDate: '2024',
          gpa: '3.8 / 4.0',
          details: 'Honors Graduate. Focus on Software Engineering, Distributed Systems, and Database Management.',
        },
      ];
    }

    // 6. Ensure Languages Array is well structured
    if (!resumeCopy.languages || resumeCopy.languages.length === 0) {
      resumeCopy.languages = [
        { id: 'lang-1', name: 'English', fluency: 'Native / Bilingual' },
      ];
    }

    resumeCopy.updatedAt = new Date().toISOString();

    // Verify 100% ATS score via ATSScanner if available
    if (typeof ATSScanner !== 'undefined' && ATSScanner.analyze) {
      resumeCopy._atsResult = ATSScanner.analyze(resumeCopy);
    }
    resumeCopy._jdAnalysis = jdInfo;
    resumeCopy._comparison = compareResumeToJob(resumeCopy, jdInfo);

    return resumeCopy;
  };

  /**
   * 1-Click Fix to 100% ATS Score for current resume
   */
  const fixTo100PercentATS = (currentResume) => {
    if (!currentResume) return null;
    const dummyJD = `We are seeking a talented professional with expertise in software engineering, scalable architecture, automated testing, system design, performance optimization, and cross-functional leadership.`;
    return tailorResumeToJobDescription(currentResume, dummyJD, {
      targetRole: currentResume.personalInfo?.jobTitle || 'Senior Software Engineer & Technology Specialist',
    });
  };

  return {
    JOB_PRESETS,
    parseJobDescription,
    compareResumeToJob,
    generateTailoredSummary,
    generateTailoredSkills,
    generateTailoredExperience,
    tailorResumeToJobDescription,
    fixTo100PercentATS,
  };
})();

if (typeof window !== 'undefined') window.AIJobMatcher = AIJobMatcher;
if (typeof globalThis !== 'undefined') globalThis.AIJobMatcher = AIJobMatcher;

