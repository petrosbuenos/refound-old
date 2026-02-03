// ============================================
// Навігація та Burger Menu
// ============================================

const burger = document.getElementById('burger');
const nav = document.getElementById('nav');
const navClose = document.getElementById('navClose');
const navLinks = document.querySelectorAll('.nav__link');
const header = document.querySelector('.header');
const heroImage = document.getElementById('heroImage');
const heroImageImg = document.getElementById('heroImageImg');

// Функція для закриття меню
function closeNavMenu() {
    if (burger && nav) {
        burger.classList.remove('active');
        nav.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Функція для відкриття меню
function openNavMenu() {
    if (burger && nav) {
        burger.classList.add('active');
        nav.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Burger menu toggle
if (burger && nav) {
    burger.addEventListener('click', (e) => {
        e.stopPropagation();
        if (nav.classList.contains('active')) {
            closeNavMenu();
        } else {
            openNavMenu();
        }
    });

    // Кнопка закриття в меню
    if (navClose) {
        navClose.addEventListener('click', (e) => {
            e.stopPropagation();
            closeNavMenu();
        });
    }

    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Невелика затримка для плавного переходу перед закриттям
            setTimeout(() => {
                closeNavMenu();
            }, 100);
        });
    });

    // Close menu on overlay click (тільки якщо клік був на overlay, а не на меню)
    nav.addEventListener('click', (e) => {
        // Перевіряємо, чи клік був на самому nav (overlay) або на елементі поза меню
        if (e.target === nav) {
            closeNavMenu();
        }
    });

    // Close menu on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && nav.classList.contains('active')) {
            closeNavMenu();
        }
    });

    // Запобігаємо закриттю при кліку всередині меню (але не на посиланнях)
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
            // Дозволяємо закриття меню при кліку на посилання, але запобігаємо закриттю при кліку на сам список
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

// ============================================
// Плавний скрол для всіх anchor-посилань
// ============================================

// Кешуємо висоту header для уникнення примусових перекомпонувань
let cachedHeaderHeight = 0;

function getHeaderHeight() {
    // Використовуємо кешоване значення, якщо воно є
    if (cachedHeaderHeight > 0) {
        return cachedHeaderHeight;
    }
    // Читаємо тільки якщо header існує
    if (header) {
        cachedHeaderHeight = header.offsetHeight || 0;
    }
    return cachedHeaderHeight;
}

// Оновлюємо кеш при зміні розміру вікна
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

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href.length > 1) {
            e.preventDefault();
            const target = document.querySelector(href);
            scrollToTarget(target);
        }
    });
});

// ============================================
// IntersectionObserver для анімацій з реверсною анімацією
// ============================================

// Перевірка prefers-reduced-motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Відстеження напрямку прокрутки
// Ініціалізуємо після завантаження для уникнення примусових перекомпонувань
let lastScrollY = 0;
let scrollDirection = 'down';

// Ініціалізуємо lastScrollY після завантаження сторінки
// Використовуємо подвійний requestAnimationFrame для гарантії готовності DOM
const initScrollY = () => {
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            // Використовуємо pageYOffset замість scrollY для кращої сумісності
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
            // Елемент входить у viewport - показуємо його
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
                // Плавна анімація для блоку відгуків
                requestAnimationFrame(() => {
                    entry.target.classList.add('visible');
                    // Анімуємо картки поетапно після появи блоку
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
            // Елемент виходить з viewport - перевіряємо напрямок прокрутки
            // Виключаємо hero елементи, щоб вони залишалися видимими
            const isHeroElement = entry.target.classList.contains('hero__text') || 
                                 entry.target.classList.contains('hero__form-wrapper') ||
                                 entry.target.classList.contains('hero__image') ||
                                 entry.target.classList.contains('contacts__form-wrapper');
            
            if (scrollDirection === 'up' && entry.target.classList.contains('visible') && !isHeroElement) {
                // При прокрутці вгору - приховуємо зі зворотною анімацією
                entry.target.classList.remove('visible');
            }
        }
    });
}, observerOptions);

// Спостерігаємо за всіма елементами з класом fade-in
document.querySelectorAll('.fade-in').forEach(el => {
    if (prefersReducedMotion) {
        el.classList.add('visible');
    } else {
        observer.observe(el);
    }
});

