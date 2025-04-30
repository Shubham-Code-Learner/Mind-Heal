// Mood Tracking Data
let moodData = {
    entries: [],
    weeklyPattern: [],
    factors: {},
    trends: []
};

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Load saved data from localStorage
    loadMoodData();
    
    // Initialize mood selection
    initializeMoodSelection();
    
    // Initialize intensity slider
    initializeIntensitySlider();
    
    // Initialize form submission
    initializeFormSubmission();
    
    // Initialize charts
    initializeCharts();
    
    // Load journal entries
    loadJournalEntries();

    // Initialize mood factors checkboxes
    initializeMoodFactors();
});

// Initialize mood factors checkboxes
function initializeMoodFactors() {
    const checkboxes = document.querySelectorAll('input[name="factors"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const label = this.nextElementSibling;
            if (this.checked) {
                label.style.color = '#6B8DD6';
                label.style.fontWeight = '500';
            } else {
                label.style.color = '#666';
                label.style.fontWeight = 'normal';
            }
        });
    });
}

// Load saved mood data from localStorage
function loadMoodData() {
    const savedData = localStorage.getItem('moodData');
    if (savedData) {
        moodData = JSON.parse(savedData);
    }
}

// Save mood data to localStorage
function saveMoodData() {
    localStorage.setItem('moodData', JSON.stringify(moodData));
}

// Initialize mood selection
function initializeMoodSelection() {
    const moodOptions = document.querySelectorAll('.mood-option');
    
    moodOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove active class from all options
            moodOptions.forEach(opt => opt.classList.remove('active'));
            
            // Add active class to clicked option
            this.classList.add('active');
            
            // Update mood icon color
            const icon = this.querySelector('i');
            icon.style.color = this.dataset.mood === 'happy' ? '#FFD700' :
                              this.dataset.mood === 'calm' ? '#4CAF50' :
                              this.dataset.mood === 'neutral' ? '#9E9E9E' :
                              this.dataset.mood === 'anxious' ? '#FF9800' :
                              '#2196F3';
        });
    });
}

// Initialize intensity slider
function initializeIntensitySlider() {
    const slider = document.getElementById('intensitySlider');
    const intensityLabels = document.querySelector('.intensity-labels');
    
    slider.addEventListener('input', function() {
        const value = this.value;
        const labels = intensityLabels.querySelectorAll('span');
        
        // Update label colors based on intensity
        labels.forEach((label, index) => {
            if (value <= 3 && index === 0) {
                label.style.color = '#4CAF50';
            } else if (value > 3 && value <= 7 && index === 1) {
                label.style.color = '#FF9800';
            } else if (value > 7 && index === 2) {
                label.style.color = '#F44336';
            } else {
                label.style.color = '#666';
            }
        });
    });
}

// Initialize form submission
function initializeFormSubmission() {
    const moodForm = document.getElementById('moodForm');
    
    moodForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get selected mood
        const selectedMood = document.querySelector('.mood-option.active');
        if (!selectedMood) {
            showNotification('Please select a mood', 'error');
            return;
        }
        
        // Get mood data
        const mood = selectedMood.dataset.mood;
        const intensity = document.getElementById('intensitySlider').value;
        const factors = Array.from(document.querySelectorAll('input[name="factors"]:checked'))
            .map(checkbox => checkbox.value);
        const notes = document.getElementById('notes').value;
        
        // Create new entry
        const entry = {
            date: new Date().toISOString(),
            mood,
            intensity: parseInt(intensity),
            factors,
            notes
        };
        
        // Add to mood data
        moodData.entries.push(entry);
        updateMoodFactors(factors);
        updateWeeklyPattern(entry);
        updateTrends(entry);
        
        // Save data
        saveMoodData();
        
        // Update UI
        updateCharts();
        addJournalEntry(entry);
        
        // Reset form
        moodForm.reset();
        document.querySelectorAll('.mood-option').forEach(opt => opt.classList.remove('active'));
        
        // Show success notification
        showNotification('Mood entry saved successfully!', 'success');
    });
}

// Update mood factors statistics
function updateMoodFactors(factors) {
    factors.forEach(factor => {
        if (!moodData.factors[factor]) {
            moodData.factors[factor] = 0;
        }
        moodData.factors[factor]++;
    });
}

// Update weekly pattern
function updateWeeklyPattern(entry) {
    const date = new Date(entry.date);
    const dayOfWeek = date.getDay();
    
    if (!moodData.weeklyPattern[dayOfWeek]) {
        moodData.weeklyPattern[dayOfWeek] = {
            total: 0,
            count: 0,
            average: 0
        };
    }
    
    moodData.weeklyPattern[dayOfWeek].total += entry.intensity;
    moodData.weeklyPattern[dayOfWeek].count++;
    moodData.weeklyPattern[dayOfWeek].average = 
        moodData.weeklyPattern[dayOfWeek].total / moodData.weeklyPattern[dayOfWeek].count;
}

