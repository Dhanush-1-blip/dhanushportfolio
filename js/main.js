/**
 * MAIN BOOTSTRAP - DHANUSH REDDY PORTFOLIO
 * Initializes page components, copyright year, resume modal behavior, and global event handlers.
 */

(function () {
  'use strict';

  function init() {
    // 1. Dynamic Footer Copyright Year
    const yearEls = document.querySelectorAll('.dynamic-year');
    const currentYear = new Date().getFullYear();
    yearEls.forEach(el => {
      el.textContent = currentYear;
    });

    // 2. Resume Button & Modal Handling
    const resumeButtons = document.querySelectorAll('.btn-resume-trigger');
    const resumeModal = document.getElementById('resume-modal');
    const resumeModalClose = document.getElementById('resume-modal-close');

    if (resumeModal) {
      function openResumeModal(e) {
        if (e) e.preventDefault();
        resumeModal.classList.add('is-open');
        resumeModal.setAttribute('aria-hidden', 'false');
        if (resumeModalClose) resumeModalClose.focus();
        document.body.style.overflow = 'hidden';
      }

      function closeResumeModal() {
        resumeModal.classList.remove('is-open');
        resumeModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }

      resumeButtons.forEach(btn => {
        btn.addEventListener('click', openResumeModal);
      });

      if (resumeModalClose) {
        resumeModalClose.addEventListener('click', closeResumeModal);
      }

      // Close when clicking outside dialog
      resumeModal.addEventListener('click', (e) => {
        if (e.target === resumeModal) {
          closeResumeModal();
        }
      });

      // Close on Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && resumeModal.classList.contains('is-open')) {
          closeResumeModal();
        }
      });
    }

    // 3. Log initial student portfolio status
    console.info(
      "%c Dhanush Reddy | Aspiring AI & Machine Learning Engineer %c\n" +
      "Portfolio successfully initialized.\n" +
      "Student: 2nd Year B.Tech CSE (AI & ML)\n" +
      "Confirmed Technical Skill: Python",
      "background: #635BFF; color: #fff; font-weight: bold; padding: 4px 8px; border-radius: 4px;",
      "color: #FF5C35; font-weight: bold;"
    );
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
