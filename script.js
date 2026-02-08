// ========================================
// Smooth Scroll Navigation
// ========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ========================================
// EmailJS Integration
// ========================================

const contactForm = document.getElementById('contact-form');

document.addEventListener('DOMContentLoaded', function() {
    // Initialize EmailJS
    if (typeof emailjs !== 'undefined') {
        emailjs.init('YxgJ-vqlDwKCrBFbE');
    }
    
    // Handle form submission
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (typeof emailjs === 'undefined') {
                showNotification('Email service is currently unavailable. Please try again later.', 'error');
                return;
            }
            
            const submitBtn = this.querySelector('.btn-submit');
            const originalText = submitBtn.innerHTML;
            
            // Disable button and show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Sending...</span>';
            
            emailjs.sendForm('service_hx80yg9', 'template_w5vfbsf', this)
                .then(
                    function() {
                        showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
                        contactForm.reset();
                    },
                    function(error) {
                        console.error('EmailJS Error:', error);
                        showNotification('Failed to send message. Please try again or email me directly.', 'error');
                    }
                )
                .finally(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                });
        });
    }
});

// ========================================
// Notification System
// ========================================

function showNotification(message, type = 'success') {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${type === 'success' ? '✓' : '✕'}</span>
            <span class="notification-message">${message}</span>
        </div>
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Add notification styles dynamically
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification {
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        padding: 1rem 1.5rem;
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        transform: translateX(400px);
        opacity: 0;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .notification.show {
        transform: translateX(0);
        opacity: 1;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }
    
    .notification-icon {
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        font-weight: 700;
        flex-shrink: 0;
    }
    
    .notification-success .notification-icon {
        background: rgba(0, 255, 136, 0.2);
        color: var(--color-accent);
    }
    
    .notification-error .notification-icon {
        background: rgba(255, 68, 68, 0.2);
        color: #ff4444;
    }
    
    .notification-message {
        font-size: 0.9375rem;
        color: var(--color-text-secondary);
    }
    
    @media (max-width: 640px) {
        .notification {
            right: 10px;
            left: 10px;
            transform: translateY(-100px);
        }
        
        .notification.show {
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(notificationStyles);

// ========================================
// GitHub Contributions Graph
// ========================================

const contributionContainer = document.getElementById('contribution-graph');

async function renderContributionGraph() {
    if (!contributionContainer) return;
    
    try {
        const API_URL = 'https://github-contributions-api.jogruber.de/v4/PiyushN17?y=last';
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error('Failed to fetch contribution data');
        }
        
        const data = await response.json();
        
        if (!data || !Array.isArray(data.contributions)) {
            throw new Error('Invalid contribution data');
        }
        
        // Clear container
        contributionContainer.innerHTML = '';
        
        // Create contribution cells
        data.contributions.forEach((day, index) => {
            const cell = document.createElement('div');
            cell.className = `day level-${day.level}`;
            cell.title = `${day.date}: ${day.count} contribution${day.count !== 1 ? 's' : ''}`;
            
            // Add staggered animation
            cell.style.animationDelay = `${index * 2}ms`;
            cell.style.animation = 'fadeIn 0.3s ease-out forwards';
            
            contributionContainer.appendChild(cell);
        });
        
    } catch (error) {
        console.error('Error fetching contribution graph:', error);
        contributionContainer.innerHTML = '<p style="color: var(--color-text-tertiary); font-size: 0.875rem; text-align: center;">Unable to load contribution graph</p>';
    }
}

// Add fade-in animation for contribution cells
const contributionStyles = document.createElement('style');
contributionStyles.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: scale(0.8);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
`;
document.head.appendChild(contributionStyles);

// ========================================
// GitHub Projects
// ========================================

const projectsContainer = document.getElementById('gitProjects');

const projectRepos = [
    'quiz-trivia',
    'eduscript',
    'news-search',
    'check-weather',
    'live-flight-tracker',
    'movie-lookup',
    'word-dictionary'
];

async function renderGitHubProjects() {
    if (!projectsContainer) return;
    
    try {
        // Fetch all repositories in parallel
        const responses = await Promise.all(
            projectRepos.map(repo => 
                fetch(`https://api.github.com/repos/PiyushN17/${repo}`)
            )
        );
        
        // Parse all responses
        const repos = await Promise.all(
            responses.map(response => {
                if (!response.ok) {
                    console.warn(`Failed to fetch repo: ${response.url}`);
                    return null;
                }
                return response.json();
            })
        );
        
        // Filter out failed requests and render
        const validRepos = repos.filter(repo => repo !== null);
        
        if (validRepos.length === 0) {
            throw new Error('No repositories found');
        }
        
        // Clear container
        projectsContainer.innerHTML = '';
        
        // Create repository cards
        validRepos.forEach((repo, index) => {
            const card = document.createElement('div');
            card.className = 'repo-card';
            card.style.animationDelay = `${index * 100}ms`;
            card.style.animation = 'fadeInUp 0.4s ease-out forwards';
            card.style.opacity = '0';
            
            const repoName = repo.name
                .split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
            
            card.innerHTML = `
                <div style="font-weight: 600; color: var(--color-text); margin-bottom: 0.5rem;">
                    ${repoName}
                </div>
                <div style="font-size: 0.8125rem; color: var(--color-text-tertiary); margin-bottom: 0.75rem;">
                    ${repo.description || 'No description available'}
                </div>
                <div style="display: flex; gap: 1rem; font-size: 0.75rem; color: var(--color-text-tertiary); font-family: var(--font-mono);">
                    <span>⭐ ${repo.stargazers_count || 0}</span>
                    <span>🔱 ${repo.forks_count || 0}</span>
                    ${repo.language ? `<span>• ${repo.language}</span>` : ''}
                </div>
            `;
            
            // Make card clickable
            card.style.cursor = 'pointer';
            card.addEventListener('click', () => {
                window.open(repo.html_url, '_blank', 'noopener,noreferrer');
            });
            
            projectsContainer.appendChild(card);
        });
        
    } catch (error) {
        console.error('Error fetching GitHub projects:', error);
        projectsContainer.innerHTML = '<p style="color: var(--color-text-tertiary); font-size: 0.875rem; text-align: center; grid-column: 1 / -1;">Unable to load GitHub projects</p>';
    }
}

// ========================================
// Header Scroll Effect
// ========================================

let lastScrollTop = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Add shadow on scroll
    if (scrollTop > 10) {
        header.style.boxShadow = 'var(--shadow-md)';
    } else {
        header.style.boxShadow = 'none';
    }
    
    lastScrollTop = scrollTop;
}, { passive: true });

// ========================================
// Initialize Everything on Load
// ========================================

window.addEventListener('load', () => {
    renderContributionGraph();
    renderGitHubProjects();
});

// ========================================
// Intersection Observer for Scroll Animations
// ========================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all section elements
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(section);
    });
});

// ========================================
// Active Navigation Link
// ========================================

const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

function updateActiveNavLink() {
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', updateActiveNavLink, { passive: true });

// Add active state styles
const activeNavStyles = document.createElement('style');
activeNavStyles.textContent = `
    .nav-link.active {
        color: var(--color-primary);
    }
    
    .nav-link.active::after {
        width: 80%;
    }
`;
document.head.appendChild(activeNavStyles);
