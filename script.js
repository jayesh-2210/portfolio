document.addEventListener('DOMContentLoaded', () => {

    // =========================================
    // PRELOADER
    // =========================================
    const preloader = document.getElementById('preloader');
    const preloaderBar = document.getElementById('preloaderBar');
    const preloaderPercent = document.getElementById('preloaderPercent');

    let progress = 0;
    const preloaderInterval = setInterval(() => {
        progress += Math.random() * 15 + 5;
        if (progress >= 100) {
            progress = 100;
            clearInterval(preloaderInterval);
            setTimeout(() => {
                preloader.classList.add('hidden');
            }, 400);
        }
        preloaderBar.style.width = progress + '%';
        preloaderPercent.textContent = Math.floor(progress) + '%';
    }, 120);

    // Fallback: ensure preloader hides after max 3s
    setTimeout(() => {
        if (!preloader.classList.contains('hidden')) {
            preloaderBar.style.width = '100%';
            preloaderPercent.textContent = '100%';
            setTimeout(() => preloader.classList.add('hidden'), 300);
        }
    }, 3000);

    // =========================================
    // CURRENT YEAR
    // =========================================
    document.getElementById('year').textContent = new Date().getFullYear();

    // =========================================
    // NAVBAR SCROLL EFFECT
    // =========================================
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // =========================================
    // MOBILE MENU TOGGLE
    // =========================================
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links a');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    navLinksItems.forEach(item => {
        item.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    });

    // =========================================
    // ACTIVE NAV LINK TRACKING
    // =========================================
    const sections = document.querySelectorAll('section[id]');
    const navLinksList = document.querySelectorAll('.nav-links a[href^="#"]');

    const updateActiveNav = () => {
        const scrollPos = window.scrollY + 150;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinksList.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', updateActiveNav);

    // =========================================
    // SCROLL REVEAL ANIMATION
    // =========================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    }, observerOptions);

    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach((el) => observer.observe(el));

    // =========================================
    // ANIMATED STAT COUNTERS
    // =========================================
    const statValues = document.querySelectorAll('.stat-value');
    let statsAnimated = false;

    const animateCounters = () => {
        statValues.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            const suffix = stat.getAttribute('data-suffix') || '';
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += increment;
                if (current >= target) {
                    stat.textContent = target + suffix;
                    return;
                }
                stat.textContent = Math.floor(current) + suffix;
                requestAnimationFrame(updateCounter);
            };

            updateCounter();
        });
        statsAnimated = true;
    };

    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !statsAnimated) {
                    animateCounters();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        statsObserver.observe(statsSection);
    }

    // =========================================
    // STICKY CTA VISIBILITY
    // =========================================
    const stickyCta = document.getElementById('stickyCta');
    const heroSection = document.querySelector('.hero');

    if (stickyCta && heroSection) {
        window.addEventListener('scroll', () => {
            const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
            if (window.scrollY > heroBottom - 200) {
                stickyCta.classList.add('visible');
            } else {
                stickyCta.classList.remove('visible');
            }
        });
    }

    // =========================================
    // PROJECT SLIDER LOGIC
    // =========================================
    const track = document.querySelector('.slider-track');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    if (track && prevBtn && nextBtn) {
        let currentIndex = 0;

        const getCardsPerView = () => {
            if (window.innerWidth <= 650) return 1;
            if (window.innerWidth <= 1000) return 2;
            return 3;
        };

        const updateSlider = () => {
            const cardWidth = track.children[0].getBoundingClientRect().width;
            const gap = parseFloat(getComputedStyle(track).gap) || 0;
            const moveAmount = cardWidth + gap;
            track.style.transform = `translateX(-${currentIndex * moveAmount}px)`;

            const maxIndex = track.children.length - getCardsPerView();
            prevBtn.disabled = currentIndex === 0;
            nextBtn.disabled = currentIndex >= maxIndex;
        };

        nextBtn.addEventListener('click', () => {
            const maxIndex = track.children.length - getCardsPerView();
            if (currentIndex < maxIndex) {
                currentIndex++;
                updateSlider();
            }
        });

        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateSlider();
            }
        });

        window.addEventListener('resize', () => {
            const maxIndex = track.children.length - getCardsPerView();
            if (currentIndex > maxIndex) {
                currentIndex = Math.max(0, maxIndex);
            }
            updateSlider();
        });

        updateSlider();
    }

    // =========================================
    // SMOOTH SCROLL FOR ALL ANCHOR LINKS
    // =========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});
