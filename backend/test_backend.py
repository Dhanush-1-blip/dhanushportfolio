"""
Automated Test Suite for Dhanush Reddy's Portfolio Backend
Tests all endpoints, validations, spam protections, rate limiting, and CORS behavior.
"""

import json
import unittest
from app import app, ip_request_history
from config import Config

class BackendTestCase(unittest.TestCase):
    def setUp(self):
        self.app = app
        self.client = self.app.test_client()
        self.app.config['TESTING'] = True
        # Clear rate limiter memory before each test
        ip_request_history.clear()

    def test_01_health_check(self):
        """Test GET /api/health returns 200 OK and expected status."""
        response = self.client.get('/api/health')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(data.get('status'), 'healthy')
        self.assertEqual(data.get('recipient'), 'dr114547@gmail.com')

    def test_02_valid_contact_submission(self):
        """Test POST /api/contact with valid payload returns 200 and success."""
        payload = {
            "name": "Jane Recruiter",
            "email": "jane@techcorp.com",
            "subject": "Internship Inquiry for AI/ML",
            "message": "Hello Dhanush, we reviewed your portfolio and would like to discuss a summer internship opportunity.",
            "bot_check": ""
        }
        response = self.client.post(
            '/api/contact',
            data=json.dumps(payload),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertTrue(data.get('success'))
        self.assertIn("successfully", data.get('message', '').lower())

    def test_03_missing_name(self):
        """Test POST /api/contact fails when name is missing."""
        payload = {
            "email": "jane@techcorp.com",
            "subject": "Hello",
            "message": "Valid test message for testing missing name.",
            "bot_check": ""
        }
        response = self.client.post('/api/contact', data=json.dumps(payload), content_type='application/json')
        self.assertEqual(response.status_code, 400)
        data = response.get_json()
        self.assertFalse(data.get('success'))
        self.assertIn('name', data.get('fields', {}))

    def test_04_invalid_email_format(self):
        """Test POST /api/contact fails when email is invalid."""
        payload = {
            "name": "Alex",
            "email": "not-an-email",
            "subject": "Hello",
            "message": "Valid test message for testing email validation.",
            "bot_check": ""
        }
        response = self.client.post('/api/contact', data=json.dumps(payload), content_type='application/json')
        self.assertEqual(response.status_code, 400)
        data = response.get_json()
        self.assertFalse(data.get('success'))
        self.assertIn('email', data.get('fields', {}))

    def test_05_honeypot_spam_trap(self):
        """Test POST /api/contact blocks bots when honeypot field is filled."""
        payload = {
            "name": "Spam Bot",
            "email": "bot@spammer.com",
            "subject": "Crypto Promotion",
            "message": "Buy our crypto coins right now for massive returns!",
            "bot_check": "http://spamsite.com"
        }
        response = self.client.post('/api/contact', data=json.dumps(payload), content_type='application/json')
        self.assertEqual(response.status_code, 400)
        data = response.get_json()
        self.assertFalse(data.get('success'))
        self.assertIn("spam", data.get('error', '').lower())

    def test_06_message_too_short(self):
        """Test POST /api/contact requires message of at least 10 characters."""
        payload = {
            "name": "Tester",
            "email": "test@example.com",
            "subject": "Short test",
            "message": "Hi",  # 2 characters
            "bot_check": ""
        }
        response = self.client.post('/api/contact', data=json.dumps(payload), content_type='application/json')
        self.assertEqual(response.status_code, 400)
        data = response.get_json()
        self.assertIn('message', data.get('fields', {}))

    def test_07_rate_limiting(self):
        """Test rate limiting blocks rapid consecutive requests from same IP."""
        payload = {
            "name": "Speedy Submitter",
            "email": "speedy@example.com",
            "subject": "Repeated request",
            "message": "Submitting valid message multiple times in quick succession.",
            "bot_check": ""
        }

        # Send MAX_REQUESTS allowed
        for _ in range(Config.RATE_LIMIT_MAX_REQUESTS):
            res = self.client.post(
                '/api/contact',
                data=json.dumps(payload),
                content_type='application/json',
                environ_base={'REMOTE_ADDR': '198.51.100.42'}
            )
            self.assertEqual(res.status_code, 200)

        # The next one should be blocked with 429 Too Many Requests
        rate_limited_res = self.client.post(
            '/api/contact',
            data=json.dumps(payload),
            content_type='application/json',
            environ_base={'REMOTE_ADDR': '198.51.100.42'}
        )
        self.assertEqual(rate_limited_res.status_code, 429)
        data = rate_limited_res.get_json()
        self.assertIn("rate limit", data.get('error', '').lower())

    def test_08_cors_headers(self):
        """Test CORS headers are returned properly for API endpoints."""
        response = self.client.get('/api/health')
        self.assertIn('Access-Control-Allow-Origin', response.headers)

if __name__ == '__main__':
    unittest.main()
