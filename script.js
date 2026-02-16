/** opora-prava.com */
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');
const navClose = document.getElementById('navClose');
const navLinks = document.querySelectorAll('.nav__link');
const header = document.querySelector('.header');
const heroImage = document.getElementById('heroImage');
const heroImageImg = document.getElementById('heroImageImg');

const runWhenIdle = (callback, timeout = 1500) => {
    if (typeof window.requestIdleCallback === 'function') {
        window.requestIdleCallback(callback, { timeout });
        return;
    }
    setTimeout(callback, 1);
};

function closeNavMenu() {
    if (burger && nav) {
        burger.classList.remove('active');
        nav.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function openNavMenu() {
    if (burger && nav) {
        burger.classList.add('active');
        nav.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

if (burger && nav) {
    burger.addEventListener('click', (e) => {
        e.stopPropagation();
        if (nav.classList.contains('active')) {
            closeNavMenu();
        } else {
            openNavMenu();
        }
    });

    if (navClose) {
        navClose.addEventListener('click', (e) => {
            e.stopPropagation();
            closeNavMenu();
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            setTimeout(() => {
                closeNavMenu();
            }, 100);
        });
    });

    nav.addEventListener('click', (e) => {
        if (e.target === nav) {
            closeNavMenu();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && nav.classList.contains('active')) {
            closeNavMenu();
        }
    });

    const navHeader = nav.querySelector('.nav__header');
    const navContent = nav.querySelector('.nav__list');
    const navFooter = nav.querySelector('.nav__footer');
    
    if (navHeader) {
        navHeader.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
    
    if (navContent) {
        navContent.addEventListener('click', (e) => {
            if (!e.target.classList.contains('nav__link')) {
                e.stopPropagation();
            }
        });
    }
    
    if (navFooter) {
        navFooter.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
}

let cachedHeaderHeight = 0;

function getHeaderHeight() {
    if (cachedHeaderHeight > 0) {
        return cachedHeaderHeight;
    }
    if (header) {
        cachedHeaderHeight = header.offsetHeight || 0;
    }
    return cachedHeaderHeight;
}

let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        cachedHeaderHeight = header?.offsetHeight || 0;
    }, 150);
}, { passive: true });

function scrollToTarget(target) {
    if (!target) return;
    const headerHeight = getHeaderHeight();
    const targetPosition = target.offsetTop - headerHeight;
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
}

const pathToSection = {
    '/': '#main',
    '/glavnaya': '#main',
    '/uslugi': '#services',
    '/komanda': '#team',
    '/etapy-vozvrata': '#stages',
    '/otzyvy': '#reviews',
    '/faq': '#faq',
    '/kontakty': '#contacts'
};

const sectionToPath = {
    'main': '/glavnaya',
    'services': '/uslugi',
    'team': '/komanda',
    'stages': '/etapy-vozvrata',
    'reviews': '/otzyvy',
    'faq': '/faq',
    'contacts': '/kontakty'
};

function getSectionFromPath(pathname) {
    const path = pathname.replace(/\/$/, '') || '/';
    return pathToSection[path];
}

function scrollToSectionByPath(pathname) {
    const selector = getSectionFromPath(pathname);
    if (selector) {
        const target = document.querySelector(selector);
        scrollToTarget(target);
    }
}

function handleSectionLinkClick(e) {
    const href = this.getAttribute('href');
    if (!href) return;
    let pathname = href;
    let selector = null;
    if (href.startsWith('#')) {
        if (href === '#' || href.length <= 1) return;
        selector = href;
        const sectionId = href.slice(1);
        pathname = sectionToPath[sectionId] || '/';
    } else if (href.startsWith('/')) {
        pathname = href.split('?')[0].replace(/\/$/, '') || '/';
        selector = pathToSection[pathname];
    }
    if (selector && document.querySelector(selector)) {
        e.preventDefault();
        scrollToTarget(document.querySelector(selector));
        history.pushState({ path: pathname }, '', pathname);
    }
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', handleSectionLinkClick);
});

document.querySelectorAll('.nav__link, .footer__link').forEach(anchor => {
    const href = anchor.getAttribute('href');
    if (href && href.startsWith('/')) {
        const path = href.split('?')[0].replace(/\/$/, '') || '/';
        if (pathToSection[path]) {
            anchor.addEventListener('click', handleSectionLinkClick);
        }
    }
});

window.addEventListener('popstate', () => {
    scrollToSectionByPath(window.location.pathname);
});

function initSectionFromUrl() {
    const pathname = window.location.pathname;
    if (getSectionFromPath(pathname)) {
        requestAnimationFrame(() => {
            scrollToSectionByPath(pathname);
        });
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSectionFromUrl);
} else {
    initSectionFromUrl();
}

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let lastScrollY = 0;
let scrollDirection = 'down';

const initScrollY = () => {
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            lastScrollY = window.pageYOffset || window.scrollY || 0;
        });
    });
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollY);
} else {
    initScrollY();
}

