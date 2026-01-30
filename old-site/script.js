// ==================== HERO SECTION ====================
const heroCanvas = document.getElementById('heroCanvas');
const heroCtx = heroCanvas ? heroCanvas.getContext('2d') : null;
const exploreBtn = document.getElementById('exploreBtn');
const storyContent = document.getElementById('storyContent');

let heroStars = [];
let heroMeteors = [];

// Initialize hero canvas
function initHeroCanvas() {
    if (!heroCanvas) return;
    heroCanvas.width = window.innerWidth;
    heroCanvas.height = window.innerHeight;

    heroStars = [];
    heroMeteors = [];

    // Create stars
    for (let i = 0; i < 200; i++) {
        heroStars.push({
            x: Math.random() * heroCanvas.width,
            y: Math.random() * heroCanvas.height,
            radius: Math.random() * 1.5,
            alpha: Math.random(),
            twinkleSpeed: Math.random() * 0.02 + 0.01
        });
    }

    // Create meteors
    for (let i = 0; i < 3; i++) {
        createHeroMeteor();
    }
}

function createHeroMeteor() {
    heroMeteors.push({
        x: Math.random() * heroCanvas.width,
        y: -50,
        length: Math.random() * 80 + 40,
        speed: Math.random() * 3 + 2,
        opacity: Math.random() * 0.5 + 0.5
    });
}

function animateHeroStars() {
    if (!heroCtx) return;
    heroCtx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);

    // Draw stars with pink/peach tones
    heroStars.forEach(star => {
        star.alpha += star.twinkleSpeed;
        if (star.alpha > 1 || star.alpha < 0) {
            star.twinkleSpeed = -star.twinkleSpeed;
        }
        // Use pink/peach colors instead of white
        const colors = [
            `rgba(255, 182, 193, ${Math.abs(star.alpha)})`,
            `rgba(255, 192, 203, ${Math.abs(star.alpha)})`,
            `rgba(252, 182, 159, ${Math.abs(star.alpha)})`
        ];
        heroCtx.beginPath();
        heroCtx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        heroCtx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
        heroCtx.fill();
    });

    // Draw meteors with pink/peach gradient
    heroMeteors.forEach((meteor, index) => {
        meteor.y += meteor.speed;
        meteor.x += meteor.speed * 0.5;

        const gradient = heroCtx.createLinearGradient(
            meteor.x, meteor.y,
            meteor.x - meteor.length * 0.5, meteor.y - meteor.length
        );
        gradient.addColorStop(0, `rgba(255, 154, 158, ${meteor.opacity})`);
        gradient.addColorStop(0.5, `rgba(252, 182, 159, ${meteor.opacity * 0.7})`);
        gradient.addColorStop(1, 'rgba(255, 237, 210, 0)');

        heroCtx.strokeStyle = gradient;
        heroCtx.lineWidth = 2;
        heroCtx.beginPath();
        heroCtx.moveTo(meteor.x, meteor.y);
        heroCtx.lineTo(meteor.x - meteor.length * 0.5, meteor.y - meteor.length);
        heroCtx.stroke();

        if (meteor.y > heroCanvas.height + 100) {
            heroMeteors[index] = {
                x: Math.random() * heroCanvas.width,
                y: -50,
                length: Math.random() * 80 + 40,
                speed: Math.random() * 3 + 2,
                opacity: Math.random() * 0.5 + 0.5
            };
        }
    });

    requestAnimationFrame(animateHeroStars);
}

// Petals
function createPetals(container) {
    if (!container) return;
    for (let i = 0; i < 30; i++) {
        const petal = document.createElement('div');
        petal.className = 'petal';
        petal.style.left = Math.random() * 100 + '%';
        petal.style.animationDuration = (Math.random() * 10 + 10) + 's';
        petal.style.animationDelay = Math.random() * 5 + 's';
        petal.style.width = (Math.random() * 5 + 5) + 'px';
        petal.style.height = (Math.random() * 5 + 5) + 'px';
        container.appendChild(petal);
    }
}

// Explore button - smooth scroll to story
if (exploreBtn) {
    exploreBtn.addEventListener('click', () => {
        storyContent.scrollIntoView({ behavior: 'smooth' });
    });
}

// Smooth scroll for navigation
document.querySelectorAll('.nav-menu a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ==================== HEART INTERACTIVE SECTION ====================
const heartCanvas = document.getElementById('heartCanvas');
const heartCtx = heartCanvas ? heartCanvas.getContext('2d') : null;

let width, height;
let particles = [];
const particleCount = 1500;
const mouse = { x: undefined, y: undefined, radius: 120 };

window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});

