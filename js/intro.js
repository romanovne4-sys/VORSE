document.body.classList.add('ready');

(function() {
    'use strict';

    function buildOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'intro-overlay';

        overlay.innerHTML = `
            <div class="intro-cards">
                <div class="intro-card intro-card--left">
                    <img src="images/intro-left.jpg" alt="">
                </div>
                <div class="intro-card intro-card--mid">
                    <img src="images/intro-mid.jpg" alt="">
                </div>
                <div class="intro-card intro-card--right">
                    <img src="images/intro-right.jpg" alt="">
                </div>
            </div>

            <div class="intro-line">
                <div class="intro-line__inner"></div>
            </div>
        `;

        document.body.insertBefore(overlay, document.body.firstChild);
        return overlay;
    }

    function runIntro() {

        const overlay = buildOverlay();

        const mid = overlay.querySelector('.intro-card--mid');
        const left = overlay.querySelector('.intro-card--left');
        const right = overlay.querySelector('.intro-card--right');
        const line = overlay.querySelector('.intro-line__inner');

        const midImg = mid.querySelector('img');
        const leftImg = left.querySelector('img');
        const rightImg = right.querySelector('img');

        const header = document.querySelector('.header');
        const logo = document.querySelector('.logo');
        const menu = document.querySelector('.menu');
        const burger = document.querySelector('.burger');
        const title1 = document.querySelector('.header__title-1');
        const title2 = document.querySelector('.header__title-2');
        const desc = document.querySelector('.header__desc');

        const isMobile = window.matchMedia('(max-width: 768px)').matches;

        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';

        const tl = gsap.timeline();

        // =====================================================
        // DESKTOP INIT
        // =====================================================
        if (!isMobile) {

            gsap.set(mid, {
                opacity: 0,
                xPercent: -50,
                yPercent: -50,
                left: "50%",
                top: "50%"
            });

            gsap.set(left, {
                opacity: 0,
                scaleY: 0,
                transformOrigin: 'bottom center'
            });

            gsap.set(right, {
                opacity: 0,
                scaleY: 0,
                transformOrigin: 'top center'
            });

            gsap.set(line, {
                scaleX: 0,
                transformOrigin: 'left center'
            });

            gsap.set([title1, title2], {
                opacity: 0,
                x: 50
            });

            gsap.set([midImg, leftImg, rightImg], {
                scale: 5.12,
                transformOrigin: 'bottom center'
            });

            if (header) gsap.set(header, { scale: 2.1, transformOrigin: 'center center' });
            if (logo) gsap.set(logo, { opacity: 0, y: -10 });
            if (menu) gsap.set(menu, { opacity: 0, y: -10 });
            if (burger) gsap.set(burger, { opacity: 0, y: -10 });
            if (desc) gsap.set(desc, { opacity: 0, y: 14 });

            // MID
            tl.to(mid, { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' }, '+=0.3');
            tl.to(midImg, { scale: 1, duration: 1.6, ease: 'power3.out' }, '<');
            tl.to(line, { scaleX: 0.3, duration: 0.5, ease: 'power2.out' }, '<');

            // RIGHT
            tl.to(right, { opacity: 1, y: 0, scaleY: 1, duration: 1.2 }, '+=0.3');
            tl.to(rightImg, { scale: 1, duration: 1.6 }, '<');
            tl.to(line, { scaleX: 0.65, duration: 0.5 }, '<');

            // LEFT
            tl.to(left, { opacity: 1, y: 0, scaleY: 1, duration: 1.2 }, '+=0.5');
            tl.to(leftImg, { scale: 1, duration: 1.6 }, '<');
            tl.to(line, { scaleX: 1, duration: 0.4 }, '<');

            // EXIT
            tl.to([left, mid], {
                scaleY: 0,
                transformOrigin: 'top center',
                duration: 0.9,
                ease: 'expo.inOut'
            }, '+=0.6');

            tl.to(right, {
                scaleY: 0,
                transformOrigin: 'bottom center'
            }, '<');

            tl.to(line, {
                scaleX: 0,
                duration: 0.45
            }, '<');

            tl.to([mid, left, right], { opacity: 0, duration: 0.15 }, '-=0.15');
        }

        // =====================================================
        // MOBILE INIT
        // =====================================================
        if (isMobile) {

            gsap.set(mid, {
                opacity: 0,
                xPercent: -50,
                yPercent: -50,
                left: "50%",
                top: "50%"
            });

            gsap.set(line, {
                scaleX: 0,
                transformOrigin: 'left center'
            });

            gsap.set(midImg, {
                scale: 5.12,
                transformOrigin: 'bottom center'
            });

            gsap.set([title1, title2], {
                opacity: 0,
                y: 20
            });

            if (logo) gsap.set(logo, { opacity: 0, y: -10 });
            if (menu) gsap.set(menu, { opacity: 0, y: -10 });
            if (burger) gsap.set(burger, { opacity: 0, y: -10 });
            if (desc) gsap.set(desc, { opacity: 0, y: 14 });

            // MID
            tl.to(mid, { opacity: 1, y: 0, duration: 1.2 }, '+=0.3');
            tl.to(midImg, { scale: 1, duration: 1.6 }, '<');

            tl.to(line, { scaleX: 1, duration: 0.85 }, '<');

            // EXIT (ОЧИЩЕНО — без дублей!)
            tl.to(mid, {
                scale: 1.05,
                y: -25,
                opacity: 0,
                duration: 0.95,
                ease: 'power3.inOut'
            }, '+=0.6');

            tl.to(midImg, {
                scale: 1.15,
                duration: 0.95
            }, '<');

            tl.to(line, {
                scaleX: 0,
                opacity: 0,
                duration: 0.7
            }, '<');
        }

        // =====================================================
        // REMOVE OVERLAY
        // =====================================================
        tl.to(overlay, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
                document.documentElement.style.overflow = '';
                document.body.style.overflow = '';
                overlay.remove();
            }
        }, '-=0.1');

        // =====================================================
        // HEADER FIX (важно)
        // =====================================================
        if (header && !isMobile) {
            tl.to(header, {
                scale: 1,
                duration: 1.8,
                ease: 'power3.out'
            }, '+=0');
        } else if (header && isMobile) {
            gsap.set(header, { scale: 1 });
        }

        // =====================================================
        // UI REVEAL (ОДИН СЛОЙ, БЕЗ ДУБЛЕЙ)
        // =====================================================
        const uiStart = isMobile ? '+=0' : '-=1.4';

        if (logo) tl.fromTo(logo, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.8 }, uiStart);
        if (menu) tl.fromTo(menu, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.8 }, '<+0.08');
        if (burger) tl.fromTo(burger, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.8 }, '<+0.08');

        // ТИТЛЫ — ЕДИНЫЙ СТИЛЬ (без дублей логики)
        const titleFrom = isMobile
        ? { opacity: 0, y: 18 }
        : { opacity: 0, x: 32 };
    
    const titleTo = {
        opacity: 1,
        x: 0,
        y: 0,
        
        duration: 1.15,
        ease: 'power3.out'
    };

        if (title1) tl.fromTo(title1, titleFrom, titleTo, '<+0.15');
        if (title2) tl.fromTo(title2, titleFrom, titleTo, '<+0.12');

        if (desc) tl.fromTo(desc, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.8 }, '<+0.1');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runIntro);
    } else {
        runIntro();
    }

})();