window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up';
    lastScrollY = currentScrollY;
}, { passive: true });

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            if (entry.target.classList.contains('hero__text')) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, 100);
            } else if (entry.target.classList.contains('hero__form-wrapper') || 
                       entry.target.classList.contains('contacts__form-wrapper')) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, 300);
            } else if (entry.target.classList.contains('reviews__content')) {
                requestAnimationFrame(() => {
                    entry.target.classList.add('visible');
                    const reviewCards = entry.target.querySelectorAll('.review-card');
                    reviewCards.forEach((card, index) => {
                        setTimeout(() => {
                            card.classList.add('review-card--animated');
                        }, 200 + (index * 80));
                    });
                });
            } else {
                entry.target.classList.add('visible');
            }
        } else {
            const isHeroElement = entry.target.classList.contains('hero__text') || 
                                 entry.target.classList.contains('hero__form-wrapper') ||
                                 entry.target.classList.contains('hero__image') ||
                                 entry.target.classList.contains('contacts__form-wrapper');
            
            if (scrollDirection === 'up' && entry.target.classList.contains('visible') && !isHeroElement) {
                entry.target.classList.remove('visible');
            }
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => {
    if (prefersReducedMotion) {
        el.classList.add('visible');
    } else {
        observer.observe(el);
    }
});

const timelineItems = document.querySelectorAll('.timeline__item.fade-in');
timelineItems.forEach((item, index) => {
    if (!prefersReducedMotion) {
        item.style.transitionDelay = `${index * 150}ms`;
    }
});


const reviewTrack = document.getElementById('reviewTrack');
const reviewPrev = document.getElementById('reviewPrev');
const reviewNext = document.getElementById('reviewNext');
const reviewDots = document.getElementById('reviewDots');
const reviewCards = document.querySelectorAll('.reviews__track .review-card');

let currentReview = 0;

let cachedCardWidth = 0;

function getCardWidth() {
    if (cachedCardWidth > 0 && reviewTrack) {
        return cachedCardWidth;
    }
    if (reviewTrack && cachedCardWidth === 0) {
        const rect = reviewTrack.getBoundingClientRect();
        cachedCardWidth = rect.width || reviewTrack.offsetWidth;
    }
    return cachedCardWidth;
}

function updateReviewCarousel() {
    if (!reviewTrack || reviewCards.length === 0) return;
    
    const cardWidth = getCardWidth();
    const targetScroll = currentReview * cardWidth;
    
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            if ('scrollBehavior' in document.documentElement.style) {
                reviewTrack.scrollTo({
                    left: targetScroll,
                    behavior: 'smooth'
                });
            } else {
                requestAnimationFrame(() => {
                    reviewTrack.scrollLeft = targetScroll;
                });
            }
            
            const dots = reviewDots?.querySelectorAll('.reviews__dot');
            if (dots) {
                dots.forEach((dot, index) => {
                    if (index === currentReview) {
                        dot.classList.add('active');
                    } else {
                        dot.classList.remove('active');
                    }
                });
            }
            
            if (reviewPrev) {
                const isFirst = currentReview === 0;
                reviewPrev.style.opacity = isFirst ? '0.5' : '1';
                reviewPrev.style.pointerEvents = isFirst ? 'none' : 'auto';
                reviewPrev.setAttribute('aria-disabled', isFirst ? 'true' : 'false');
            }
            
            if (reviewNext) {
                const isLast = currentReview === reviewCards.length - 1;
                reviewNext.style.opacity = isLast ? '0.5' : '1';
                reviewNext.style.pointerEvents = isLast ? 'none' : 'auto';
                reviewNext.setAttribute('aria-disabled', isLast ? 'true' : 'false');
            }
        });
    });
}

function goToReview(index) {
    if (index < 0 || index >= reviewCards.length) return;
    currentReview = index;
    updateReviewCarousel();
}

function nextReview() {
    if (currentReview < reviewCards.length - 1) {
        currentReview++;
        updateReviewCarousel();
    }
}

function prevReview() {
    if (currentReview > 0) {
        currentReview--;
        updateReviewCarousel();
    }
}

let reviewTouchStartX = 0;
let reviewTouchEndX = 0;
let isReviewScrolling = false;

function handleReviewSwipe() {
    const swipeThreshold = 50;
    const diff = reviewTouchStartX - reviewTouchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            nextReview();
        } else {
            prevReview();
        }
    }
}

