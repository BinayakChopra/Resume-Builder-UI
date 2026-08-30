/**
 * ============================================================================
 * RESUME BUILDER 2.0 — REAL-TIME ATS SCANNER & SCORING ENGINE
 * Analyzes resume data, calculates score (0-100), detects action verbs & metrics
 * ============================================================================
 */

const ATSScanner = (() => {
  const ACTION_VERBS = [
    'accelerated', 'achieved', 'architected', 'automated', 'built', 'championed',
    'collaborated', 'configured', 'constructed', 'containerized', 'created', 'debugged',
    'delivered', 'deployed', 'designed', 'developed', 'devised', 'directed',
    'eliminated', 'engineered', 'enhanced', 'established', 'executed', 'expanded',
    'formulated', 'generated', 'guided', 'implemented', 'improved', 'increased',
    'initiated', 'innovated', 'inspected', 'instituted', 'integrated', 'investigated',
    'launched', 'led', 'managed', 'maximized', 'mentored', 'modernized',
    'optimized', 'orchestrated', 'overhauled', 'pioneered', 'programmed', 'published',
    'reduced', 'refactored', 'resolved', 'restructured', 'scaled', 'secured',
    'simplified', 'spearheaded', 'streamlined', 'strengthened', 'synthesized', 'transformed',
  ];

  /**
   * Analyze complete resume dataset
   */
  const analyze = (resumeData) => {
    if (!resumeData) {
      return { score: 0, grade: 'Needs Work', tips: [] };
    }

    let score = 0;
    const tips = [];
    const p = resumeData.personalInfo || {};

    // 1. Contact Information Check (Max 25 pts)
    let contactPts = 0;
    if (p.fullName && p.fullName.trim().length > 2 && p.fullName !== 'Your Name') contactPts += 5;
    else tips.push({ type: 'critical', text: 'Add your full professional name.' });

    if (p.jobTitle && p.jobTitle.trim().length > 2 && p.jobTitle !== 'Professional Title') contactPts += 5;
    else tips.push({ type: 'recommended', text: 'Specify a clear target role / headline (e.g., "Frontend Engineer").' });

    if (p.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email)) contactPts += 5;
    else tips.push({ type: 'critical', text: 'Include a valid professional email address.' });

    if (p.phone && p.phone.trim().length > 6) contactPts += 4;
    else tips.push({ type: 'recommended', text: 'Add a contact phone number.' });

    if (p.location && p.location.trim().length > 2) contactPts += 3;
    if (p.linkedin || p.github || p.website) contactPts += 3;
    else tips.push({ type: 'recommended', text: 'Add a LinkedIn or GitHub profile link for technical credibility.' });

    score += Math.min(25, contactPts);

    // 2. Professional Summary Check (Max 15 pts)
    const summary = resumeData.summary || '';
    const summaryWords = summary.trim().split(/\s+/).filter(Boolean).length;
    if (summaryWords >= 25 && summaryWords <= 120) {
      score += 15;
    } else if (summaryWords > 0) {
      score += 8;
      tips.push({ type: 'recommended', text: 'Expand your professional summary to 30–80 impactful words.' });
    } else {
      tips.push({ type: 'critical', text: 'Add a concise 2–3 sentence professional summary.' });
    }

    // 3. Work Experience & Bullet Point Quality (Max 30 pts)
    const experience = resumeData.experience || [];
    if (experience.length >= 1) {
      score += 10;
      let actionVerbHits = 0;
      let metricHits = 0;
      let totalBullets = 0;

      experience.forEach((exp) => {
        const text = (exp.description || '').toLowerCase();
        totalBullets += text.split('\n').filter((l) => l.trim().length > 0).length;

        ACTION_VERBS.forEach((verb) => {
          if (text.includes(verb)) actionVerbHits++;
        });

        // Check for numbers, % signs, multipliers (3x, 40%, $10k, 5,000)
        const metricMatch = text.match(/\b\d+[%+kKmMxX]?\b/g);
        if (metricMatch) metricHits += metricMatch.length;
      });

      if (actionVerbHits >= 3) {
        score += 10;
      } else {
        score += 5;
        tips.push({ type: 'recommended', text: 'Start experience bullet points with strong action verbs (e.g., Engineered, Led, Optimized).' });
      }

      if (metricHits >= 2) {
        score += 10;
      } else {
        score += 4;
        tips.push({ type: 'recommended', text: 'Quantify your impact with measurable metrics (e.g., "improved speed by 35%", "mentored 40+ students").' });
      }
    } else {
      tips.push({ type: 'critical', text: 'Add at least one work experience or internship entry.' });
    }

    // 4. Skills & Technologies Density (Max 15 pts)
    const skills = resumeData.skills || {};
    let totalSkillCount = 0;
    Object.keys(skills).forEach((k) => {
      if (skills[k]) {
        totalSkillCount += skills[k].split(',').map((s) => s.trim()).filter(Boolean).length;
      }
    });

    if (totalSkillCount >= 8) {
      score += 15;
    } else if (totalSkillCount >= 4) {
      score += 10;
      tips.push({ type: 'recommended', text: 'Add 4+ more relevant technical skills / tools to optimize ATS keyword matching.' });
    } else {
      tips.push({ type: 'critical', text: 'List your core programming languages, frameworks, and tools.' });
    }

    // 5. Education & Projects (Max 15 pts)
    const edu = resumeData.education || [];
    const proj = resumeData.projects || [];

    if (edu.length >= 1) score += 7;
    else tips.push({ type: 'recommended', text: 'Add your university degree or academic background.' });

    if (proj.length >= 1) score += 8;
    else tips.push({ type: 'recommended', text: 'Include 1–3 technical projects to showcase hands-on capability.' });

    // Calculate Grade
    let grade = 'Needs Work';
    let gradeColor = '#f43f5e';
    if (score >= 85) {
      grade = 'ATS-Ready (Excellent)';
      gradeColor = '#10b981';
    } else if (score >= 70) {
      grade = 'Good Match';
      gradeColor = '#06b6d4';
    } else if (score >= 50) {
      grade = 'Fair (Needs Polish)';
      gradeColor = '#f59e0b';
    }

    return {
      score: Math.min(100, score),
      grade,
      gradeColor,
      tips: tips.slice(0, 5),
    };
  };

  return {
    analyze,
    ACTION_VERBS,
  };
})();
