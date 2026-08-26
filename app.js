/* ==========================================================================
   PETER'S GYM DERA BASSI - ENGINE & INTERACTIVITY
   ========================================================================== */

// === PAGE TRANSITION: Burgundy slides down, shows DO WORKOUT, then exits upward ===
(function() {
    const overlay = document.getElementById('page-transition-overlay');
    if (!overlay) return;

    // Phase 1: overlay sweeps down from top (covers screen)
    overlay.classList.add('entering');

    // Phase 2: after entering animation + text reveal, exit upward
    overlay.addEventListener('animationend', function onEnterEnd() {
        // Hold visible for ~700ms so both words fully reveal, then exit
        setTimeout(() => {
            overlay.classList.remove('entering');
            requestAnimationFrame(() => {
                overlay.classList.add('exiting');
            });
        }, 700);
    }, { once: true });
})();

// === CUSTOM CIRCLE MIRROR RING CURSOR (instant follow, no inner dot) ===
(function() {
    const ring = document.getElementById('cursor-ring');
    if (!ring) return;

    // Instant position — no lerp, no delay
    document.addEventListener('mousemove', (e) => {
        ring.style.left = e.clientX + 'px';
        ring.style.top  = e.clientY + 'px';
    }, { passive: true });

    // Expand on hover over interactive elements
    const interactiveSelectors = 'a, button, input, select, label, [role="button"], .program-card, .review-glass-card, .name-slip-card, .membership-card';
    document.addEventListener('mouseover', (e) => {
        if (e.target.closest(interactiveSelectors)) ring.classList.add('hovering');
    });
    document.addEventListener('mouseout', (e) => {
        if (e.target.closest(interactiveSelectors)) ring.classList.remove('hovering');
    });

    // Hide when mouse leaves window
    document.addEventListener('mouseleave', () => { ring.style.opacity = '0'; });
    document.addEventListener('mouseenter', () => { ring.style.opacity = '1'; });
})();