const initReviews = () => {
    if (reviewCards.length > 0 && reviewDots) {
        reviewCards.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = 'reviews__dot' + (index === 0 ? ' active' : '');
            dot.setAttribute('aria-label', `Перейти к отзыву ${index + 1}`);
            dot.addEventListener('click', () => goToReview(index));
            reviewDots.appendChild(dot);
        });
    }

    if (reviewTrack) {
        if (typeof ResizeObserver !== 'undefined') {
            const resizeObserver = new ResizeObserver(() => {
                requestAnimationFrame(() => {
                    cachedCardWidth = reviewTrack.offsetWidth;
                });
            });
            resizeObserver.observe(reviewTrack);
        } else {
            let resizeTimeout;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(() => {
                    requestAnimationFrame(() => {
                        cachedCardWidth = reviewTrack.offsetWidth;
                    });
                }, 150);
            }, { passive: true });
        }
    }

    if (reviewNext) {
        reviewNext.addEventListener('click', nextReview);
    }

    if (reviewPrev) {
        reviewPrev.addEventListener('click', prevReview);
    }

    if (reviewTrack) {
        reviewTrack.addEventListener('touchstart', (e) => {
            reviewTouchStartX = e.changedTouches[0].screenX;
            isReviewScrolling = false;
        }, { passive: true });

        reviewTrack.addEventListener('touchmove', () => {
            isReviewScrolling = true;
        }, { passive: true });

        reviewTrack.addEventListener('touchend', (e) => {
            if (!isReviewScrolling) {
                reviewTouchEndX = e.changedTouches[0].screenX;
                handleReviewSwipe();
            }
        }, { passive: true });
    }

    if (reviewTrack) {
        let scrollTimeout;
        reviewTrack.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                requestAnimationFrame(() => {
                    const cardWidth = getCardWidth();
                    const scrollLeft = reviewTrack.scrollLeft;
                    const newIndex = Math.round(scrollLeft / cardWidth);
                    if (newIndex !== currentReview && newIndex >= 0 && newIndex < reviewCards.length) {
                        currentReview = newIndex;
                        requestAnimationFrame(() => {
                            const dots = reviewDots?.querySelectorAll('.reviews__dot');
                            if (dots) {
                                dots.forEach((dot, index) => {
                                    dot.classList.toggle('active', index === currentReview);
                                });
                            }
                        });
                    }
                });
            }, 100);
        }, { passive: true });
    }

    if (reviewCards.length > 0) {
        const initCarousel = () => {
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    if (reviewTrack) {
                        const rect = reviewTrack.getBoundingClientRect();
                        cachedCardWidth = rect.width || 0;
                    }
                    updateReviewCarousel();
                });
            });
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initCarousel);
        } else {
            initCarousel();
        }
    }
};

const initFAQ = () => {
    const faqQuestions = document.querySelectorAll('.faq__question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const item = question.closest('.faq__item');
            const isExpanded = question.getAttribute('aria-expanded') === 'true';
            
            faqQuestions.forEach(q => {
                if (q !== question) {
                    const otherItem = q.closest('.faq__item');
                    if (otherItem.classList.contains('active')) {
                        q.setAttribute('aria-expanded', 'false');
                        otherItem.classList.remove('active');
                    }
                }
            });
            
            question.setAttribute('aria-expanded', !isExpanded ? 'true' : 'false');
            item.classList.toggle('active', !isExpanded);
        });
        
        question.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                question.click();
            }
        });
    });
};

runWhenIdle(initReviews);
runWhenIdle(initFAQ);

function openJivoChat() {
    if (typeof jivo_api !== 'undefined') {
        jivo_api.open();
    } else {
        const checkJivo = setInterval(() => {
            if (typeof jivo_api !== 'undefined') {
                jivo_api.open();
                clearInterval(checkJivo);
            }
        }, 100);
        
        setTimeout(() => {
            clearInterval(checkJivo);
        }, 5000);
    }
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closePopup();
    }
});

const popup = document.getElementById('popup');
const popupClose = document.getElementById('popupClose');
const popupForm = document.getElementById('popupForm');

const POPUP_STORAGE_KEY = 'opora_prava_popup_shown';
const POPUP_DELAY = 30000;
const POPUP_COOLDOWN = 24 * 60 * 60 * 1000;

function shouldShowPopup() {
    const lastShown = localStorage.getItem(POPUP_STORAGE_KEY);
    if (!lastShown) return true;
    
    const lastShownTime = parseInt(lastShown, 10);
    const now = Date.now();
    return (now - lastShownTime) > POPUP_COOLDOWN;
}

function showPopup() {
    if (popup && shouldShowPopup()) {
        popup.classList.add('active');
        document.body.style.overflow = 'hidden';
        localStorage.setItem(POPUP_STORAGE_KEY, Date.now().toString());
    }
}

function closePopup() {
    if (popup) {
        popup.classList.remove('active');
        document.body.style.overflow = '';
    }
}

if (popupClose) {
    popupClose.addEventListener('click', closePopup);
}

if (popup) {
    popup.addEventListener('click', (e) => {
        if (e.target === popup || e.target.classList.contains('popup__overlay')) {
            closePopup();
        }
    });
}

const cookiePopup = document.getElementById('cookiePopup');
const cookieAccept = document.getElementById('cookieAccept');
const cookieReject = document.getElementById('cookieReject');

const COOKIE_CONSENT_KEY = 'opora_prava_cookie_consent';

function hasCookieConsent() {
    return localStorage.getItem(COOKIE_CONSENT_KEY) !== null;
}

function showCookiePopup() {
    if (cookiePopup && !hasCookieConsent()) {
        setTimeout(() => {
            cookiePopup.classList.add('active');
        }, 1000);
    }
}

