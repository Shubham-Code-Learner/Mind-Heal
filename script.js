document.addEventListener("DOMContentLoaded", function () {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Team slider animation
    const slider = document.querySelector(".slider");
    const cards = document.querySelectorAll(".card");
    
    // Duplicate cards for infinite loop
    cards.forEach(card => {
        let clone = card.cloneNode(true);
        slider.appendChild(clone);
    });

    // Video player functionality
    window.changeVideo = function(videoUrl) {
        document.getElementById('video-player').src = videoUrl;
    };

    // FAQ accordion functionality
    const faqItems = document.querySelectorAll('.ques');
    faqItems.forEach(item => {
        item.addEventListener('click', function() {
            const icon = this.querySelector('i');
            icon.classList.toggle('fa-plus');
            icon.classList.toggle('fa-minus');
            
            // In a real implementation, you would show/hide the answer here
            // This is just a visual indicator for the demo
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            navbar.style.padding = '10px 0';
        } else {
            navbar.style.boxShadow = 'none';
            navbar.style.padding = '15px 0';
        }
    });

    // Lazy loading for images
    if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    } else {
        // Fallback for browsers that don't support lazy loading
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/lozad/dist/lozad.min.js';
        document.body.appendChild(script);
        script.onload = function() {
            const observer = lozad();
            observer.observe();
        };
    }

    // Tab switching functionality
    const navItems = document.querySelectorAll('.features-nav .nav-item');
    const contentItems = document.querySelectorAll('.feature-content');

    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all nav items
            navItems.forEach(nav => nav.classList.remove('active'));
            // Add active class to clicked nav item
            this.classList.add('active');

            // Hide all content items
            contentItems.forEach(content => content.classList.remove('active'));
            // Show corresponding content
            const contentId = this.textContent.trim().toLowerCase().replace(/\s+/g, '-') + '-content';
            document.getElementById(contentId)?.classList.add('active');
        });
    });

    // Audio player functionality
    const playButton = document.querySelector('.play-button');
    let isPlaying = false;

    playButton.addEventListener('click', function() {
        isPlaying = !isPlaying;
        this.innerHTML = isPlaying 
            ? '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="6" y="4" width="4" height="16" fill="currentColor"/><rect x="14" y="4" width="4" height="16" fill="currentColor"/></svg>'
            : '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>';
    });

    // Voice Controls
    const voiceSearchBtn = document.getElementById('voiceSearchBtn');
    const textToSpeechBtn = document.getElementById('textToSpeechBtn');
    let isListening = false;
    let isSpeaking = false;

    // Voice Search
    if ('webkitSpeechRecognition' in window) {
        const recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = function() {
            isListening = true;
            voiceSearchBtn.classList.add('active');
        };

        recognition.onend = function() {
            isListening = false;
            voiceSearchBtn.classList.remove('active');
        };

        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            handleVoiceCommand(transcript.toLowerCase());
        };

        voiceSearchBtn.addEventListener('click', function() {
            if (!isListening) {
                recognition.start();
            } else {
                recognition.stop();
            }
        });
    } else {
        voiceSearchBtn.style.display = 'none';
        console.log('Speech Recognition not supported');
    }

    // Text to Speech
    if ('speechSynthesis' in window) {
        const synthesis = window.speechSynthesis;
        
        textToSpeechBtn.addEventListener('click', function() {
            if (isSpeaking) {
                synthesis.cancel();
                isSpeaking = false;
                textToSpeechBtn.classList.remove('active');
            } else {
                const visibleContent = document.querySelector('.content.active');
                if (visibleContent) {
                    const text = visibleContent.textContent.trim();
                    const utterance = new SpeechSynthesisUtterance(text);
                    utterance.lang = 'en-US';
                    utterance.rate = 1;
                    utterance.pitch = 1;

                    utterance.onstart = function() {
                        isSpeaking = true;
                        textToSpeechBtn.classList.add('active');
                    };

                    utterance.onend = function() {
                        isSpeaking = false;
                        textToSpeechBtn.classList.remove('active');
                    };

                    synthesis.speak(utterance);
                }
            }
        });
    } else {
        textToSpeechBtn.style.display = 'none';
        console.log('Speech Synthesis not supported');
    }
});

function handleVoiceCommand(command) {
    // Navigation commands
    if (command.includes('go to') || command.includes('open')) {
        if (command.includes('home')) {
            window.location.href = '/';
        } else if (command.includes('about')) {
            window.location.href = '/about';
        } else if (command.includes('contact')) {
            window.location.href = '/contact';
        }
    }
    
    // Content section commands
    const sections = {
        'ai guidance': 'aiGuidance',
        'guided meditation': 'guidedMeditation',
        'sleep resources': 'sleepResources',
        'mental health': 'mentalHealth'
    };

    for (const [keyword, sectionId] of Object.entries(sections)) {
        if (command.includes(keyword)) {
            const button = document.querySelector(`[data-section="${sectionId}"]`);
            if (button) button.click();
            break;
        }
    }

    // Show a notification for the recognized command
    showNotification(`Command recognized: "${command}"`, 'info');
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }, 100);
}

// Add notification styles if not already present
if (!document.getElementById('notificationStyles')) {
    const style = document.createElement('style');
    style.id = 'notificationStyles';
    style.textContent = `
        .notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 12px 24px;
            border-radius: 4px;
            background: #333;
            color: white;
            font-size: 14px;
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.3s ease;
            z-index: 1000;
        }
        .notification.show {
            opacity: 1;
            transform: translateY(0);
        }
        .notification.info {
            background: #007bff;
        }
        .notification.success {
            background: #28a745;
        }
        .notification.error {
            background: #dc3545;
        }
    `;
    document.head.appendChild(style);
}