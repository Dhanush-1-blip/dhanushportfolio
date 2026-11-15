/**
 * NAVIGATION CONTROLLER - DHANUSH REDDY PORTFOLIO
 * Handles navbar scroll effects, scroll progress, active state, mobile drawer, and accessibility.
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar');
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollProgress = document.getElementById('scroll-progress');

    // 1. Scroll Progress & Navbar Scrolled Class
    function handleScroll() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      
      if (scrollProgress && docHeight > 0) {
        const progressPercent = Math.min((scrollTop / docHeight) * 100, 100);
        scrollProgress.style.width = `${progressPercent}%`;
      }

      if (navbar) {
        if (scrollTop > 20) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // 2. Active Route Highlighting
    function highlightActiveRoute() {
      const currentPath = window.location.pathname.replace(/\/$/, '') || '/index.html';
      const currentPage = currentPath.substring(currentPath.lastIndexOf('/') + 1) || 'index.html';

      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;
        const linkPage = href.substring(href.lastIndexOf('/') + 1) || 'index.html';

        if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
          link.classList.add('active');
          link.setAttribute('aria-current', 'page');
        } else {
          link.classList.remove('active');
          link.removeAttribute('aria-current');
        }
      });
    }

    highlightActiveRoute();

    // 3. Mobile Navigation Drawer
    if (mobileToggle && navMenu) {
      function toggleMobileMenu(open) {
        const isCurrentlyExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
        const shouldOpen = open !== undefined ? open : !isCurrentlyExpanded;

        mobileToggle.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
        mobileToggle.setAttribute('aria-label', shouldOpen ? 'Close navigation menu' : 'Open navigation menu');
        
        if (shouldOpen) {
          navMenu.classList.add('is-active');
          document.body.style.overflow = 'hidden'; // Prevent background scrolling
        } else {
          navMenu.classList.remove('is-active');
          document.body.style.overflow = '';
        }
      }

      mobileToggle.addEventListener('click', () => {
        toggleMobileMenu();
      });

      // Close menu when clicking outside or clicking any link
      navLinks.forEach(link => {
        link.addEventListener('click', () => {
          if (navMenu.classList.contains('is-active')) {
            toggleMobileMenu(false);
          }
        });
      });

      document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('is-active') &&
            !navMenu.contains(e.target) &&
            !mobileToggle.contains(e.target)) {
          toggleMobileMenu(false);
        }
      });

      // Close on Escape key press
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('is-active')) {
          toggleMobileMenu(false);
          mobileToggle.focus();
        }
      });
    }

    // 4. Smooth Anchor Scrolling with header offset
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#' || targetId === '') return;
        
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          const headerOffset = 80;
          const elementPosition = targetEl.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });

          // Set focus for accessibility
          targetEl.setAttribute('tabindex', '-1');
          targetEl.focus({ preventScroll: true });
        }
      });
    });
  });
})();
