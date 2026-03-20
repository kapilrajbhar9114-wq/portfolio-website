// 1. Loader Logic
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }, 1500);
});

// 2. Three.js Background Implementation
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.getElementById('canvas-container').appendChild(renderer.domElement);

// Objects: Create a "World" of floating objects
const objectsGroup = new THREE.Group();
scene.add(objectsGroup);

const geometryTypes = [
    new THREE.TorusGeometry(0.7, 0.2, 16, 100),
    new THREE.IcosahedronGeometry(0.5, 0),
    new THREE.OctahedronGeometry(0.8, 0),
    new THREE.TetrahedronGeometry(0.6, 0)
];

const colors = [0x00f2ff, 0x7000ff, 0xff00ff, 0x00ff88];

for(let i = 0; i < 50; i++) {
    const geo = geometryTypes[Math.floor(Math.random() * geometryTypes.length)];
    const mat = new THREE.MeshPhongMaterial({
        color: colors[Math.floor(Math.random() * colors.length)],
        wireframe: true,
        emissive: colors[Math.floor(Math.random() * colors.length)],
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.6
    });
    
    const mesh = new THREE.Mesh(geo, mat);
    
    // Scatter objects through a long "tunnel" along the Z axis
    mesh.position.x = (Math.random() - 0.5) * 15;
    mesh.position.y = (Math.random() - 0.5) * 15;
    mesh.position.z = (Math.random() - 0.5) * 30;
    
    mesh.rotation.x = Math.random() * Math.PI;
    mesh.rotation.y = Math.random() * Math.PI;
    
    // Random scale
    const s = Math.random() * 0.8 + 0.2;
    mesh.scale.set(s, s, s);
    
    objectsGroup.add(mesh);
}

// Larger Particles
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 3000;
const posArray = new Float32Array(particlesCount * 3);

for(let i=0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 20;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

const particlesMaterial = new THREE.PointsMaterial({
    size: 0.015,
    color: '#00f2ff',
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// Lights - Brighter and Moving
const mainLight = new THREE.PointLight(0x00f2ff, 2, 50);
mainLight.position.set(5, 5, 5);
scene.add(mainLight);

const secondaryLight = new THREE.PointLight(0x7000ff, 2, 50);
secondaryLight.position.set(-5, -5, 2);
scene.add(secondaryLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

camera.position.z = 5;

// Mouse Interactivity
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) - 0.5;
    mouseY = (e.clientY / window.innerHeight) - 0.5;
});

// Animation Loop
const animate = () => {
    requestAnimationFrame(animate);

    particlesMesh.rotation.y += 0.0005;
    
    // Rotate all scattered objects
    objectsGroup.children.forEach(obj => {
        obj.rotation.x += 0.005;
        obj.rotation.y += 0.005;
    });
    
    // Mouse parallax
    const targetX = mouseX * 3;
    const targetY = mouseY * 3;
    scene.rotation.y += (targetX - scene.rotation.y) * 0.05;
    scene.rotation.x += (-targetY - scene.rotation.x) * 0.05;

    renderer.render(scene, camera);
};

animate();

// Handle Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// 3. GSAP & ScrollTrigger Animations
gsap.registerPlugin(ScrollTrigger);

// --- NEW: Scroll-bound 3D background movement ---
gsap.to(camera.position, {
    z: 5,
    y: -2,
    scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 1
    }
});

gsap.to(scene.rotation, {
    y: Math.PI * 2,
    x: 1,
    scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 2
    }
});

// Enhance particles on scroll
gsap.to(particlesMesh.rotation, {
    y: 10,
    scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 3
    }
});
// ----------------------------------------------

// Reveal elements on scroll
const revealElements = document.querySelectorAll('[data-reveal]');
revealElements.forEach(el => {
    ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        onEnter: () => el.classList.add('reveal-visible')
    });
});

// Progress bars animation
const skillItems = document.querySelectorAll('.skill-item');
skillItems.forEach(item => {
    const bar = item.querySelector('.progress-bar');
    gsap.to(bar, {
        scrollTrigger: {
            trigger: item,
            start: 'top 90%',
        },
        scaleX: 1,
        duration: 1.5,
        ease: 'power4.out'
    });
});

// Hero animations
gsap.from('.glitch-text', {
    y: 100,
    opacity: 0,
    duration: 1,
    delay: 1.8
});

gsap.from('.role-text', {
    y: 50,
    opacity: 0,
    duration: 1,
    delay: 2.1
});

gsap.from('.hero-btns', {
    y: 50,
    opacity: 0,
    duration: 1,
    delay: 2.4
});

// 4. Tilt Effect for Cards
const cards = document.querySelectorAll('.tilt');
cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotX = (y - centerY) / 10;
        const rotY = (centerX - x) / 10;

        card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
});

