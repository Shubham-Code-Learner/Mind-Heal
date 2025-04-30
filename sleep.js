// Sleep Tracker
let isTracking = false;
let sleepStartTime = null;

function startSleepTracking() {
    if (!isTracking) {
        isTracking = true;
        sleepStartTime = new Date();
        document.querySelector('.tracker-controls button:first-child').innerHTML = '<i class="fas fa-stop"></i> Stop Tracking';
        showNotification('Sleep tracking started');
    } else {
        isTracking = false;
        const sleepEndTime = new Date();
        const sleepDuration = Math.floor((sleepEndTime - sleepStartTime) / (1000 * 60));
        const hours = Math.floor(sleepDuration / 60);
        const minutes = sleepDuration % 60;
        
        document.getElementById('sleepDuration').textContent = `${hours}h ${minutes}m`;
        document.querySelector('.tracker-controls button:first-child').innerHTML = '<i class="fas fa-play"></i> Start Tracking';
        
        // Update sleep quality (random for demo)
        const quality = Math.floor(Math.random() * 20) + 80;
        document.getElementById('sleepQuality').textContent = `${quality}%`;
        
        // Update streak
        const streak = parseInt(localStorage.getItem('sleepStreak') || '0') + 1;
        localStorage.setItem('sleepStreak', streak);
        document.getElementById('sleepConsistency').textContent = `${streak} days`;
        
        showNotification('Sleep tracking completed');
    }
}

function viewSleepHistory() {
    showNotification('Opening sleep history...');
    // In a real implementation, this would show a modal or redirect to a history page
}

// Sleep Programs
function startProgram(programType) {
    localStorage.setItem('currentProgram', programType);
    localStorage.setItem('programStartDate', new Date().toISOString());
    showNotification(`Started ${programType} program!`);
}

// Sleep Sounds
const sounds = {
    rain: new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'),
    waves: new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'),
    white: new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3')
};

let currentSound = null;

function playSound(soundType) {
    if (currentSound) {
        currentSound.pause();
        currentSound.currentTime = 0;
    }
    
    if (currentSound !== sounds[soundType]) {
        currentSound = sounds[soundType];
        currentSound.loop = true;
        currentSound.play();
        showNotification(`Playing ${soundType} sounds`);
    } else {
        currentSound = null;
    }
}

// Sleep Calculator
function calculateSleep() {
    const wakeTime = document.getElementById('wakeTime').value;
    const cycles = parseInt(document.getElementById('sleepCycles').value);
    
    if (!wakeTime) {
        showNotification('Please select a wake-up time');
        return;
    }
    
    const [hours, minutes] = wakeTime.split(':').map(Number);
    const wakeDate = new Date();
    wakeDate.setHours(hours, minutes, 0, 0);
    
    // Each sleep cycle is 90 minutes
    const bedtime = new Date(wakeDate.getTime() - (cycles * 90 * 60 * 1000));
    
    const bedtimeStr = bedtime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    document.getElementById('recommendedBedtime').textContent = bedtimeStr;
    
    // Add sleep cycle information
    const cycleInfo = document.getElementById('sleepCycleInfo');
    cycleInfo.innerHTML = `
        <p>Each sleep cycle is approximately 90 minutes</p>
        <p>${cycles} cycles = ${cycles * 90} minutes of sleep</p>
        <p>Recommended bedtime: ${bedtimeStr}</p>
    `;
    
    // Add copy to clipboard button
    const copyButton = document.createElement('button');
    copyButton.className = 'btn btn-outline-primary mt-3';
    copyButton.innerHTML = '<i class="fas fa-copy"></i> Copy Bedtime';
    copyButton.onclick = () => {
        navigator.clipboard.writeText(bedtimeStr);
        showNotification('Bedtime copied to clipboard!');
    };
    document.getElementById('sleepResult').appendChild(copyButton);
    
    showNotification('Bedtime calculated!');
}

// Community Features
function joinGroup() {
    showNotification('Joining support group...');
    // In a real implementation, this would redirect to a group page
}

function joinDiscussion() {
    showNotification('Redirecting to discussion forum...');
    // In a real implementation, this would redirect to the forum
}

function viewChallenges() {
    showNotification('Loading sleep challenges...');
    // In a real implementation, this would show available challenges
}

// Newsletter Subscription
function subscribeNewsletter(event) {
    event.preventDefault();
    const form = event.target;
    const email = form.querySelector('input[type="email"]').value;
    const submitButton = form.querySelector('button[type="submit"]');
    
    // Validate email
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    // Show loading state
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
    
    // Simulate API call
    setTimeout(() => {
        localStorage.setItem('newsletterSubscriber', email);
        showNotification('Thank you for subscribing to our newsletter!');
        form.reset();
        submitButton.disabled = false;
        submitButton.innerHTML = 'Subscribe';
    }, 1500);
}

// Email validation helper
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Support Contact
function contactSupport() {
    showNotification('Opening support chat...');
    // In a real implementation, this would open a chat interface
}

// Utility Functions
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        ${message}
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Load saved data
    const streak = localStorage.getItem('sleepStreak') || '0';
    document.getElementById('sleepConsistency').textContent = `${streak} days`;
    
    // Initialize sleep calculator with current time
    const now = new Date();
    const currentTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    document.getElementById('wakeTime').value = currentTime;
}); 