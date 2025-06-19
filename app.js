// SensoryPro Application JavaScript

// Application state
let currentPage = 'landing';
let uploadedFiles = [];
let currentChart = null;
let resultsChart = null;

// Statistical test descriptions
const testDescriptions = {
    'anova': {
        title: 'Analysis of Variance (ANOVA)',
        description: 'Compare means across multiple groups. ANOVA tests whether there are significant differences between group means. Useful for comparing multiple products or treatments in sensory evaluation.'
    },
    'pca': {
        title: 'Principal Component Analysis (PCA)',
        description: 'Reduce dimensionality and identify patterns in your data. PCA helps visualize relationships between sensory attributes and identifies the most important variables that drive variation.'
    },
    'preference': {
        title: 'Preference Mapping',
        description: 'Map consumer preferences to product attributes. This technique combines consumer preference data with descriptive sensory data to identify optimal product characteristics.'
    },
    'triangle': {
        title: 'Triangle Test',
        description: 'Detect differences between products using a forced-choice method. Panelists are presented with three samples and must identify which one is different.'
    },
    'hedonic': {
        title: 'Hedonic Scaling',
        description: 'Measure consumer liking using structured scales. Typically uses 9-point scales ranging from "dislike extremely" to "like extremely".'
    },
    'mfa': {
        title: 'Multiple Factor Analysis (MFA)',
        description: 'Analyze multiple data tables simultaneously. Useful when you have different types of data (descriptive, consumer, instrumental) for the same products.'
    }
};

// Sample data for demonstration
const sampleData = [
    ['Product', 'Sweetness', 'Sourness', 'Texture', 'Overall Liking'],
    ['Product A', '7.2', '3.1', '6.8', '7.5'],
    ['Product B', '5.8', '5.2', '7.1', '6.2'],
    ['Product C', '6.5', '4.3', '5.9', '6.8'],
    ['Product D', '8.1', '2.8', '7.3', '8.2'],
    ['Product E', '4.9', '6.1', '6.4', '5.5']
];

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeFileUpload();
    initializeStatisticalTests();
    initializeCharts();
    initializeAnalysis();
    
    // Show landing page by default
    showPage('landing');
});

// Navigation functionality
function initializeNavigation() {
    // Handle main navigation
    document.querySelectorAll('[data-page]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            showPage(page);
        });
    });
    
    // Handle sidebar navigation
    document.querySelectorAll('.sidebar__link').forEach(link => {
        link.addEventListener('click', function(e) {
            // Update active state
            document.querySelectorAll('.sidebar__link').forEach(l => l.classList.remove('sidebar__link--active'));
            this.classList.add('sidebar__link--active');
        });
    });
}

function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.add('hidden');
    });
    
    // Show selected page
    const targetPage = document.getElementById(pageId + '-page');
    if (targetPage) {
        targetPage.classList.remove('hidden');
        currentPage = pageId;
        
        // Initialize page-specific functionality
        if (pageId === 'dashboard') {
            initializeDashboardCharts();
        } else if (pageId === 'analysis') {
            initializeAnalysisPage();
        }
    }
}

// File upload functionality
function initializeFileUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    
    if (!uploadArea || !fileInput) return;
    
    // Handle drag and drop
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadArea.style.borderColor = 'var(--color-primary)';
    });
    
    uploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        uploadArea.style.borderColor = 'var(--color-border)';
    });
    
    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadArea.style.borderColor = 'var(--color-border)';
        
        const files = Array.from(e.dataTransfer.files);
        handleFileUpload(files);
    });
    
    // Handle file input change
    fileInput.addEventListener('change', function(e) {
        const files = Array.from(e.target.files);
        handleFileUpload(files);
    });
    
    // Handle click on upload area
    uploadArea.addEventListener('click', function() {
        fileInput.click();
    });
}

function handleFileUpload(files) {
    uploadedFiles = files;
    
    // Update upload area to show uploaded files
    const uploadArea = document.getElementById('uploadArea');
    const content = uploadArea.querySelector('.upload-area__content');
    
    if (files.length > 0) {
        content.innerHTML = `
            <div class="upload-area__icon">✅</div>
            <h3>${files.length} file(s) uploaded</h3>
            <p>${files.map(f => f.name).join(', ')}</p>
            <button class="btn btn--outline" onclick="document.getElementById('fileInput').click()">Change Files</button>
        `;
        
        // Show sample data in preview table
        displaySampleData();
    }
}

