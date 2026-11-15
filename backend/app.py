"""
Flask Backend API for Dhanush Reddy's Portfolio
Handles contact form submission, validation, rate limiting, spam protection, and email delivery.
"""

import html
import logging
import os
import re
import smtplib
import time
from collections import defaultdict, deque
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from flask import Flask, jsonify, request
from flask_cors import CORS

from config import Config

# Configure structured logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(name)s: %(message)s'
)
logger = logging.getLogger('portfolio_backend')

app = Flask(__name__)
app.config.from_object(Config)

# Enable CORS for allowed origins
if Config.FRONTEND_ORIGIN == '*':
    CORS(app, resources={r"/api/*": {"origins": "*"}})
else:
    allowed_origins = [origin.strip() for origin in Config.FRONTEND_ORIGIN.split(',')]
    CORS(app, resources={r"/api/*": {"origins": allowed_origins}})

# --------------------------------------------------------------------------
# Spam Protection & Rate Limiting
# --------------------------------------------------------------------------
# In-memory IP tracking: ip -> deque([timestamp1, timestamp2, ...])
ip_request_history = defaultdict(deque)

def is_rate_limited(client_ip: str) -> bool:
    """Check if the given IP address has exceeded the submission rate limit."""
    now = time.time()
    history = ip_request_history[client_ip]
    
    # Prune requests older than the sliding window
    while history and now - history[0] > Config.RATE_LIMIT_WINDOW_SECONDS:
        history.popleft()
        
    if len(history) >= Config.RATE_LIMIT_MAX_REQUESTS:
        return True
        
    history.append(now)
    return False

# RFC 5322 compliant email regex
EMAIL_REGEX = re.compile(
    r"^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$"
)

# --------------------------------------------------------------------------
# Email Dispatcher
# --------------------------------------------------------------------------
def send_contact_email(name: str, sender_email: str, subject: str, message: str) -> bool:
    """
    Sends an email to Dhanush Reddy using configured SMTP credentials,
    or logs safely to console if in development / simulation mode.
    """
    if not Config.is_smtp_configured():
        if Config.DEV_MODE:
            logger.info("=" * 60)
            logger.info("[DEV MODE] Contact Form Submission Received")
            logger.info(f"From: {name} <{sender_email}>")
            logger.info(f"To: {Config.MAIL_RECIPIENT}")
            logger.info(f"Subject: [Portfolio Contact] {subject}")
            logger.info(f"Message:\n{message}")
            logger.info("=" * 60)
            return True
        else:
            logger.error("SMTP credentials are not configured on server and DEV_MODE is disabled.")
            return False

    try:
        msg = MIMEMultipart('alternative')
        msg['Subject'] = f"[Portfolio Contact] {subject}"
        msg['From'] = Config.MAIL_SENDER or Config.MAIL_USERNAME
        msg['To'] = Config.MAIL_RECIPIENT
        msg['Reply-To'] = sender_email

        plain_text = (
            f"You received a new message from your portfolio website:\n\n"
            f"Name: {name}\n"
            f"Email: {sender_email}\n"
            f"Subject: {subject}\n\n"
            f"Message:\n{message}\n\n"
            f"---\nSent via Dhanush Reddy Portfolio API"
        )

        escaped_message = html.escape(message).replace('\n', '<br>')
        html_content = f"""
        <html>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #171717;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #E2E8F0; border-radius: 8px;">
              <h2 style="color: #635BFF; margin-top: 0;">New Contact Form Message</h2>
              <p><strong>From:</strong> {html.escape(name)} (<a href="mailto:{html.escape(sender_email)}">{html.escape(sender_email)}</a>)</p>
              <p><strong>Subject:</strong> {html.escape(subject)}</p>
              <hr style="border: none; border-top: 1px solid #E2E8F0; margin: 20px 0;">
              <h3 style="color: #FF5C35;">Message:</h3>
              <div style="background-color: #F8FAFC; padding: 15px; border-radius: 6px; white-space: pre-wrap;">{escaped_message}</div>
              <p style="font-size: 12px; color: #718096; margin-top: 25px;">
                This message was delivered via the Dhanush Reddy Portfolio Backend API.
              </p>
            </div>
          </body>
        </html>
        """

        msg.attach(MIMEText(plain_text, 'plain', 'utf-8'))
        msg.attach(MIMEText(html_content, 'html', 'utf-8'))

        if Config.MAIL_USE_SSL:
            server = smtplib.SMTP_SSL(Config.MAIL_SERVER, Config.MAIL_PORT, timeout=10)
        else:
            server = smtplib.SMTP(Config.MAIL_SERVER, Config.MAIL_PORT, timeout=10)
            if Config.MAIL_USE_TLS:
                server.starttls()

        server.login(Config.MAIL_USERNAME, Config.MAIL_PASSWORD)
        server.sendmail(msg['From'], [Config.MAIL_RECIPIENT], msg.as_string())
        server.quit()
        logger.info(f"Successfully dispatched email from {sender_email} to {Config.MAIL_RECIPIENT}")
        return True

    except Exception as e:
        logger.error(f"Failed to dispatch email: {str(e)}", exc_info=True)
        return False

