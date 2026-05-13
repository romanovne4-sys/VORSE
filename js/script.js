document.addEventListener('DOMContentLoaded', () => {

    // =========================
    // TOUCH DETECT
    // =========================
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

    // =========================
    // CURSOR (ONLY DESKTOP)
    // =========================
    if (!isTouchDevice) {

        const cursorEl = document.querySelector('.cursor');
        const trailEl = document.querySelector('.cursor-trail');

        if (cursorEl) {
            cursorEl.remove();
        }

        if (trailEl) {
            trailEl.remove();
        }

        const cursor = document.querySelector('.cursor');
        const trail = document.querySelector('.cursor-trail');

        if (cursor && trail) {

            let mouseX = 0,
                mouseY = 0;
            let cursorX = 0,
                cursorY = 0;
            let trailX = 0,
                trailY = 0;

            const cursorSpeed = 0.18;
            const trailSpeed = 0.08;

            window.addEventListener('mousemove', (e) => {
                mouseX = e.clientX;
                mouseY = e.clientY;
            });

            function animateCursor() {
                cursorX += (mouseX - cursorX) * cursorSpeed;
                cursorY += (mouseY - cursorY) * cursorSpeed;
                trailX += (mouseX - trailX) * trailSpeed;
                trailY += (mouseY - trailY) * trailSpeed;

                cursor.style.transform =
                    `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;

                trail.style.transform =
                    `translate(${trailX}px, ${trailY}px) translate(-50%, -50%)`;

                requestAnimationFrame(animateCursor);
            }

            animateCursor();
        }
    }

    // =========================
    // IMAGES
    // =========================
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

    // =========================
    // PREVIEW
    // =========================
    function showPreview(key) {

        if (!previewInner || !preview) {
            return;
        }

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

        if (preview) {
            preview.style.opacity = '0';
        }
    }

    // =========================
    // BOTTOM SHEET
    // =========================
    function openSheet(key) {

        if (!sheetImage || !bottomSheet) {
            return;
        }

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

        if (bottomSheet) {
            bottomSheet.classList.remove('open');
        }
    }

    if (sheetClose) {
        sheetClose.addEventListener('click', closeSheet);
    }

    if (bottomSheet) {

        const overlay = bottomSheet.querySelector('.bottom-sheet__overlay');

        if (overlay) {
            overlay.addEventListener('click', closeSheet);
        }
    }

    // =========================
    // BREAKPOINTS
    // =========================
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const isTablet = window.matchMedia("(min-width: 768px) and (max-width: 1024px)").matches;
    const isDesktop = window.matchMedia("(min-width: 1025px)").matches;

    // =========================
    // DESKTOP PREVIEW
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

        function loop() {

            curX += (mouseX - curX) * 0.1;
            curY += (mouseY - curY) * 0.1;

            if (isActive && preview) {

                const pw = 200;
                const ph = 280;

                const margin = 20;
                const offX = 36;

                const spaceRight = window.innerWidth - curX - offX;

                let x;

                if (spaceRight >= pw + margin) {
                    x = curX + offX;
                } else {
                    x = curX - pw - offX;
                }

                const y = Math.min(
                    Math.max(curY - ph / 2, margin),
                    window.innerHeight - ph - margin
                );

                preview.style.transform = `translate(${x}px, ${y}px)`;
            }

            requestAnimationFrame(loop);
        }

        loop();

        items.forEach(item => {

            item.addEventListener('mouseenter', () => {

                clearTimeout(hideTimeout);

                isActive = true;

                if (list) {
                    list.classList.add('prop-list--hovered');
                }

                items.forEach(i => {
                    i.classList.remove('prop-item--hovered');
                });

                item.classList.add('prop-item--hovered');

                showPreview(item.dataset.key);
            });
        });

        if (list) {

            list.addEventListener('mouseleave', () => {

                hideTimeout = setTimeout(() => {

                    isActive = false;

                    hidePreview();

                    list.classList.remove('prop-list--hovered');

                    items.forEach(i => {
                        i.classList.remove('prop-item--hovered');
                    });

                }, 120);
            });
        }
    }

    // =========================
    // TABLET
    // =========================
    if (isTablet) {

        items.forEach(item => {

            item.addEventListener('mouseenter', () => {

                if (list) {
                    list.classList.add('prop-list--hovered');
                }

                items.forEach(i => {
                    i.classList.remove('prop-item--hovered');
                });

                item.classList.add('prop-item--hovered');

                showPreview(item.dataset.key);
            });
        });

        if (list) {

            list.addEventListener('mouseleave', () => {

                hidePreview();

                list.classList.remove('prop-list--hovered');

                items.forEach(i => {
                    i.classList.remove('prop-item--hovered');
                });
            });
        }
    }

    // =========================
    // MOBILE
    // =========================
    if (isMobile) {

        items.forEach(item => {

            item.addEventListener('click', () => {

                const key = item.dataset.key;

                if (list) {
                    list.classList.add('prop-list--hovered');
                }

                items.forEach(i => {
                    i.classList.remove('prop-item--hovered');
                });

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

        if (cards) {

            const cardItems = gsap.utils.toArray('#cardsScroll .card__scroll');

            const totalWidth = () => {
                return cardItems.reduce((acc, card) => {
                    return acc + card.offsetWidth;
                }, 0) - window.innerWidth;
            };

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
    }

    // =========================
    // BURGER MENU
    // =========================
    const burger = document.querySelector('.burger');
    const menu = document.querySelector('.menu');

    if (burger && menu) {

        burger.addEventListener('click', () => {

            burger.classList.toggle('is-active');

            burger.setAttribute(
                'aria-expanded',
                burger.classList.contains('is-active')
            );

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