// Enhanced JavaScript with advanced animations and interactions

document.addEventListener('DOMContentLoaded', function() {
    // Include header/footer HTML
    includeHTML();

    // Initialize all animations and functionality
    initScrollAnimations();
    initHeaderEffects();
    initSmoothScrolling();
    initContactForm();
    initParallaxEffects();
    initCounterAnimations();
    initTypingEffect();
    initServiceHoverEffects();
});

// Scroll Animations
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.scroll-animate, .scroll-animate-left, .scroll-animate-right, .scroll-animate-scale, .scroll-animate-rotate'
    );
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                
                // Staggered animation for child elements
                if (
                    entry.target.classList.contains('highlight-grid') || 
                    entry.target.classList.contains('strengths-grid') ||
                    entry.target.classList.contains('services-grid') ||
                    entry.target.classList.contains('industries-grid') ||
                    entry.target.classList.contains('projects-grid') ||
                    entry.target.classList.contains('expertise-grid') ||
                    entry.target.classList.contains('equipment-grid')
                ) {
                    const children = entry.target.children;
                    Array.from(children).forEach((child, index) => {
                        child.style.transitionDelay = `${index * 0.1}s`;
                    });
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Header Effects
function initHeaderEffects() {
    const header = document.querySelector('header');
    if (!header) return;

    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Hide header on scroll down, show on scroll up
        if (window.scrollY > lastScrollY && window.scrollY > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }

        lastScrollY = window.scrollY;
    });
}

// Smooth Scrolling
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (!targetId || targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;

            e.preventDefault();

            const header = document.querySelector('header');
            const headerHeight = header ? header.offsetHeight : 0;
            const targetPosition = targetElement.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
}

// Parallax Effects
function initParallaxEffects() {
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxSpeed = 0.5;
            hero.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
        });
    }
}

// Counter Animations
function initCounterAnimations() {
    const counters = document.querySelectorAll('.counter');
    if (!counters.length) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startCounter(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

function startCounter(counter) {
    const target = parseInt(counter.getAttribute('data-target'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            counter.textContent = target + '+';
            clearInterval(timer);
        } else {
            counter.textContent = Math.floor(current) + '+';
        }
    }, 16);
}

// Typing Effect
function initTypingEffect() {
    const typingElement = document.querySelector('.typing-effect');
    if (typingElement) {
        const texts = JSON.parse(typingElement.getAttribute('data-texts'));
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        
        function type() {
            const currentText = texts[textIndex];
            
            if (isDeleting) {
                typingElement.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingElement.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
            }
            
            if (!isDeleting && charIndex === currentText.length) {
                isDeleting = true;
                setTimeout(type, 2000);
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                setTimeout(type, 500);
            } else {
                setTimeout(type, isDeleting ? 50 : 100);
            }
        }
        
        type();
    }
}

// Service Hover Effects
function initServiceHoverEffects() {
    const serviceItems = document.querySelectorAll('.service-category, .industry-item, .project-item');
    
    serviceItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Enhanced Contact Form
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Form validation
        if (!validateForm()) {
            return;
        }
        
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        // Show loading state
        submitBtn.innerHTML = '<span class="loading"></span> Sending...';
        submitBtn.disabled = true;
        
        try {
            const formData = {
                name: contactForm.name.value,
                company: contactForm.company.value,
                phone: contactForm.phone.value,
                email: contactForm.email.value,
                city: contactForm.city.value,
                service: contactForm.service.value || "Not specified",
                message: contactForm.message.value
            };

            // Your EmailJS IDs
            const SERVICE_ID = "service_bxjx5h9";
            const TEMPLATE_ID = "template_h4mtvc8";

            await emailjs.send(SERVICE_ID, TEMPLATE_ID, formData);

            showNotification('Message sent successfully! We will get back to you soon.', 'success');
            contactForm.reset();
        } catch (error) {
            console.error("EmailJS error:", error);
            showNotification('Error sending message. Please try again.', 'error');
        } finally {
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });

    // Real-time validation
    const inputs = contactForm.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
}

function validateForm() {
    const requiredFields = document.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField({ target: field })) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    let isValid = true;
    
    clearFieldError({ target: field });
    
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'This field is required');
        isValid = false;
    }
    
    if (field.type === 'email' && value && !isValidEmail(value)) {
        showFieldError(field, 'Please enter a valid email address');
        isValid = false;
    }
    
    if (field.type === 'tel' && value && !isValidPhone(value)) {
        showFieldError(field, 'Please enter a valid phone number');
        isValid = false;
    }
    
    return isValid;
}

function clearFieldError(e) {
    const field = e.target;
    field.classList.remove('error');
    
    const errorElement = field.parentNode.querySelector('.error-message');
    if (errorElement) {
        errorElement.remove();
    }
}

function showFieldError(field, message) {
    field.classList.add('error');
    
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.style.color = '#ef4444';
    errorElement.style.fontSize = '0.875rem';
    errorElement.style.marginTop = '0.25rem';
    errorElement.textContent = message;
    
    field.parentNode.appendChild(errorElement);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    notification.style.background = type === 'success' ? '#10b981' : '#ef4444';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Google Map - Service Areas
function initServiceMap() {
    const mapElement = document.getElementById("service-map");
    if (!mapElement) return;

    if (typeof google === "undefined" || !google.maps) {
        console.warn("Google Maps JS API not loaded.");
        return;
    }

    const locations = [
        {
            name: "Visakhapatnam",
            position: { lat: 17.6868, lng: 83.2185 },
        },
        {
            name: "Kakinada",
            position: { lat: 16.9891, lng: 82.2475 },
        },
        {
            name: "Hyderabad",
            position: { lat: 17.3850, lng: 78.4867 },
        },
    ];

    const map = new google.maps.Map(mapElement, {
        center: { lat: 17.3, lng: 81.3 },
        zoom: 6,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
    });

    const bounds = new google.maps.LatLngBounds();

    locations.forEach(loc => {
        const marker = new google.maps.Marker({
            position: loc.position,
            map,
            title: loc.name,
        });

        const infoWindow = new google.maps.InfoWindow({
            content: `<div style="font-size:14px;"><strong>${loc.name}</strong></div>`,
        });

        marker.addListener("click", () => {
            infoWindow.open({
                anchor: marker,
                map,
                shouldFocus: false,
            });
        });

        bounds.extend(loc.position);
    });

    map.fitBounds(bounds);
}

// Include HTML components
function includeHTML() {
    const elements = document.querySelectorAll('[data-include]');
    
    elements.forEach(element => {
        const file = element.getAttribute('data-include');
        
        if (file) {
            fetch(file)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Could not load ${file}: ${response.statusText}`);
                    }
                    return response.text();
                })
                .then(data => {
                    element.innerHTML = data;
                    element.removeAttribute('data-include');
                })
                .catch(error => {
                    console.error('Error including HTML:', error);
                    element.innerHTML = `<p>Error loading ${file}</p>`;
                });
        }
    });
}

// Add CSS for error states
const style = document.createElement('style');
style.textContent = `
    .form-group input.error,
    .form-group select.error,
    .form-group textarea.error {
        border-color: #ef4444 !important;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
    }
    
    .notification {
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    }
`;
document.head.appendChild(style);