function initHeartCanvas() {
    if (!heartCanvas) return;
    const rect = heartCanvas.getBoundingClientRect();
    width = heartCanvas.width = window.innerWidth;
    height = heartCanvas.height = rect.height;

    particles = [];
    createHeart();
    animateHeart();
}

function heartFunction(t) {
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    return { x, y };
}

class Particle {
    constructor(x, y, targetX, targetY) {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.targetX = targetX;
        this.targetY = targetY;
        this.size = Math.random() * 2.5 + 1;
        this.baseX = targetX;
        this.baseY = targetY;
        this.density = (Math.random() * 30) + 1;

        const colors = [
            `rgba(255, 182, 193, ${Math.random() * 0.6 + 0.4})`,
            `rgba(255, 192, 203, ${Math.random() * 0.6 + 0.4})`,
            `rgba(255, 105, 180, ${Math.random() * 0.6 + 0.4})`,
            `rgba(255, 20, 147, ${Math.random() * 0.6 + 0.4})`
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    draw() {
        heartCtx.fillStyle = this.color;
        heartCtx.shadowBlur = 10;
        heartCtx.shadowColor = this.color;
        heartCtx.beginPath();
        heartCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        heartCtx.closePath();
        heartCtx.fill();
    }

    update() {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
        let maxDistance = mouse.radius;
        let force = (maxDistance - distance) / maxDistance;
        let directionX = forceDirectionX * force * this.density;
        let directionY = forceDirectionY * force * this.density;

        if (distance < mouse.radius) {
            this.x -= directionX;
            this.y -= directionY;
        } else {
            if (this.x !== this.baseX) {
                let dx = this.x - this.baseX;
                this.x -= dx / 15;
            }
            if (this.y !== this.baseY) {
                let dy = this.y - this.baseY;
                this.y -= dy / 15;
            }
        }
    }
}

function createHeart() {
    const scale = Math.min(width, height) / 35;
    for (let i = 0; i < particleCount; i++) {
        const t = Math.random() * Math.PI * 2;
        const pos = heartFunction(t);
        const r = Math.sqrt(Math.random());
        const targetX = width / 2 + pos.x * scale * r;
        const targetY = height / 2 + pos.y * scale * r;
        particles.push(new Particle(0, 0, targetX, targetY));
    }
}

function animateHeart() {
    if (!heartCtx) return;
    heartCtx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
        particles[i].draw();
        particles[i].update();
    }
    requestAnimationFrame(animateHeart);
}

// ==================== FOOTER HEART ====================
const footerHeartCanvas = document.getElementById('footerHeartCanvas');
const footerHeartCtx = footerHeartCanvas ? footerHeartCanvas.getContext('2d') : null;
let footerParticles = [];

function initFooterHeart() {
    if (!footerHeartCanvas) return;
    const rect = footerHeartCanvas.parentElement.getBoundingClientRect();
    footerHeartCanvas.width = rect.width;
    footerHeartCanvas.height = rect.height;

    footerParticles = [];
    const scale = Math.min(footerHeartCanvas.width, footerHeartCanvas.height) / 40;

    for (let i = 0; i < 500; i++) {
        const t = Math.random() * Math.PI * 2;
        const pos = heartFunction(t);
        const r = Math.sqrt(Math.random());
        const x = footerHeartCanvas.width / 2 + pos.x * scale * r;
        const y = footerHeartCanvas.height / 2 + pos.y * scale * r;

        footerParticles.push({
            x: x,
            y: y,
            size: Math.random() * 2 + 1,
            alpha: Math.random() * 0.5 + 0.3,
            pulse: Math.random() * 0.02 + 0.01
        });
    }

    animateFooterHeart();
}

function animateFooterHeart() {
    if (!footerHeartCtx) return;
    footerHeartCtx.clearRect(0, 0, footerHeartCanvas.width, footerHeartCanvas.height);

    footerParticles.forEach(particle => {
        particle.alpha += particle.pulse;
        if (particle.alpha > 0.8 || particle.alpha < 0.2) {
            particle.pulse = -particle.pulse;
        }

        footerHeartCtx.fillStyle = `rgba(255, 255, 255, ${particle.alpha})`;
        footerHeartCtx.beginPath();
        footerHeartCtx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        footerHeartCtx.fill();
    });

    requestAnimationFrame(animateFooterHeart);
}

// ==================== SCROLL ANIMATIONS ====================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all fade-in elements
document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// ==================== WINDOW RESIZE ====================
window.addEventListener('resize', () => {
    if (heroCanvas) {
        initHeroCanvas();
    }
    if (heartCanvas) {
        initHeartCanvas();
    }
    if (footerHeartCanvas) {
        initFooterHeart();
    }
});

// ==================== CAROUSEL ====================
let currentSlide = 0;
const carousel = document.querySelector('.chat-screenshots.carousel');
const dots = document.querySelectorAll('.carousel-dots .dot');
const totalSlides = dots.length;

function showSlide(index) {
    if (!carousel) return;
    currentSlide = (index + totalSlides) % totalSlides;
    carousel.style.transform = `translateY(-${currentSlide * 100}%)`;

    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
    });
}

