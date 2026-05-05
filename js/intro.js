(function() {
    'use strict';

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function buildOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'intro-overlay';
        overlay.innerHTML = `
            <div class="intro-cards">
                <div class="intro-card intro-card--left">
                    <img src="images/intro-left.jpg" alt="" aria-hidden="true">
                </div>
                <div class="intro-card intro-card--mid">
                    <img src="images/intro-mid.jpg" alt="" aria-hidden="true">
                </div>
                <div class="intro-card intro-card--right">
                    <img src="images/intro-right.jpg" alt="" aria-hidden="true">
                </div>
            </div>
            <div class="intro-line">
                <div class="intro-line__inner"></div>
            </div>
        `;
        document.body.insertBefore(overlay, document.body.firstChild);
        return overlay;
    }

    function setLineWidth(overlay) {
        const mid = overlay.querySelector('.intro-card--mid');
        const left = overlay.querySelector('.intro-card--left');
        const right = overlay.querySelector('.intro-card--right');
        const line = overlay.querySelector('.intro-line__inner');

        if (!mid || !line) return;

        const isMobile = window.matchMedia("(max-width: 768px)").matches;

        let width = 0;

        if (isMobile) {
            // 📱 мобильная версия — только центральная карточка
            const rectMid = mid.getBoundingClientRect();
            width = rectMid.width;
        } else {
            // 💻 desktop — от левой до правой
            const rectLeft = left.getBoundingClientRect();
            const rectRight = right.getBoundingClientRect();
            width = rectRight.right - rectLeft.left;
        }

        line.style.width = width + 'px';
    }

    async function runIntro() {
        const overlay = buildOverlay();

        const cardMid = overlay.querySelector('.intro-card--mid');
        const cardRight = overlay.querySelector('.intro-card--right');
        const cardLeft = overlay.querySelector('.intro-card--left');
        const line = overlay.querySelector('.intro-line__inner');

        const header = document.querySelector('.header');
        const logo = document.querySelector('.header .logo');
        const menu = document.querySelector('.menu');
        const burger = document.querySelector('.burger');
        const title1 = document.querySelector('.header__title-1');
        const title2 = document.querySelector('.header__title-2');
        const desc = document.querySelector('.header__desc');

        // блок скролла
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
        document.body.style.overflowX = 'visible';

        if (header) header.classList.add('header--zoomed');

        await delay(100);

        // ⚡ считаем ширину линии
        setLineWidth(overlay);

        // пересчёт при ресайзе
        window.addEventListener('resize', () => setLineWidth(overlay));

        line.classList.add('is-growing');

        await delay(100);

        cardMid.classList.add('is-in');
        await delay(600);

        cardRight.classList.add('is-in');
        await delay(600);

        cardLeft.classList.add('is-in');

        await delay(1100);

        cardLeft.classList.add('is-out');
        cardMid.classList.add('is-out');
        cardRight.classList.add('is-out');
        line.classList.add('is-out');

        await delay(550);

        // разблок скролла
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
        document.body.style.overflowX = '';

        overlay.classList.add('is-done');

        if (header) {
            header.classList.remove('header--zoomed');
            header.classList.add('header--unzoom');
        }

        await delay(200);

        if (logo) logo.classList.add('is-visible');
        if (menu) menu.classList.add('is-visible');
        if (burger) burger.classList.add('is-visible');

        await delay(500);

        if (title1) title1.classList.add('is-visible');

        await delay(600);

        if (title2) title2.classList.add('is-visible');

        await delay(300);

        if (desc) desc.classList.add('is-visible');

        await delay(700);

        overlay.remove();
        if (header) header.classList.remove('header--unzoom');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runIntro);
    } else {
        runIntro();
    }

})();