function hideCookiePopup() {
    if (cookiePopup) {
        cookiePopup.classList.remove('active');
    }
}

function acceptCookies() {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
    hideCookiePopup();
}

function rejectCookies() {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'rejected');
    hideCookiePopup();
}

if (cookieAccept) {
    cookieAccept.addEventListener('click', acceptCookies);
}

if (cookieReject) {
    cookieReject.addEventListener('click', rejectCookies);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', showCookiePopup);
} else {
    showCookiePopup();
}

const heroForm = document.getElementById('heroForm');
const contactsForm = document.getElementById('contactsForm');
const forms = [heroForm, popupForm, contactsForm].filter(Boolean);
const FORM_NOTICE_ID = 'oporaPravaFormNotice';
const phoneInputs = document.querySelectorAll('input[name="phone"]');
const phoneInstances = new Map();

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxBoismlL2vju4GaWJtLuDLmFkQtzdf9WO1cOtPMVqFmBkgXWG0joJaXRIMEEsetKpieA/exec';
const GCLID_STORAGE_KEY = 'opora_prava_gclid';

// Cloudflare Turnstile Site Key (замініть на свій ключ)
const TURNSTILE_SITE_KEY = '0x4AAAAAACYpe5iZG3zFKbyk';

const TRACKING_PARAMS = [
    'gbraid',
    'gad_campaignid',
    'gad_adgroupid',
    'gad_adid',
    'gad_source',
    'review',
];

const CONVERSION_PARAM_MAP = {
    conversion_name: 'Conversion Name',
    conversion_time: 'Conversion Time',
    conversion_value: 'Conversion Value',
    conversion_currency: 'Conversion Currency',
};

function getUrlParamCaseInsensitive(paramName) {
    const params = new URLSearchParams(window.location.search);
    for (const [key, value] of params.entries()) {
        if (key.toLowerCase() === paramName.toLowerCase()) {
            return value;
        }
    }
    return '';
}

function getGclidFromUrl() {
    const urlGclid = getUrlParamCaseInsensitive('gclid');
    if (urlGclid) {
        localStorage.setItem(GCLID_STORAGE_KEY, urlGclid);
        return urlGclid;
    }
    return localStorage.getItem(GCLID_STORAGE_KEY) || '';
}

function pad2(value) {
    return String(value).padStart(2, '0');
}

function formatDateTime(date) {
    const year = date.getFullYear();
    const month = pad2(date.getMonth() + 1);
    const day = pad2(date.getDate());
    const hours = pad2(date.getHours());
    const minutes = pad2(date.getMinutes());
    const seconds = pad2(date.getSeconds());
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function getConversionTimeString() {
    const now = new Date();
    const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
    const gtmPlusOneMs = utcMs + 60 * 60000;
    const withExtraTwoMinutes = gtmPlusOneMs + 2 * 60000;
    return formatDateTime(new Date(withExtraTwoMinutes));
}

function ensureHiddenInput(form, name, value) {
    let input = form.querySelector(`input[name="${name}"]`);
    if (!input) {
        input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        form.appendChild(input);
    }
    input.value = value;
}

function initPhoneInputs() {
    if (phoneInputs.length === 0 || typeof window.intlTelInput !== 'function') {
        return;
    }

    phoneInputs.forEach((input) => {
        if (input.dataset.itiInitialized) return;

        const instance = window.intlTelInput(input, {
            initialCountry: 'ru',
            separateDialCode: true,
            nationalMode: true,
            autoPlaceholder: 'polite',
            utilsScript: 'https://cdn.jsdelivr.net/npm/intl-tel-input@latest/build/js/utils.js',
        });

        phoneInstances.set(input, instance);
        input.dataset.itiInitialized = 'true';
    });
}

function renderTurnstileWidgets() {
    if (!window.turnstile) return;

    document.querySelectorAll('.cf-turnstile').forEach((element) => {
        // Перевірка, чи вже зарендерено (має iframe або data-widget-id)
        if (element.getAttribute('data-widget-id') || element.querySelector('iframe')) {
            return;
        }

        const sitekey = element.getAttribute('data-sitekey') || TURNSTILE_SITE_KEY;
        if (!sitekey) return;

        const theme = element.getAttribute('data-theme') || 'light';
        const size = element.getAttribute('data-size') || 'normal';
        const appearance = element.getAttribute('data-appearance') || 'interaction-only';

        try {
            const widgetId = window.turnstile.render(element, {
                sitekey,
                theme,
                size,
                appearance,
            });
            element.setAttribute('data-widget-id', widgetId);
        } catch (error) {
            console.error('Turnstile render error:', error);
        }
    });
}

function initTurnstile() {
    if (window.turnstile) {
        renderTurnstileWidgets();
        return;
    }

    let attempts = 0;
    const maxAttempts = 15;
    const intervalId = setInterval(() => {
        attempts += 1;
        if (window.turnstile) {
            clearInterval(intervalId);
            renderTurnstileWidgets();
        } else if (attempts >= maxAttempts) {
            clearInterval(intervalId);
            console.warn('Turnstile script did not load');
            document.querySelectorAll('.cf-turnstile').forEach((element) => {
                if (!element.textContent) {
                    element.textContent = 'Капча не загрузилась. Обновите страницу';
                }
                element.classList.add('cf-turnstile--error');
            });
        }
    }, 300);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTurnstile);
} else {
    initTurnstile();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPhoneInputs);
} else {
    initPhoneInputs();
}