// Поетапна анімація для timeline items (змійка)
const timelineItems = document.querySelectorAll('.timeline__item.fade-in');
timelineItems.forEach((item, index) => {
    if (!prefersReducedMotion) {
        item.style.transitionDelay = `${index * 150}ms`;
    }
});


// ============================================
// Карусель відгуків
// ============================================

const reviewTrack = document.getElementById('reviewTrack');
const reviewPrev = document.getElementById('reviewPrev');
const reviewNext = document.getElementById('reviewNext');
const reviewDots = document.getElementById('reviewDots');
const reviewCards = document.querySelectorAll('.reviews__track .review-card');

let currentReview = 0;

// Створюємо dots для каруселі
if (reviewCards.length > 0 && reviewDots) {
    reviewCards.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.className = 'reviews__dot' + (index === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Перейти к отзыву ${index + 1}`);
        dot.addEventListener('click', () => goToReview(index));
        reviewDots.appendChild(dot);
    });
}

// Кешуємо ширину картки для уникнення примусових перекомпонувань
let cachedCardWidth = 0;

function getCardWidth() {
    if (cachedCardWidth > 0 && reviewTrack) {
        return cachedCardWidth;
    }
    // Читаємо offsetWidth тільки якщо потрібно, і тільки в requestAnimationFrame
    if (reviewTrack && cachedCardWidth === 0) {
        // Використовуємо getBoundingClientRect як альтернативу offsetWidth
        // або читаємо в requestAnimationFrame
        const rect = reviewTrack.getBoundingClientRect();
        cachedCardWidth = rect.width || reviewTrack.offsetWidth;
    }
    return cachedCardWidth;
}

// Оновлюємо кеш при зміні розміру
if (reviewTrack) {
    if (typeof ResizeObserver !== 'undefined') {
        const resizeObserver = new ResizeObserver(() => {
            // Використовуємо requestAnimationFrame для уникнення примусових перекомпонувань
            requestAnimationFrame(() => {
                cachedCardWidth = reviewTrack.offsetWidth;
            });
        });
        resizeObserver.observe(reviewTrack);
    } else {
        // Fallback для браузерів без ResizeObserver
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

function updateReviewCarousel() {
    if (!reviewTrack || reviewCards.length === 0) return;
    
    // Використовуємо кешовану ширину
    const cardWidth = getCardWidth();
    const targetScroll = currentReview * cardWidth;
    
    // Використовуємо подвійний requestAnimationFrame для уникнення примусових перекомпонувань
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            // Плавна прокрутка з перевіркою підтримки
            // Використовуємо CSS scroll-behavior замість JS scrollTo для кращої продуктивності
            if ('scrollBehavior' in document.documentElement.style) {
                reviewTrack.scrollTo({
                    left: targetScroll,
                    behavior: 'smooth'
                });
            } else {
                // Fallback для старих браузерів - використовуємо requestAnimationFrame
                requestAnimationFrame(() => {
                    reviewTrack.scrollLeft = targetScroll;
                });
            }
            
            // Оновлюємо dots з плавною анімацією
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
            
            // Оновлюємо видимість стрілок з плавним переходом
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

if (reviewNext) {
    reviewNext.addEventListener('click', nextReview);
}

if (reviewPrev) {
    reviewPrev.addEventListener('click', prevReview);
}

// Swipe для мобільних пристроїв
let reviewTouchStartX = 0;
let reviewTouchEndX = 0;
let isReviewScrolling = false;

if (reviewTrack) {
    reviewTrack.addEventListener('touchstart', (e) => {
        reviewTouchStartX = e.changedTouches[0].screenX;
        isReviewScrolling = false;
    }, { passive: true });

    reviewTrack.addEventListener('touchmove', (e) => {
        isReviewScrolling = true;
    }, { passive: true });

    reviewTrack.addEventListener('touchend', (e) => {
        if (!isReviewScrolling) {
            reviewTouchEndX = e.changedTouches[0].screenX;
            handleReviewSwipe();
        }
    }, { passive: true });
}

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

// Обробка scroll для синхронізації
if (reviewTrack) {
    let scrollTimeout;
    reviewTrack.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            // Використовуємо requestAnimationFrame для читання геометричних властивостей
            requestAnimationFrame(() => {
                // Використовуємо кешовану ширину замість прямого читання
                const cardWidth = getCardWidth();
                // Читаємо scrollLeft в requestAnimationFrame для уникнення примусових перекомпонувань
                const scrollLeft = reviewTrack.scrollLeft;
                const newIndex = Math.round(scrollLeft / cardWidth);
                if (newIndex !== currentReview && newIndex >= 0 && newIndex < reviewCards.length) {
                    currentReview = newIndex;
                    // Використовуємо requestAnimationFrame для batch операцій
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

// Ініціалізація при завантаженні
if (reviewCards.length > 0) {
    // Ініціалізуємо кеш ширини картки після завантаження
    // Використовуємо подвійний requestAnimationFrame для гарантії готовності DOM
    const initCarousel = () => {
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                if (reviewTrack) {
                    // Використовуємо getBoundingClientRect замість offsetWidth для менших перекомпонувань
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

// ============================================
// FAQ Accordion
// ============================================

const faqQuestions = document.querySelectorAll('.faq__question');

faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
        const item = question.closest('.faq__item');
        const isExpanded = question.getAttribute('aria-expanded') === 'true';
        
        // Закриваємо всі інші
        faqQuestions.forEach(q => {
            if (q !== question) {
                q.setAttribute('aria-expanded', 'false');
                q.closest('.faq__item').classList.remove('active');
            }
        });
        
        // Перемикаємо поточний
        question.setAttribute('aria-expanded', !isExpanded);
        item.classList.toggle('active', !isExpanded);
    });
    
    // Keyboard navigation
    question.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            question.click();
        }
    });
});

// ============================================
// Модалки
// ============================================

// Функція для відкриття Jivo чату
function openJivoChat() {
    if (typeof jivo_api !== 'undefined') {
        jivo_api.open();
    } else {
        // Якщо Jivo ще не завантажився, чекаємо
        const checkJivo = setInterval(() => {
            if (typeof jivo_api !== 'undefined') {
                jivo_api.open();
                clearInterval(checkJivo);
            }
        }, 100);
        
        // Таймаут на випадок, якщо Jivo не завантажиться
        setTimeout(() => {
            clearInterval(checkJivo);
        }, 5000);
    }
}

// ESC для закриття модалок
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closePopup();
    }
});

// ============================================
// Попап форма
// ============================================

const popup = document.getElementById('popup');
const popupClose = document.getElementById('popupClose');
const popupForm = document.getElementById('popupForm');

const POPUP_STORAGE_KEY = 'refound_popup_shown';
const POPUP_DELAY = 30000; // 30 секунд
const POPUP_COOLDOWN = 24 * 60 * 60 * 1000; // 24 години

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

// ТИМЧАСОВО ВИМКНЕНО: Показуємо попап через затримку
// Розкоментуйте наступні рядки, щоб увімкнути попап назад:
// setTimeout(() => {
//     if (shouldShowPopup()) {
//         showPopup();
//     }
// }, POPUP_DELAY);

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

// ============================================
// Cookie Popup
// ============================================

const cookiePopup = document.getElementById('cookiePopup');
const cookieAccept = document.getElementById('cookieAccept');
const cookieReject = document.getElementById('cookieReject');

const COOKIE_CONSENT_KEY = 'refound_cookie_consent';

function hasCookieConsent() {
    return localStorage.getItem(COOKIE_CONSENT_KEY) !== null;
}

function showCookiePopup() {
    if (cookiePopup && !hasCookieConsent()) {
        // Невелика затримка для кращого UX
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
    // Тут можна додати код для ініціалізації cookies/аналітики
}

function rejectCookies() {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'rejected');
    hideCookiePopup();
    // Тут можна додати код для видалення cookies
}

if (cookieAccept) {
    cookieAccept.addEventListener('click', acceptCookies);
}

if (cookieReject) {
    cookieReject.addEventListener('click', rejectCookies);
}

// Показуємо cookie popup при завантаженні сторінки
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', showCookiePopup);
} else {
    showCookiePopup();
}

// ============================================
// Форми
// ============================================

const heroForm = document.getElementById('heroForm');
const contactsForm = document.getElementById('contactsForm');
const forms = [heroForm, popupForm, contactsForm].filter(Boolean);

forms.forEach(form => {
    form?.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Тут можна додати відправку на сервер
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        console.log('Form submitted:', data);
        
        // Показуємо повідомлення про успіх
        alert('Спасибо! Мы свяжемся с вами в ближайшее время.');
        
        // Закриваємо попап якщо це форма в попапі
        if (form === popupForm) {
            closePopup();
        }
        
        // Очищаємо форму
        form.reset();
    });
});

// ============================================
// CTA кнопки
// ============================================

const headerCta = document.getElementById('headerCta');

function scrollToContacts(e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    const contacts = document.getElementById('contacts');
    if (contacts) {
        // Читаємо всі геометричні властивості одразу перед використанням
        // для уникнення примусових перекомпонувань
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

// Кнопка "Получить консультацию" в мобільному меню
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

// ============================================
// Sticky Header Shadow with smooth transition
// ============================================

let ticking = false;

function updateHeader() {
    const scrollY = window.scrollY;
    
    if (scrollY > 20) {
        header?.classList.add('scrolled');
    } else {
        header?.classList.remove('scrolled');
    }
    
    // Apple-style parallax для hero image fullscreen
    if (heroImage && heroImageImg && scrollY < window.innerHeight) {
        const scrollProgress = Math.max(0, Math.min(1, scrollY / window.innerHeight));
        
        // Паралакс ефект - зображення рухається повільніше (Apple style)
        const parallaxOffset = scrollY * 0.3;
        const scale = 1 + scrollProgress * 0.1;
        heroImageImg.style.transform = `translateY(${parallaxOffset}px) scale(${scale})`;
        
        // Додаємо клас для плавного переходу
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

// ============================================
// Лічильник для таймлайну (опціонально)
// ============================================

// ============================================
// Оптимізація: Lazy loading для зображень (якщо будуть додані)
// ============================================

if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.dataset.src || img.src;
    });
} else {
    // Fallback для старих браузерів
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

// ============================================
// Ініціалізація
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Перевірка підтримки основних функцій
    if (!window.IntersectionObserver) {
        // Fallback: показуємо всі елементи одразу
        // Використовуємо requestAnimationFrame для batch операцій
        requestAnimationFrame(() => {
            const fadeInElements = document.querySelectorAll('.fade-in');
            fadeInElements.forEach(el => {
                el.classList.add('visible');
            });
        });
    }
    
    
    // Ініціалізація карти 2GIS (чекаємо на завантаження скрипта)
    function checkAndInit2GIS() {
        if (typeof mapgl !== 'undefined') {
            init2GISMap();
            return true;
        }
        return false;
    }
    
    // Перевіряємо одразу
    if (!checkAndInit2GIS()) {
        // Якщо скрипт ще не завантажився, чекаємо на подію load
        if (document.readyState === 'complete') {
            // Якщо сторінка вже завантажена, чекаємо трохи більше
            let attempts = 0;
            const maxAttempts = 10;
            const checkInterval = setInterval(() => {
                attempts++;
                if (checkAndInit2GIS() || attempts >= maxAttempts) {
                    clearInterval(checkInterval);
                    if (attempts >= maxAttempts && typeof mapgl === 'undefined') {
                        // Тихо пропускаємо помилку, якщо карта не критична
                        console.debug('2GIS MapGL script not available');
                    }
                }
            }, 200);
        } else {
            // Чекаємо на завантаження сторінки
            window.addEventListener('load', () => {
                let attempts = 0;
                const maxAttempts = 10;
                const checkInterval = setInterval(() => {
                    attempts++;
                    if (checkAndInit2GIS() || attempts >= maxAttempts) {
                        clearInterval(checkInterval);
                        if (attempts >= maxAttempts && typeof mapgl === 'undefined') {
                            // Тихо пропускаємо помилку, якщо карта не критична
                            console.debug('2GIS MapGL script not available');
                        }
                    }
                }, 200);
            });
        }
    }
});

// ============================================
// 2GIS Map Initialization
// ============================================

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
        // Координати Казанского переулка, д. 7/19, Москва
        // Формат: [долгота, широта]
        const coordinates = [37.6149609, 55.7314007]; // Казанский пер., д. 7/19
        const map = new mapgl.Map('map', {
            key: '67949d2c-9089-4829-95d9-196b46ee87b1',
            center: coordinates,
            zoom: 16,
        });
        
        // Чекаємо на завантаження карти перед додаванням маркера
        map.on('load', () => {
            // Додаємо маркер на карту
            new mapgl.Marker(map, {
                coordinates: coordinates,
            });
            
            // Додаємо доступні назви для кнопок карти
            addAccessibilityLabels(mapContainer);
            
            console.log('2GIS map initialized successfully');
        });
        
    } catch (error) {
        console.error('Error initializing 2GIS map:', error);
    }
}

// ============================================
// Додавання доступних назв для кнопок та посилань карти 2GIS
// ============================================

function addAccessibilityLabels(mapContainer) {
    if (!mapContainer) return;
    
    // Функція для додавання aria-label до кнопок
    const addLabelsToButtons = () => {
        const buttons = mapContainer.querySelectorAll('button[type="button"]');
        buttons.forEach((button, index) => {
            // Перевіряємо, чи кнопка вже має aria-label
            if (!button.getAttribute('aria-label')) {
                // Визначаємо тип кнопки за класами або позицією
                const classes = button.className || '';
                let label = '';
                
                // Спробуємо визначити тип кнопки за класами mapgl
                if (classes.includes('mapgl')) {
                    // Кнопки масштабування (zoom)
                    if (classes.includes('zoom') || button.textContent === '+' || button.textContent === '−' || button.textContent === '-') {
                        label = button.textContent === '+' || button.textContent.includes('+') 
                            ? 'Увеличить масштаб карты' 
                            : 'Уменьшить масштаб карты';
                    }
                    // Кнопки повороту
                    else if (classes.includes('rotate') || classes.includes('compass')) {
                        label = 'Повернуть карту';
                    }
                    // Кнопки навігації
                    else if (classes.includes('navigation') || classes.includes('control')) {
                        label = 'Элемент управления картой';
                    }
                    // Інші кнопки карти
                    else {
                        label = `Кнопка управления картой ${index + 1}`;
                    }
                } else {
                    // Якщо не вдалося визначити тип, використовуємо загальну назву
                    label = `Кнопка управления картой ${index + 1}`;
                }
                
                if (label) {
                    button.setAttribute('aria-label', label);
                }
            }
        });
    };
    
    // Функція для додавання aria-label до посилань без тексту
    const addLabelsToLinks = () => {
        const links = mapContainer.querySelectorAll('a');
        links.forEach((link) => {
            // Перевіряємо, чи посилання має текстовий вміст або aria-label
            const hasText = link.textContent && link.textContent.trim().length > 0;
            const hasAriaLabel = link.getAttribute('aria-label');
            const hasImageWithAlt = link.querySelector('img[alt]');
            
            // Якщо посилання не має тексту, aria-label або зображення з alt
            if (!hasText && !hasAriaLabel && !hasImageWithAlt) {
                const href = link.getAttribute('href') || '';
                let label = '';
                
                // Визначаємо тип посилання за href
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
    
    // Функція для обробки всіх елементів
    const addAllLabels = () => {
        addLabelsToButtons();
        addLabelsToLinks();
    };
    
    // Спочатку додаємо labels до існуючих елементів
    setTimeout(() => {
        addAllLabels();
    }, 500);
    
    // Використовуємо MutationObserver для відстеження нових елементів
    const observer = new MutationObserver((mutations) => {
        let shouldUpdate = false;
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // Element node
                        if (node.tagName === 'BUTTON' || node.tagName === 'A' || 
                            node.querySelector('button') || node.querySelector('a')) {
                            shouldUpdate = true;
                        }
                    }
                });
            }
        });
        
        if (shouldUpdate) {
            // Використовуємо невелику затримку для того, щоб DOM встиг оновитися
            setTimeout(() => {
                addAllLabels();
            }, 100);
        }
    });
    
    // Спостерігаємо за змінами в контейнері карти
    observer.observe(mapContainer, {
        childList: true,
        subtree: true
    });
    
    // Також перевіряємо періодично (на випадок, якщо MutationObserver пропустить щось)
    const intervalId = setInterval(() => {
        addAllLabels();
    }, 2000);
    
    // Зупиняємо інтервал через 30 секунд (після повного завантаження карти)
    setTimeout(() => {
        clearInterval(intervalId);
    }, 30000);
}
