// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Initialize plan selection
    initializePlanSelection();
    
    // Initialize FAQ accordion
    initializeFAQAccordion();
    
    // Initialize newsletter subscription
    initializeNewsletter();
    
    // Initialize smooth scrolling
    initializeSmoothScrolling();
});

// Initialize plan selection
function initializePlanSelection() {
    const planButtons = document.querySelectorAll('.plan-card .btn');
    
    planButtons.forEach(button => {
        button.addEventListener('click', function() {
            const planCard = this.closest('.plan-card');
            const planName = planCard.querySelector('h3').textContent;
            
            // Show loading state
            this.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Processing...';
            this.disabled = true;
            
            // Simulate processing (replace with actual signup logic)
            setTimeout(() => {
                showNotification(`Starting your ${planName} plan...`, 'success');
                this.innerHTML = planName === 'Free' ? 'Get Started' : 'Start Free Trial';
                this.disabled = false;
            }, 1500);
        });
    });
}

// Initialize FAQ accordion
function initializeFAQAccordion() {
    const accordionButtons = document.querySelectorAll('.accordion-button');
    
    accordionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            
            // Add animation class
            this.closest('.accordion-item').classList.add('animating');
            
            // Remove animation class after transition
            setTimeout(() => {
                this.closest('.accordion-item').classList.remove('animating');
            }, 300);
            
            // Update icon
            const icon = this.querySelector('i') || document.createElement('i');
            if (!this.querySelector('i')) {
                icon.className = 'fas fa-chevron-down ms-2';
                this.appendChild(icon);
            }
            
            icon.style.transform = isExpanded ? 'rotate(0deg)' : 'rotate(180deg)';
        });
    });
}

// Initialize newsletter subscription
function initializeNewsletter() {
    const newsletterForm = document.querySelector('.footer .col-md-3:last-child');
    const emailInput = newsletterForm.querySelector('input[type="email"]');
    const subscribeBtn = newsletterForm.querySelector('.subscribe-btn');
    
    subscribeBtn.addEventListener('click', function() {
        const email = emailInput.value.trim();
        
        if (!email) {
            showNotification('Please enter your email address', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Show loading state
        this.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Subscribing...';
        this.disabled = true;
        
        // Simulate subscription (replace with actual API call)
        setTimeout(() => {
            showNotification('Successfully subscribed to newsletter!', 'success');
            emailInput.value = '';
            this.innerHTML = 'Subscribe now';
            this.disabled = false;
        }, 1500);
    });
}

// Initialize smooth scrolling
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 76, // Adjust for navbar height
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Validate email format
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add notification styles
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 8px;
        color: white;
        transform: translateY(100px);
        opacity: 0;
        transition: all 0.3s ease;
        z-index: 1000;
    }
    
    .notification.show {
        transform: translateY(0);
        opacity: 1;
    }
    
    .notification.success {
        background: #4CAF50;
    }
    
    .notification.error {
        background: #F44336;
    }
    
    .notification.info {
        background: #2196F3;
    }
    
    .accordion-item.animating .accordion-collapse {
        transition: height 0.3s ease;
    }
`;
document.head.appendChild(style); 