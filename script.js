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

const POPUP_STORAGE_KEY = 'refound_popup_shown';
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

const COOKIE_CONSENT_KEY = 'refound_cookie_consent';

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
const FORM_NOTICE_ID = 'formNotice';

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxBoismlL2vju4GaWJtLuDLmFkQtzdf9WO1cOtPMVqFmBkgXWG0joJaXRIMEEsetKpieA/exec';

function showFormNotice(message, isError = false) {
    let notice = document.getElementById(FORM_NOTICE_ID);
    if (!notice) {
        notice = document.createElement('div');
        notice.id = FORM_NOTICE_ID;
        notice.className = 'form-notice';
        notice.setAttribute('role', 'status');
        notice.setAttribute('aria-live', 'polite');
        notice.innerHTML = '<span class="form-notice__text"></span>';
        document.body.appendChild(notice);
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

        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

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
        };

        try {
            await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            showFormNotice('Спасибо! Мы свяжемся с вами в ближайшее время.');

            if (form === popupForm) {
                closePopup();
            }

            form.reset();
        } catch (error) {
            console.error('Form submit error:', error);
            showFormNotice('Ошибка отправки формы. Пожалуйста, попробуйте еще раз.', true);
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
