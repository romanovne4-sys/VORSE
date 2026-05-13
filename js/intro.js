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

        // =========================
        // BLOCK SCROLL
        // =========================

        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';

        // =========================
        // HEADER ZOOM DESKTOP
        // =========================

        if (header && !isMobile) {

            gsap.set(header, {
                scale: 2.1,
                transformOrigin: 'center center'
            });
        }

        // =========================
        // INIT STATE — CARDS
        // =========================

        gsap.set(mid, {
            opacity: 0,
            scaleY: 0,
            xPercent: -50,
            transformOrigin: 'bottom center'
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

        // =========================
        // MOBILE FIX
        // =========================

        if (isMobile) {

            gsap.set(mid, {
                opacity: 0,
                scaleY: 0,
                xPercent: -50,
                yPercent: -50,
                transformOrigin: 'center center'
            });
        }

        // =========================
        // INIT STATE — IMAGES
        // =========================

        gsap.set([midImg, leftImg, rightImg], {
            scale: 5.12,
            transformOrigin: 'bottom center'
        });

        // =========================
        // TITLES
        // =========================

        if (isMobile) {

            if (title1) {
                gsap.set(title1, {
                    opacity: 0,
                    y: 20
                });
            }

            if (title2) {
                gsap.set(title2, {
                    opacity: 0,
                    y: 20
                });
            }

        } else {

            if (title1) {
                gsap.set(title1, {
                    opacity: 0,
                    x: 50
                });
            }

            if (title2) {
                gsap.set(title2, {
                    opacity: 0,
                    x: 50
                });
            }
        }

        if (desc) {

            gsap.set(desc, {
                opacity: 0,
                y: 14
            });
        }

        // =========================
        // LINE
        // =========================

        const LINE_PADDING = 0;

        gsap.set(line, {
            scaleX: 0,
            transformOrigin: 'left center',
            x: LINE_PADDING,
            width: `calc(100% - ${LINE_PADDING * 2}px)`
        });

        // =========================
        // TIMELINE
        // =========================

        const tl = gsap.timeline();

        // MID

        tl.to(mid, {
            opacity: 1,
            scaleY: 1,
            duration: 1.2,
            ease: 'power3.out'
        }, '+=0.3');

        tl.to(midImg, {
            scale: 1,
            duration: 1.6,
            ease: 'power3.out'
        }, '<');

        tl.to(line, {
            scaleX: 0.3,
            duration: 0.5,
            ease: 'power2.out'
        }, '<+0.2');

        // RIGHT

        tl.to(right, {
            opacity: 1,
            scaleY: 1,
            duration: 1.2,
            ease: 'power3.out'
        }, '+=0.3');

        tl.to(rightImg, {
            scale: 1,
            duration: 1.6,
            ease: 'power3.out'
        }, '<');

        tl.to(line, {
            scaleX: 0.65,
            duration: 0.5,
            ease: 'power2.out'
        }, '<+0.2');

        // LEFT

        tl.to(left, {
            opacity: 1,
            scaleY: 1,
            duration: 1.2,
            ease: 'power3.out'
        }, '+=0.5');

        tl.to(leftImg, {
            scale: 1,
            duration: 1.6,
            ease: 'power3.out'
        }, '<');

        tl.to(line, {
            scaleX: 1,
            duration: 0.4,
            ease: 'power2.out'
        }, '<+0.2');

        // OUT

        tl.to([mid, left, right, line], {
            opacity: 0,
            scaleY: 0,
            duration: 0.4,
            ease: 'power2.in'
        }, '+=0.6');

        // OVERLAY OUT

        tl.to(overlay, {

            opacity: 0,
            duration: 0.5,
            pointerEvents: 'none',

            onComplete: () => {

                document.documentElement.style.overflow = '';
                document.body.style.overflow = '';

                // =========================
                // SHOW UI
                // =========================

                if (logo) {
                    logo.classList.add('is-visible');
                }

                if (!isMobile && menu) {
                    menu.classList.add('is-visible');
                }

                if (isMobile && burger) {
                    burger.classList.add('is-visible');
                }

                overlay.remove();
            }

        }, '-=0.1');

        // HEADER UNZOOM DESKTOP

        if (header && !isMobile) {

            tl.to(header, {
                scale: 1,
                duration: 1.8,
                ease: 'power3.out'
            }, '-=0.3');
        }

        // TITLES

        if (isMobile) {

            tl.to(title1, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: 'power3.out'
            }, '-=0.8');

            tl.to(title2, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: 'power3.out'
            }, '<+0.15');

        } else {

            tl.to(title1, {
                opacity: 1,
                x: 0,
                duration: 0.8,
                ease: 'power3.out'
            }, '-=0.8');

            tl.to(title2, {
                opacity: 1,
                x: 0,
                duration: 0.8,
                ease: 'power3.out'
            }, '<+0.15');
        }

        tl.to(desc, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out'
        }, '<+0.1');
    }

    if (document.readyState === 'loading') {

        document.addEventListener('DOMContentLoaded', runIntro);

    } else {

        runIntro();
    }

})();