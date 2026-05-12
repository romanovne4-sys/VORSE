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

        // ─── ФИКС горизонтального скролла на мобильных ───────────────────
        // overflow-x: hidden на body ломает position: fixed на мобильных,
        // создавая новый containing block. Блокируем только вертикальный
        // скролл через overflow: hidden на html, а body оставляем visible.
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'visible'; // НЕ hidden — иначе fixed уезжает
        document.body.style.overflowX = 'hidden'; // только горизонталь для страховки
        // ─────────────────────────────────────────────────────────────────

        // =========================
        // INIT STATE — карточки
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

        if (header) gsap.set(header, { scale: 2.1, transformOrigin: 'center center' });
        if (logo) gsap.set(logo, { opacity: 0, y: -10 });
        if (menu) gsap.set(menu, { opacity: 0, y: -10 });
        if (burger) gsap.set(burger, { opacity: 0, y: -10 });
        if (title1) gsap.set(title1, { opacity: 0, x: 50 });
        if (title2) gsap.set(title2, { opacity: 0, x: 50 });
        if (desc) gsap.set(desc, { opacity: 0, y: 14 });

        const isMobile = window.matchMedia('(max-width: 768px)').matches;
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
        // INIT STATE — картинки
        // =========================

        gsap.set([midImg, leftImg, rightImg], {
            scale: 5.12,
            transformOrigin: 'bottom center'
        });

        // =========================
        // ОТСТУПЫ ПРОГРЕСС-БАРА
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

        // ── MID появляется + линия до 30% ────────────────
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

        // ── RIGHT появляется + линия до 65% ──────────────
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

        // ── LEFT появляется + линия до 100% ──────────────
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

        // ── ВЫХОД — карточки и линия ──────────────────────
        tl.to([mid, left, right, line], {
            opacity: 0,
            scaleY: 0,
            duration: 0.4,
            ease: 'power2.in'
        }, '+=0.6');

        // ─── ВОССТАНАВЛИВАЕМ СКРОЛЛ до fade-out оверлея ──────────────────
        // Оверлей ещё перекрывает страницу чёрным — скачка не будет.
        // Восстанавливаем именно здесь, чтобы position: fixed на странице
        // снова работал корректно к моменту появления UI.
        tl.call(() => {
            document.documentElement.style.overflow = '';
            document.body.style.overflow = '';
            document.body.style.overflowX = '';
        });
        // ─────────────────────────────────────────────────────────────────

        // ── ОВЕРЛЕЙ исчезает ──────────────────────────────
        tl.to(overlay, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
                overlay.remove();
            }
        }, '-=0.1');

        // ── HEADER разворачивается ────────────────────────
        if (header) {
            tl.to(header, {
                scale: 1,
                duration: 1.8,
                ease: 'power3.out'
            }, '-=0.3');
        }

        // ── UI появляется ─────────────────────────────────
        tl.to(logo, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=1.5');
        tl.to(menu, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '<+0.1');
        tl.to(burger, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '<');
        tl.to(title1, { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }, '<-0.2');
        tl.to(title2, { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }, '<+0.15');
        tl.to(desc, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '<+0.1');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runIntro);
    } else {
        runIntro();
    }

})();