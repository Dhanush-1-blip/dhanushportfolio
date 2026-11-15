/**
 * CONTACT FORM CONTROLLER - DHANUSH REDDY PORTFOLIO
 * Client validation, honeypot protection, asynchronous submission, and UI state feedback.
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');
    const honeypotInput = document.getElementById('bot-check');
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const statusAlert = document.getElementById('form-status-alert');
    const messageCharCount = document.getElementById('message-char-count');

    // Record timestamp when page/form loaded for bot timing detection
    const formRenderTime = Date.now();

    // Update character counter
    if (messageInput && messageCharCount) {
      messageInput.addEventListener('input', () => {
        const len = messageInput.value.length;
        messageCharCount.textContent = `${len}/2000`;
      });
    }

    // Validation patterns
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

    function setFieldError(input, message) {
      input.classList.add('error');
      let errorEl = input.parentElement.querySelector('.form-field-error');
      if (!errorEl) {
        errorEl = document.createElement('span');
        errorEl.className = 'form-field-error';
        errorEl.setAttribute('role', 'alert');
        input.parentElement.appendChild(errorEl);
      }
      errorEl.textContent = message;
      input.setAttribute('aria-invalid', 'true');
    }

    function clearFieldError(input) {
      input.classList.remove('error');
      const errorEl = input.parentElement.querySelector('.form-field-error');
      if (errorEl) {
        errorEl.textContent = '';
      }
      input.removeAttribute('aria-invalid');
    }

    // Clear error on input
    [nameInput, emailInput, subjectInput, messageInput].forEach(field => {
      if (field) {
        field.addEventListener('input', () => clearFieldError(field));
      }
    });

    function showStatus(type, message) {
      if (!statusAlert) return;
      statusAlert.className = `form-status-alert ${type}`;
      statusAlert.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          ${type === 'success' 
            ? '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>'
            : '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>'}
        </svg>
        <div>${message}</div>
      `;
      statusAlert.setAttribute('role', 'alert');
      statusAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Clear previous status
      if (statusAlert) {
        statusAlert.className = 'form-status-alert';
        statusAlert.innerHTML = '';
      }

      // Honeypot check
      if (honeypotInput && honeypotInput.value.trim() !== '') {
        console.warn('Bot submission blocked.');
        showStatus('error', 'Spam detection triggered. Your message was not sent.');
        return;
      }

      // Human submission speed check (minimum 1.5 seconds)
      const elapsedSeconds = (Date.now() - formRenderTime) / 1000;
      if (elapsedSeconds < 1.5) {
        showStatus('error', 'Submission was too fast. Please take your time to review your message.');
        return;
      }

      let isValid = true;

      // Validate Name
      const nameVal = nameInput.value.trim();
      if (!nameVal) {
        setFieldError(nameInput, 'Full Name is required.');
        isValid = false;
      } else if (nameVal.length < 2) {
        setFieldError(nameInput, 'Name must be at least 2 characters.');
        isValid = false;
      } else if (nameVal.length > 100) {
        setFieldError(nameInput, 'Name cannot exceed 100 characters.');
        isValid = false;
      }

      // Validate Email
      const emailVal = emailInput.value.trim();
      if (!emailVal) {
        setFieldError(emailInput, 'Email Address is required.');
        isValid = false;
      } else if (!emailRegex.test(emailVal)) {
        setFieldError(emailInput, 'Please provide a valid email address (e.g., name@example.com).');
        isValid = false;
      } else if (emailVal.length > 100) {
        setFieldError(emailInput, 'Email address is too long.');
        isValid = false;
      }

      // Validate Subject
      const subjectVal = subjectInput.value.trim();
      if (!subjectVal) {
        setFieldError(subjectInput, 'Subject is required.');
        isValid = false;
      } else if (subjectVal.length < 3) {
        setFieldError(subjectInput, 'Subject must be at least 3 characters.');
        isValid = false;
      } else if (subjectVal.length > 150) {
        setFieldError(subjectInput, 'Subject cannot exceed 150 characters.');
        isValid = false;
      }

      // Validate Message
      const messageVal = messageInput.value.trim();
      if (!messageVal) {
        setFieldError(messageInput, 'Message is required.');
        isValid = false;
      } else if (messageVal.length < 10) {
        setFieldError(messageInput, 'Message must be at least 10 characters.');
        isValid = false;
      } else if (messageVal.length > 2000) {
        setFieldError(messageInput, 'Message cannot exceed 2000 characters.');
        isValid = false;
      }

      if (!isValid) return;

      // Prepare payload
      const payload = {
        name: nameVal,
        email: emailVal,
        subject: subjectVal,
        message: messageVal,
        bot_check: honeypotInput ? honeypotInput.value : '',
        timestamp: Date.now()
      };

      // Set Loading State
      submitBtn.disabled = true;
      submitBtn.classList.add('is-submitting');
      const originalBtnText = submitBtn.querySelector('.btn-text').textContent;
      submitBtn.querySelector('.btn-text').textContent = 'Sending Message...';

      const targetEndpoint = `${PORTFOLIO_CONFIG.api.baseUrl}${PORTFOLIO_CONFIG.api.contactEndpoint}`;

      try {
        const response = await fetch(targetEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        const data = await response.json().catch(() => ({}));

        if (response.ok && data.success) {
          showStatus('success', data.message || 'Thank you! Your message has been sent successfully. Dhanush will get back to you shortly.');
          contactForm.reset();
          if (messageCharCount) messageCharCount.textContent = '0/2000';
        } else {
          const errorMsg = data.error || data.message || 'Unable to send message at this time. Please try again or reach out directly at dr114547@gmail.com.';
          showStatus('error', errorMsg);
        }
      } catch (err) {
        console.error('Contact submission error:', err);
        showStatus('error', `Could not connect to the backend server. You can contact Dhanush directly via email at <a href="mailto:dr114547@gmail.com" style="text-decoration: underline; color: inherit; font-weight: 600;">dr114547@gmail.com</a> or phone at <a href="tel:9900320107" style="text-decoration: underline; color: inherit; font-weight: 600;">9900320107</a>.`);
      } finally {
        submitBtn.disabled = false;
        submitBtn.classList.remove('is-submitting');
        submitBtn.querySelector('.btn-text').textContent = originalBtnText;
      }
    });
  });
})();
