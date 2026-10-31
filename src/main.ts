import './style.css';
import { SITE_CONFIG } from './config';

/**
 * ANIMAL FRESH — CORE INTERACTION & SCROLL CHOREOGRAPHY ENGINE
 * High-performance, zero-jank, requestAnimationFrame-driven
 */

document.addEventListener('DOMContentLoaded', () => {
  initCommercialConfig();
  initMobileMenu();
  initScrollChoreography();
  initIntersectionReveals();
  initSmoothScroll();
});

/**
 * 1. BIND COMMERCIAL CONFIGURATION (PREÇO, FRETE GRÁTIS E CHECKOUT DIRETO)
 */
function initCommercialConfig(): void {
  const priceDisplay = document.getElementById('product-price-display');
  const installmentsDisplay = document.getElementById('product-installments-display');
  const btnCheckout = document.getElementById('btn-checkout-primary') as HTMLAnchorElement | null;
  const mobileBuyBtn = document.querySelector('#mobile-buy-bar a') as HTMLAnchorElement | null;
  const mobilePriceDisplay = document.getElementById('mobile-price-display');

  if (priceDisplay && SITE_CONFIG.product.price) {
    priceDisplay.textContent = SITE_CONFIG.product.price;
  }

  if (installmentsDisplay && SITE_CONFIG.product.installments) {
    installmentsDisplay.textContent = SITE_CONFIG.product.installments;
  }

  if (mobilePriceDisplay && SITE_CONFIG.product.price) {
    mobilePriceDisplay.textContent = `${SITE_CONFIG.product.price} • Frete Grátis`;
  }

  const checkoutUrl = SITE_CONFIG.product.checkoutUrl;

  // Atualiza botão principal de compra
  if (btnCheckout) {
    btnCheckout.href = checkoutUrl;
    btnCheckout.target = '_blank';
    btnCheckout.rel = 'noopener noreferrer';
  }

  // Atualiza botão da barra fixa mobile
  if (mobileBuyBtn) {
    mobileBuyBtn.href = checkoutUrl;
    mobileBuyBtn.target = '_blank';
    mobileBuyBtn.rel = 'noopener noreferrer';
  }
}

/**
 * 2. MOBILE MENU CONTROLLER
 */
function initMobileMenu(): void {
  const btn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  const openIcon = btn?.querySelector('.menu-open-icon');
  const closeIcon = btn?.querySelector('.menu-close-icon');
  const navLinks = menu?.querySelectorAll('.mobile-nav-link');

  if (!btn || !menu) return;

  const toggleMenu = (open?: boolean) => {
    const isExpanded = open ?? btn.getAttribute('aria-expanded') !== 'true';
    btn.setAttribute('aria-expanded', String(isExpanded));
    menu.classList.toggle('hidden', !isExpanded);
    openIcon?.classList.toggle('hidden', isExpanded);
    closeIcon?.classList.toggle('hidden', !isExpanded);
  };

  btn.addEventListener('click', () => toggleMenu());

  navLinks?.forEach((link) => {
    link.addEventListener('click', () => toggleMenu(false));
  });
}

/**
 * 3. SCROLL CHOREOGRAPHY & STAGE PINNING ENGINE
 * Single requestAnimationFrame loop calculating normalized stage progress [0, 1]
 */
function initScrollChoreography(): void {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const heroContainer = document.querySelector('.stage-hero-container') as HTMLElement | null;
  const revealContainer = document.querySelector('.stage-reveal-container') as HTMLElement | null;
  const darkContainer = document.querySelector('.stage-dark-container') as HTMLElement | null;
  const offerSection = document.getElementById('oferta') as HTMLElement | null;
  const footerElement = document.querySelector('footer') as HTMLElement | null;
  const mobileBuyBar = document.getElementById('mobile-buy-bar');

  const darkFeatureItems = document.querySelectorAll<HTMLElement>('.dark-feature-item');
  let currentDarkIndex = -1;

  let ticking = false;

  const calculateStageProgress = (container: HTMLElement | null): number => {
    if (!container) return 0;
    const rect = container.getBoundingClientRect();
    const scrollDistance = container.offsetHeight - window.innerHeight;
    if (scrollDistance <= 0) return 0;
    const topOffset = -rect.top;
    const progress = Math.max(0, Math.min(1, topOffset / scrollDistance));
    return progress;
  };

  const updateScrollStates = () => {
    const scrollY = window.scrollY;

    // --- Estágio 1: Hero Editorial ---
    if (heroContainer) {
      const heroProgress = calculateStageProgress(heroContainer);
      heroContainer.style.setProperty('--hero-progress', heroProgress.toFixed(4));
    }

    // --- Estágio 2: Revelação da Imagem (clip-path de baixo para cima) ---
    if (revealContainer) {
      const revealProgress = calculateStageProgress(revealContainer);
      revealContainer.style.setProperty('--reveal-progress', revealProgress.toFixed(4));
    }

    // --- Estágio 3: Características Técnicas em Fundo Escuro ---
    if (darkContainer) {
      const darkProgress = calculateStageProgress(darkContainer);
      darkContainer.style.setProperty('--dark-progress', darkProgress.toFixed(4));

      // Atualiza o item ativo preservando contraste e sem piscar DOM
      const targetDarkIndex = Math.min(3, Math.floor(darkProgress * 4));
      if (targetDarkIndex !== currentDarkIndex && darkFeatureItems.length > 0) {
        currentDarkIndex = targetDarkIndex;
        darkFeatureItems.forEach((item, index) => {
          if (index === currentDarkIndex) {
            item.classList.add('is-active');
          } else {
            item.classList.remove('is-active');
          }
        });
      }
    }

    // --- Barra Fixa de Compra Mobile ---
    if (mobileBuyBar) {
      const passedHero = scrollY > (heroContainer?.offsetHeight || 600) * 0.7;
      
      let inOfferOrFooter = false;
      if (offerSection) {
        const offerRect = offerSection.getBoundingClientRect();
        if (offerRect.top <= window.innerHeight && offerRect.bottom >= 0) {
          inOfferOrFooter = true;
        }
      }
      if (footerElement) {
        const footerRect = footerElement.getBoundingClientRect();
        if (footerRect.top <= window.innerHeight) {
          inOfferOrFooter = true;
        }
      }

      if (passedHero && !inOfferOrFooter) {
        mobileBuyBar.classList.remove('translate-y-full');
      } else {
        mobileBuyBar.classList.add('translate-y-full');
      }
    }

    ticking = false;
  };

  const onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(updateScrollStates);
      ticking = true;
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });

  // Disparo inicial
  updateScrollStates();
}

/**
 * 4. INTERSECTION OBSERVER FOR EDITORIAL ENTRANCES
 * Single observer watching all [data-rev] elements
 */
function initIntersectionReveals(): void {
  const elements = document.querySelectorAll('[data-rev]');
  if (elements.length === 0) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          obs.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  elements.forEach((el) => observer.observe(el));
}

/**
 * 5. SMOOTH ANCHOR SCROLLING WITH HEADER OFFSET
 */
function initSmoothScroll(): void {
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 76;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    });
  });
}