// Функція для отримання токену капчі з форми
function getTurnstileToken(form) {
    const turnstileContainer = form.querySelector('.cf-turnstile');
    if (!turnstileContainer) return null;
    
    const widgetId = turnstileContainer.getAttribute('data-widget-id');
    if (!widgetId) return null;
    
    try {
        return window.turnstile?.getResponse(widgetId) || null;
    } catch (error) {
        console.error('Turnstile error:', error);
        return null;
    }
}

// Функція для скидання капчі
function resetTurnstile(form) {
    const turnstileContainer = form.querySelector('.cf-turnstile');
    if (!turnstileContainer) return;
    
    const widgetId = turnstileContainer.getAttribute('data-widget-id');
    if (widgetId && window.turnstile) {
        try {
            window.turnstile.reset(widgetId);
        } catch (error) {
            console.error('Turnstile reset error:', error);
        }
    }
    
    // Прибираємо помилку капчі
    const formGroup = turnstileContainer.closest('.form__group');
    const errorElement = formGroup?.querySelector('.turnstile-error');
    if (errorElement) {
        errorElement.textContent = '';
    }
}

// Функція для відображення помилки капчі на формі
function showTurnstileError(form, message) {
    const turnstileContainer = form.querySelector('.cf-turnstile');
    if (!turnstileContainer) return;
    
    const formGroup = turnstileContainer.closest('.form__group');
    if (!formGroup) return;
    
    // Знаходимо або створюємо елемент помилки
    let errorElement = formGroup.querySelector('.turnstile-error');
    if (!errorElement) {
        errorElement = document.createElement('span');
        errorElement.className = 'turnstile-error form__error';
        errorElement.setAttribute('role', 'alert');
        errorElement.setAttribute('aria-live', 'polite');
        formGroup.appendChild(errorElement);
    }
    
    // Показуємо помилку
    errorElement.textContent = message;
}

// Валідація полів форми
const validators = {
    name: (value) => {
        if (!value || value.trim().length === 0) {
            return 'Укажите, пожалуйста, имя';
        }
        if (value.trim().length < 2) {
            return 'Имя — не менее 2 символов';
        }
        if (value.trim().length > 50) {
            return 'Имя — не более 50 символов';
        }
        if (!/^[а-яА-ЯёЁa-zA-Z\s\-']+$/u.test(value.trim())) {
            return 'В имени допускаются только буквы, пробелы, дефис и апостроф';
        }
        return '';
    },
    phone: (value) => {
        if (!value || value.trim().length === 0) {
            return 'Укажите, пожалуйста, номер телефона';
        }
        // Видаляємо всі нецифрові символи для перевірки
        const digitsOnly = value.replace(/\D/g, '');
        if (digitsOnly.length < 10) {
            return 'Номер — не менее 10 цифр';
        }
        if (digitsOnly.length > 15) {
            return 'Номер — не более 15 цифр';
        }
        // Перевірка формату (може починатися з +, містити дужки, пробіли, дефіси)
        if (!/^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}[-\s\.]?[0-9]{1,9}$/im.test(value.trim())) {
            return 'Введите номер в правильном формате';
        }
        return '';
    },
    email: (value) => {
        if (!value || value.trim().length === 0) {
            return ''; // Email не обов'язкове поле
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value.trim())) {
            return 'Введите email в правильном формате';
        }
        if (value.trim().length > 100) {
            return 'Email — не более 100 символов';
        }
        return '';
    },
    lossAmount: (value) => {
        if (!value || value.trim().length === 0) {
            return 'Выберите, пожалуйста, сумму потери';
        }
        return '';
    },
    message: (value) => {
        if (!value || value.trim().length === 0) {
            return ''; // Повідомлення не обов'язкове поле
        }
        if (value.trim().length > 1000) {
            return 'Сообщение — не более 1000 символов';
        }
        return '';
    }
};

