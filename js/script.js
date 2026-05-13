document.addEventListener('DOMContentLoaded', () => {

    const imgUrls = {
        Lofts: './images/lofts.jpg',
        Penthouses: './images/penthouse.jpg',
        Villas: './images/villa.jpg',
        Mansions: './images/mansions.jpg',
        Estates: './images/estate.jpg',
    };

    const list = document.getElementById('propList');
    const items = document.querySelectorAll('.prop-item');

    const preview = document.getElementById('propPreview');
    const previewInner = document.getElementById('propPreviewInner');

    const bottomSheet = document.getElementById('bottomSheet');
    const sheetImage = document.getElementById('sheetImage');
    const sheetClose = document.getElementById('sheetClose');

    const imgCache = {};
    Object.entries(imgUrls).forEach(([key, src]) => {
        const img = new Image();
        img.src = src;
        imgCache[key] = img;
    });

    let isActive = false;
    let hideTimeout = null;

    function showPreview(key) {
        previewInner.innerHTML = '';

        const img = imgCache[key];
        if (img && img.src) {
            const el = document.createElement('img');
            el.src = img.src;
            el.alt = key;
            previewInner.appendChild(el);
        }

        preview.style.opacity = '1';
    }

    function hidePreview() {
        preview.style.opacity = '0';
    }

    function openSheet(key) {
        sheetImage.innerHTML = '';

        const img = imgCache[key];

        if (img && img.src) {
            const el = document.createElement('img');
            el.src = img.src;
            el.alt = key;
            sheetImage.appendChild(el);
        }

        bottomSheet.classList.add('open');
    }

    function closeSheet() {
        bottomSheet.classList.remove('open');
    }

    if (sheetClose) sheetClose.addEventListener('click', closeSheet);

    const overlay = bottomSheet ? bottomSheet.querySelector('.bottom-sheet__overlay') : null;
    if (overlay) overlay.addEventListener('click', closeSheet);

    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const isTablet = window.matchMedia("(min-width: 768px) and (max-width: 1024px)").matches;
    const isDesktop = window.matchMedia("(min-width: 1025px)").matches;

    // =========================
    // DESKTOP
    // =========================
    if (isDesktop) {

        let mouseX = 0, mouseY = 0;
        let curX = 0, curY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        (function loop() {
            curX += (mouseX - curX) * 0.1;
            curY += (mouseY - curY) * 0.1;

            if (isActive) {
                const pw = 200, ph = 280;
                const margin = 20, offX = 36;

                const spaceRight = window.innerWidth - curX - offX;

                const x = spaceRight >= pw + margin
                    ? curX + offX
                    : curX - pw - offX;

                const y = Math.min(
                    Math.max(curY - ph / 2, margin),
                    window.innerHeight - ph - margin
                );

                preview.style.transform = `translate(${x}px, ${y}px)`;
            }

            requestAnimationFrame(loop);
        })();

        items.forEach(item => {
            item.addEventListener('mouseenter', () => {
                clearTimeout(hideTimeout);

                isActive = true;

                list.classList.add('prop-list--hovered');
                items.forEach(i => i.classList.remove('prop-item--hovered'));
                item.classList.add('prop-item--hovered');

                showPreview(item.dataset.key);
            });
        });

        list.addEventListener('mouseleave', () => {
            hideTimeout = setTimeout(() => {
                isActive = false;
                hidePreview();

                list.classList.remove('prop-list--hovered');
                items.forEach(i => i.classList.remove('prop-item--hovered'));
            }, 120);
        });
    }

    // =========================
    // TABLET
    // =========================
    if (isTablet) {

        items.forEach(item => {
            item.addEventListener('mouseenter', () => {

                list.classList.add('prop-list--hovered');

                items.forEach(i => i.classList.remove('prop-item--hovered'));
                item.classList.add('prop-item--hovered');

                showPreview(item.dataset.key);
            });
        });

        list.addEventListener('mouseleave', () => {
            hidePreview();

            list.classList.remove('prop-list--hovered');
            items.forEach(i => i.classList.remove('prop-item--hovered'));
        });
    }

    // =========================
    // MOBILE
    // =========================
    if (isMobile) {

        items.forEach(item => {
            item.addEventListener('click', () => {

                const key = item.dataset.key;

                list.classList.add('prop-list--hovered');

                items.forEach(i => i.classList.remove('prop-item--hovered'));
                item.classList.add('prop-item--hovered');

                openSheet(key);
            });
        });
    }

    // =========================
    // GSAP
    // =========================
    gsap.registerPlugin(ScrollTrigger);

    if (isDesktop) {

        const cards = document.querySelector('#cardsScroll');
        if (!cards) return;

        const cardItems = gsap.utils.toArray('#cardsScroll .card__scroll');

        const totalWidth = () =>
            cardItems.reduce((acc, card) => acc + card.offsetWidth, 0) - window.innerWidth;

        gsap.set(cards, { x: -totalWidth() });

        gsap.to(cards, {
            x: 0,
            scrollTrigger: {
                trigger: '.cards',
                start: 'top top',
                end: () => `+=${totalWidth()}`,
                pin: true,
                scrub: 2
            }
        });
    }

    // =========================
    // BURGER
    // =========================
    const burger = document.querySelector('.burger');
    const menu = document.querySelector('.menu');

    if (burger && menu) {
        burger.addEventListener('click', () => {
            burger.classList.toggle('is-active');
            burger.setAttribute('aria-expanded', burger.classList.contains('is-active'));
            menu.classList.toggle('is-open');
        });

        document.querySelectorAll('.menu__link').forEach(link => {
            link.addEventListener('click', () => {
                burger.classList.remove('is-active');
                menu.classList.remove('is-open');
            });
        });
    }

});


// =========================
// CUSTOM CURSOR (FIXED)
// =========================

document.addEventListener('DOMContentLoaded', () => {

    const canUseCursor = window.matchMedia(
        "(hover: hover) and (pointer: fine)"
    ).matches;

    if (!canUseCursor) return; // ⛔ полностью отключаем на мобилках

    const cursor = document.querySelector('.cursor');
    const trail = document.querySelector('.cursor-trail');
    if (!cursor || !trail) return;

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let trailX = 0, trailY = 0;

    const cursorSpeed = 0.18;
    const trailSpeed = 0.08;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animate() {
        cursorX += (mouseX - cursorX) * cursorSpeed;
        cursorY += (mouseY - cursorY) * cursorSpeed;

        trailX += (mouseX - trailX) * trailSpeed;
        trailY += (mouseY - trailY) * trailSpeed;

        cursor.style.transform =
            `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;

        trail.style.transform =
            `translate(${trailX}px, ${trailY}px) translate(-50%, -50%)`;

        requestAnimationFrame(animate);
    }

    animate();

    const interactive = document.querySelectorAll(
        'a, button, .cards__link, li, input, .form-checkbox__box'
    );

    interactive.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('active');
            trail.classList.add('active');
        });

        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('active');
            trail.classList.remove('active');
        });
    });

    const videoEl = document.querySelector('.story__video');

    if (videoEl && !isTouchDevice) {
        videoEl.addEventListener('mouseenter', () => {
            cursor.classList.add('video');
            trail.classList.add('video');
        });
    
        videoEl.addEventListener('mouseleave', () => {
            cursor.classList.remove('video');
            trail.classList.remove('video');
        });
    }

});