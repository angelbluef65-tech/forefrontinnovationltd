// Form Handler for Formspree Integration with enhanced features

class FormHandler {
    constructor(formId, formspreeUrl) {
        this.form = document.getElementById(formId);
        this.formspreeUrl = formspreeUrl;
        this.init();
    }

    init() {
        if (!this.form) return;

        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.setupFormValidation();
    }

    setupFormValidation() {
        const inputs = this.form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    validateField(field) {
        if (!field.hasAttribute('required')) return true;

        let isValid = true;
        let errorMessage = '';

        if (!field.value.trim()) {
            isValid = false;
            errorMessage = 'This field is required';
        } else if (field.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }

        this.showFieldError(field, errorMessage);
        return isValid;
    }

    showFieldError(field, message) {
        this.clearFieldError(field);
        
        if (message) {
            field.classList.add('error');
            const errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            errorElement.textContent = message;
            errorElement.style.color = '#ff4444';
            errorElement.style.fontSize = '0.85rem';
            errorElement.style.marginTop = '5px';
            field.parentNode.appendChild(errorElement);
        }
    }

    clearFieldError(field) {
        field.classList.remove('error');
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }

    validateForm() {
        let isValid = true;
        const requiredFields = this.form.querySelectorAll('[required]');

        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    async handleSubmit(event) {
        event.preventDefault();

        const formData = new FormData(this.form);
        const submitButton = this.form.querySelector('button[type="submit"]');
        const submitText = submitButton.querySelector('.submit-text');
        const loadingSpinner = submitButton.querySelector('.loading-spinner');
        const formMessage = document.getElementById('formMessage');

        // Validate form
        if (!this.validateForm()) {
            this.showMessage(formMessage, 'Please fill all required fields correctly.', 'error');
            return;
        }

        // Show loading state
        submitText.style.display = 'none';
        loadingSpinner.style.display = 'inline-block';
        submitButton.disabled = true;
        submitButton.classList.add('loading');

        try {
            // Add timestamp to form data
            formData.append('_timestamp', new Date().toISOString());
            formData.append('_page', window.location.href);

            // Send to Formspree with enhanced headers
            const response = await fetch(this.formspreeUrl, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            const data = await response.json();

            if (response.ok) {
                // Success
                this.form.reset();
                this.showMessage(formMessage, 'Thank you! Your message has been sent successfully. We\'ll get back to you within 24 hours.', 'success');
                
                // Add to browser storage for tracking
                localStorage.setItem('lastContactSubmit', new Date().toISOString());
                
                // Optional: Track in Google Analytics if available
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'contact_form_submit', {
                        'event_category': 'engagement',
                        'event_label': 'Contact Form Submission'
                    });
                }
            } else {
                // Error from Formspree
                throw new Error(data.error || 'Form submission failed');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            
            // Fallback: Try email alternative if Formspree fails
            const emailData = {
                name: formData.get('name'),
                email: formData.get('email'),
                subject: formData.get('subject'),
                message: formData.get('message'),
                phone: formData.get('phone')
            };

            const fallbackMessage = `
                Form submission failed. Please contact us directly at:
                Email: info@forefrontinnovations.com
                Phone: +233 (059) 266-9974
                
                Your message details:
                Name: ${emailData.name}
                Email: ${emailData.email}
                Subject: ${emailData.subject}
                Message: ${emailData.message}
            `;
            
            this.showMessage(formMessage, fallbackMessage, 'error');
        } finally {
            // Reset button state
            submitText.style.display = 'inline';
            loadingSpinner.style.display = 'none';
            submitButton.disabled = false;
            submitButton.classList.remove('loading');

            // Hide message after 8 seconds
            setTimeout(() => {
                formMessage.style.display = 'none';
                formMessage.textContent = '';
                formMessage.className = 'form-message';
            }, 8000);
        }
    }

    showMessage(element, message, type) {
        element.textContent = message;
        element.className = `form-message ${type}`;
        element.style.display = 'block';

        // Scroll to message if it's not visible
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
        });

        // Add animation
        element.style.animation = 'fadeInUp 0.5s ease-out';
    }

    // Optional: Add spam protection
    isSpam(formData) {
        // Check for common spam patterns
        const message = formData.get('message') || '';
        const name = formData.get('name') || '';
        
        // Simple spam detection (can be enhanced)
        const spamPatterns = [
            /http[s]?:\/\//i, // URLs in message
            /[A-Z]{5,}/, // Excessive caps
            /viagra|cialis|porn/i, // Common spam keywords
        ];

        return spamPatterns.some(pattern => 
            pattern.test(message) || pattern.test(name)
        );
    }
}

// Initialize Form Handler when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const formspreeUrl = 'https://formspree.io/f/mjgbjrer';
    const contactFormHandler = new FormHandler('contactForm', formspreeUrl);

    // Add form field animations
    const formGroups = document.querySelectorAll('.form-group');
    formGroups.forEach((group, index) => {
        group.style.animationDelay = `${0.1 * index}s`;
    });
});