// Функція для відображення помилки
function showFieldError(input, errorMessage) {
    const formGroup = input.closest('.form__group');
    if (!formGroup) return;
    
    const form = input.closest('form');
    const formId = form?.id || 'form';
    const fieldName = input.name;
    
    // Перевіряємо чи вже є елемент помилки (може бути в HTML)
    let errorElement = formGroup.querySelector('.form__error');
    if (!errorElement) {
        errorElement = document.createElement('span');
        errorElement.className = 'form__error';
        errorElement.setAttribute('role', 'alert');
        errorElement.setAttribute('aria-live', 'polite');
        errorElement.id = `${formId}-${fieldName}-error`;
        formGroup.appendChild(errorElement);
    }
    
    // Оновлюємо aria-describedby на input
    const errorId = errorElement.id;
    if (errorId && !input.getAttribute('aria-describedby')) {
        input.setAttribute('aria-describedby', errorId);
    }
    
    errorElement.textContent = errorMessage;
    input.setAttribute('aria-invalid', errorMessage ? 'true' : 'false');
    
    if (errorMessage) {
        input.classList.add('form__input--error');
        input.classList.remove('form__input--valid');
    } else {
        input.classList.remove('form__input--error');
        if (input.value.trim().length > 0) {
            input.classList.add('form__input--valid');
        }
    }
}

// Функція для валідації поля
function validateField(input) {
    const fieldName = input.name;
    const validator = validators[fieldName];
    
    if (!validator) return true;
    
    let valueToValidate = input.value;
    if (fieldName === 'phone') {
        const phoneInstance = phoneInstances.get(input);
        const fullNumber = phoneInstance?.getNumber();
        if (fullNumber) {
            valueToValidate = fullNumber;
        } else if (phoneInstance) {
            const dialCode = phoneInstance.getSelectedCountryData()?.dialCode || '';
            const digitsOnly = input.value.replace(/\D/g, '');
            valueToValidate = dialCode ? `+${dialCode}${digitsOnly}` : digitsOnly;
        }
    }

    const errorMessage = validator(valueToValidate);
    showFieldError(input, errorMessage);
    
    return !errorMessage;
}

// Функція для валідації всієї форми
function validateForm(form) {
    const inputs = form.querySelectorAll('input[name], textarea[name], select[name]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Додаємо валідацію в реальному часі
forms.forEach(form => {
    if (!form) return;
    
    const inputs = form.querySelectorAll('input[name], textarea[name], select[name]');
    inputs.forEach(input => {
        // Валідація при втраті фокусу
        input.addEventListener('blur', () => {
            validateField(input);
        });

        // Для select надійніше перевіряти по зміні значення
        input.addEventListener('change', () => {
            validateField(input);
        });
        
        // Валідація при введенні (з затримкою для кращого UX)
        let timeout;
        input.addEventListener('input', () => {
            clearTimeout(timeout);
            // Видаляємо клас помилки під час введення
            if (input.classList.contains('form__input--error')) {
                const formGroup = input.closest('.form__group');
                const errorElement = formGroup?.querySelector('.form__error');
                if (errorElement && errorElement.textContent) {
                    timeout = setTimeout(() => {
                        validateField(input);
                    }, 500);
                }
            }
        });
    });
});

function showFormNotice(message, isError = false) {
    let notice = document.getElementById(FORM_NOTICE_ID);
    if (!notice) {
        notice = document.createElement('div');
        notice.id = FORM_NOTICE_ID;
        notice.className = 'form-notice';
        notice.innerHTML = `
            <div class="form-notice__overlay" data-opora-prava-dismiss></div>
            <div class="form-notice__content" role="status" aria-live="polite">
                <button type="button" class="form-notice__close" aria-label="Закрыть">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M15 5L5 15M5 5l10 10"/>
                    </svg>
                </button>
                <span class="form-notice__text"></span>
            </div>
        `;
        document.body.appendChild(notice);

        const closeTriggers = notice.querySelectorAll('[data-opora-prava-dismiss], .form-notice__close');
        closeTriggers.forEach((trigger) => {
            trigger.addEventListener('click', () => {
                notice.classList.remove('form-notice--visible');
                window.clearTimeout(notice._hideTimer);
            });
        });
    }

    const textEl = notice.querySelector('.form-notice__text');
    if (textEl) {
        textEl.textContent = message;
    }

    notice.classList.toggle('form-notice--error', isError);
    notice.classList.add('form-notice--visible');

    window.clearTimeout(notice._hideTimer);
    notice._hideTimer = window.setTimeout(() => {
        notice.classList.remove('form-notice--visible');
    }, 3500);
}

forms.forEach(form => {
    form?.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Валідація форми перед відправкою
        if (!validateForm(form)) {
            // Знаходимо перше поле з помилкою та фокусуємо на ньому
            const firstError = form.querySelector('.form__input--error');
            if (firstError) {
                firstError.focus();
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            showFormNotice('Исправьте, пожалуйста, допущенные в форме ошибки', true);
            return;
        }

        // Перевірка капчі перед відправкою
        const turnstileToken = getTurnstileToken(form);
        if (!turnstileToken) {
            showTurnstileError(form, 'Подтвердите, что вы не робот');
            return;
        }
        
        // Прибираємо помилку капчі, якщо вона була
        const turnstileError = form.querySelector('.turnstile-error');
        if (turnstileError) {
            turnstileError.textContent = '';
        }

        const gclidValue = getGclidFromUrl();
        ensureHiddenInput(form, 'gclid', gclidValue);

        const phoneInput = form.querySelector('input[name="phone"]');
        if (phoneInput) {
            const phoneInstance = phoneInstances.get(phoneInput);
            const fullNumber = phoneInstance?.getNumber();
            if (fullNumber) {
                phoneInput.value = fullNumber;
            } else if (phoneInstance) {
                const dialCode = phoneInstance.getSelectedCountryData()?.dialCode || '';
                const digitsOnly = phoneInput.value.replace(/\D/g, '');
                phoneInput.value = dialCode ? `+${dialCode}${digitsOnly}` : digitsOnly;
            }
        }

        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        const trackingPayload = {
            'Google Click ID': gclidValue,
        };

        TRACKING_PARAMS.forEach((param) => {
            trackingPayload[param] = getUrlParamCaseInsensitive(param);
        });

        Object.entries(CONVERSION_PARAM_MAP).forEach(([paramName, payloadKey]) => {
            trackingPayload[payloadKey] = getUrlParamCaseInsensitive(paramName);
        });

        if (!trackingPayload['Conversion Name']) {
            trackingPayload['Conversion Name'] = 'Lead_Opora_Prava';
        }

        if (!trackingPayload['Conversion Value']) {
            trackingPayload['Conversion Value'] = '100';
        }

        if (!trackingPayload['Conversion Currency']) {
            trackingPayload['Conversion Currency'] = 'USD';
        }

        let formSource = 'unknown';
        if (form === heroForm) {
            formSource = 'hero';
        } else if (form === contactsForm) {
            formSource = 'contacts';
        } else if (form === popupForm) {
            formSource = 'popup';
        }

        const payload = {
            ...data,
            formSource,
            timestamp: new Date().toISOString(),
            turnstileToken: turnstileToken,
            gclid: gclidValue,
            ...trackingPayload,
        };

        // Блокуємо кнопку відправки
        const submitButton = form.querySelector('button[type="submit"]');
        const originalButtonText = submitButton?.textContent;
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Отправляем...';
        }

        try {
            await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                event: 'form_submit_success',
                form_source: formSource,
                gclid: gclidValue,
                conversion_name: trackingPayload['Conversion Name'],
                conversion_value: trackingPayload['Conversion Value'],
                conversion_currency: trackingPayload['Conversion Currency'],
            });

            showFormNotice('Благодарим! Мы свяжемся с вами в ближайшее время.');

            if (form === popupForm) {
                closePopup();
            }

            // Очищаємо всі помилки та класи валідації
            form.querySelectorAll('.form__input').forEach(input => {
                input.classList.remove('form__input--error', 'form__input--valid');
                input.setAttribute('aria-invalid', 'false');
            });
            form.querySelectorAll('.form__error').forEach(error => {
                error.textContent = '';
            });
            
            // Прибираємо помилку капчі
            const turnstileError = form.querySelector('.turnstile-error');
            if (turnstileError) {
                turnstileError.textContent = '';
            }

            form.reset();
            
            // Скидаємо капчу після успішної відправки
            resetTurnstile(form);
        } catch (error) {
            console.error('Form submit error:', error);
            showFormNotice('Ошибка при отправке. Попробуйте, пожалуйста, ещё раз.', true);
        } finally {
            // Розблоковуємо кнопку відправки
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText || 'Отправить';
            }
        }
    });
});

