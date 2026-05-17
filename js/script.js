document.addEventListener('DOMContentLoaded', () => {

    const imgUrls = {
        Lofts: './images/lofts.webp',
        Penthouses: './images/penthouse.webp',
        Villas: './images/villa.webp',
        Mansions: './images/mansions.webp',
        Estates: './images/estate.webp',
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
        list.classList.remove('prop-list--hovered');        // добавить
        items.forEach(i => i.classList.remove('prop-item--hovered')); // добавить
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


//update may 9

document.addEventListener('DOMContentLoaded', () => {
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

  const storyWrap = document.querySelector('.story__video-wrap');
  const storyVideo = document.querySelector('.story__video');
  let initialHeight = 0;
  let wrapStart = 0;
  let animDistance = 0;
  let zoomDistance = 0;

  if (storyWrap && storyVideo) {
    initialHeight = storyVideo.offsetHeight;
    wrapStart = storyWrap.offsetTop;
    animDistance = (storyWrap.offsetHeight - window.innerHeight) * 0.5;
    zoomDistance = (storyWrap.offsetHeight - window.innerHeight) * 0.5;
  }

  function updateStory() {
    if (!storyWrap || !storyVideo) return;
    const scrollY = window.scrollY;

    if (scrollY < wrapStart) {
      storyVideo.style.position = 'absolute';
      storyVideo.style.top = '0';
      storyVideo.style.bottom = '';
      storyVideo.style.left = '0';
      storyVideo.style.width = '100%';
      storyVideo.style.height = initialHeight + 'px';
      storyVideo.style.backgroundSize = 'cover';

    } else if (scrollY >= wrapStart && scrollY <= wrapStart + animDistance) {
      const progress = (scrollY - wrapStart) / animDistance;
      const newHeight = initialHeight + (window.innerHeight - initialHeight) * progress;

      storyVideo.style.position = 'fixed';
      storyVideo.style.top = '0';
      storyVideo.style.bottom = '';
      storyVideo.style.left = '0';
      storyVideo.style.width = '100%';
      storyVideo.style.height = newHeight + 'px';
      storyVideo.style.backgroundSize = 'cover';

    } else if (scrollY > wrapStart + animDistance && scrollY <= wrapStart + animDistance + zoomDistance) {
      const zoomProgress = (scrollY - wrapStart - animDistance) / zoomDistance;
      const scale = 100 + zoomProgress * 15;

      storyVideo.style.position = 'fixed';
      storyVideo.style.top = '0';
      storyVideo.style.bottom = '';
      storyVideo.style.left = '0';
      storyVideo.style.width = '100%';
      storyVideo.style.height = window.innerHeight + 'px';
      storyVideo.style.backgroundSize = scale + '%';

    } else {
      const wrapHeight = storyWrap.offsetHeight;
      storyVideo.style.position = 'absolute';
      storyVideo.style.top = (wrapHeight - window.innerHeight) + 'px';
      storyVideo.style.bottom = '';
      storyVideo.style.left = '0';
      storyVideo.style.width = '100%';
      storyVideo.style.height = window.innerHeight + 'px';
      storyVideo.style.backgroundSize = '115%';
    }
  }

  function animate() {
    cursorX += (mouseX - cursorX) * cursorSpeed;
    cursorY += (mouseY - cursorY) * cursorSpeed;
    trailX += (mouseX - trailX) * trailSpeed;
    trailY += (mouseY - trailY) * trailSpeed;
    cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;
    trail.style.transform = `translate(${trailX}px, ${trailY}px) translate(-50%, -50%)`;
    updateStory();
    requestAnimationFrame(animate);
  }

  animate();

  const interactive = document.querySelectorAll('a, button, .cards__link, li, input, .form-checkbox__box');
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
  if (videoEl) {
    videoEl.addEventListener('mouseenter', () => {
      cursor.classList.add('video');
      trail.classList.add('video');
    });
    videoEl.addEventListener('mouseleave', () => {
      cursor.classList.remove('video');
      trail.classList.remove('video');
    });
  }


const cards = document.querySelectorAll('.card');
cards.forEach(card => {
  const img = card.querySelector('img');
  if (!img) return;

  let currentX = 0;
  let currentY = 0;
  let targetX = 0;
  let targetY = 0;
  let currentScale = 1;
  let targetScale = 1;
  const speed = 0.08;

  img.style.willChange = 'transform';

  function animate() {
    currentX += (targetX - currentX) * speed;
    currentY += (targetY - currentY) * speed;
    currentScale += (targetScale - currentScale) * speed;

    img.style.transform = `
      scale(${currentScale})
      translate(${currentX}px, ${currentY}px)
    `;
    requestAnimationFrame(animate);
  }
  animate();

  card.addEventListener('mouseenter', () => {
    targetScale = 1.15;
  });

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    targetX = x * 120;
    targetY = y * 120;
  });

  card.addEventListener('mouseleave', () => {
    targetX = 0;
    targetY = 0;
    targetScale = 1;
  });
});

});

//scroll
// scroll
const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

if (!isTouchDevice) {
  let ease = window.pageYOffset;
  let target = ease;
  let velocity = 0;
  const friction = 0.92;
  const maxSpeed = 80;

  window.addEventListener('wheel', (e) => {
    e.preventDefault();
    velocity += e.deltaY * 0.15;
    velocity = Math.max(Math.min(velocity, maxSpeed), -maxSpeed);
  }, { passive: false });

  window.addEventListener('scroll', () => {
    const native = window.pageYOffset;
    if (Math.abs(native - ease) > 5) {
      ease = native;
      target = native;
      velocity = 0;
    }
  });

  (function loop() {
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    velocity *= friction;
    target += velocity;
    target = Math.max(0, Math.min(target, maxScroll));
    ease += (target - ease) * 0.12;
    if (Math.abs(target - ease) < 0.5) ease = target;

    window.scrollTo(0, ease);
    if (Math.abs(velocity) > 0.1 || Math.abs(target - ease) > 0.5) {
      window.scrollTo(0, ease);
  }

    requestAnimationFrame(loop);

  })();
}
