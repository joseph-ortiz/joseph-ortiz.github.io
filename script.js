// Nav scroll effect
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 10);
});

// Contact form submission
const form = document.getElementById('contact-form');
const thankYou = document.getElementById('thank-you');

form.addEventListener('submit', () => {
    setTimeout(() => {
        form.hidden = true;
        thankYou.hidden = false;
    }, 500);
});

// Scroll-triggered fade-in animations
const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.1 }
);

document.querySelectorAll('.project-card, .contact-form, .section-title').forEach((el) => {
    el.classList.add('fade-in');
    observer.observe(el);
});
