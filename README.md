# Dhanush Reddy — Portfolio Website

Personal portfolio website for **Dhanush Reddy**, a 2nd-year B.Tech student in Computer Science Engineering (Artificial Intelligence & Machine Learning).

Built with a clean white design accented with Coral (`#FF5C35`) and Electric Purple (`#635BFF`), featuring a vanilla web frontend, a secure Python Flask backend for contact form handling and email dispatch, and full accessibility and SEO optimization.

---

## 1. Verified Profile Information

- **Name:** Dhanush Reddy
- **Degree:** Bachelor of Technology (B.Tech)
- **Branch:** Computer Science Engineering (AI & ML)
- **Current Year:** 2nd Year
- **Professional Headline:** "Aspiring AI & Machine Learning Engineer"
- **Confirmed Technical Skill:** Python
- **Career & Academic Interests:**
  - Artificial Intelligence
  - Machine Learning
  - Emerging AI Technologies
  - Problem-solving through technology
- **Verified Contact Details:**
  - **Email:** [dr114547@gmail.com](mailto:dr114547@gmail.com)
  - **Phone:** [+91 9900320107](tel:9900320107) (Clickable direct call link)
  - **LinkedIn:** [linkedin.com/in/dhanush-reddy-333961446](https://www.linkedin.com/in/dhanush-reddy-333961446?trk=contact-info)
  - **GitHub:** [github.com/Dhanush-1-blip](https://github.com/Dhanush-1-blip)

> **Authenticity Guarantee:** Strictly features verified student details. Zero fabricated projects, certificates, grades, or fake proficiency percentages.

---

## 2. Tech Stack

- **Frontend:** HTML5, CSS3, Vanilla ES6+ JavaScript.
- **Backend:** Python (Flask 3.x), Flask-CORS, Gunicorn.
- **Email & Spam Protection:** Standard library `smtplib`, IP sliding-window rate limiting, Honeypot bot protection.
- **Hosting Targets:** Vercel (Frontend) & Render (Backend).

---

## 3. Directory Layout

```text
dhanush portfolio/
├── index.html                  # Homepage (Hero, About, Skills, Projects empty state, Journey, Contact)
├── about.html                  # Dedicated About page
├── skills.html                 # Dedicated Skills page (Python + AI/ML study areas)
├── projects.html               # Projects showcase (Honest empty state)
├── contact.html                # Dedicated Contact page (Working form + Phone/Email/Social)
├── project-details/
│   └── project-template.html   # Reusable project case study template
├── css/
│   ├── themes.css              # Light & dark theme variables, color tokens
│   ├── style.css               # Main components, layout grids, animations
│   └── responsive.css          # Breakpoints (1440px, 1024px, 768px, 480px, 390px, 360px)
├── js/
│   ├── config.js               # Central settings & backend API URL
│   ├── theme.js                # Theme switcher with localStorage & OS detection
│   ├── navigation.js           # Mobile drawer, active link indicators, scroll progress
│   ├── animations.js           # Neural network particle canvas & scroll reveals
│   ├── contact.js              # Form validation, honeypot check & fetch API dispatch
│   ├── projects.js             # Projects registry & dynamic card rendering
│   └── main.js                 # Dynamic copyright year & resume modal handler
├── assets/
│   ├── images/favicon.svg      # Vector monogram icon
│   └── documents/README.txt    # Resume drop-in instructions
├── backend/
│   ├── app.py                  # Flask API (/api/contact, /api/health)
│   ├── config.py               # Env loader & configuration
│   ├── requirements.txt        # Flask, Flask-Cors, python-dotenv, gunicorn
│   ├── Procfile                # Render process launch
│   ├── .env.example            # Safe environment template
│   └── test_backend.py         # Unit & integration test suite (8 tests)
├── vercel.json                 # Vercel routing & security headers
├── render.yaml                 # Render Blueprint deployment config
├── robots.txt                  # Search engine crawl rules
├── sitemap.xml                 # XML sitemap
└── README.md
```

---

## 4. Local Quickstart

### Running the Python Flask Backend
```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python -m unittest discover -s . -p "test_*.py"
python app.py
```
*Health check URL: `http://127.0.0.1:5000/api/health`*

### Running the Frontend
In the project root:
```powershell
python -m http.server 5500
```
Open `http://localhost:5500` in your browser.

---

## 5. Deployment Setup

### Frontend on Vercel
1. Push codebase to GitHub repository: `Dhanush-1-blip/dhanush-portfolio`
2. Connect repository to [Vercel](https://vercel.com).
3. Framework Preset: **Other** / Root directory: `./`
4. Deploy.

### Backend on Render
1. In [Render](https://render.com), create a new **Web Service** from your GitHub repo.
2. Root Directory: `backend` | Build Command: `pip install -r requirements.txt` | Start Command: `gunicorn app:app`
3. Add environment variables from `backend/.env.example`.
4. Copy the live Render backend URL into `js/config.js` (`baseUrl`).

---

## 6. Verification & Test Summary

All 8 automated backend tests passed successfully:
- `test_01_health_check`: PASSED (200 OK, recipient: `dr114547@gmail.com`)
- `test_02_valid_contact_submission`: PASSED (200 OK, email simulation & response)
- `test_03_missing_name`: PASSED (400 Bad Request)
- `test_04_invalid_email_format`: PASSED (400 Bad Request)
- `test_05_honeypot_spam_trap`: PASSED (400 Bad Request)
- `test_06_message_too_short`: PASSED (400 Bad Request)
- `test_07_rate_limiting`: PASSED (429 Too Many Requests after threshold)
- `test_08_cors_headers`: PASSED (Access-Control-Allow-Origin verified)
