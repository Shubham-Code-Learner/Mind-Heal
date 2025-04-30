// Voice Controls for Mind Heal
class VoiceController {
    constructor() {
        this.recognition = null;
        this.synthesis = window.speechSynthesis;
        this.isListening = false;
        this.isSpeaking = false;
        this.voiceEnabled = false;
        this.initializeSpeechRecognition();
    }

    initializeSpeechRecognition() {
        if ('webkitSpeechRecognition' in window) {
            this.recognition = new webkitSpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-US';

            this.recognition.onstart = () => {
                this.isListening = true;
                this.updateMicIcon(true);
            };

            this.recognition.onend = () => {
                this.isListening = false;
                this.updateMicIcon(false);
            };

            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                this.showNotification('Voice recognition error. Please try again.', 'error');
            };

            this.voiceEnabled = true;
        } else {
            console.error('Speech recognition not supported');
            this.showNotification('Voice recognition is not supported in your browser.', 'error');
        }
    }

    startListening(callback) {
        if (!this.voiceEnabled) return;

        this.recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            callback(transcript);
        };

        this.recognition.start();
    }

    stopListening() {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
        }
    }

    speak(text) {
        if (this.synthesis && !this.isSpeaking) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.onend = () => {
                this.isSpeaking = false;
                this.updateSpeakerIcon(false);
            };
            utterance.onstart = () => {
                this.isSpeaking = true;
                this.updateSpeakerIcon(true);
            };
            this.synthesis.speak(utterance);
        }
    }

    updateMicIcon(isActive) {
        const micIcon = document.querySelector('.voice-input-icon');
        if (micIcon) {
            micIcon.classList.toggle('active', isActive);
        }
    }

    updateSpeakerIcon(isActive) {
        const speakerIcon = document.querySelector('.voice-output-icon');
        if (speakerIcon) {
            speakerIcon.classList.toggle('active', isActive);
        }
    }

    showNotification(message, type) {
        if (window.showNotification) {
            window.showNotification(message, type);
        } else {
            alert(message);
        }
    }
}

// Initialize voice controls
document.addEventListener('DOMContentLoaded', function() {
    const voiceController = new VoiceController();
    
    // Add voice control buttons to the navbar
    const navbar = document.querySelector('.navbar-nav');
    if (navbar) {
        const voiceControls = document.createElement('div');
        voiceControls.className = 'voice-controls';
        voiceControls.innerHTML = `
            <button class="voice-input-icon" title="Voice Search">
                <i class="fas fa-microphone"></i>
            </button>
            <button class="voice-output-icon" title="Text-to-Speech">
                <i class="fas fa-volume-up"></i>
            </button>
        `;
        navbar.appendChild(voiceControls);
    }

    // Add voice input to search
    const searchInputs = document.querySelectorAll('input[type="search"], input[type="text"]');
    searchInputs.forEach(input => {
        const voiceButton = document.createElement('button');
        voiceButton.className = 'voice-input-button';
        voiceButton.innerHTML = '<i class="fas fa-microphone"></i>';
        input.parentNode.insertBefore(voiceButton, input.nextSibling);

        voiceButton.addEventListener('click', () => {
            voiceController.startListening((transcript) => {
                input.value = transcript;
                input.dispatchEvent(new Event('input'));
            });
        });
    });

    // Add voice input to chatbot
    const userInput = document.getElementById('user-input');
    if (userInput) {
        const voiceButton = document.createElement('button');
        voiceButton.className = 'voice-input-button';
        voiceButton.innerHTML = '<i class="fas fa-microphone"></i>';
        userInput.parentNode.insertBefore(voiceButton, userInput.nextSibling);

        voiceButton.addEventListener('click', () => {
            voiceController.startListening((transcript) => {
                userInput.value = transcript;
                userInput.dispatchEvent(new Event('input'));
            });
        });
    }

    // Add text-to-speech for AI responses
    const originalAddMessage = window.addMessage;
    if (originalAddMessage) {
        window.addMessage = function(text, sender) {
            originalAddMessage(text, sender);
            if (sender === 'ai') {
                voiceController.speak(text);
            }
        };
    }

    // Add voice navigation
    const voiceCommands = {
        'go to home': '/',
        'go to articles': '/Article.html',
        'go to meditation': '/meditation.html',
        'go to sleep': '/sleep.html',
        'go to ai care': '/ai-care.html',
        'go to contact': '/contact.html',
        'go to plans': '/plans.html',
        'go to music': '/music.html',
        'go to about': '/About.html',
        'go to mood': '/mood.html',
        'go to login': '/login.html'
    };

    // Add global voice navigation button
    const voiceNavButton = document.createElement('button');
    voiceNavButton.className = 'voice-nav-button';
    voiceNavButton.innerHTML = '<i class="fas fa-microphone"></i>';
    document.body.appendChild(voiceNavButton);

    voiceNavButton.addEventListener('click', () => {
        voiceController.showNotification('Listening for navigation command...', 'info');
        voiceController.startListening((transcript) => {
            const command = transcript.toLowerCase().trim();
            for (const [key, url] of Object.entries(voiceCommands)) {
                if (command.includes(key)) {
                    window.location.href = url;
                    return;
                }
            }
            voiceController.showNotification('Command not recognized. Please try again.', 'error');
        });
    });
});

// Add styles for voice control elements
const voiceStyles = document.createElement('style');
voiceStyles.textContent = `
    .voice-controls {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-left: 15px;
    }

    .voice-input-icon,
    .voice-output-icon,
    .voice-input-button,
    .voice-nav-button {
        background: none;
        border: none;
        cursor: pointer;
        padding: 8px;
        border-radius: 50%;
        transition: all 0.3s ease;
    }

    .voice-input-icon:hover,
    .voice-output-icon:hover,
    .voice-input-button:hover,
    .voice-nav-button:hover {
        background: rgba(0, 0, 0, 0.1);
    }

    .voice-input-icon.active,
    .voice-output-icon.active {
        color: #2D1B54;
        animation: pulse 1.5s infinite;
    }

    .voice-nav-button {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #2D1B54;
        color: white;
        width: 50px;
        height: 50px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        z-index: 1000;
    }

    .voice-nav-button:hover {
        transform: scale(1.1);
        background: #231442;
    }

    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }

    .voice-input-button {
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        color: #666;
    }

    input[type="search"],
    input[type="text"] {
        padding-right: 40px;
    }
`;
document.head.appendChild(voiceStyles); 