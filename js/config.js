/**
 * CONFIGURATION - DHANUSH REDDY PORTFOLIO
 * Centralized settings for API endpoints, contact information, and social links.
 */

const PORTFOLIO_CONFIG = {
  student: {
    name: "Dhanush Reddy",
    degree: "Bachelor of Technology (B.Tech)",
    branch: "Computer Science Engineering (AI & ML)",
    year: "2nd Year",
    headline: "Aspiring AI & Machine Learning Engineer",
    email: "dr114547@gmail.com",
    phone: "9900320107",
    github: "https://github.com/Dhanush-1-blip",
    linkedin: "https://www.linkedin.com/in/dhanush-reddy-333961446?trk=contact-info"
  },
  
  // API Base URL - In local dev it defaults to localhost Flask port 5000.
  // In production on Vercel, this can be configured or points to the Render backend URL.
  api: {
    // If running locally, points to Flask http://localhost:5000
    // For production, update this with your Render backend URL e.g., "https://dhanush-portfolio-backend.onrender.com"
    baseUrl: window.PORTFOLIO_API_URL || (
      window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://127.0.0.1:5000'
        : 'https://dhanush-portfolio-backend.onrender.com'
    ),
    contactEndpoint: '/api/contact',
    healthEndpoint: '/api/health'
  }
};

// Freeze configuration to prevent accidental modification
Object.freeze(PORTFOLIO_CONFIG);
Object.freeze(PORTFOLIO_CONFIG.student);
Object.freeze(PORTFOLIO_CONFIG.api);
