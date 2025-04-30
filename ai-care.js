// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Initialize chat interface
    initializeChatInterface();
    
    // Initialize mood selector
    initializeMoodSelector();
    
    // Initialize smooth scrolling
    initializeSmoothScrolling();
    
    // Initialize newsletter subscription
    initializeNewsletter();
    
    // Initialize voice chat
    initializeVoiceChat();
});

// Chat interface functionality
function initializeChatInterface() {
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const startChatBtn = document.querySelector('.start-chat-btn');
    
    // Show/hide chat interface
    if (startChatBtn) {
        startChatBtn.addEventListener('click', function() {
            document.getElementById('chat-interface').scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    // Welcome message
    setTimeout(() => {
        addMessage("Hello! I'm here to listen and support you. How are you feeling today?", 'ai');
    }, 1000);
    
    // Send message function
    function sendMessage(message) {
        if (!message.trim()) return;
        
        // Add user message
        addMessage(message, 'user');
        
        // Clear input
        userInput.value = '';
        
        // Get AI response
        getAIResponse(message);
    }
    
    // Add message to chat
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        const p = document.createElement('p');
        p.textContent = text;
        
        contentDiv.appendChild(p);
        messageDiv.appendChild(contentDiv);
        chatMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Show typing indicator
    function showTypingIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'message ai-message typing-indicator';
        indicator.innerHTML = '<div class="message-content"><span class="typing-dots"><span>.</span><span>.</span><span>.</span></span></div>';
        chatMessages.appendChild(indicator);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return indicator;
    }
    
    // Remove typing indicator
    function removeTypingIndicator(indicator) {
        indicator.remove();
    }
    
    // Get AI response
    async function getAIResponse(userMessage) {
        const typingIndicator = showTypingIndicator();
        
        try {
            console.log('Sending request to API...');
            const response = await fetch('https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer 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'
                },
                body: JSON.stringify({
                    inputs: userMessage,
                    options: {
                        wait_for_model: true,
                        use_cache: false
                    }
                })
            });

            console.log('Response status:', response.status);
            
            if (!response.ok) {
                const errorData = await response.json();
                console.error('API Error:', errorData);
                throw new Error(`API request failed with status ${response.status}`);
            }

            const data = await response.json();
            console.log('API Response:', data);
            
            removeTypingIndicator(typingIndicator);
            
            // Handle the response from HuggingFace
            if (data && data[0] && data[0].generated_text) {
                let aiResponse = processResponse(data[0].generated_text);
                addMessage(aiResponse, 'ai');
            } else {
                console.error('Unexpected response format:', data);
                addMessage('I apologize, but I\'m having trouble understanding right now. Could you please rephrase your message?', 'ai');
            }
        } catch (error) {
            console.error('Error in getAIResponse:', error);
            removeTypingIndicator(typingIndicator);
            
            if (error.message.includes('Failed to fetch')) {
                addMessage('I\'m having trouble connecting to the server. Please check your internet connection and try again.', 'ai');
            } else if (error.message.includes('loading')) {
                addMessage('The AI model is currently loading. Please try again in a few seconds.', 'ai');
            } else {
                addMessage('I apologize for the technical difficulty. Please try again in a moment.', 'ai');
            }
        }
    }
    
    // Process the AI response to make it more appropriate for mental health support
    function processResponse(response) {
        // Remove any inappropriate content and clean up the response
        response = response.replace(/[^\w\s.,!?'-]/g, ' ').trim();
        response = response.replace(/\s+/g, ' '); // Remove extra spaces
        
        // Add empathetic prefixes randomly
        const empathyPrefixes = [
            "I understand how you feel. ",
            "Thank you for sharing that with me. ",
            "I hear you. ",
            "That sounds challenging. ",
            "I appreciate you opening up. ",
            "Let me help you with that. ",
            "I'm here to support you. "
        ];
        
        const randomPrefix = empathyPrefixes[Math.floor(Math.random() * empathyPrefixes.length)];
        
        // Add supportive suffixes randomly
        const supportiveSuffixes = [
            " Remember, it's okay to feel this way.",
            " I'm here to support you.",
            " Would you like to tell me more?",
            " How can I help you with this?",
            " Let's work through this together.",
            " Your feelings are valid.",
            " Take your time to process this."
        ];
        
        const randomSuffix = supportiveSuffixes[Math.floor(Math.random() * supportiveSuffixes.length)];
        
        // If response is too short, add more supportive content
        if (response.length < 20) {
            response = "I understand. Please tell me more about how you're feeling.";
        }
        
        // Combine the processed response with empathetic elements
        return randomPrefix + response + randomSuffix;
    }
    
    // Event listeners
    if (sendBtn) {
        sendBtn.addEventListener('click', function() {
            sendMessage(userInput.value);
        });
    }
    
    if (userInput) {
        userInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage(userInput.value);
            }
        });
    }
}