function autoSlide() {
    showSlide(currentSlide + 1);
}

// Auto-scroll carousel every 4 seconds
let carouselInterval = setInterval(autoSlide, 4000);

// Dot navigation
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        showSlide(index);
        clearInterval(carouselInterval);
        carouselInterval = setInterval(autoSlide, 4000);
    });
});

// ==================== MICRO ANIMATIONS ====================

// Floating Hearts on Mouse Move
function createFloatingHeart(x, y) {
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.innerHTML = ['❤', '💕', '💗', '💖', '✨'][Math.floor(Math.random() * 5)];
    heart.style.left = x + 'px';
    heart.style.top = y + 'px';
    heart.style.fontSize = (Math.random() * 1.5 + 1) + 'rem';
    heart.style.animationDuration = (Math.random() * 2 + 4) + 's';
    document.body.appendChild(heart);

    setTimeout(() => {
        heart.remove();
    }, 6000);
}

// Create floating hearts on click (limited frequency)
let lastHeartTime = 0;
document.addEventListener('click', (e) => {
    const now = Date.now();
    if (now - lastHeartTime > 200) {
        createFloatingHeart(e.clientX, e.clientY);
        lastHeartTime = now;
    }
});

// Parallax Effect on Scroll
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.parallax');

    parallaxElements.forEach(el => {
        const speed = el.dataset.speed || 0.5;
        el.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Add Sparkles to Buttons
function addSparkles(element) {
    for (let i = 0; i < 5; i++) {
        const sparkle = document.createElement('span');
        sparkle.className = 'sparkle';
        sparkle.style.left = Math.random() * 100 + '%';
        sparkle.style.top = Math.random() * 100 + '%';
        sparkle.style.animationDelay = Math.random() * 1 + 's';
        element.appendChild(sparkle);
    }
}

// Add sparkles to CTA button
const ctaBtn = document.querySelector('.cta-btn');
if (ctaBtn) {
    addSparkles(ctaBtn);
}

// Magnetic Effect for Interactive Elements
const magneticElements = document.querySelectorAll('.cta-btn, .gallery-item');

magneticElements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });

    el.addEventListener('mouseleave', () => {
        el.style.transform = 'translate(0, 0)';
    });
});

// Text Reveal Animation
function revealText(element, text, delay = 100) {
    element.textContent = '';
    let index = 0;

    const interval = setInterval(() => {
        if (index < text.length) {
            element.textContent += text[index];
            index++;
        } else {
            clearInterval(interval);
        }
    }, delay);
}

// Add hover sound effect placeholder (visual only)
const interactiveElements = document.querySelectorAll('.cta-btn, .gallery-item, .timeline-content');

interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        el.style.transition = 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    });
});

// Stagger children animation
function staggerAnimate(parent, className = 'fade-in', delay = 100) {
    const children = parent.querySelectorAll(`.${className}`);
    children.forEach((child, index) => {
        child.style.transitionDelay = `${index * 0.1}s`;
    });
}

// Apply stagger animation to timeline items
const timeline = document.querySelector('.timeline');
if (timeline) {
    staggerAnimate(timeline, 'fade-in', 150);
}

// Cursor Glow Effect
const cursorGlow = document.createElement('div');
cursorGlow.style.cssText = `
    position: fixed;
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(255, 182, 193, 0.15), transparent 70%);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%, -50%);
    transition: opacity 0.3s ease;
    opacity: 0;
`;
document.body.appendChild(cursorGlow);

document.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
    cursorGlow.style.opacity = '1';
});

document.addEventListener('mouseleave', () => {
    cursorGlow.style.opacity = '0';
});

// ==================== INITIALIZATION ====================
if (heroCanvas) {
    initHeroCanvas();
    animateHeroStars();
}

const heroPetalsContainer = document.getElementById('heroPetalsContainer');
if (heroPetalsContainer) {
    createPetals(heroPetalsContainer);
}

// Initialize heart canvas when page loads
if (heartCanvas) {
    initHeartCanvas();
}

// Initialize footer heart
if (footerHeartCanvas) {
    initFooterHeart();
}

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        navbar.querySelectorAll('a, .nav-logo').forEach(el => {
            el.style.color = '#2d3748';
        });
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.05)';
        navbar.style.boxShadow = 'none';
        navbar.querySelectorAll('a, .nav-logo').forEach(el => {
            el.style.color = 'white';
        });
    }

    lastScroll = currentScroll;
});
