"""
Configuration Module for Dhanush Reddy's Portfolio Backend
Loads environment variables and provides structured settings.
"""

import os
from dotenv import load_dotenv

# Load .env file if present in the backend directory
load_dotenv()

class Config:
    # Security & Server
    SECRET_KEY = os.getenv('SECRET_KEY', 'default-dev-secret-key-change-in-production')
    PORT = int(os.getenv('PORT', 5000))
    DEBUG = os.getenv('FLASK_DEBUG', 'false').lower() in ('true', '1', 't')
    
    # Allowed Frontend Origins for CORS
    FRONTEND_ORIGIN = os.getenv('FRONTEND_ORIGIN', '*')
    
    # Recipient for all contact submissions
    MAIL_RECIPIENT = os.getenv('MAIL_RECIPIENT', 'dr114547@gmail.com')
    
    # SMTP Server Settings
    MAIL_SERVER = os.getenv('MAIL_SERVER', '')
    MAIL_PORT = int(os.getenv('MAIL_PORT', 587))
    MAIL_USE_TLS = os.getenv('MAIL_USE_TLS', 'true').lower() in ('true', '1', 't')
    MAIL_USE_SSL = os.getenv('MAIL_USE_SSL', 'false').lower() in ('true', '1', 't')
    MAIL_USERNAME = os.getenv('MAIL_USERNAME', '')
    MAIL_PASSWORD = os.getenv('MAIL_PASSWORD', '')
    MAIL_SENDER = os.getenv('MAIL_SENDER', os.getenv('MAIL_USERNAME', 'no-reply@dhanushportfolio.com'))
    
    # Rate Limiting Settings (Requests per IP per time window in seconds)
    RATE_LIMIT_MAX_REQUESTS = int(os.getenv('RATE_LIMIT_MAX_REQUESTS', 5))
    RATE_LIMIT_WINDOW_SECONDS = int(os.getenv('RATE_LIMIT_WINDOW_SECONDS', 900))  # 15 minutes
    
    # If True or if MAIL_SERVER is not set, log emails locally instead of failing
    DEV_MODE = os.getenv('DEV_MODE', 'true').lower() in ('true', '1', 't')

    @classmethod
    def is_smtp_configured(cls):
        """Returns True if the required SMTP settings are populated."""
        return bool(cls.MAIL_SERVER and cls.MAIL_USERNAME and cls.MAIL_PASSWORD)
