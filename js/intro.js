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

        // 🔥 FIX horizontal scroll
        document.documentElement.style.overflowX = 'hidden';
        document.body.style.overflowX = 'hidden';

        // INIT
        if (isMobile) {
            gsap.set(mid, {
                opacity: 0,
                y: 30,
                xPercent: -50,
                yPercent: -50,
                willChange: "transform"
            });

            gsap.set([left, right], {
                opacity: 0
            });

        } else {
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
        }

        gsap.set(line, {
            scaleX: 0,
            transformOrigin: 'left center'
        });

        if (header && !isMobile) gsap.set(header, { scale: 2.1, transformOrigin: 'center center' });

        if (logo) gsap.set(logo, { opacity: 0, y: -10 });
        if (menu) gsap.set(menu, { opacity: 0, y: -10 });
        if (burger) gsap.set(burger, { opacity: 0, y: -10 });

        if (isMobile) {
            if (title1) gsap.set(title1, { opacity: 0, y: 20 });
            if (title2) gsap.set(title2, { opacity: 0, y: 20 });
        } else {
            if (title1) gsap.set(title1, { opacity: 0, x: 50 });
            if (title2) gsap.set(title2, { opacity: 0, x: 50 });
        }

        if (desc) gsap.set(desc, { opacity: 0, y: 14 });

        gsap.set([midImg, leftImg, rightImg], {
            scale: 5.12,
            transformOrigin: 'bottom center'
        });

        const tl = gsap.timeline();

        // MID
        tl.to(mid, {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: 'power3.out'
        }, '+=0.3');

        tl.to(midImg, { scale: 1, duration: 1.6, ease: 'power3.out' }, '<');

        // LINE + LEFT/RIGHT
        if (!isMobile) {

            tl.to(line, { scaleX: 0.3, duration: 0.5, ease: 'power2.out' }, '<+0.2');

            tl.to(right, {
                opacity: 1,
                y: 0,
                duration: 1.2,
                ease: 'power3.out'
            }, '+=0.3');

            tl.to(rightImg, { scale: 1, duration: 1.6, ease: 'power3.out' }, '<');

            tl.to(line, { scaleX: 0.65, duration: 0.5, ease: 'power2.out' }, '<+0.2');

            tl.to(left, {
                opacity: 1,
                y: 0,
                duration: 1.2,
                ease: 'power3.out'
            }, '+=0.5');

            tl.to(leftImg, { scale: 1, duration: 1.6, ease: 'power3.out' }, '<');

            tl.to(line, { scaleX: 1, duration: 0.4, ease: 'power2.out' }, '<+0.2');

        } else {

            tl.to(line, {
                scaleX: 1,
                duration: 0.8,
                ease: 'power2.out'
            }, '<+0.2');

            tl.to(line, {
                scaleX: 0,
                duration: 0.35,
                ease: 'power2.in'
            }, '+=0.2');
        }

        // EXIT (синхрон + фикс overflow)
        if (isMobile) {

            tl.addLabel('mobileExit');

            tl.to(mid, {
                scale: 0,
                opacity: 0,
                duration: 0.5,
                ease: 'power2.in',
                willChange: "transform"
            }, 'mobileExit');

            tl.to(line, {
                opacity: 0,
                duration: 0.5,
                ease: 'power2.in'
            }, 'mobileExit');

        } else {
            tl.to([mid, left, right, line], {
                opacity: 0,
                duration: 0.4,
                ease: 'power2.in'
            }, '+=0.4');
        }

        tl.to(overlay, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
                document.documentElement.style.overflow = '';
                document.body.style.overflow = '';
                document.documentElement.style.overflowX = '';
                document.body.style.overflowX = '';
                overlay.remove();
            }
        }, '-=0.1');

        // HEADER + UI
        if (header && !isMobile) {
            tl.to(header, { scale: 1, duration: 1.8, ease: 'power3.out' }, '+=0');
        }

        const uiStart = isMobile ? '+=0' : '-=1.4';

        if (logo) tl.to(logo, { opacity: 1, y: 0, duration: 0.6 }, uiStart);
        if (menu) tl.to(menu, { opacity: 1, y: 0, duration: 0.6 }, '<+0.1');
        if (burger) tl.to(burger, { opacity: 1, y: 0 }, '<');

        if (isMobile) {
            if (title1) tl.to(title1, { opacity: 1, y: 0, duration: 0.8 }, '<+0.1');
            if (title2) tl.to(title2, { opacity: 1, y: 0, duration: 0.8 }, '<+0.15');
        } else {
            if (title1) tl.to(title1, { opacity: 1, x: 0, duration: 0.8 }, '<+0.1');
            if (title2) tl.to(title2, { opacity: 1, x: 0, duration: 0.8 }, '<+0.15');
        }

        if (desc) tl.to(desc, { opacity: 1, y: 0, duration: 0.8 }, '<+0.1');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runIntro);
    } else {
        runIntro();
    }

})();