const headerCta = document.getElementById('headerCta');

function scrollToContacts(e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    const contacts = document.getElementById('contacts');
    if (contacts) {
        requestAnimationFrame(() => {
            const headerHeight = getHeaderHeight();
            const rect = contacts.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const targetPosition = rect.top + scrollTop - headerHeight;
            
            window.scrollTo({
                top: Math.max(0, targetPosition),
                behavior: 'smooth'
            });
        });
    }
}

if (headerCta) {
    headerCta.addEventListener('click', scrollToContacts);
}

const navCta = document.getElementById('navCta');
if (navCta) {
    navCta.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        scrollToContacts(e);
        setTimeout(() => {
            closeNavMenu();
        }, 100);
    });
}

let ticking = false;

function updateHeader() {
    const scrollY = window.scrollY;
    
    if (scrollY > 20) {
        header?.classList.add('scrolled');
    } else {
        header?.classList.remove('scrolled');
    }
    
    if (heroImage && heroImageImg && scrollY < window.innerHeight) {
        const scrollProgress = Math.max(0, Math.min(1, scrollY / window.innerHeight));
        
        const parallaxOffset = scrollY * 0.3;
        const scale = 1 + scrollProgress * 0.1;
        heroImageImg.style.transform = `translateY(${parallaxOffset}px) scale(${scale})`;
        
        if (scrollY > 50) {
            heroImage.classList.add('parallax');
        } else {
            heroImage.classList.remove('parallax');
        }
    }
    
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(updateHeader);
        ticking = true;
    }
}, { passive: true });

