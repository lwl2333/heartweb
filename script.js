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

    // Draw stars
    heroStars.forEach(star => {
        star.alpha += star.twinkleSpeed;
        if (star.alpha > 1 || star.alpha < 0) {
            star.twinkleSpeed = -star.twinkleSpeed;
        }
        heroCtx.beginPath();
        heroCtx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        heroCtx.fillStyle = `rgba(255, 255, 255, ${Math.abs(star.alpha)})`;
        heroCtx.fill();
    });

    // Draw meteors
    heroMeteors.forEach((meteor, index) => {
        meteor.y += meteor.speed;
        meteor.x += meteor.speed * 0.5;

        const gradient = heroCtx.createLinearGradient(
            meteor.x, meteor.y,
            meteor.x - meteor.length * 0.5, meteor.y - meteor.length
        );
        gradient.addColorStop(0, `rgba(255, 255, 255, ${meteor.opacity})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

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