// 6. Statistics Counter Animation
const counters = document.querySelectorAll('.counter');
const speed = 200;

counters.forEach(counter => {
    const updateCount = () => {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText;
        const inc = target / speed;

        if (count < target) {
            counter.innerText = Math.ceil(count + inc);
            setTimeout(updateCount, 1);
        } else {
            counter.innerText = target;
        }
    };
    
    ScrollTrigger.create({
        trigger: counter,
        start: 'top 90%',
        onEnter: () => updateCount()
    });
});

// 7. Custom Cursor Tracking
const cursorDot = document.querySelector(".cursor-dot");
const cursorOutline = document.querySelector(".cursor-outline");

window.addEventListener("mousemove", (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;
    cursorDot.style.opacity = "1";

    cursorOutline.animate({
        left: `${posX}px`,
        top: `${posY}px`
    }, { duration: 500, fill: "forwards" });
    cursorOutline.style.opacity = "1";
});

// Cursor Click Effect
window.addEventListener("mousedown", () => {
    cursorDot.style.transform = "translate(-50%, -50%) scale(0.5)";
    cursorOutline.style.transform = "translate(-50%, -50%) scale(1.5)";
});

window.addEventListener("mouseup", () => {
    cursorDot.style.transform = "translate(-50%, -50%) scale(1)";
    cursorOutline.style.transform = "translate(-50%, -50%) scale(1)";
});

// 8. FAQ Accordion
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
        item.classList.toggle('active');
    });
});

// 9. Scroll to Top with Progress
const scrollTopBtn = document.getElementById('scroll-top');
const progressCircle = scrollTopBtn.querySelector('circle');
const circumference = progressCircle.getTotalLength();

progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
progressCircle.style.strokeDashoffset = circumference;

window.addEventListener('scroll', () => {
    // Visibility toggle
    if (window.pageYOffset > 300) {
        scrollTopBtn.classList.add('active');
    } else {
        scrollTopBtn.classList.remove('active');
    }

    // Progress calculation
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollProgress = window.pageYOffset / scrollHeight;
    const offset = circumference - (scrollProgress * circumference);
    progressCircle.style.strokeDashoffset = offset;
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// 12. Magnetic Effect
const magneticElements = document.querySelectorAll('.magnetic');
magneticElements.forEach(el => {
    el.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        this.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });
    
    el.addEventListener('mouseleave', function() {
        this.style.transform = `translate(0px, 0px)`;
    });
});

// 13. Project Filtering
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card[data-category]');

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        // Active state toggle
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filter = btn.getAttribute('data-filter');
        
        projectCards.forEach(card => {
            const category = card.getAttribute('data-category');
            if (filter === 'all' || filter === category) {
                card.style.display = 'block';
                setTimeout(() => card.style.opacity = '1', 10);
            } else {
                card.style.opacity = '0';
                setTimeout(() => card.style.display = 'none', 300);
            }
        });
    });
});

// 10. Testimonial Slider
const testimonialCards = document.querySelectorAll('.testimonial-card');
let currentTestimonial = 0;

if (testimonialCards.length > 0) {
    setInterval(() => {
        testimonialCards[currentTestimonial].style.display = 'none';
        currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
        testimonialCards[currentTestimonial].style.display = 'block';
        testimonialCards[currentTestimonial].style.animation = 'fadeIn 0.5s ease-in-out';
    }, 5000);
}

// 11. Global Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 70,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            if (navLinks.classList.contains('mobile-active')) {
                navLinks.classList.remove('mobile-active');
                navLinks.style.display = '';
            }
        }
    });
});

// 10. Navigation & Menu Toggle Update
const nav = document.getElementById('main-nav');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        nav.style.padding = '10px 50px';
        nav.style.background = 'rgba(5, 5, 5, 0.9)';
    } else {
        nav.style.padding = '20px 50px';
        nav.style.background = 'rgba(5, 5, 5, 0.5)';
    }
});

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('mobile-active');
    if(navLinks.classList.contains('mobile-active')) {
        navLinks.style.display = 'flex';
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '100%';
        navLinks.style.left = '0';
        navLinks.style.width = '100%';
        navLinks.style.background = 'rgba(5, 5, 5, 0.95)';
        navLinks.style.padding = '20px';
    } else {
        navLinks.style.display = '';
    }
});

// Form Submission
const form = document.getElementById('portfolio-form');
if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = form.querySelector('button');
        const originalText = btn.innerText;
        
        btn.innerText = 'Sending...';
        btn.disabled = true;

        setTimeout(() => {
            btn.innerText = 'Message Sent!';
            btn.style.background = '#00ff00';
            form.reset();
            
            setTimeout(() => {
                btn.innerText = originalText;
                btn.style.background = '';
                btn.disabled = false;
            }, 3000);
        }, 2000);
    });
}
