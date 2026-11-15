/**
 * ANIMATIONS & AI CANVAS - DHANUSH REDDY PORTFOLIO
 * Lightweight neural network background visualization and scroll-reveal interactions.
 */

(function () {
  'use strict';

  // Check prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --------------------------------------------------------------------------
  // 1. Intersection Observer for Scroll Reveal
  // --------------------------------------------------------------------------
  function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    if (!revealElements.length) return;

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      revealElements.forEach(el => el.classList.add('revealed'));
      return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  }

  // --------------------------------------------------------------------------
  // 2. Subtle AI Neural-Network Particle Canvas
  // --------------------------------------------------------------------------
  function initAiCanvas() {
    const canvas = document.getElementById('ai-canvas');
    if (!canvas || prefersReducedMotion) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement.offsetWidth);
    let height = (canvas.height = canvas.parentElement.offsetHeight);
    let animationFrameId = null;
    let isVisible = true;

    // Node configuration
    const NODE_COUNT = Math.min(Math.floor((width * height) / 18000), 45);
    const MAX_DISTANCE = 130;
    const nodes = [];

    // Mouse interactive position
    const mouse = { x: null, y: null, radius: 100 };

    window.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      if (e.clientY >= rect.top && e.clientY <= rect.bottom &&
          e.clientX >= rect.left && e.clientX <= rect.right) {
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
      } else {
        mouse.x = null;
        mouse.y = null;
      }
    }, { passive: true });

    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    function getThemeColors() {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      return {
        nodeColor: isDark ? 'rgba(124, 117, 255, 0.45)' : 'rgba(99, 91, 255, 0.35)',
        coralNodeColor: isDark ? 'rgba(255, 110, 74, 0.55)' : 'rgba(255, 92, 53, 0.45)',
        lineColor: isDark ? 'rgba(124, 117, 255, ' : 'rgba(99, 91, 255, '
      };
    }

    let colors = getThemeColors();
    window.addEventListener('themeChanged', () => {
      colors = getThemeColors();
    });

    // Create random network nodes
    for (let i = 0; i < NODE_COUNT; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1.2,
        isCoral: Math.random() > 0.75
      });
    }

    function render() {
      if (!isVisible) return;
      ctx.clearRect(0, 0, width, height);

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.hypot(dx, dy);

          if (dist < MAX_DISTANCE) {
            const opacity = (1 - dist / MAX_DISTANCE) * 0.22;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `${colors.lineColor}${opacity})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Draw and update nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];

        // Move
        n.x += n.vx;
        n.y += n.vy;

        // Bounce at boundaries
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;

        // Mouse gentle repel
        if (mouse.x !== null && mouse.y !== null) {
          const mdx = n.x - mouse.x;
          const mdy = n.y - mouse.y;
          const mDist = Math.hypot(mdx, mdy);
          if (mDist < mouse.radius) {
            const force = (1 - mDist / mouse.radius) * 0.6;
            n.x += (mdx / mDist) * force;
            n.y += (mdy / mDist) * force;
          }
        }

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fillStyle = n.isCoral ? colors.coralNodeColor : colors.nodeColor;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    }

    // Resize handler
    function handleResize() {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
    }
    window.addEventListener('resize', handleResize);

    // Pause when off-screen to conserve energy
    if ('IntersectionObserver' in window) {
      const canvasObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          isVisible = entry.isIntersecting;
          if (isVisible && !animationFrameId) {
            animationFrameId = requestAnimationFrame(render);
          } else if (!isVisible && animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
          }
        });
      });
      canvasObserver.observe(canvas);
    }

    render();
  }

  function init() {
    initScrollReveal();
    initAiCanvas();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.PortfolioAnimations = {
    initScrollReveal,
    initAiCanvas
  };
})();
