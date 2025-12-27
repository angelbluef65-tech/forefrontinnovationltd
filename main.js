// Theme Toggle Functionality
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const moonIcon = themeToggle?.querySelector('.fa-moon');
    const sunIcon = themeToggle?.querySelector('.fa-sun');
    
    if (!themeToggle || !moonIcon || !sunIcon) return;
    
    // Check for saved theme preference or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        moonIcon.style.display = 'none';
        sunIcon.style.display = 'inline-block';
    }
    
    themeToggle.addEventListener('click', function() {
        const isLight = document.body.classList.toggle('light-theme');
        
        if (isLight) {
            moonIcon.style.display = 'none';
            sunIcon.style.display = 'inline-block';
            localStorage.setItem('theme', 'light');
        } else {
            moonIcon.style.display = 'inline-block';
            sunIcon.style.display = 'none';
            localStorage.setItem('theme', 'dark');
        }
    });
}

// Call it in DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    // Add this line after other initializations
    initThemeToggle();
});

// Main JavaScript Functionality    


document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            const icon = this.querySelector('i');
            if (mainNav.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
                document.body.style.overflow = 'hidden';
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                document.body.style.overflow = '';
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!event.target.closest('.header-container') && mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                mobileMenuToggle.querySelector('i').classList.remove('fa-times');
                mobileMenuToggle.querySelector('i').classList.add('fa-bars');
                document.body.style.overflow = '';
            }
        });
    }

    // Smooth Scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                if (mainNav.classList.contains('active')) {
                    mainNav.classList.remove('active');
                    mobileMenuToggle.querySelector('i').classList.remove('fa-times');
                    mobileMenuToggle.querySelector('i').classList.add('fa-bars');
                    document.body.style.overflow = '';
                }

                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Header scroll effect with animation
    const header = document.querySelector('header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.style.backgroundColor = 'rgba(10, 10, 10, 0.98)';
            header.style.backdropFilter = 'blur(10px)';
            header.style.boxShadow = '0 5px 20px rgba(0, 255, 136, 0.1)';
        } else {
            header.style.backgroundColor = 'rgba(10, 10, 10, 0.95)';
            header.style.backdropFilter = 'blur(5px)';
            header.style.boxShadow = '0 2px 10px rgba(0, 255, 136, 0.1)';
        }
    });

    // Back to Top Button
    const backToTopButton = document.createElement('button');
    backToTopButton.className = 'back-to-top';
    backToTopButton.innerHTML = '<i class="fas fa-chevron-up"></i>';
    backToTopButton.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(backToTopButton);

    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });

    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Scroll reveal animation
    function revealOnScroll() {
        const reveals = document.querySelectorAll('.reveal');
        
        reveals.forEach(reveal => {
            const windowHeight = window.innerHeight;
            const elementTop = reveal.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add('active');
            }
        });
    }

    // Add reveal class to sections
    document.querySelectorAll('section').forEach(section => {
        section.classList.add('reveal');
    });

    // Initial reveal check
    revealOnScroll();
    window.addEventListener('scroll', revealOnScroll);

    // Initialize stats counter animation
    function animateStats() {
        const statNumbers = document.querySelectorAll('.stat-number');
        let hasAnimated = false;

        return function() {
            const statsSection = document.querySelector('.stats');
            if (!statsSection || hasAnimated) return;

            const sectionTop = statsSection.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            if (sectionTop < windowHeight - 100) {
                hasAnimated = true;

                statNumbers.forEach((stat, index) => {
                    const finalValue = parseInt(stat.textContent);
                    const duration = 2000;
                    const increment = finalValue / (duration / 16);
                    let current = 0;

                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= finalValue) {
                            stat.textContent = finalValue + (stat.textContent.includes('+') ? '+' :
                                                           stat.textContent.includes('%') ? '%' : '');
                            clearInterval(timer);
                        } else {
                            stat.textContent = Math.floor(current) + (stat.textContent.includes('+') ? '+' :
                                                                     stat.textContent.includes('%') ? '%' : '');
                        }
                    }, 16);
                });
            }
        };
    }

    // Trigger stats animation when section is in view
    const checkStats = animateStats();
    window.addEventListener('scroll', checkStats);
    checkStats(); // Initial check

    // Parallax effect for hero section
    function parallaxEffect() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.backgroundPositionY = scrolled * 0.5 + 'px';
        }
    }

    window.addEventListener('scroll', parallaxEffect);

    // Add touch-friendly hover effects for mobile
    if ('ontouchstart' in window) {
        document.querySelectorAll('.service-card, .product-card, .team-member').forEach(element => {
            element.addEventListener('touchstart', function() {
                this.classList.add('touched');
            }, { passive: true });

            element.addEventListener('touchend', function() {
                setTimeout(() => {
                    this.classList.remove('touched');
                }, 150);
            }, { passive: true });
        });
    }

    // Animate elements on page load
    setTimeout(() => {
        document.querySelectorAll('.hero-content, .section-title').forEach(el => {
            if (el) {
                el.style.animationDelay = '0.1s';
            }
        });
    }, 100);

    // Add animation delay to service cards
    document.querySelectorAll('.service-card').forEach((card, index) => {
        card.style.animationDelay = `${0.2 + index * 0.1}s`;
    });

    // Add animation delay to product cards
    document.querySelectorAll('.product-card').forEach((card, index) => {
        card.style.animationDelay = `${0.2 + index * 0.1}s`;
    });

    // Add animation delay to team members
    document.querySelectorAll('.team-member').forEach((member, index) => {
        member.style.animationDelay = `${0.2 + index * 0.05}s`;
    });

    // Form validation styling
    const formInputs = document.querySelectorAll('.form-control');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
    });

    // Add subtle hover effect to all cards
    document.querySelectorAll('.service-card, .product-card, .team-member, .testimonial-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        });
    });
});



