document.addEventListener('DOMContentLoaded', function() {
    // Initialize form switching
    initializeFormSwitching();
    
    // Initialize password visibility toggle
    initializePasswordToggle();
    
    // Initialize form validation
    initializeFormValidation();
    
    // Initialize social login buttons
    initializeSocialLogin();
    
    // Initialize background animation
    initializeBackgroundAnimation();
});

// Form Switching
function initializeFormSwitching() {
    const loginForm = document.querySelector('.login-form');
    const registerForm = document.querySelector('.register-form');
    const switchLinks = document.querySelectorAll('.form-footer a');
    
    // Show login form by default
    loginForm.classList.add('active');
    
    switchLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (this.getAttribute('data-form') === 'login') {
                loginForm.classList.add('active');
                registerForm.classList.remove('active');
            } else {
                registerForm.classList.add('active');
                loginForm.classList.remove('active');
            }
        });
    });
}

// Password Visibility Toggle
function initializePasswordToggle() {
    const toggleButtons = document.querySelectorAll('.toggle-password');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
}

// Form Validation
function initializeFormValidation() {
    const forms = document.querySelectorAll('.auth-form form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm(this)) {
                showLoadingState(this);
                // Simulate API call
                setTimeout(() => {
                    hideLoadingState(this);
                    showSuccessMessage(this);
                }, 1500);
            }
        });
    });
}

function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required]');
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            showError(input, 'This field is required');
            isValid = false;
        } else if (input.type === 'email' && !isValidEmail(input.value)) {
            showError(input, 'Please enter a valid email address');
            isValid = false;
        } else if (input.type === 'password' && input.value.length < 6) {
            showError(input, 'Password must be at least 6 characters');
            isValid = false;
        } else if (input.id === 'confirm-password') {
            const password = form.querySelector('#password');
            if (input.value !== password.value) {
                showError(input, 'Passwords do not match');
                isValid = false;
            }
        } else {
            clearError(input);
        }
    });
    
    return isValid;
}

function showError(input, message) {
    const formGroup = input.closest('.form-group');
    const errorDiv = formGroup.querySelector('.error-message') || document.createElement('div');
    
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    if (!formGroup.querySelector('.error-message')) {
        formGroup.appendChild(errorDiv);
    }
    
    input.classList.add('error');
}

function clearError(input) {
    const formGroup = input.closest('.form-group');
    const errorDiv = formGroup.querySelector('.error-message');
    
    if (errorDiv) {
        errorDiv.remove();
    }
    
    input.classList.remove('error');
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Loading State
function showLoadingState(form) {
    const button = form.querySelector('.auth-btn');
    const originalText = button.textContent;
    
    button.disabled = true;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    button.dataset.originalText = originalText;
}

function hideLoadingState(form) {
    const button = form.querySelector('.auth-btn');
    button.disabled = false;
    button.textContent = button.dataset.originalText;
}

// Success Message
function showSuccessMessage(form) {
    const formContainer = form.closest('.auth-form');
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <h3>Success!</h3>
        <p>${form.classList.contains('login-form') ? 'You have successfully logged in!' : 'Your account has been created!'}</p>
    `;
    
    form.style.display = 'none';
    formContainer.appendChild(successMessage);
    
    // Redirect after 2 seconds
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 2000);
}

// Social Login
function initializeSocialLogin() {
    const socialButtons = document.querySelectorAll('.social-btn');
    
    socialButtons.forEach(button => {
        button.addEventListener('click', function() {
            const provider = this.getAttribute('data-provider');
            showLoadingState(this.closest('.auth-form').querySelector('form'));
            
            // Simulate social login
            setTimeout(() => {
                hideLoadingState(this.closest('.auth-form').querySelector('form'));
                showSuccessMessage(this.closest('.auth-form').querySelector('form'));
            }, 1500);
        });
    });
}

// Background Animation
function initializeBackgroundAnimation() {
    const background = document.querySelector('.background-animation');
    
    // Create additional circles
    for (let i = 0; i < 5; i++) {
        const circle = document.createElement('div');
        circle.className = 'circle';
        
        // Random position and size
        const size = Math.random() * 200 + 100;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        
        circle.style.width = `${size}px`;
        circle.style.height = `${size}px`;
        circle.style.left = `${x}%`;
        circle.style.top = `${y}%`;
        circle.style.animationDelay = `${Math.random() * 10}s`;
        
        background.appendChild(circle);
    }
}

// Add CSS for error messages and success state
const style = document.createElement('style');
style.textContent = `
    .error-message {
        color: #dc3545;
        font-size: 0.875rem;
        margin-top: 0.5rem;
    }
    
    .error {
        border-color: #dc3545 !important;
    }
    
    .success-message {
        text-align: center;
        padding: 2rem;
        animation: fadeIn 0.5s ease;
    }
    
    .success-message i {
        font-size: 3rem;
        color: #28a745;
        margin-bottom: 1rem;
    }
    
    .success-message h3 {
        color: #2D1B54;
        margin-bottom: 0.5rem;
    }
    
    .success-message p {
        color: #666;
    }
    
    .auth-btn i {
        margin-right: 0.5rem;
    }
`;

document.head.appendChild(style); 