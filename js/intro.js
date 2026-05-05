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

    async function runIntro() {
        const overlay = buildOverlay();
        const cardMid = overlay.querySelector('.intro-card--mid');
        const cardRight = overlay.querySelector('.intro-card--right');
        const cardLeft = overlay.querySelector('.intro-card--left');
        const line = overlay.querySelector('.intro-line__inner');

        const header = document.querySelector('.header');
        const logo = document.querySelector('.logo');
        const menu = document.querySelector('.menu');
        const burger = document.querySelector('.burger');
        const title1 = document.querySelector('.header__title-1');
        const title2 = document.querySelector('.header__title-2');
        const desc = document.querySelector('.header__desc');

        /* Блокируем скролл. overflowX: visible убирает баг с position: fixed на мобильных */
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
        document.body.style.overflowX = 'visible';

        /* хедер сразу zoom */
        if (header) header.classList.add('header--zoomed');

        await delay(200);

        /* полоска начинает расти */
        line.classList.add('is-growing');

        await delay(100);

        /* средняя карточка вырастает снизу */
        cardMid.classList.add('is-in');
        await delay(600);

        /* правая — сверху */
        cardRight.classList.add('is-in');
        await delay(600);

        /* левая — снизу */
        cardLeft.classList.add('is-in');

        /* ждём пока полоска дорастёт (2s от старта, ~1.1s осталось) */
        await delay(1100);

        /* всё исчезает одновременно — карточки + полоска */
        cardLeft.classList.add('is-out');
        cardMid.classList.add('is-out');
        cardRight.classList.add('is-out');
        line.classList.add('is-out');

        await delay(550);

        /* восстанавливаем скролл ДО того как оверлей исчезает —
           оверлей ещё перекрывает страницу, поэтому скачка не будет */
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
        document.body.style.overflowX = '';

        /* оверлей уходит, хедер начинает zoom-out */
        overlay.classList.add('is-done');
        if (header) {
            header.classList.remove('header--zoomed');
            header.classList.add('header--unzoom');
        }

        await delay(200);

        /* лого + навигация */
        if (logo) logo.classList.add('is-visible');
        if (menu) menu.classList.add('is-visible');
        if (burger) burger.classList.add('is-visible');

        await delay(500);

        /* "private" */
        if (title1) title1.classList.add('is-visible');

        await delay(600);

        /* "elevated" */
        if (title2) title2.classList.add('is-visible');

        await delay(300);

        /* описание + кнопка */
        if (desc) desc.classList.add('is-visible');

        /* чистим DOM */
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