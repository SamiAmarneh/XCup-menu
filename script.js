/**
 * X Cup - Premium Café Website
 * Interactive Script
 */

document.addEventListener('DOMContentLoaded', async () => {
    initNavigation();
    initScrollEffects();
    initAnimations();
    initSmoothScroll();
    initImageLoading();
    
    await loadDynamicMenu();
    // Cart features are disabled as per request
    // initTableFromUrl();
    // initCart();
});

async function loadDynamicMenu() {
    try {
        // Use global MENU_DATA from menu_data.js
        const items = typeof MENU_DATA !== 'undefined' ? MENU_DATA : [];
        if (items.length === 0) {
            console.warn('MENU_DATA is empty or not defined');
        }

        items.forEach(item => {
            const container = document.querySelector(`#${item.category_id} .menu-grid`);
            if (container) {
                const isCompact = container.classList.contains('menu-grid-compact');
                if (isCompact) {
                    container.innerHTML += `
                        <div class="menu-card glass-card compact" style="opacity: 1; transform: translateY(0);">
                            <div class="card-image" style="height: 120px; margin-bottom: 0.75rem;">
                                <img src="${item.image_url || 'imgs/logo.jpg'}" alt="${item.name_ar}" style="display:block; opacity:1;">
                                <div class="card-overlay"></div>
                            </div>
                            <div class="card-content">
                                <h3 class="item-name" style="font-size: 1rem; margin-bottom: 0.5rem;">${item.name_ar}</h3>
                                ${item.description_ar ? `<p class="item-description" style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.5rem;">${item.description_ar}</p>` : ''}
                                ${item.name_en ? `<p class="item-name-en" style="font-size: 0.75rem; margin-bottom: 0.5rem;">${item.name_en}</p>` : ''}
                                <div class="item-prices single" style="display:flex; justify-content:center; gap: 10px;">
                                    <span class="price"><strong>${item.price_m}</strong></span>
                                </div>
                            </div>
                        </div>
                    `;
                } else {
                    container.innerHTML += `
                        <div class="menu-card glass-card" style="opacity: 1; transform: translateY(0);">
                            <div class="card-image">
                                <img src="${item.image_url || 'imgs/logo.jpg'}" alt="${item.name_ar}" style="display:block; opacity:1;">
                                <div class="card-overlay"></div>
                            </div>
                            <div class="card-content">
                                <h3 class="item-name">${item.name_ar}</h3>
                                ${item.description_ar ? `<p class="item-description" style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 0.5rem; line-height: 1.4;">${item.description_ar}</p>` : ''}
                                ${item.name_en ? `<p class="item-name-en">${item.name_en}</p>` : ''}
                                <div class="item-prices" style="display:flex; justify-content:center; gap: 10px;">
                                    ${item.price_l ? `<span class="price">M <strong>${item.price_m}</strong></span>` : `<span class="price"><strong>${item.price_m}</strong></span>`}
                                    ${item.price_l ? `<span class="price">L <strong>${item.price_l}</strong></span>` : ''}
                                </div>
                            </div>
                        </div>
                    `;
                }
            }
        });
    } catch (e) {
        console.error(e);
    }
}

/**
 * Navigation
 */
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!navToggle || !navMenu) return;

    // Mobile menu toggle
    navToggle.onclick = (e) => {
        e.stopPropagation();
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    };

    // Close menu on link click
    navLinks.forEach(link => {
        link.onclick = () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        };
    });

    // Close menu on outside click
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') &&
            !navMenu.contains(e.target) &&
            !navToggle.contains(e.target)) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Scroll effect
    if (navbar) {
        let lastScroll = 0;
        window.onscroll = () => {
            const currentScroll = window.pageYOffset;
            if (currentScroll > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            lastScroll = currentScroll;
        };
    }
}

/**
 * Scroll Effects
 */
function initScrollEffects() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe category sections
    document.querySelectorAll('.category-section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    // Observe menu cards
    document.querySelectorAll('.menu-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `opacity 0.5s ease ${index * 0.05}s, transform 0.5s ease ${index * 0.05}s`;
        observer.observe(card);
    });
}

/**
 * Initialize Animations
 */
function initAnimations() {
    // Hero animation
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '1';
    }

    // Floating lights parallax
    const lights = document.querySelectorAll('.light');
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        lights.forEach((light, index) => {
            const speed = 0.05 + (index * 0.02);
            light.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });

    // Card hover effects
    const cards = document.querySelectorAll('.menu-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.zIndex = '10';
        });
        card.addEventListener('mouseleave', () => {
            card.style.zIndex = '1';
        });
    });
}

/**
 * Smooth Scroll
 */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const target = document.querySelector(targetId);

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
}

/**
 * Utility: Throttle
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Utility: Debounce
 */
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

/**
 * Active Navigation Link on Scroll
 */
function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', throttle(updateActiveNav, 100));

/**
 * Preload Images
 */
function preloadImages() {
    const images = document.querySelectorAll('img[data-src]');

    const imgObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imgObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imgObserver.observe(img));
}

/**
 * Loading Animation
 */
window.addEventListener('load', () => {
    document.body.classList.add('loaded');

    // Trigger initial animations
    setTimeout(() => {
        document.querySelectorAll('.category-section').forEach((section, index) => {
            setTimeout(() => {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }, 500);
});

/**
 * Keyboard Navigation
 */
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const navMenu = document.getElementById('navMenu');
        const navToggle = document.getElementById('navToggle');

        if (navMenu && navToggle && navMenu.classList.contains('active')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
});

/**
 * Image Loading & Error Handling
 */
function initImageLoading() {
    const images = document.querySelectorAll('.card-image img');

    images.forEach(img => {
        // Ensure images are visible
        img.style.opacity = '1';
        img.style.display = 'block';

        // Handle image error - use a simple colored background
        img.onerror = function() {
            this.style.display = 'none';
            // Create a colored placeholder
            const cardImage = this.closest('.card-image');
            if (cardImage) {
                cardImage.style.background = 'linear-gradient(135deg, rgba(0, 255, 136, 0.2), rgba(0, 255, 136, 0.05))';
            }
        };
    });
}