if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.dataset.src || img.src;
    });
} else {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

document.addEventListener('DOMContentLoaded', () => {
    if (!window.IntersectionObserver) {
        requestAnimationFrame(() => {
            const fadeInElements = document.querySelectorAll('.fade-in');
            fadeInElements.forEach(el => {
                el.classList.add('visible');
            });
        });
    }
    
    runWhenIdle(() => {
        function checkAndInit2GIS() {
            if (typeof mapgl !== 'undefined') {
                init2GISMap();
                return true;
            }
            return false;
        }
        
        if (!checkAndInit2GIS()) {
            if (document.readyState === 'complete') {
                let attempts = 0;
                const maxAttempts = 10;
                const checkInterval = setInterval(() => {
                    attempts++;
                    if (checkAndInit2GIS() || attempts >= maxAttempts) {
                        clearInterval(checkInterval);
                        if (attempts >= maxAttempts && typeof mapgl === 'undefined') {
                            console.debug('2GIS MapGL script not available');
                        }
                    }
                }, 200);
            } else {
                window.addEventListener('load', () => {
                    let attempts = 0;
                    const maxAttempts = 10;
                    const checkInterval = setInterval(() => {
                        attempts++;
                        if (checkAndInit2GIS() || attempts >= maxAttempts) {
                            clearInterval(checkInterval);
                            if (attempts >= maxAttempts && typeof mapgl === 'undefined') {
                                console.debug('2GIS MapGL script not available');
                            }
                        }
                    }, 200);
                });
            }
        }
    });
});

function init2GISMap() {
    const mapContainer = document.getElementById('map');
    if (!mapContainer) {
        console.warn('Map container not found');
        return;
    }
    
    if (typeof mapgl === 'undefined') {
        console.warn('2GIS MapGL library not loaded');
        return;
    }
    
    try {
        const coordinates = [37.6149609, 55.7314007];
        const map = new mapgl.Map('map', {
            key: '67949d2c-9089-4829-95d9-196b46ee87b1',
            center: coordinates,
            zoom: 16,
        });
        
        map.on('load', () => {
            new mapgl.Marker(map, {
                coordinates: coordinates,
            });
            
            addAccessibilityLabels(mapContainer);
            
            console.log('2GIS map initialized successfully');
        });
        
    } catch (error) {
        console.error('Error initializing 2GIS map:', error);
    }
}

function addAccessibilityLabels(mapContainer) {
    if (!mapContainer) return;
    
    const addLabelsToButtons = () => {
        const buttons = mapContainer.querySelectorAll('button[type="button"]');
        buttons.forEach((button, index) => {
            if (!button.getAttribute('aria-label')) {
                const classes = button.className || '';
                let label = '';
                
                if (classes.includes('mapgl')) {
                    if (classes.includes('zoom') || button.textContent === '+' || button.textContent === '−' || button.textContent === '-') {
                        label = button.textContent === '+' || button.textContent.includes('+') 
                            ? 'Увеличить масштаб карты' 
                            : 'Уменьшить масштаб карты';
                    }
                    else if (classes.includes('rotate') || classes.includes('compass')) {
                        label = 'Повернуть карту';
                    }
                    else if (classes.includes('navigation') || classes.includes('control')) {
                        label = 'Элемент управления картой';
                    }
                    else {
                        label = `Кнопка управления картой ${index + 1}`;
                    }
                } else {
                    label = `Кнопка управления картой ${index + 1}`;
                }
                
                if (label) {
                    button.setAttribute('aria-label', label);
                }
            }
        });
    };
    
    const addLabelsToLinks = () => {
        const links = mapContainer.querySelectorAll('a');
        links.forEach((link) => {
            const hasText = link.textContent && link.textContent.trim().length > 0;
            const hasAriaLabel = link.getAttribute('aria-label');
            const hasImageWithAlt = link.querySelector('img[alt]');
            
            if (!hasText && !hasAriaLabel && !hasImageWithAlt) {
                const href = link.getAttribute('href') || '';
                let label = '';
                
                if (href.includes('2gis.ru') || href.includes('link_api_map')) {
                    label = 'Ссылка на сайт 2GIS (откроется в новой вкладке)';
                } else if (href.includes('map')) {
                    label = 'Ссылка на карту';
                } else {
                    label = 'Ссылка на внешний ресурс';
                }
                
                if (label) {
                    link.setAttribute('aria-label', label);
                }
            }
        });
    };
    
    const addAllLabels = () => {
        addLabelsToButtons();
        addLabelsToLinks();
    };
    
    setTimeout(() => {
        addAllLabels();
    }, 500);
    
    const observer = new MutationObserver((mutations) => {
        let shouldUpdate = false;
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) {
                        if (node.tagName === 'BUTTON' || node.tagName === 'A' || 
                            node.querySelector('button') || node.querySelector('a')) {
                            shouldUpdate = true;
                        }
                    }
                });
            }
        });
        
        if (shouldUpdate) {
            setTimeout(() => {
                addAllLabels();
            }, 100);
        }
    });
    
    observer.observe(mapContainer, {
        childList: true,
        subtree: true
    });
    
    const intervalId = setInterval(() => {
        addAllLabels();
    }, 2000);
    
    setTimeout(() => {
        clearInterval(intervalId);
    }, 30000);
}
