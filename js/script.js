document.addEventListener('DOMContentLoaded', () => {

    const imgUrls = {
        Lofts: './images/explore-img-1.webp',
        Penthouses: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80',
        Villas: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80',
        Mansions: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80',
        Estates: 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=600&q=80'
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

    // =========================
    // PREVIEW
    // =========================
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

    // =========================
    // BOTTOM SHEET
    // =========================
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

    if (sheetClose) {
        sheetClose.addEventListener('click', closeSheet);
    }

    const overlay = bottomSheet ? bottomSheet.querySelector('.bottom-sheet__overlay') : null;

    if (overlay) {
        overlay.addEventListener('click', closeSheet);
    }

    // =========================
    // BREAKPOINTS
    // =========================
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const isTablet = window.matchMedia("(min-width: 768px) and (max-width: 1024px)").matches;
    const isDesktop = window.matchMedia("(min-width: 1025px)").matches;

    // =========================
    // DESKTOP
    // =========================
    if (isDesktop) {

        let mouseX = 0,
            mouseY = 0;
        let curX = 0,
            curY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        (function loop() {
            curX += (mouseX - curX) * 0.1;
            curY += (mouseY - curY) * 0.1;

            if (isActive) {
                const pw = 200,
                    ph = 280;
                const margin = 20,
                    offX = 36;

                const spaceRight = window.innerWidth - curX - offX;

                const x = spaceRight >= pw + margin ?
                    curX + offX :
                    curX - pw - offX;

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

        gsap.set(cards, {
            x: -totalWidth()
        });

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