// Update trends
function updateTrends(entry) {
    const date = new Date(entry.date);
    const month = date.getMonth();
    const year = date.getFullYear();
    const key = `${year}-${month}`;
    
    if (!moodData.trends[key]) {
        moodData.trends[key] = {
            total: 0,
            count: 0,
            average: 0
        };
    }
    
    moodData.trends[key].total += entry.intensity;
    moodData.trends[key].count++;
    moodData.trends[key].average = 
        moodData.trends[key].total / moodData.trends[key].count;
}

// Initialize charts
function initializeCharts() {
    // Weekly Mood Pattern Chart
    const weeklyMoodCtx = document.getElementById('weeklyMoodChart').getContext('2d');
    new Chart(weeklyMoodCtx, {
        type: 'line',
        data: {
            labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            datasets: [{
                label: 'Mood Intensity',
                data: [7, 6, 8, 5, 7, 9, 8],
                borderColor: '#6B8DD6',
                backgroundColor: 'rgba(107, 141, 214, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 10,
                    ticks: {
                        stepSize: 1
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
    
    // Mood Factors Chart
    const factorsCtx = document.getElementById('factorsChart').getContext('2d');
    new Chart(factorsCtx, {
        type: 'doughnut',
        data: {
            labels: ['Sleep', 'Work', 'Relationships', 'Health', 'Exercise', 'Diet'],
            datasets: [{
                data: [25, 20, 15, 15, 15, 10],
                backgroundColor: [
                    '#FFD700',
                    '#4CAF50',
                    '#2196F3',
                    '#FF9800',
                    '#9C27B0',
                    '#F44336'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right'
                }
            }
        }
    });
    
    // Mood Trends Chart
    const trendCtx = document.getElementById('trendChart').getContext('2d');
    new Chart(trendCtx, {
        type: 'bar',
        data: {
            labels: ['Happy', 'Calm', 'Neutral', 'Anxious', 'Sad'],
            datasets: [{
                label: 'Mood Distribution',
                data: [30, 25, 20, 15, 10],
                backgroundColor: [
                    '#FFD700',
                    '#4CAF50',
                    '#9E9E9E',
                    '#FF9800',
                    '#2196F3'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 5
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// Update charts with current data
function updateCharts() {
    // Update Weekly Mood Pattern
    const weeklyMoodChart = Chart.getChart('weeklyMoodChart');
    weeklyMoodChart.data.datasets[0].data = moodData.weeklyPattern.map(day => day ? day.average : 0);
    weeklyMoodChart.update();
    
    // Update Mood Factors
    const factorsChart = Chart.getChart('factorsChart');
    factorsChart.data.labels = Object.keys(moodData.factors);
    factorsChart.data.datasets[0].data = Object.values(moodData.factors);
    factorsChart.update();
    
    // Update Mood Trends
    const trendChart = Chart.getChart('trendChart');
    const sortedTrends = Object.entries(moodData.trends)
        .sort(([a], [b]) => a.localeCompare(b));
    trendChart.data.labels = sortedTrends.map(([key]) => {
        const [year, month] = key.split('-');
        return new Date(year, month).toLocaleDateString('default', { month: 'short', year: '2-digit' });
    });
    trendChart.data.datasets[0].data = sortedTrends.map(([, data]) => data.average);
    trendChart.update();
}

// Load journal entries
function loadJournalEntries() {
    const journalEntries = document.getElementById('journalEntries');
    journalEntries.innerHTML = '';
    
    moodData.entries.sort((a, b) => new Date(b.date) - new Date(a.date))
        .forEach(entry => addJournalEntry(entry));
}

// Add a new journal entry
function addJournalEntry(entry) {
    const journalEntries = document.getElementById('journalEntries');
    const date = new Date(entry.date);
    
    const entryElement = document.createElement('div');
    entryElement.className = 'journal-entry';
    entryElement.innerHTML = `
        <div class="date">${date.toLocaleDateString('default', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        })}</div>
        <div class="mood">
            <i class="fas ${getMoodIcon(entry.mood)}"></i>
            <span>${entry.mood.charAt(0).toUpperCase() + entry.mood.slice(1)}</span>
            <span class="intensity">Intensity: ${entry.intensity}/10</span>
        </div>
        ${entry.factors.length > 0 ? `
            <div class="factors">
                <strong>Factors:</strong> ${entry.factors.join(', ')}
            </div>
        ` : ''}
        ${entry.notes ? `
            <div class="notes">
                ${entry.notes}
            </div>
        ` : ''}
    `;
    
    journalEntries.insertBefore(entryElement, journalEntries.firstChild);
}

// Get mood icon based on mood type
function getMoodIcon(mood) {
    switch(mood) {
        case 'happy': return 'fa-smile';
        case 'calm': return 'fa-peace';
        case 'neutral': return 'fa-meh';
        case 'anxious': return 'fa-flushed';
        case 'sad': return 'fa-sad-tear';
        default: return 'fa-question';
    }
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
`;
document.head.appendChild(style); 