# --------------------------------------------------------------------------
# API Routes
# --------------------------------------------------------------------------
@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint to verify backend status."""
    return jsonify({
        "status": "healthy",
        "service": "Dhanush Reddy Portfolio Backend",
        "smtp_configured": Config.is_smtp_configured(),
        "dev_mode": Config.DEV_MODE,
        "recipient": Config.MAIL_RECIPIENT
    }), 200

@app.route('/api/contact', methods=['POST'])
def handle_contact():
    """
    POST /api/contact
    Handles contact submission with validation, spam protection, and rate limiting.
    """
    client_ip = request.headers.get('X-Forwarded-For', request.remote_addr)
    if client_ip and ',' in client_ip:
        client_ip = client_ip.split(',')[0].strip()

    # Rate Limiting Check
    if is_rate_limited(client_ip):
        logger.warning(f"Rate limit exceeded for IP: {client_ip}")
        return jsonify({
            "success": False,
            "error": "Rate limit exceeded. Please wait a few minutes before submitting another message."
        }), 429

    # Content-Type Check
    if not request.is_json:
        return jsonify({
            "success": False,
            "error": "Invalid request format. JSON body required."
        }), 400

    data = request.get_json() or {}

    # 1. Anti-Spam: Honeypot check
    bot_check = data.get('bot_check', '').strip()
    if bot_check:
        logger.warning(f"Honeypot triggered by IP: {client_ip}")
        return jsonify({
            "success": False,
            "error": "Spam protection triggered."
        }), 400

    # 2. Extract and Sanitize Fields
    raw_name = str(data.get('name', '')).strip()
    raw_email = str(data.get('email', '')).strip()
    raw_subject = str(data.get('subject', '')).strip()
    raw_message = str(data.get('message', '')).strip()

    # Prevent header injection (strip newlines from header fields)
    name = re.sub(r'[\r\n]', '', raw_name)
    email = re.sub(r'[\r\n]', '', raw_email)
    subject = re.sub(r'[\r\n]', '', raw_subject)
    message = raw_message

    # 3. Input Validation
    errors = {}

    if not name:
        errors['name'] = "Full Name is required."
    elif len(name) < 2:
        errors['name'] = "Name must be at least 2 characters."
    elif len(name) > 100:
        errors['name'] = "Name cannot exceed 100 characters."

    if not email:
        errors['email'] = "Email address is required."
    elif len(email) > 100:
        errors['email'] = "Email address cannot exceed 100 characters."
    elif not EMAIL_REGEX.match(email):
        errors['email'] = "Please provide a valid email address."

    if not subject:
        errors['subject'] = "Subject is required."
    elif len(subject) < 3:
        errors['subject'] = "Subject must be at least 3 characters."
    elif len(subject) > 150:
        errors['subject'] = "Subject cannot exceed 150 characters."

    if not message:
        errors['message'] = "Message is required."
    elif len(message) < 10:
        errors['message'] = "Message must be at least 10 characters."
    elif len(message) > 2000:
        errors['message'] = "Message cannot exceed 2000 characters."

    if errors:
        return jsonify({
            "success": False,
            "error": "Validation failed.",
            "fields": errors
        }), 400

    # 4. Dispatch Email
    dispatched = send_contact_email(name, email, subject, message)
    if dispatched:
        return jsonify({
            "success": True,
            "message": "Thank you! Your message has been sent successfully. Dhanush will get back to you shortly."
        }), 200
    else:
        return jsonify({
            "success": False,
            "error": "Email delivery could not be completed at this time. Please contact Dhanush directly at dr114547@gmail.com."
        }), 500

@app.errorhandler(404)
def not_found(e):
    return jsonify({"error": "Resource not found"}), 404

@app.errorhandler(405)
def method_not_allowed(e):
    return jsonify({"error": "Method not allowed"}), 405

@app.errorhandler(500)
def server_error(e):
    return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    port = Config.PORT
    debug = Config.DEBUG
    logger.info(f"Starting Flask backend server on port {port} (debug={debug})")
    app.run(host='0.0.0.0', port=port, debug=debug)
