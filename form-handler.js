// Form Handler for Formspree Integration

class FormHandler {
    constructor(formId, formspreeUrl) {
        this.form = document.getElementById(formId);
        this.formspreeUrl = formspreeUrl;
        this.init();
    }
    
    init() {
        if (!this.form) return;
        
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
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
        
        try {
            // Send to Formspree
            const response = await fetch(this.formspreeUrl, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                // Success
                this.form.reset();
                this.showMessage(formMessage, 'Thank you! Your message has been sent successfully. We\'ll get back to you soon.', 'success');
            } else {
                // Error from Formspree
                throw new Error('Form submission failed');
            }
        } catch (error) {
            // Network error or Formspree error
            console.error('Form submission error:', error);
            this.showMessage(formMessage, 'Sorry, there was an error sending your message. Please try again later or contact us directly.', 'error');
        } finally {
            // Reset button state
            submitText.style.display = 'inline';
            loadingSpinner.style.display = 'none';
            submitButton.disabled = false;
            
            // Hide message after 5 seconds
            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 5000);
        }
    }
    
    validateForm() {
        let isValid = true;
        const requiredFields = this.form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.style.borderColor = '#ff4444';
                isValid = false;
                
                // Reset border on input
                field.addEventListener('input', () => {
                    field.style.borderColor = '';
                }, { once: true });
            }
            
            // Email validation
            if (field.type === 'email' && field.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(field.value)) {
                    field.style.borderColor = '#ff4444';
                    isValid = false;
                    
                    field.addEventListener('input', () => {
                        field.style.borderColor = '';
                    }, { once: true });
                }
            }
        });
        
        return isValid;
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
    }
}

// Initialize Form Handler when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // INSTRUCTION: Replace 'YOUR_FORM_ID' with your actual Formspree form ID
    const formspreeUrl = 'https://formspree.io/f/YOUR_FORM_ID';
    const contactFormHandler = new FormHandler('contactForm', formspreeUrl);
});