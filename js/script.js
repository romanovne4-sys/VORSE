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

    // preload all images
    const imgCache = {};
    Object.entries(imgUrls).forEach(([key, src]) => {
        const img = new Image();
        img.src = src;
        imgCache[key] = img;
    });

    // mouse follow with lerp
    let mouseX = 0,
        mouseY = 0;
    let curX = 0,
        curY = 0;
    let isActive = false;
    let hideTimeout = null;

    document.addEventListener('mousemove', e => {
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

    // show image
    function showPreview(key) {
        previewInner.innerHTML = '';

        const img = imgCache[key];
        if (img && img.complete && img.naturalWidth > 0) {
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

    // hover handlers
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
            list.classList.remove('prop-list--hovered');
            items.forEach(i => i.classList.remove('prop-item--hovered'));
            hidePreview();
        }, 120);
    });


    // gsap


    gsap.registerPlugin(ScrollTrigger);


    const cards = document.querySelector('#cardsScroll');
    // Берем блок, который будем двигать по X (горизонтальная лента) #cardsScroll
    const cardItems = gsap.utils.toArray('#cardsScroll .card__scroll');
    // Берем все карточки для расчета общей ширины
    const totalWidth = () =>
        //  Считаем ширину горизонтального пути
        cardItems.reduce((acc, card) => acc + card.offsetWidth, 0) - window.innerWidth;
    // Складываем ширины всех карточек и вычитаем ширину экрана,чтобы не скроллить лишнее

    gsap.set(cards, {
        x: -totalWidth()
            // старт с конца чтоб движение было справа налево
    });

    gsap.to(cards, {
        x: 0,

        scrollTrigger: {
            trigger: '.cards',
            start: 'start start',
            end: () => `+=${totalWidth()}`,
            pin: true,
            scrub: 2
        }

    });


});