// Mood selector functionality
function initializeMoodSelector() {
    const moodButtons = document.querySelectorAll('.mood-btn');
    let selectedMood = null;
    
    moodButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            moodButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            selectedMood = this.dataset.mood;
            
            // Update chat context with mood
            updateMoodContext(selectedMood);
        });
    });
}

// Update mood context
function updateMoodContext(mood) {
    const moodMessages = {
        happy: 'I\'m glad you\'re feeling happy! Positive moments are worth celebrating. Would you like to share what\'s bringing you joy today? Understanding what makes us happy can help us build more positive experiences.',
        neutral: 'Thank you for checking in. A neutral mood can be a good time for reflection. How have you been taking care of yourself lately? We can explore ways to maintain balance in your daily life.',
        sad: 'I hear you, and it\'s completely okay to feel sad. Your feelings are valid. Would you like to talk about what\'s on your mind? I\'m here to listen without judgment and support you through this moment.'
    };
    
    addMessage(moodMessages[mood], 'ai');
}

// Smooth scrolling
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 76,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Newsletter subscription
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

// Email validation
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
    
    .typing-indicator .typing-dots {
        display: inline-block;
    }
    
    .typing-indicator .typing-dots span {
        animation: typing 1s infinite;
        opacity: 0;
    }
    
    .typing-indicator .typing-dots span:nth-child(2) {
        animation-delay: 0.2s;
    }
    
    .typing-indicator .typing-dots span:nth-child(3) {
        animation-delay: 0.4s;
    }
    
    @keyframes typing {
        0% { opacity: 0; }
        50% { opacity: 1; }
        100% { opacity: 0; }
    }
`;
document.head.appendChild(style);

// Voice chat functionality
function initializeVoiceChat() {
    const voiceInputBtn = document.getElementById('voiceInputBtn');
    const userInput = document.getElementById('user-input');
    let isListening = false;

    if ('webkitSpeechRecognition' in window) {
        const recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = function() {
            isListening = true;
            voiceInputBtn.classList.add('active');
            showNotification('Listening...', 'info');
        };

        recognition.onend = function() {
            isListening = false;
            voiceInputBtn.classList.remove('active');
        };

        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            userInput.value = transcript;
            // Trigger the send button click after voice input
            setTimeout(() => {
                document.getElementById('send-btn').click();
            }, 500);
        };

        recognition.onerror = function(event) {
            console.error('Speech recognition error:', event.error);
            showNotification('Voice recognition error. Please try again.', 'error');
        };

        voiceInputBtn.addEventListener('click', function() {
            if (!isListening) {
                recognition.start();
            } else {
                recognition.stop();
            }
        });
    } else {
        voiceInputBtn.style.display = 'none';
        console.log('Speech Recognition not supported');
    }
}

// Add voice input button to the chat interface
function addVoiceInputButton() {
    const inputGroup = document.querySelector('.input-group');
    const voiceInputBtn = document.createElement('button');
    voiceInputBtn.id = 'voiceInputBtn';
    voiceInputBtn.className = 'voice-input-btn';
    voiceInputBtn.innerHTML = '<i class="fas fa-microphone"></i>';
    voiceInputBtn.title = 'Voice Input';
    inputGroup.appendChild(voiceInputBtn);
}

// Add voice input button styles
const voiceStyles = document.createElement('style');
voiceStyles.textContent = `
    .voice-input-btn {
        background: none;
        border: none;
        padding: 8px;
        cursor: pointer;
        color: #666;
        transition: all 0.3s ease;
    }

    .voice-input-btn:hover {
        color: #2D1B54;
    }

    .voice-input-btn.active {
        color: #2D1B54;
        animation: pulse 1.5s infinite;
    }

    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(voiceStyles); 