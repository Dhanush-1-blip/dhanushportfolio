/**
 * PROJECTS DATA & RENDERER - DHANUSH REDDY PORTFOLIO
 * Designed for future expandability. Renders honest empty states when no projects are listed,
 * or dynamic project cards once verified projects are added.
 */

(function () {
  'use strict';

  /**
   * Projects Registry
   * To add a future completed project, append an object here matching the schema below:
   * {
   *   id: "project-slug",
   *   title: "Project Title",
   *   category: "Machine Learning" | "Artificial Intelligence" | "Python Automation",
   *   description: "Concise summary of the project and problem solved.",
   *   technologies: ["Python", "NumPy", "Pandas"],
   *   image: "assets/images/projects/project-preview.jpg", // optional
   *   githubUrl: "https://github.com/Dhanush-1-blip/project-repo",
   *   demoUrl: "https://project-demo.com", // optional
   *   detailPage: "project-details/project-slug.html" // optional
   * }
   */
  const PROJECTS_DATA = [
    // Currently empty to reflect verified student status accurately without fabrication.
  ];

  function renderProjects(containerId, isPreview = false) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // 1. If no projects, render the honest empty state
    if (PROJECTS_DATA.length === 0) {
      container.innerHTML = `
        <div class="empty-state-box reveal">
          <div class="empty-state-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="12" y1="18" x2="12" y2="12"></line>
              <line x1="9" y1="15" x2="15" y2="15"></line>
            </svg>
          </div>
          <h3 class="empty-state-title">Portfolio Currently in Development</h3>
          <p class="empty-state-text">
            "Every great journey starts with learning. My project portfolio is currently growing. Check back soon for upcoming work."
          </p>
          <div class="roadmap-steps">
            <div class="roadmap-card">
              <div class="roadmap-step-num">Step 01</div>
              <h4>Core Foundations</h4>
              <p>Strengthening Python programming, data structures, and algorithmic thinking.</p>
            </div>
            <div class="roadmap-card">
              <div class="roadmap-step-num">Step 02</div>
              <h4>AI & ML Studies</h4>
              <p>Mastering machine learning models, data exploration, and mathematical concepts.</p>
            </div>
            <div class="roadmap-card">
              <div class="roadmap-step-num">Step 03</div>
              <h4>Hands-On Projects</h4>
              <p>Building real-world AI applications and publishing source code here soon.</p>
            </div>
          </div>
        </div>
      `;
      return;
    }

    // 2. When projects exist, render responsive project cards
    const displayList = isPreview ? PROJECTS_DATA.slice(0, 3) : PROJECTS_DATA;
    let html = `<div class="card-grid-3">`;

    displayList.forEach(project => {
      const techTags = project.technologies.map(t => `<span class="interest-tag">${t}</span>`).join('');
      html += `
        <article class="card project-card reveal">
          <div class="project-header">
            <span class="section-tag" style="font-size: 0.75rem;">${project.category}</span>
            <h3 class="card-title">${project.title}</h3>
          </div>
          <p class="card-description">${project.description}</p>
          <div class="interest-tag-list" style="margin: 1.25rem 0;">
            ${techTags}
          </div>
          <div class="project-actions" style="display: flex; gap: 0.75rem; margin-top: auto;">
            ${project.githubUrl ? `<a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm">GitHub</a>` : ''}
            ${project.demoUrl ? `<a href="${project.demoUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">Live Demo</a>` : ''}
          </div>
        </article>
      `;
    });

    html += `</div>`;
    container.innerHTML = html;
  }

  function init() {
    renderProjects('projects-preview-container', true);
    renderProjects('all-projects-container', false);
    if (window.PortfolioAnimations && typeof window.PortfolioAnimations.initScrollReveal === 'function') {
      window.PortfolioAnimations.initScrollReveal();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose for dynamic inspection or updates
  window.PortfolioProjects = {
    data: PROJECTS_DATA,
    render: renderProjects,
    init: init
  };
})();
