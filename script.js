// ============================================
// Навігація та Burger Menu
// ============================================

const burger = document.getElementById('burger');
const nav = document.getElementById('nav');
const navLinks = document.querySelectorAll('.nav__link');
const header = document.querySelector('.header');
const heroImage = document.getElementById('heroImage');
const heroImageImg = document.getElementById('heroImageImg');

// Burger menu toggle
if (burger && nav) {
    burger.addEventListener('click', () => {
        burger.classList.toggle('active');
        nav.classList.toggle('active');
        document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            burger.classList.remove('active');
            nav.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close menu on outside click
    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && !burger.contains(e.target)) {
            burger.classList.remove('active');
            nav.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// ============================================
// Плавний скрол для всіх anchor-посилань
// ============================================

function getHeaderHeight() {
    return header?.offsetHeight || 0;
}

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
// IntersectionObserver для анімацій
// ============================================

// Перевірка prefers-reduced-motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            // Для hero елементів додаємо затримку
            if (entry.target.classList.contains('hero__text')) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, 100);
            } else if (entry.target.classList.contains('hero__form-wrapper')) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, 300);
            } else {
                entry.target.classList.add('visible');
            }
            // Прибираємо observer після появи для оптимізації
            if (!prefersReducedMotion) {
                observer.unobserve(entry.target);
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
// Відео-карусель відгуків
// ============================================

const videoTrack = document.getElementById('videoTrack');
const videoPrev = document.getElementById('videoPrev');
const videoNext = document.getElementById('videoNext');
const videoDots = document.getElementById('videoDots');
const videoSlides = document.querySelectorAll('.video-carousel__slide');

let currentVideoSlide = 0;

// Створюємо dots для відео-каруселі
if (videoSlides.length > 0 && videoDots) {
    videoSlides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.className = 'video-carousel__dot' + (index === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Перейти к видео ${index + 1}`);
        dot.addEventListener('click', () => goToVideoSlide(index));
        videoDots.appendChild(dot);
    });
}

function updateVideoSlider() {
    if (videoTrack) {
        videoTrack.scrollTo({
            left: currentVideoSlide * videoTrack.offsetWidth,
            behavior: 'smooth'
        });
    }
    
    // Оновлюємо dots
    const dots = videoDots?.querySelectorAll('.video-carousel__dot');
    if (dots) {
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentVideoSlide);
        });
    }
}

function goToVideoSlide(index) {
    currentVideoSlide = index;
    updateVideoSlider();
}

function nextVideoSlide() {
    currentVideoSlide = (currentVideoSlide + 1) % videoSlides.length;
    updateVideoSlider();
}

function prevVideoSlide() {
    currentVideoSlide = (currentVideoSlide - 1 + videoSlides.length) % videoSlides.length;
    updateVideoSlider();
}

if (videoNext) {
    videoNext.addEventListener('click', nextVideoSlide);
}

if (videoPrev) {
    videoPrev.addEventListener('click', prevVideoSlide);
}

// Swipe для мобільних пристроїв
let videoTouchStartX = 0;
let videoTouchEndX = 0;

if (videoTrack) {
    videoTrack.addEventListener('touchstart', (e) => {
        videoTouchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    videoTrack.addEventListener('touchend', (e) => {
        videoTouchEndX = e.changedTouches[0].screenX;
        handleVideoSwipe();
    }, { passive: true });
}

function handleVideoSwipe() {
    const swipeThreshold = 50;
    const diff = videoTouchStartX - videoTouchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            nextVideoSlide();
        } else {
            prevVideoSlide();
        }
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

// Чат bubble з випадаючим меню
const chatBubble = document.getElementById('chatBubble');
const chatDropdown = document.getElementById('chatDropdown');
const chatOnSite = document.getElementById('chatOnSite');
const chatModal = document.getElementById('chatModal');
const chatModalClose = document.getElementById('chatModalClose');

function toggleChatDropdown() {
    if (chatDropdown && chatBubble) {
        const isExpanded = chatBubble.getAttribute('aria-expanded') === 'true';
        chatBubble.setAttribute('aria-expanded', !isExpanded);
        chatDropdown.classList.toggle('active', !isExpanded);
    }
}

function closeChatDropdown() {
    if (chatDropdown && chatBubble) {
        chatBubble.setAttribute('aria-expanded', 'false');
        chatDropdown.classList.remove('active');
    }
}

function openChatModal() {
    if (chatModal) {
        chatModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        closeChatDropdown();
    }
}

function closeChatModal() {
    if (chatModal) {
        chatModal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

if (chatBubble) {
    chatBubble.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleChatDropdown();
    });
}

if (chatOnSite) {
    chatOnSite.addEventListener('click', (e) => {
        e.preventDefault();
        openChatModal();
    });
}

// Закриваємо dropdown при кліку поза ним
document.addEventListener('click', (e) => {
    if (chatDropdown && chatBubble) {
        if (!chatBubble.contains(e.target) && !chatDropdown.contains(e.target)) {
            closeChatDropdown();
        }
    }
});

if (chatModalClose) {
    chatModalClose.addEventListener('click', closeChatModal);
}

if (chatModal) {
    chatModal.addEventListener('click', (e) => {
        if (e.target === chatModal || e.target.classList.contains('modal__overlay')) {
            closeChatModal();
        }
    });
}

// Відео відтворення на картці
const videoReviewCards = document.querySelectorAll('.video-review-card');

videoReviewCards.forEach(card => {
    const previewVideo = card.querySelector('.video-review-card__preview-video');
    const playButton = card.querySelector('.video-review-card__play');
    
    if (previewVideo && playButton) {
        // При кліку на кнопку play - відтворюємо відео
        playButton.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            previewVideo.play();
            playButton.style.display = 'none';
        });
        
        // Коли відео починає відтворюватися, ховаємо кнопку play
        previewVideo.addEventListener('play', () => {
            playButton.style.display = 'none';
        });
        
        // Коли відео зупиняється (пауза), показуємо кнопку play тільки якщо відео на початку
        previewVideo.addEventListener('pause', () => {
            if (previewVideo.currentTime === 0) {
                playButton.style.display = 'flex';
            }
        });
        
        // Коли відео закінчується, показуємо кнопку play
        previewVideo.addEventListener('ended', () => {
            playButton.style.display = 'flex';
        });
    }
});

// ESC для закриття модалок
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeChatModal();
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

// Показуємо попап через затримку
setTimeout(() => {
    if (shouldShowPopup()) {
        showPopup();
    }
}, POPUP_DELAY);

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
const chatForm = document.getElementById('chatForm');
const forms = [heroForm, popupForm, chatForm].filter(Boolean);

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
        
        // Закриваємо модалку чату якщо це форма чату
        if (form === chatForm) {
            closeChatModal();
        }
        
        // Очищаємо форму
        form.reset();
    });
});

// ============================================
// CTA кнопки
// ============================================

const headerCta = document.getElementById('headerCta');
const heroCtaPrimary = document.getElementById('heroCtaPrimary');
const heroCtaSecondary = document.getElementById('heroCtaSecondary');

function scrollToForm() {
    const heroFormWrapper = document.querySelector('.hero__form-wrapper');
    scrollToTarget(heroFormWrapper);
}

function scrollToContacts() {
    const contacts = document.getElementById('contacts');
    scrollToTarget(contacts);
}

if (headerCta) {
    headerCta.addEventListener('click', scrollToForm);
}

if (heroCtaPrimary) {
    heroCtaPrimary.addEventListener('click', scrollToForm);
}

if (heroCtaSecondary) {
    heroCtaSecondary.addEventListener('click', () => {
        if (chatModal) {
            openChatModal();
        } else {
            scrollToContacts();
        }
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
        document.querySelectorAll('.fade-in').forEach(el => {
            el.classList.add('visible');
        });
    }
    
    
    // Ініціалізація карти 2GIS (чекаємо на завантаження скрипта)
    if (typeof mapgl !== 'undefined') {
        init2GISMap();
    } else {
        // Чекаємо на завантаження скрипта 2GIS
        window.addEventListener('load', () => {
            setTimeout(() => {
                if (typeof mapgl !== 'undefined') {
                    init2GISMap();
                } else {
                    console.warn('2GIS MapGL script not loaded');
                }
            }, 500);
        });
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
            
            console.log('2GIS map initialized successfully');
        });
        
    } catch (error) {
        console.error('Error initializing 2GIS map:', error);
    }
}