function displaySampleData() {
    const table = document.getElementById('dataTable');
    if (!table) return;
    
    // Clear existing content
    table.innerHTML = '';
    
    // Create header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    sampleData[0].forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    // Create body
    const tbody = document.createElement('tbody');
    sampleData.slice(1).forEach(row => {
        const tr = document.createElement('tr');
        row.forEach(cell => {
            const td = document.createElement('td');
            td.textContent = cell;
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);
}

// Statistical tests functionality
function initializeStatisticalTests() {
    const testSelect = document.getElementById('testSelect');
    const testDescription = document.getElementById('testDescription');
    
    if (!testSelect || !testDescription) return;
    
    testSelect.addEventListener('change', function() {
        const selectedTest = this.value;
        
        if (selectedTest && testDescriptions[selectedTest]) {
            const test = testDescriptions[selectedTest];
            testDescription.innerHTML = `
                <h3>${test.title}</h3>
                <p>${test.description}</p>
            `;
        } else {
            testDescription.innerHTML = '<p>Select a statistical test to see its description and parameters.</p>';
        }
    });
}

// Charts functionality
function initializeCharts() {
    // Initialize charts when needed
}

function initializeDashboardCharts() {
    const ctx = document.getElementById('analyticsChart');
    if (!ctx) return;
    
    // Destroy existing chart if it exists
    if (currentChart) {
        currentChart.destroy();
    }
    
    // Create new chart
    currentChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Projects Completed',
                data: [12, 19, 15, 25, 22, 30],
                borderColor: '#1FB8CD',
                backgroundColor: 'rgba(31, 184, 205, 0.1)',
                tension: 0.4,
                fill: true
            }, {
                label: 'Reports Generated',
                data: [8, 14, 12, 18, 16, 22],
                borderColor: '#FFC185',
                backgroundColor: 'rgba(255, 193, 133, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function initializeAnalysisPage() {
    // Reset analysis page state
    const resultsSection = document.getElementById('resultsSection');
    if (resultsSection) {
        resultsSection.style.display = 'none';
    }
}

// Analysis functionality
function initializeAnalysis() {
    const runAnalysisBtn = document.getElementById('runAnalysisBtn');
    
    if (!runAnalysisBtn) return;
    
    runAnalysisBtn.addEventListener('click', function() {
        runAnalysis();
    });
}

function runAnalysis() {
    const runAnalysisBtn = document.getElementById('runAnalysisBtn');
    const resultsSection = document.getElementById('resultsSection');
    const testSelect = document.getElementById('testSelect');
    
    if (!runAnalysisBtn || !resultsSection || !testSelect) return;
    
    // Validate inputs
    if (uploadedFiles.length === 0) {
        alert('Please upload data files before running analysis.');
        return;
    }
    
    if (!testSelect.value) {
        alert('Please select a statistical test.');
        return;
    }
    
    // Show loading state
    runAnalysisBtn.innerHTML = '<span class="loading"></span> Running Analysis...';
    runAnalysisBtn.disabled = true;
    
    // Simulate analysis processing
    setTimeout(() => {
        // Reset button
        runAnalysisBtn.innerHTML = 'Run Analysis';
        runAnalysisBtn.disabled = false;
        
        // Show results
        resultsSection.style.display = 'block';
        
        // Create results chart
        createResultsChart();
        
        // Scroll to results
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }, 3000);
}

function createResultsChart() {
    const ctx = document.getElementById('resultsChart');
    if (!ctx) return;
    
    // Destroy existing chart if it exists
    if (resultsChart) {
        resultsChart.destroy();
    }
    
    // Create results visualization based on sample data
    resultsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Product A', 'Product B', 'Product C', 'Product D', 'Product E'],
            datasets: [{
                label: 'Overall Liking',
                data: [7.5, 6.2, 6.8, 8.2, 5.5],
                backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F'],
                borderColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Product Preference Results'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 9,
                    title: {
                        display: true,
                        text: 'Liking Score (1-9 scale)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Products'
                    }
                }
            }
        }
    });
}

// Utility functions
function showLoading(element) {
    element.innerHTML = '<span class="loading"></span> Loading...';
    element.disabled = true;
}

function hideLoading(element, originalText) {
    element.innerHTML = originalText;
    element.disabled = false;
}

// Handle smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add interactive hover effects
document.addEventListener('mouseover', function(e) {
    if (e.target.classList.contains('feature-card') || 
        e.target.classList.contains('pricing-card') ||
        e.target.classList.contains('project-card')) {
        e.target.style.transform = 'translateY(-2px)';
    }
});

document.addEventListener('mouseout', function(e) {
    if (e.target.classList.contains('feature-card') || 
        e.target.classList.contains('pricing-card') ||
        e.target.classList.contains('project-card')) {
        e.target.style.transform = 'translateY(0)';
    }
});

// Handle form submissions (for demo purposes)
document.addEventListener('submit', function(e) {
    e.preventDefault();
    alert('This is a demo application. Form submission is not implemented.');
});

// Add click handlers for buttons that aren't navigation
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn') && !e.target.hasAttribute('data-page')) {
        const buttonText = e.target.textContent.trim();
        
        // Handle specific button actions
        switch(buttonText) {
            case 'Start Free Trial':
            case 'Get Started':
            case 'Sign Up':
                alert('Sign up functionality would be implemented here. This is a demo.');
                break;
            case 'Watch Demo':
                alert('Demo video would be shown here. This is a demo application.');
                break;
            case 'Contact Sales':
                alert('Contact form would be shown here. This is a demo application.');
                break;
            case 'New Project':
                alert('New project wizard would be launched here. This is a demo.');
                break;
            case 'Upload Data':
                showPage('analysis');
                break;
            case 'View Report':
            case 'View Reports':
                alert('Report viewer would be opened here. This is a demo.');
                break;
            case 'Continue':
            case 'Analyze':
                showPage('analysis');
                break;
            case 'Save Configuration':
                alert('Configuration saved successfully! (Demo)');
                break;
            default:
                // Don't show alert for buttons that have their own handlers
                if (!e.target.id) {
                    console.log('Button clicked:', buttonText);
                }
        }
    }
});

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    // ESC key to close modals or go back
    if (e.key === 'Escape') {
        // Could be used to close modals or return to previous page
        console.log('Escape pressed');
    }
    
    // Tab navigation improvements
    if (e.key === 'Tab') {
        // Ensure proper focus management
        document.body.classList.add('keyboard-navigation');
    }
});

// Remove keyboard navigation class on mouse use
document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-navigation');
});

// Handle window resize for responsive charts
window.addEventListener('resize', function() {
    if (currentChart) {
        currentChart.resize();
    }
    if (resultsChart) {
        resultsChart.resize();
    }
});

// Export functions for potential external use
window.SensoryPro = {
    showPage: showPage,
    runAnalysis: runAnalysis,
    handleFileUpload: handleFileUpload
};