document.addEventListener('DOMContentLoaded', () => {
    
    // --- Preloader Progress Simulation with Fail-Safe ---
    const loaderOverlay = document.getElementById('loader-overlay');
    const loaderBar = document.getElementById('loader-bar');
    const loaderPercentage = document.getElementById('loader-percentage');

    function hideLoader() {
        if (!loaderOverlay || loaderOverlay.classList.contains('fade-out')) return;
        loaderOverlay.classList.add('fade-out');
        setTimeout(() => {
            loaderOverlay.style.display = 'none';
        }, 800);
    }

    let loadProgress = 0;
    const progressInterval = setInterval(() => {
        loadProgress += 20;
        if (loadProgress > 100) loadProgress = 100;
        
        if (loaderBar) loaderBar.style.width = `${loadProgress}%`;
        if (loaderPercentage) loaderPercentage.textContent = `${loadProgress}%`;

        if (loadProgress >= 100) {
            clearInterval(progressInterval);
            setTimeout(hideLoader, 200);
        }
    }, 30);

    // Fail-safe: ensure loader disappears after 1 second max
    setTimeout(hideLoader, 1000);

    // --- iPhone Liquid Glass Navigation Bar: Throttled Smart Hide & Reveal on Scroll ---
    const navLinks = document.querySelectorAll('.nav-link');
    const navPill = document.getElementById('nav-pill');
    const liquidNavbar = document.getElementById('liquid-navbar');
    const navbarWrapper = document.getElementById('navbar-wrapper');

    let lastScrollY = window.scrollY;
    let scrollTicking = false;

    window.addEventListener('scroll', () => {
        if (!scrollTicking) {
            window.requestAnimationFrame(() => {
                const currentScrollY = window.scrollY;

                // Hide when scrolling DOWN, Reveal when scrolling UP
                if (currentScrollY > 120 && currentScrollY > lastScrollY) {
                    if (navbarWrapper) navbarWrapper.classList.add('nav-hidden');
                } else {
                    if (navbarWrapper) navbarWrapper.classList.remove('nav-hidden');
                }

                // Glass background intensity on scroll
                if (currentScrollY > 40) {
                    if (liquidNavbar) {
                        liquidNavbar.style.background = 'rgba(1, 38, 33, 0.95)';
                        liquidNavbar.style.borderColor = 'rgba(255, 239, 179, 0.4)';
                    }
                } else {
                    if (liquidNavbar) {
                        liquidNavbar.style.background = 'rgba(1, 38, 33, 0.6)';
                        liquidNavbar.style.borderColor = 'rgba(255, 239, 179, 0.2)';
                    }
                }

                lastScrollY = currentScrollY;
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    }, { passive: true });

    function positionNavPill(activeLink) {
        if (!navPill || !activeLink || !activeLink.offsetParent) return;
        const linkRect = activeLink.getBoundingClientRect();
        const navRect = activeLink.parentElement.getBoundingClientRect();

        navPill.style.width = `${linkRect.width}px`;
        navPill.style.left = `${linkRect.left - navRect.left}px`;
        navPill.style.opacity = '1';
    }

    // --- Smooth Scroll Helper with Fixed Header Offset ---
    function scrollToSection(targetId) {
        const targetClean = targetId.replace('#', '');
        const targetEl = document.getElementById(targetClean);
        if (!targetEl) return;
        const navHeight = 70;
        const targetTop = targetEl.getBoundingClientRect().top + window.pageYOffset - navHeight;
        window.scrollTo({
            top: targetTop,
            behavior: 'smooth'
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                positionNavPill(link);
                scrollToSection(href);
            }
        });
    });

    const activeLink = document.querySelector('.nav-link.active');
    if (activeLink) setTimeout(() => positionNavPill(activeLink), 300);

    // --- Full-Screen Glass Blur Navigation Overlay Modal Engine ---
    const mobileToggle = document.getElementById('mobile-toggle');
    const fullNavOverlay = document.getElementById('full-nav-overlay');
    const navOverlayClose = document.getElementById('nav-overlay-close');
    const navOverlayBackdrop = document.querySelector('.nav-overlay-backdrop');
    const overlayItems = document.querySelectorAll('.overlay-nav-item');

    function openFullNavOverlay() {
        if (!fullNavOverlay) return;
        fullNavOverlay.classList.add('active');
        fullNavOverlay.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        if (mobileToggle) mobileToggle.classList.add('active');
    }

    function closeFullNavOverlay() {
        if (!fullNavOverlay) return;
        fullNavOverlay.classList.remove('active');
        fullNavOverlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (mobileToggle) mobileToggle.classList.remove('active');
    }

    if (mobileToggle) {
        mobileToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (fullNavOverlay && fullNavOverlay.classList.contains('active')) {
                closeFullNavOverlay();
            } else {
                openFullNavOverlay();
            }
        });
    }

    if (navOverlayClose) {
        navOverlayClose.addEventListener('click', closeFullNavOverlay);
    }

    if (navOverlayBackdrop) {
        navOverlayBackdrop.addEventListener('click', closeFullNavOverlay);
    }

    // Close on Escape key press
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && fullNavOverlay && fullNavOverlay.classList.contains('active')) {
            closeFullNavOverlay();
        }
    });

    // 6 Fully Working Overlay Links: Home, Membership, Location, Reviews, Contact, Metrics
    overlayItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const href = item.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                overlayItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                closeFullNavOverlay();
                setTimeout(() => {
                    scrollToSection(href);
                }, 150);
            }
        });
    });

    // --- Hero Video Reel: Cursor Drag, Wheel & Touch Driven Scrolling (No Auto-Scroll) ---
    const heroScrollWrapper = document.getElementById('hero-video-scroll');

    if (heroScrollWrapper) {
        let isDragging = false;
        let startX = 0;
        let scrollLeftStart = 0;

        // Mouse Drag to Scroll via Cursor
        heroScrollWrapper.addEventListener('mousedown', (e) => {
            isDragging = true;
            heroScrollWrapper.classList.add('is-dragging');
            startX = e.pageX - heroScrollWrapper.offsetLeft;
            scrollLeftStart = heroScrollWrapper.scrollLeft;
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                heroScrollWrapper.classList.remove('is-dragging');
            }
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX - heroScrollWrapper.offsetLeft;
            const walk = (x - startX) * 2; // Smooth drag sensitivity multiplier
            heroScrollWrapper.scrollLeft = scrollLeftStart - walk;
        });

        // Mouse Wheel Horizontal Scroll Support
        heroScrollWrapper.addEventListener('wheel', (e) => {
            if (e.deltaY !== 0) {
                e.preventDefault();
                heroScrollWrapper.scrollLeft += e.deltaY * 1.5;
            }
        }, { passive: false });

        // Left & Right Navigation Scroll Buttons
        const btnPrev = document.getElementById('hero-scroll-prev');
        const btnNext = document.getElementById('hero-scroll-next');

        if (btnPrev) {
            btnPrev.addEventListener('click', () => {
                const cardWidth = heroScrollWrapper.querySelector('.hero-video-card')?.offsetWidth || 300;
                heroScrollWrapper.scrollBy({ left: -(cardWidth + 20), behavior: 'smooth' });
            });
        }

        if (btnNext) {
            btnNext.addEventListener('click', () => {
                const cardWidth = heroScrollWrapper.querySelector('.hero-video-card')?.offsetWidth || 300;
                heroScrollWrapper.scrollBy({ left: (cardWidth + 20), behavior: 'smooth' });
            });
        }
    }

    // --- Hero Video Playback Observer ---
    const heroVideos = document.querySelectorAll('.hero-video-card video');

    if (heroVideos.length > 0 && 'IntersectionObserver' in window) {
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const video = entry.target;
                if (entry.isIntersecting) {
                    const playPromise = video.play();
                    if (playPromise !== undefined) {
                        playPromise.catch(() => {});
                    }
                } else {
                    if (!video.paused) {
                        video.pause();
                    }
                }
            });
        }, { threshold: 0.05, rootMargin: '150px 0px' });

        heroVideos.forEach(video => {
            videoObserver.observe(video);
        });
    }

    // --- Gym Working Hours Status Calculation ---
    function updateGymOpenStatus() {
        const liveStatusText = document.getElementById('live-status-text');
        const liveStatusDot = document.getElementById('live-status-dot');

        if (!liveStatusText || !liveStatusDot) return;

        const now = new Date();
        const day = now.getDay();
        const hour = now.getHours();
        const minute = now.getMinutes();
        const currentTimeInMinutes = hour * 60 + minute;

        if (day === 0) {
            liveStatusText.textContent = "CLOSED TODAY (SUNDAY)";
            liveStatusText.className = "text-red";
            liveStatusDot.classList.add('closed');
        } else {
            const isMorningSession = currentTimeInMinutes >= 300 && currentTimeInMinutes < 720;
            const isEveningSession = currentTimeInMinutes >= 960 && currentTimeInMinutes < 1320;

            if (isMorningSession || isEveningSession) {
                liveStatusText.textContent = "OPEN NOW (ACTIVE SESSION)";
                liveStatusText.className = "text-green";
                liveStatusDot.classList.remove('closed');
            } else {
                liveStatusText.textContent = "CLOSED NOW (OPENS 5 AM / 4 PM)";
                liveStatusText.className = "text-copper";
                liveStatusDot.classList.add('closed');
            }
        }
    }

    updateGymOpenStatus();
    setInterval(updateGymOpenStatus, 60000);

    // --- Center Review Card Magnification Tracker (IntersectionObserver Optimized) ---
    const reviewsSection = document.getElementById('reviews');
    const reviewsContainer = document.getElementById('reviews-carousel-container');
    const reviewCards = document.querySelectorAll('.review-glass-card');
    let reviewAnimFrame = null;

    function highlightCenterReview() {
        if (!reviewsContainer || reviewCards.length === 0) return;

        const containerRect = reviewsContainer.getBoundingClientRect();
        const containerCenterX = containerRect.left + containerRect.width / 2;

        let closestCard = null;
        let minDistance = Infinity;

        reviewCards.forEach(card => {
            const cardRect = card.getBoundingClientRect();
            const cardCenterX = cardRect.left + cardRect.width / 2;
            const distance = Math.abs(containerCenterX - cardCenterX);

            if (distance < minDistance) {
                minDistance = distance;
                closestCard = card;
            }
        });

        reviewCards.forEach(card => {
            if (card === closestCard && minDistance < containerRect.width * 0.25) {
                card.classList.add('in-center');
            } else {
                card.classList.remove('in-center');
            }
        });

        reviewAnimFrame = requestAnimationFrame(highlightCenterReview);
    }

    if (reviewsSection && 'IntersectionObserver' in window) {
        const reviewObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (!reviewAnimFrame) reviewAnimFrame = requestAnimationFrame(highlightCenterReview);
                } else {
                    if (reviewAnimFrame) {
                        cancelAnimationFrame(reviewAnimFrame);
                        reviewAnimFrame = null;
                    }
                }
            });
        }, { threshold: 0.1 });
        reviewObserver.observe(reviewsSection);
    } else {
        requestAnimationFrame(highlightCenterReview);
    }

    // --- Pricing Billing Switch ---
    const billingSwitch = document.getElementById('billing-switch');
    const labelMonthly = document.getElementById('label-monthly');
    const labelAnnual = document.getElementById('label-annual');
    const priceAmounts = document.querySelectorAll('.amount');

    let isAnnual = true;

    if (billingSwitch) {
        billingSwitch.addEventListener('click', () => {
            isAnnual = !isAnnual;
            billingSwitch.classList.toggle('annual', isAnnual);

            if (isAnnual) {
                labelAnnual.classList.add('active');
                labelMonthly.classList.remove('active');
            } else {
                labelMonthly.classList.add('active');
                labelAnnual.classList.remove('active');
            }

            priceAmounts.forEach(el => {
                const targetVal = isAnnual ? el.getAttribute('data-annual') : el.getAttribute('data-monthly');
                if (targetVal) el.textContent = targetVal;
            });
        });
    }

    // --- Interactive Body Metrics Calculator ---
    const bmiForm = document.getElementById('bmi-form');
    if (bmiForm) {
        bmiForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const heightCm = parseFloat(document.getElementById('calc-height').value);
            const weightKg = parseFloat(document.getElementById('calc-weight').value);
            const age = parseInt(document.getElementById('calc-age').value);
            const gender = document.getElementById('calc-gender').value;
            const activity = parseFloat(document.getElementById('calc-activity').value);

            if (!heightCm || !weightKg) return;

            const heightM = heightCm / 100;
            const bmi = (weightKg / (heightM * heightM)).toFixed(1);

            let status = 'NORMAL WEIGHT';
            let statusColor = '#00ff88';
            if (bmi < 18.5) { status = 'UNDERWEIGHT'; statusColor = '#D47A5B'; }
            else if (bmi >= 25 && bmi < 29.9) { status = 'OVERWEIGHT'; statusColor = '#D47A5B'; }
            else if (bmi >= 30) { status = 'OBESE'; statusColor = '#ff3366'; }

            let bmr = 10 * weightKg + 6.25 * heightCm - 5 * age;
            bmr = gender === 'male' ? bmr + 5 : bmr - 161;

            const tdee = Math.round(bmr * activity);
            const protein = Math.round(weightKg * 2.0);

            document.getElementById('res-bmi').textContent = bmi;
            const resStatus = document.getElementById('res-bmi-status');
            resStatus.textContent = status;
            resStatus.style.color = statusColor;

            document.getElementById('res-calories').textContent = tdee.toLocaleString();
            document.getElementById('res-protein').textContent = protein;

            showToast(`Metrics Calculated! Daily TDEE: ${tdee} kcal`);
        });
    }

    // --- FAQ Accordion ---
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.parentElement;
            const isActive = item.classList.contains('active');
            document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
            if (!isActive) item.classList.add('active');
        });
    });

    // --- Membership Modal ---
    const modal = document.getElementById('plan-modal');
    const modalClose = document.getElementById('modal-close');
    const modalPlanTitle = document.getElementById('modal-plan-title');
    const selectButtons = document.querySelectorAll('.btn-plan-select');

    selectButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const planName = btn.getAttribute('data-plan') || 'Membership';
            if (modalPlanTitle) modalPlanTitle.textContent = `${planName.toUpperCase()} REGISTRATION`;
            if (modal) modal.classList.add('active');
        });
    });

    if (modalClose) {
        modalClose.addEventListener('click', () => {
            if (modal) modal.classList.remove('active');
        });
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('active');
        });
    }

    const modalForm = document.getElementById('modal-form');
    if (modalForm) {
        modalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (modal) modal.classList.remove('active');
            showToast('Welcome to Peter\'s Gym! Registration Confirmation Sent.');
            modalForm.reset();
        });
    }

    // --- Contact Form ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast('Inquiry Received! Our Team Will Contact You Shortly.');
            contactForm.reset();
        });
    }



    // --- 1. Glassy Stretch Animation on Scroll for Pricing / Membership Section ---
    const membershipSection = document.getElementById('membership');
    if (membershipSection && 'IntersectionObserver' in window) {
        const stretchObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    membershipSection.classList.add('stretched');
                } else {
                    membershipSection.classList.remove('stretched');
                }
            });
        }, { threshold: 0.15 });
        stretchObserver.observe(membershipSection);
    }

    // --- Stat Counter Animation (0 -> 5,000+ Fast Auto Count) ---
    const counterEl = document.getElementById('stat-counter-5000');
    let counterAnimated = false;

    if (counterEl && 'IntersectionObserver' in window) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !counterAnimated) {
                    counterAnimated = true;
                    const target = parseInt(counterEl.getAttribute('data-target') || '5000', 10);
                    const duration = 1400; // Fast auto count 1.4 seconds
                    const startTime = performance.now();

                    function updateCounter(currentTime) {
                        const elapsedTime = currentTime - startTime;
                        const progress = Math.min(elapsedTime / duration, 1);
                        // Ease Out Quad
                        const easeProgress = progress * (2 - progress);
                        const currentVal = Math.floor(easeProgress * target);

                        counterEl.textContent = currentVal.toLocaleString() + '+';

                        if (progress < 1) {
                            requestAnimationFrame(updateCounter);
                        } else {
                            counterEl.textContent = target.toLocaleString() + '+';
                        }
                    }

                    requestAnimationFrame(updateCounter);
                }
            });
        }, { threshold: 0.3 });

        counterObserver.observe(counterEl);
    }

    // --- Progressive Line-by-Line Unmask Scroll & Parallax Handler ---
    const unmaskSection = document.getElementById('unmask-philosophy');
    const unmaskLines = document.querySelectorAll('.unmask-line');
    const unmaskParallaxBg = document.getElementById('unmask-parallax-bg');

    function handleUnmaskScroll() {
        if (!unmaskSection) return;
        const rect = unmaskSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Check if section is visible in viewport
        if (rect.top < windowHeight && rect.bottom > 0) {
            // Calculate scroll progress from 0 (just entered) to 1 (passed through)
            const progress = (windowHeight - rect.top) / (windowHeight + rect.height);
            
            // Parallax background movement
            if (unmaskParallaxBg) {
                const bgOffset = (progress - 0.5) * 60;
                unmaskParallaxBg.style.transform = `translateY(${bgOffset}px)`;
            }

            // Progressive line-by-line unmask reveal across 3 scroll stages:
            // Stage 1 (0.22 - 0.35): Lines 1-3 reveal
            // Stage 2 (0.35 - 0.50): Lines 4-6 reveal
            // Stage 3 (0.50 - 0.70): Lines 7-10 reveal whole
            unmaskLines.forEach((line, idx) => {
                const lineThreshold = 0.20 + (idx * 0.045);
                if (progress >= lineThreshold) {
                    line.classList.add('revealed');
                } else {
                    line.classList.remove('revealed');
                }
            });
        }
    }

    window.addEventListener('scroll', handleUnmaskScroll, { passive: true });
    // --- Scroll Unmask Observer for Program Included & Athlete Sections ---
    const unmaskScrollTargets = document.querySelectorAll('.unmask-scroll-target');
    if (unmaskScrollTargets.length > 0 && 'IntersectionObserver' in window) {
        const targetObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('unmasked');
                } else {
                    entry.target.classList.remove('unmasked');
                }
            });
        }, { threshold: 0.15 });

        unmaskScrollTargets.forEach(target => targetObserver.observe(target));
    }

    // --- Program Cards Scroll Ease-In Up Observer ---
    const easeUpCards = document.querySelectorAll('.scroll-ease-up');
    if (easeUpCards.length > 0 && 'IntersectionObserver' in window) {
        const easeUpObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                } else {
                    entry.target.classList.remove('in-view');
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

        easeUpCards.forEach(card => easeUpObserver.observe(card));
    }

    // --- 2. Scroll-Driven Floating Image Sequence & Parallax ---
    const facilityShowcase = document.getElementById('facility-showcase');
    const bg3dText = document.getElementById('bg-3d-text');

    function handleFacilityScrollAnimation() {
        if (!facilityShowcase) return;
        const rect = facilityShowcase.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Images assemble & follow scroll into facility section
        if (rect.top <= windowHeight * 0.8 && rect.bottom >= windowHeight * 0.2) {
            facilityShowcase.classList.add('in-view');
        } else if (rect.top > windowHeight * 0.8) {
            facilityShowcase.classList.remove('in-view');
        }

        // Middle big image slides down & disappears + 3 small images fly to corners and disappear as user scrolls towards reviews section
        if (rect.bottom <= windowHeight * 0.65) {
            facilityShowcase.classList.add('fly-corners');
        } else {
            facilityShowcase.classList.remove('fly-corners');
        }

        // Smooth Parallax movement for 3D Watermark Text "15,000 SQ FT"
        if (bg3dText && rect.top < windowHeight && rect.bottom > 0) {
            const scrollProgress = (windowHeight - rect.top) / (windowHeight + rect.height);
            const translateY = (scrollProgress - 0.5) * 45;
            const scale = 0.96 + scrollProgress * 0.08;
            if (!facilityShowcase.classList.contains('fly-corners')) {
                bg3dText.style.transform = `translateY(${translateY}px) scale(${scale})`;
            }
        }
    }

    window.addEventListener('scroll', handleFacilityScrollAnimation, { passive: true });
    handleFacilityScrollAnimation();

    // --- Pure Lottie Animation Section: Scroll-Driven Playback & Parallax Sliding ---
    const lottieSection = document.getElementById('lottie-showcase');
    const lottieWrapper = document.getElementById('lottie-parallax-wrapper');
    const desktopContainer = document.getElementById('lottie-desktop-player');
    const mobileContainer = document.getElementById('lottie-mobile-player');

    let desktopAnim = null;
    let mobileAnim = null;

    if (window.lottie) {
        if (desktopContainer) {
            desktopAnim = window.lottie.loadAnimation({
                container: desktopContainer,
                renderer: 'svg',
                loop: false,
                autoplay: false,
                path: './16-9.json'
            });
        }

        if (mobileContainer) {
            mobileAnim = window.lottie.loadAnimation({
                container: mobileContainer,
                renderer: 'svg',
                loop: false,
                autoplay: false,
                path: './9-16.json'
            });
        }
    }

    function handleLottieScroll() {
        if (!lottieSection) return;
        const rect = lottieSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        if (rect.top < windowHeight && rect.bottom > 0) {
            // Calculate scroll progress through section (0 to 1)
            const scrollProgress = Math.max(0, Math.min(1, (windowHeight - rect.top) / (windowHeight + rect.height)));

            // Parallax sliding effect
            if (lottieWrapper) {
                const translateY = (scrollProgress - 0.5) * 60;
                lottieWrapper.style.transform = `translateY(${translateY}px)`;
            }

            // Scroll-Driven Frame Scrubbing
            if (desktopAnim && desktopAnim.totalFrames) {
                const targetFrame = Math.floor(scrollProgress * desktopAnim.totalFrames);
                desktopAnim.goToAndStop(targetFrame, true);
            }

            if (mobileAnim && mobileAnim.totalFrames) {
                const targetFrame = Math.floor(scrollProgress * mobileAnim.totalFrames);
                mobileAnim.goToAndStop(targetFrame, true);
            }
        }
    }

    window.addEventListener('scroll', handleLottieScroll, { passive: true });
    handleLottieScroll();

    // Toast Helper
    function showToast(message) {
        const toast = document.getElementById('toast');
        const toastMsg = document.getElementById('toast-message');
        if (!toast || !toastMsg) return;

        toastMsg.textContent = message;
        toast.classList.add('active');

        setTimeout(() => {
            toast.classList.remove('active');
        }, 3500);
    }

    // Initialize Lucide Icons
    if (window.lucide) {
        window.lucide.createIcons();
    }
});

