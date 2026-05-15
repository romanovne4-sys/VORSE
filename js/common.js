// для курсора
document.addEventListener('DOMContentLoaded', () => {
    const cursor = document.querySelector('.cursor');
    const trail = document.querySelector('.cursor-trail');

    if (!cursor || !trail) return;

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

    function animate() {
        cursorX += (mouseX - cursorX) * cursorSpeed;
        cursorY += (mouseY - cursorY) * cursorSpeed;

        trailX += (mouseX - trailX) * trailSpeed;
        trailY += (mouseY - trailY) * trailSpeed;

        cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;
        trail.style.transform = `translate(${trailX}px, ${trailY}px) translate(-50%, -50%)`;

        requestAnimationFrame(animate);
    }

    animate();

    const interactive = document.querySelectorAll('a, button, li, input, .form-checkbox__box, .filters');

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
});

// бургер меню

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




//  page-blackwood 
//  код для картинок, чтоб при клике по картинке - она становилась на беграунд
// пока коменирую, потому что нету картинок

// document.querySelectorAll('.photo-strip').forEach(img => {
//     img.addEventListener('click', () => {
//         document.querySelector('.header__apartament').style.backgroundImage = `url(${img.src})`;
//     });
// });

// для изменения номера секции с 3 на 2
//  (бо на 1024 меняется колво секций на странице blackwood, убирается карта)
if (
    document.body.classList.contains('page-blackwood') &&
    window.innerWidth <= 1024
) {
    document.querySelector('.contact__number').textContent = '02';
}
// page map, page search (кнопка показа/скрытия фильтров (584px)

const btn = document.querySelector('.hide-filters-btn');
const filters = document.querySelector('.filters');

let isOpen = false;

btn.addEventListener('click', () => {
    isOpen = !isOpen;

    filters.classList.toggle('active', isOpen);

    btn.textContent = isOpen ? 'HIDE FILTERS' : 'SHOW FILTERS';
});

// page search кнопка показа скрытия карты
const mapbtn = document.querySelector('.map-btn-search');
const mapsearch = document.querySelector('.search__map');

let mapOpen = false;

mapbtn.addEventListener('click', () => {
    isOpen = !isOpen;

    mapsearch.classList.toggle('active', isOpen);

    mapbtn.textContent = isOpen ? 'HIDE MAP' : 'SHOW MAP';});