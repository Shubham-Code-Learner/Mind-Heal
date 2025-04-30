// Meditation Audio Player
const audio = document.getElementById('meditationAudio');
let isPlaying = false;
let isMuted = false;

function togglePlay() {
    if (isPlaying) {
        audio.pause();
        document.querySelector('.play-btn i').classList.replace('fa-pause', 'fa-play');
    } else {
        audio.play();
        document.querySelector('.play-btn i').classList.replace('fa-play', 'fa-pause');
    }
    isPlaying = !isPlaying;
}

function toggleMute() {
    if (isMuted) {
        audio.muted = false;
        document.querySelector('.volume-btn i').classList.replace('fa-volume-mute', 'fa-volume-up');
    } else {
        audio.muted = true;
        document.querySelector('.volume-btn i').classList.replace('fa-volume-up', 'fa-volume-mute');
    }
    isMuted = !isMuted;
}

// Update progress bar and time
audio.addEventListener('timeupdate', () => {
    const progress = (audio.currentTime / audio.duration) * 100;
    document.querySelector('.progress').style.width = `${progress}%`;
    
    const currentTime = formatTime(audio.currentTime);
    const duration = formatTime(audio.duration);
    document.querySelector('.current-time').textContent = currentTime;
    document.querySelector('.duration').textContent = duration;
});

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Meditation Programs
function startProgram(programType) {
    localStorage.setItem('currentProgram', programType);
    localStorage.setItem('programStartDate', new Date().toISOString());
    updateProgress();
    showNotification(`Started ${programType} program!`);
}

// Live Sessions Countdown
function updateCountdowns() {
    const countdowns = document.querySelectorAll('.countdown');
    countdowns.forEach(countdown => {
        const targetTime = countdown.dataset.time;
        const [hours, minutes] = targetTime.split(':').map(Number);
        const now = new Date();
        const target = new Date();
        target.setHours(hours, minutes, 0, 0);
        
        if (target < now) {
            target.setDate(target.getDate() + 1);
        }
        
        const diff = target - now;
        const hoursLeft = Math.floor(diff / (1000 * 60 * 60));
        const minutesLeft = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        countdown.textContent = `${hoursLeft}h ${minutesLeft}m`;
    });
}

setInterval(updateCountdowns, 60000);
updateCountdowns();

// Meditation Library
const meditationData = [
    {
        id: 1,
        title: "5-Minute Breathing",
        description: "Quick breathing exercise for stress relief",
        duration: "5 min",
        level: "Beginner",
        type: "guided",
        icon: "🧘‍♀️",
        gradient: "linear-gradient(45deg, #FF8A00, #FF5630)"
    },
    {
        id: 2,
        title: "Sleep Meditation",
        description: "Guided meditation for better sleep",
        duration: "15 min",
        level: "All Levels",
        type: "sleep",
        icon: "🌙",
        gradient: "linear-gradient(45deg, #4EA8DE, #56CCF2)"
    },
    {
        id: 3,
        title: "Focus & Clarity",
        description: "Enhance concentration and mental clarity",
        duration: "10 min",
        level: "Intermediate",
        type: "focus",
        icon: "🎯",
        gradient: "linear-gradient(45deg, #9333EA, #7C3AED)"
    },
    {
        id: 4,
        title: "Nature Meditation",
        description: "Connect with nature through guided imagery",
        duration: "20 min",
        level: "All Levels",
        type: "guided",
        icon: "🌿",
        gradient: "linear-gradient(45deg, #10B981, #059669)"
    }
];

function loadMeditations(filter = 'all') {
    const grid = document.getElementById('meditationGrid');
    grid.innerHTML = '';
    
    const filteredData = filter === 'all' 
        ? meditationData 
        : meditationData.filter(item => item.type === filter);
    
    filteredData.forEach(item => {
        const card = document.createElement('div');
        card.className = 'meditation-card';
        card.innerHTML = `
            <div class="card-image" style="background: ${item.gradient}">
                <div class="icon">${item.icon}</div>
            </div>
            <div class="card-content">
                <h3>${item.title}</h3>
                <p>${item.description}</p>
                <div class="card-meta">
                    <span><i class="fas fa-clock"></i> ${item.duration}</span>
                    <span><i class="fas fa-level-up-alt"></i> ${item.level}</span>
                </div>
                <button class="btn btn-primary" onclick="startMeditation(${item.id})">Start Meditation</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        loadMeditations(btn.dataset.filter);
    });
});

// Progress Tracking
function updateProgress() {
    const streak = localStorage.getItem('meditationStreak') || 0;
    const mindfulnessLevel = localStorage.getItem('mindfulnessLevel') || 1;
    
    document.getElementById('streakProgress').style.width = `${(streak / 30) * 100}%`;
    document.getElementById('streakText').textContent = `${streak} days streak`;
    
    document.getElementById('mindfulnessProgress').style.width = `${(mindfulnessLevel / 5) * 100}%`;
    document.getElementById('mindfulnessText').textContent = `Level ${mindfulnessLevel} Mindfulness`;
    
    updateAchievements();
}

function updateAchievements() {
    const achievements = [];
    const streak = parseInt(localStorage.getItem('meditationStreak') || 0);
    const level = parseInt(localStorage.getItem('mindfulnessLevel') || 1);
    
    if (streak >= 7) achievements.push('7-Day Streak');
    if (streak >= 30) achievements.push('Monthly Master');
    if (level >= 3) achievements.push('Mindful Master');
    if (level >= 5) achievements.push('Zen Master');
    
    const achievementsList = document.getElementById('achievementsList');
    achievementsList.innerHTML = achievements.map(achievement => 
        `<span class="badge">${achievement}</span>`
    ).join('');
}

// Community Features
function viewSchedule() {
    showNotification('Opening group session schedule...');
    // In a real implementation, this would open a modal or new page
}

function joinDiscussion() {
    showNotification('Redirecting to community forum...');
    // In a real implementation, this would redirect to the forum
}

function viewChallenges() {
    showNotification('Loading meditation challenges...');
    // In a real implementation, this would show available challenges
}

// Newsletter Subscription
function subscribeNewsletter(event) {
    event.preventDefault();
    const email = event.target.querySelector('input[type="email"]').value;
    localStorage.setItem('newsletterSubscriber', email);
    showNotification('Thank you for subscribing to our newsletter!');
    event.target.reset();
}

// Support Contact
function contactSupport() {
    showNotification('Opening support chat...');
    // In a real implementation, this would open a chat interface
}

// Utility Functions
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
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
    loadMeditations();
    updateProgress();
}); 