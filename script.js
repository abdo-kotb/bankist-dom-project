'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const navLinks = document.querySelector('.nav__links');

const header = document.querySelector('.header');
const nav = document.querySelector('.nav');

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.getElementById('section--1');

const sections = document.querySelectorAll('.section');

const imgs = document.querySelectorAll('[data-src]');

const tabsContainer = document.querySelector('.operations__tab-container');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContent = document.querySelectorAll('.operations__content');

const slides = document.querySelectorAll('.slide');
const btnPrev = document.querySelector('.slider__btn--left');
const btnNext = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');

///////////////////////////////////////
// Modal window

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn =>
  btn.addEventListener('click', function (el) {
    el.preventDefault();
    openModal();
  })
);

overlay.addEventListener('click', closeModal);
btnCloseModal.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeModal();
});

///////////////////////////////////////////
// page navigation

navLinks.addEventListener('click', function (e) {
  e.preventDefault();

  // Matching with the target
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// menu fade effect

const handlerHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const siblings = e.target
      .closest('.nav__links')
      .querySelectorAll('.nav__link');

    siblings.forEach(el => {
      if (el !== e.target) el.style.opacity = this;
    });
  }
};

navLinks.addEventListener('mouseover', handlerHover.bind(0.5));

navLinks.addEventListener('mouseout', handlerHover.bind(1));

// sticky navigation

const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

//////////////////////////////////
// Smooth button scrolling

btnScrollTo.addEventListener('click', function () {
  // old browsers
  // const s1coords = section1.getBoundingClientRect();
  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  // new browsers
  section1.scrollIntoView({ behavior: 'smooth' });
});

/////////////////////////////////////////////////
// Reveal sections

const revealSection = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  threshold: 0.15,
});

sections.forEach(sec => {
  // sec.classList.add('section--hidden');
  sectionObserver.observe(sec);
});

/////////////////////////////////////////////////
// Lazy-loading images
const loadImgs = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgsObserver = new IntersectionObserver(loadImgs, {
  threshold: 0,
});

imgs.forEach(img => imgsObserver.observe(img));

/////////////////////////////////////////////////
// Tapped component

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  if (!clicked) return;

  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');

  tabsContent.forEach(c => c.classList.remove('operations__content--active'));
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

////////////////////////////////////////////
// Slider

// Implementing the positions of the sliders
const slideGoTo = function (slide) {
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
  );
};

const createDots = function () {
  slides.forEach((_, i) =>
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${i}"></button>`
    )
  );
};

// Adding the active class to dots
const activateDots = function (slide) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));

  document
    .querySelector(`[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
};

const init = function () {
  slideGoTo(0);
  createDots();
  activateDots(0);
};
init();

let curSlide = 0;

const slidePrev = function () {
  curSlide === 0 ? (curSlide = slides.length - 1) : curSlide--;

  slideGoTo(curSlide);

  activateDots(curSlide);
};

btnPrev.addEventListener('click', slidePrev);

const slideNext = function () {
  curSlide === slides.length - 1 ? (curSlide = 0) : curSlide++;

  slideGoTo(curSlide);

  activateDots(curSlide);
};

btnNext.addEventListener('click', slideNext);

document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowLeft') slidePrev();
  if (e.key === 'ArrowRight') slideNext();
});

dotContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    slideGoTo(e.target.dataset.slide);

    activateDots(e.target.dataset.slide);
  }
});

setInterval(slideNext, 5000);
