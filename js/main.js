// Main JavaScript for KiddyLand Preschool Website

document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // 2. Sticky Navbar Shadow Effect
    const navbar = document.getElementById('main-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 30) {
            navbar.classList.add('shadow-lg', 'bg-opacity-95', 'backdrop-blur-md');
        } else {
            navbar.classList.remove('shadow-lg', 'bg-opacity-95', 'backdrop-blur-md');
        }
    });

    // 3. Animated Stats Counters
    const statCounters = document.querySelectorAll('.stat-count');
    let animated = false;

    const animateCounters = () => {
        statCounters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'), 10);
            const suffix = counter.getAttribute('data-suffix') || '';
            const duration = 1800; // 1.8 seconds
            const stepTime = 30;
            const steps = duration / stepTime;
            const increment = target / steps;
            let current = 0;

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    counter.innerText = target + suffix;
                    clearInterval(timer);
                } else {
                    counter.innerText = Math.floor(current) + suffix;
                }
            }, stepTime);
        });
    };

    const statsSection = document.getElementById('stats-section');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !animated) {
                    animated = true;
                    animateCounters();
                }
            });
        }, { threshold: 0.3 });
        observer.observe(statsSection);
    }

    // 4. Gallery Carousel & Lightbox
    const galleryContainer = document.getElementById('gallery-slider');
    const galleryPrevBtn = document.getElementById('gallery-prev');
    const galleryNextBtn = document.getElementById('gallery-next');

    if (galleryContainer && galleryPrevBtn && galleryNextBtn) {
        galleryPrevBtn.addEventListener('click', () => {
            galleryContainer.scrollBy({ left: -280, behavior: 'smooth' });
        });
        galleryNextBtn.addEventListener('click', () => {
            galleryContainer.scrollBy({ left: 280, behavior: 'smooth' });
        });
    }

    // Lightbox modal
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');
    const galleryImages = document.querySelectorAll('.gallery-thumb');

    galleryImages.forEach(img => {
        img.addEventListener('click', () => {
            if (lightboxModal && lightboxImg) {
                lightboxImg.src = img.src;
                lightboxModal.classList.remove('hidden');
                lightboxModal.classList.add('flex');
            }
        });
    });

    if (lightboxClose && lightboxModal) {
        lightboxClose.addEventListener('click', () => {
            lightboxModal.classList.add('hidden');
            lightboxModal.classList.remove('flex');
        });
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) {
                lightboxModal.classList.add('hidden');
                lightboxModal.classList.remove('flex');
            }
        });
    }

    // 5. Testimonials Carousel
    const testimonials = [
        {
            quote: "KiddyLand has been a wonderful experience for our child. The teachers are caring and the activities are amazing!",
            name: "Priya Sharma",
            role: "Parent of Aarav (Nursery)",
            img: "assets/images/parent_smiling.jpg"
        },
        {
            quote: "The personalized attention and creative environment helped my daughter build immense confidence and social skills!",
            name: "Ananya Deshmukh",
            role: "Parent of Diya (Kindergarten)",
            img: "assets/images/parent_smiling.jpg"
        },
        {
            quote: "Outstanding curriculum and state-of-the-art safety protocols. We couldn't have chosen a better preschool for our son.",
            name: "Rohan Kapoor",
            role: "Parent of Kabir (Pre-Nursery)",
            img: "assets/images/parent_smiling.jpg"
        }
    ];

    let currentTestimonial = 0;
    const testQuote = document.getElementById('testimonial-quote');
    const testName = document.getElementById('testimonial-name');
    const testRole = document.getElementById('testimonial-role');
    const testNextBtn = document.getElementById('testimonial-next');
    const testDots = document.querySelectorAll('.testimonial-dot');

    const updateTestimonial = (index) => {
        currentTestimonial = (index + testimonials.length) % testimonials.length;
        const data = testimonials[currentTestimonial];
        
        if (testQuote) {
            testQuote.style.opacity = '0';
            setTimeout(() => {
                testQuote.innerText = data.quote;
                testName.innerText = data.name;
                testRole.innerText = data.role;
                testQuote.style.opacity = '1';
            }, 200);
        }

        testDots.forEach((dot, idx) => {
            if (idx === currentTestimonial) {
                dot.classList.add('bg-white', 'w-6');
                dot.classList.remove('bg-white/40', 'w-2.5');
            } else {
                dot.classList.remove('bg-white', 'w-6');
                dot.classList.add('bg-white/40', 'w-2.5');
            }
        });
    };

    if (testNextBtn) {
        testNextBtn.addEventListener('click', () => {
            updateTestimonial(currentTestimonial + 1);
        });
    }

    testDots.forEach((dot, idx) => {
        dot.addEventListener('click', () => {
            updateTestimonial(idx);
        });
    });

    // 6. Latest News Carousel
    const newsSlider = document.getElementById('news-slider');
    const newsPrev = document.getElementById('news-prev');
    const newsNext = document.getElementById('news-next');

    if (newsSlider && newsPrev && newsNext) {
        newsPrev.addEventListener('click', () => {
            newsSlider.scrollBy({ left: -350, behavior: 'smooth' });
        });
        newsNext.addEventListener('click', () => {
            newsSlider.scrollBy({ left: 350, behavior: 'smooth' });
        });
    }

    // 7. Enrollment Modal Handling
    const enrollModal = document.getElementById('enroll-modal');
    const enrollButtons = document.querySelectorAll('.btn-enroll');
    const enrollCloseBtn = document.getElementById('enroll-close-btn');
    const enrollForm = document.getElementById('enrollment-form');

    enrollButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (enrollModal) {
                enrollModal.classList.remove('hidden');
                enrollModal.classList.add('flex');
            }
        });
    });

    if (enrollCloseBtn && enrollModal) {
        enrollCloseBtn.addEventListener('click', () => {
            enrollModal.classList.add('hidden');
            enrollModal.classList.remove('flex');
        });
        enrollModal.addEventListener('click', (e) => {
            if (e.target === enrollModal) {
                enrollModal.classList.add('hidden');
                enrollModal.classList.remove('flex');
            }
        });
    }

    if (enrollForm) {
        enrollForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const childName = document.getElementById('child-name')?.value || 'Student';
            showToast(`Success! Admission inquiry submitted for ${childName}. Our coordinator will contact you shortly! 🎉`);
            enrollForm.reset();
            enrollModal.classList.add('hidden');
            enrollModal.classList.remove('flex');
        });
    }

    // 8. Tour Modal Handling
    const tourModal = document.getElementById('tour-modal');
    const tourButtons = document.querySelectorAll('.btn-tour');
    const tourCloseBtn = document.getElementById('tour-close-btn');

    tourButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (tourModal) {
                tourModal.classList.remove('hidden');
                tourModal.classList.add('flex');
            }
        });
    });

    if (tourCloseBtn && tourModal) {
        tourCloseBtn.addEventListener('click', () => {
            tourModal.classList.add('hidden');
            tourModal.classList.remove('flex');
        });
        tourModal.addEventListener('click', (e) => {
            if (e.target === tourModal) {
                tourModal.classList.add('hidden');
                tourModal.classList.remove('flex');
            }
        });
    }

    // 9. Toast Notification Helper
    function showToast(message) {
        let toast = document.getElementById('kiddy-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'kiddy-toast';
            toast.className = 'fixed bottom-6 right-6 bg-[#341270] text-white px-6 py-4 rounded-2xl shadow-2xl z-50 transform transition-all duration-300 translate-y-20 opacity-0 flex items-center space-x-3 border-2 border-yellow-400';
            document.body.appendChild(toast);
        }
        toast.innerHTML = `<span class="text-xl">🌟</span><p class="font-medium text-sm">${message}</p>`;
        toast.classList.remove('translate-y-20', 'opacity-0');
        toast.classList.add('translate-y-0', 'opacity-100');

        setTimeout(() => {
            toast.classList.remove('translate-y-0', 'opacity-100');
            toast.classList.add('translate-y-20', 'opacity-0');
        }, 4000);
    }

    // 10. Newsletter Form
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast('Thank you for subscribing to KiddyLand updates! 🎈');
            newsletterForm.reset();
        });
    }
});
