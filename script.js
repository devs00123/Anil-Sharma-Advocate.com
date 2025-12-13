// Navigation scroll effect
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Mobile menu toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Active navigation link highlighting
const sections = document.querySelectorAll('section[id]');

function highlightNavigation() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', highlightNavigation);

// Intersection Observer for fade-in animations
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

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.service-card, .timeline-item, .contact-item');
    
    animateElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });
});

// Contact form handling with Google Sheets integration
const contactForm = document.getElementById('contactForm');

// Google Script URL is loaded from config.js (loaded before this script)
// The config.js file is separate and should be added to .gitignore
// Check if GOOGLE_SCRIPT_URL is defined (from config.js)
let googleScriptUrl = null;
if (typeof GOOGLE_SCRIPT_URL !== 'undefined') {
    googleScriptUrl = GOOGLE_SCRIPT_URL;
} else {
    console.warn('config.js not loaded. Please ensure config.js exists and is loaded before script.js');
}

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    // Disable button during submission
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';
    submitButton.style.opacity = '0.7';
    
    // Check if config is loaded
    if (!googleScriptUrl || !googleScriptUrl.startsWith('http')) {
        submitButton.disabled = false;
        submitButton.textContent = originalText;
        submitButton.style.opacity = '1';
        showNotification('Configuration error: Please ensure config.js is properly set up with your Google Apps Script URL.', 'error');
        return;
    }
    
    // Get form values
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value || 'N/A',
        message: document.getElementById('message').value,
        timestamp: new Date().toLocaleString()
    };
    
    try {
        // Check if Google Script URL is configured (must be a valid URL)
        if (!googleScriptUrl || !googleScriptUrl.startsWith('http')) {
            throw new Error('Google Sheets integration not configured. Please set up Google Apps Script first.');
        }
        
        // Send data to Google Sheets via Google Apps Script
        // Using GET method with query parameters
        const queryParams = new URLSearchParams({
            timestamp: formData.timestamp,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            message: formData.message
        });
        
        // Send GET request to Google Apps Script
        await fetch(googleScriptUrl + '?' + queryParams.toString(), {
            method: 'GET',
            mode: 'no-cors'
        });
        submitButton.textContent = 'Message Sent! ✓';
        submitButton.style.backgroundColor = '#4caf50';
        submitButton.style.opacity = '1';
        
        // Reset form
        contactForm.reset();
        
        // Show success message
        showNotification('Thank you! Your message has been sent successfully.', 'success');
        
        // Reset button after 3 seconds
        setTimeout(() => {
            submitButton.textContent = originalText;
            submitButton.style.backgroundColor = '';
            submitButton.disabled = false;
        }, 3000);
        
    } catch (error) {
        console.error('Error submitting form:', error);
        
        submitButton.textContent = 'Error - Try Again';
        submitButton.style.backgroundColor = '#f44336';
        submitButton.style.opacity = '1';
        submitButton.disabled = false;
        
        showNotification('Sorry, there was an error sending your message. Please try again.', 'error');
        
        // Reset button after 3 seconds
        setTimeout(() => {
            submitButton.textContent = originalText;
            submitButton.style.backgroundColor = '';
        }, 3000);
    }
});

// Notification function for user feedback
function showNotification(message, type = 'success') {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.form-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `form-notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 15px 25px;
        background-color: ${type === 'success' ? '#4caf50' : '#f44336'};
        color: white;
        border-radius: 5px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        max-width: 400px;
        font-weight: 500;
    `;
    
    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Remove notification after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => {
            notification.remove();
            style.remove();
        }, 300);
    }, 5000);
}

// Scroll to top functionality (optional enhancement)
let scrollToTopBtn = document.createElement('button');
scrollToTopBtn.innerHTML = '↑';
scrollToTopBtn.className = 'scroll-to-top';
scrollToTopBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: #e94560;
    color: white;
    border: none;
    cursor: pointer;
    font-size: 24px;
    display: none;
    z-index: 1000;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(233, 69, 96, 0.3);
`;

document.body.appendChild(scrollToTopBtn);

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollToTopBtn.style.display = 'flex';
        scrollToTopBtn.style.alignItems = 'center';
        scrollToTopBtn.style.justifyContent = 'center';
    } else {
        scrollToTopBtn.style.display = 'none';
    }
});

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

scrollToTopBtn.addEventListener('mouseenter', () => {
    scrollToTopBtn.style.transform = 'scale(1.1)';
    scrollToTopBtn.style.backgroundColor = '#d63447';
});

scrollToTopBtn.addEventListener('mouseleave', () => {
    scrollToTopBtn.style.transform = 'scale(1)';
    scrollToTopBtn.style.backgroundColor = '#e94560';
});

// Add typing effect to hero title (optional enhancement)
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Uncomment to enable typing effect on page load
// window.addEventListener('load', () => {
//     const heroTitle = document.querySelector('.hero-title');
//     const originalText = heroTitle.textContent;
//     typeWriter(heroTitle, originalText, 50);
// });

// Service card review arrow toggle functionality
document.addEventListener('DOMContentLoaded', () => {
    const reviewArrows = document.querySelectorAll('.review-arrow');
    
    reviewArrows.forEach(arrow => {
        arrow.addEventListener('click', () => {
            const card = arrow.closest('.service-card');
            const content = card.querySelector('.service-content');
            
            // Toggle expanded class
            content.classList.toggle('expanded');
            arrow.classList.toggle('expanded');
        });
    });

    // Service cards scroll arrows functionality
    const servicesGrid = document.getElementById('servicesGrid');
    const scrollLeftBtn = document.getElementById('scrollLeft');
    const scrollRightBtn = document.getElementById('scrollRight');

    if (servicesGrid && scrollLeftBtn && scrollRightBtn) {
        // Function to check scroll position and update arrow visibility
        function updateScrollArrows() {
            const scrollLeft = servicesGrid.scrollLeft;
            const scrollWidth = servicesGrid.scrollWidth;
            const clientWidth = servicesGrid.clientWidth;
            const maxScroll = scrollWidth - clientWidth;

            // Show/hide left arrow
            if (scrollLeft > 10) {
                scrollLeftBtn.style.display = 'flex';
            } else {
                scrollLeftBtn.style.display = 'none';
            }

            // Show/hide right arrow
            if (scrollLeft < maxScroll - 10) {
                scrollRightBtn.style.display = 'flex';
            } else {
                scrollRightBtn.style.display = 'none';
            }
        }

        // Scroll left
        scrollLeftBtn.addEventListener('click', () => {
            const cardWidth = servicesGrid.querySelector('.service-card').offsetWidth;
            const gap = 15; // Match the gap in CSS
            servicesGrid.scrollBy({
                left: -(cardWidth + gap),
                behavior: 'smooth'
            });
        });

        // Scroll right
        scrollRightBtn.addEventListener('click', () => {
            const cardWidth = servicesGrid.querySelector('.service-card').offsetWidth;
            const gap = 15; // Match the gap in CSS
            servicesGrid.scrollBy({
                left: cardWidth + gap,
                behavior: 'smooth'
            });
        });

        // Update arrows on scroll
        servicesGrid.addEventListener('scroll', updateScrollArrows);

        // Update arrows on resize
        window.addEventListener('resize', updateScrollArrows);

        // Initial check
        updateScrollArrows();

        // Check if content is scrollable
        setTimeout(() => {
            if (servicesGrid.scrollWidth <= servicesGrid.clientWidth) {
                scrollLeftBtn.style.display = 'none';
                scrollRightBtn.style.display = 'none';
            } else {
                updateScrollArrows();
            }
        }, 100);
    }
});

