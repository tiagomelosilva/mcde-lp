(function () {
  const body = document.body;

  function qs(sel, root) {
    return (root || document).querySelector(sel);
  }

  function qsa(sel, root) {
    return Array.from((root || document).querySelectorAll(sel));
  }

  function openLock() {
    body.classList.add('modal-lock');
  }

  function closeLock() {
    body.classList.remove('modal-lock');
  }

  const menuToggle = qs('#menuToggle');
  const mainNav = qs('#mainNav');
  const navbar = qs('#topo');
  const logoLink = qs('.logo-link');

  if (menuToggle && mainNav) {
    function closeMainNav() {
      mainNav.classList.remove('is-open');
      menuToggle.classList.remove('is-active');
      menuToggle.setAttribute('aria-expanded', 'false');
    }

    function openMainNav() {
      mainNav.classList.add('is-open');
      menuToggle.classList.add('is-active');
      menuToggle.setAttribute('aria-expanded', 'true');
    }

    menuToggle.addEventListener('click', function () {
      const open = mainNav.classList.contains('is-open');
      if (open) {
        closeMainNav();
        return;
      }
      openMainNav();
    });

    document.addEventListener('click', function (event) {
      if (navbar && !navbar.contains(event.target)) {
        closeMainNav();
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 1024) {
        closeMainNav();
      }
    });

    qsa('a', mainNav).forEach(function (link) {
      link.addEventListener('click', function (event) {
        const href = link.getAttribute('href') || '';
        if (!href.startsWith('#')) {
          if (window.innerWidth <= 1024) closeMainNav();
          return;
        }

        const target = qs(href);
        if (!target) {
          if (window.innerWidth <= 1024) closeMainNav();
          return;
        }

        event.preventDefault();

        const headerOffset = navbar ? navbar.offsetHeight + 8 : 0;
        const targetTop = target.getBoundingClientRect().top + window.scrollY - headerOffset;
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        window.scrollTo({
          top: Math.max(0, targetTop),
          behavior: reduceMotion ? 'auto' : 'smooth'
        });

        if (window.history && window.history.pushState) {
          window.history.pushState(null, '', href);
        }

        if (window.innerWidth <= 1024) {
          closeMainNav();
        }
      });
    });

    if (!menuToggle.hasAttribute('aria-controls')) {
      menuToggle.setAttribute('aria-controls', 'mainNav');
    }
    if (!menuToggle.hasAttribute('aria-expanded')) {
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  }

  if (logoLink) {
    logoLink.addEventListener('click', function (event) {
      const href = logoLink.getAttribute('href') || '';
      if (!href.startsWith('#')) return;

      event.preventDefault();
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({
        top: 0,
        behavior: reduceMotion ? 'auto' : 'smooth'
      });

      if (window.history && window.history.pushState) {
        window.history.pushState(null, '', href);
      }
    });
  }

  const slides = qsa('.hero-slide');
  const heroPrev = qs('#heroPrev');
  const heroNext = qs('#heroNext');
  const heroDots = qs('#heroDots');
  let heroIndex = 0;
  let heroTimer = null;

  slides.forEach(function (slide) {
    const bg = slide.getAttribute('data-bg');
    if (bg) {
      slide.style.backgroundImage = 'url("' + bg + '")';
    }
  });

  function renderHeroDots() {
    if (!heroDots) return;
    heroDots.innerHTML = '';
    slides.forEach(function (_, i) {
      const b = document.createElement('button');
      b.type = 'button';
      if (i === heroIndex) b.classList.add('is-active');
      b.addEventListener('click', function () {
        showHero(i);
        startHeroAuto();
      });
      heroDots.appendChild(b);
    });
  }

  function showHero(index) {
    slides.forEach(function (s, i) {
      const active = i === index;
      s.classList.toggle('is-active', active);
      s.setAttribute('aria-hidden', active ? 'false' : 'true');
    });
    heroIndex = index;
    renderHeroDots();
  }

  function nextHero() {
    showHero((heroIndex + 1) % slides.length);
  }

  function prevHero() {
    showHero((heroIndex - 1 + slides.length) % slides.length);
  }

  function startHeroAuto() {
    if (heroTimer) clearInterval(heroTimer);
    heroTimer = setInterval(nextHero, 7000);
  }

  if (slides.length) {
    showHero(0);
    startHeroAuto();
    if (heroNext) {
      heroNext.addEventListener('click', function () {
        nextHero();
        startHeroAuto();
      });
    }
    if (heroPrev) {
      heroPrev.addEventListener('click', function () {
        prevHero();
        startHeroAuto();
      });
    }
  }

  const contentModal = qs('#contentModal');
  const modalTitle = qs('#modalTitle');
  const modalText = qs('#modalText');
  const modalClose = qs('#modalClose');

  function openContentModal(title, text) {
    if (!contentModal) return;
    modalTitle.textContent = title || 'Detalhes';
    modalText.textContent = text || '';
    contentModal.classList.add('is-open');
    contentModal.setAttribute('aria-hidden', 'false');
    openLock();
  }

  function closeContentModal() {
    if (!contentModal) return;
    contentModal.classList.remove('is-open');
    contentModal.setAttribute('aria-hidden', 'true');
    closeLock();
  }

  qsa('.servico').forEach(function (card) {
    const btn = qs('.open-modal', card);
    if (!btn) return;
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      openContentModal(card.getAttribute('data-title'), card.getAttribute('data-text'));
    });
  });

  qsa('.sistema-item .open-modal').forEach(function (btn) {
    btn.addEventListener('click', function () {
      openContentModal(btn.getAttribute('data-title'), btn.getAttribute('data-text'));
    });
  });

  const vagasTrack = qs('#vagasTrack');
  if (vagasTrack) {
    vagasTrack.addEventListener('click', function (e) {
      if (e.target.closest('.vaga-cta')) return;
      const card = e.target.closest('.vaga-card');
      if (!card || !vagasTrack.contains(card)) return;
      openContentModal(card.getAttribute('data-title'), card.getAttribute('data-text'));
    });
  }

  if (modalClose) {
    modalClose.addEventListener('click', closeContentModal);
  }

  if (contentModal) {
    contentModal.addEventListener('click', function (e) {
      if (e.target.matches('[data-close-modal="true"]')) {
        closeContentModal();
      }
    });
  }

  const galleryData = {
    educacao: [
      { src: 'images/galeria-educacao/em-joao-candido-01.jpg', caption: 'Educação - EM João Cândido 01' },
      { src: 'images/galeria-educacao/em-joao-candido-02.jpg', caption: 'Educação - EM João Cândido 02' },
      { src: 'images/galeria-educacao/em-levina-01.jpg', caption: 'Educação - EM Levina 01' },
      { src: 'images/galeria-educacao/em-levina-02.jpg', caption: 'Educação - EM Levina 02' },
      { src: 'images/galeria-educacao/em-telma-regina-01.jpg', caption: 'Educação - EM Telma Regina 01' },
      { src: 'images/galeria-educacao/em-telma-regina-02.jpg', caption: 'Educação - EM Telma Regina 02' }
    ],
    saude: [
      { src: 'images/galera-saude/saude-01.jpg', caption: 'Saúde - Unidade 01' },
      { src: 'images/galera-saude/saude-02.jpg', caption: 'Saúde - Unidade 02' },
      { src: 'images/galera-saude/saude-03.jpg', caption: 'Saúde - Unidade 03' },
      { src: 'images/galera-saude/saude-04.jpg', caption: 'Saúde - Unidade 04' },
      { src: 'images/galera-saude/saude-05.jpg', caption: 'Saúde - Unidade 05' }
    ],
    administracao: [
      { src: 'images/galeria-administracao/adm-01.jpg', caption: 'Administração - Unidade 01' },
      { src: 'images/galeria-administracao/adm-02.jpg', caption: 'Administração - Unidade 02' },
      { src: 'images/galeria-administracao/adm-03.jpg', caption: 'Administração - Unidade 03' },
      { src: 'images/galeria-administracao/adm-04.jpg', caption: 'Administração - Unidade 04' },
      { src: 'images/galeria-administracao/adm-05.jpg', caption: 'Administração - Unidade 05' },
      { src: 'images/galeria-administracao/adm-06.jpg', caption: 'Administração - Unidade 06' }
    ]
  };

  const galleryModal = qs('#galleryModal');
  const galleryImage = qs('#galleryImage');
  const galleryCaption = qs('#galleryCaption');
  const galleryClose = qs('#galleryClose');
  const galleryPrev = qs('#galleryPrev');
  const galleryNext = qs('#galleryNext');
  let galleryList = [];
  let galleryIndex = 0;

  function renderGallery() {
    if (!galleryList.length) return;
    const item = galleryList[galleryIndex];
    galleryImage.src = item.src;
    galleryCaption.textContent = item.caption;
  }

  function openGallery(list, index) {
    galleryList = list;
    galleryIndex = index;
    renderGallery();
    galleryModal.classList.add('is-open');
    galleryModal.setAttribute('aria-hidden', 'false');
    openLock();
  }

  function closeGallery() {
    galleryModal.classList.remove('is-open');
    galleryModal.setAttribute('aria-hidden', 'true');
    galleryImage.src = '';
    closeLock();
  }

  function nextGallery() {
    if (!galleryList.length) return;
    galleryIndex = (galleryIndex + 1) % galleryList.length;
    renderGallery();
  }

  function prevGallery() {
    if (!galleryList.length) return;
    galleryIndex = (galleryIndex - 1 + galleryList.length) % galleryList.length;
    renderGallery();
  }

  qsa('.open-gallery, .projeto-click').forEach(function (trigger) {
    const key = trigger.getAttribute('data-gallery');
    if (!galleryData[key]) return;
    trigger.addEventListener('click', function () {
      openGallery(galleryData[key], 0);
    });
  });

  if (galleryNext) galleryNext.addEventListener('click', nextGallery);
  if (galleryPrev) galleryPrev.addEventListener('click', prevGallery);
  if (galleryClose) galleryClose.addEventListener('click', closeGallery);

  if (galleryModal) {
    galleryModal.addEventListener('click', function (e) {
      if (e.target.matches('[data-close-gallery="true"]')) {
        closeGallery();
      }
    });
  }

  const counters = qsa('.counter');
  let countersStarted = false;

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'), 10) || 0;
    const duration = 1800;
    const start = performance.now();

    function frame(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = String(Math.round(target * eased));
      if (p < 1) {
        requestAnimationFrame(frame);
      }
    }

    requestAnimationFrame(frame);
  }

  const resultsSection = qs('#resultados');
  if (resultsSection && counters.length) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !countersStarted) {
          countersStarted = true;
          counters.forEach(animateCounter);
          io.disconnect();
        }
      });
    }, { threshold: 0.35 });

    io.observe(resultsSection);
  }

  const depTrack = qs('#depTrack');
  const depPrev = qs('#depPrev');
  const depNext = qs('#depNext');
  const depViewport = qs('.depoimentos-viewport');

  if (depTrack) {
    const depCards = Array.from(depTrack.children);
    const depReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let depOffset = 0;
    let depSetWidth = 0;
    let depRaf = null;
    let depLastTs = 0;
    let depPaused = false;
    const depSpeed = 48;

    function depCloneCards() {
      depCards.forEach(function (card) {
        const clone = card.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        depTrack.appendChild(clone);
      });
    }

    function depWrapOffset() {
      if (!depSetWidth) return;
      while (depOffset < 0) depOffset += depSetWidth;
      while (depOffset >= depSetWidth) depOffset -= depSetWidth;
    }

    function depRender() {
      depTrack.style.transform = 'translateX(-' + depOffset + 'px)';
    }

    function depMeasure() {
      if (!depCards.length) return;
      const gap = parseFloat(window.getComputedStyle(depTrack).gap || '0') || 0;
      depSetWidth = depCards.reduce(function (acc, card) {
        return acc + card.getBoundingClientRect().width;
      }, 0) + (gap * Math.max(0, depCards.length - 1));
      depWrapOffset();
      depRender();
    }

    function depAnimate(ts) {
      if (!depLastTs) depLastTs = ts;
      const dt = (ts - depLastTs) / 1000;
      depLastTs = ts;
      depOffset += depSpeed * dt;
      depWrapOffset();
      depRender();
      depRaf = requestAnimationFrame(depAnimate);
    }

    function depStart() {
      if (depRaf || depPaused || depReducedMotion.matches) return;
      depLastTs = 0;
      depRaf = requestAnimationFrame(depAnimate);
    }

    function depStop() {
      if (!depRaf) return;
      cancelAnimationFrame(depRaf);
      depRaf = null;
    }

    function depStep(direction) {
      if (!depSetWidth || !depCards.length) return;
      depOffset += direction * (depSetWidth / depCards.length);
      depWrapOffset();
      depRender();
    }

    depCloneCards();
    depMeasure();
    depStart();

    if (depNext) {
      depNext.addEventListener('click', function () {
        depStep(1);
      });
    }

    if (depPrev) {
      depPrev.addEventListener('click', function () {
        depStep(-1);
      });
    }

    if (depViewport) {
      depViewport.addEventListener('mouseenter', function () {
        depPaused = true;
        depStop();
      });

      depViewport.addEventListener('mouseleave', function () {
        depPaused = false;
        depStart();
      });
    }

    depTrack.addEventListener('focusin', function () {
      depPaused = true;
      depStop();
    });

    depTrack.addEventListener('focusout', function () {
      depPaused = false;
      depStart();
    });

    function depHandleMotionChange() {
      if (depReducedMotion.matches) {
        depStop();
      } else {
        depStart();
      }
    }

    if (typeof depReducedMotion.addEventListener === 'function') {
      depReducedMotion.addEventListener('change', depHandleMotionChange);
    } else if (typeof depReducedMotion.addListener === 'function') {
      depReducedMotion.addListener(depHandleMotionChange);
    }

    window.addEventListener('resize', function () {
      depMeasure();
    });
  }

  const vagasTrackEl = qs('#vagasTrack');
  const vagasUp = qs('#vagasUp');
  const vagasDown = qs('#vagasDown');
  if (vagasTrackEl) {
    const vagasOriginalCards = Array.from(vagasTrackEl.children);
    let vagasOffset = 0;
    let vagasSetSize = 0;
    let vagasStepSize = 0;
    let vagasRaf = null;
    let vagasLastTs = 0;
    let vagasPaused = false;
    const vagasSpeed = 24;

    function vagasIsHorizontal() {
      return window.innerWidth <= 1024;
    }

    function vagasCloneCards() {
      if (vagasOriginalCards.length <= 1) return;
      vagasOriginalCards.forEach(function (card) {
        const clone = card.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        vagasTrackEl.appendChild(clone);
      });
    }

    function vagasWrapOffset() {
      if (!vagasSetSize) return;
      while (vagasOffset >= vagasSetSize) vagasOffset -= vagasSetSize;
      while (vagasOffset < 0) vagasOffset += vagasSetSize;
    }

    function vagasRender() {
      if (vagasIsHorizontal()) {
        vagasTrackEl.style.transform = 'translate3d(' + (-vagasOffset) + 'px,0,0)';
      } else {
        vagasTrackEl.style.transform = 'translate3d(0,' + (-vagasOffset) + 'px,0)';
      }
    }

    function vagasMeasure() {
      if (!vagasOriginalCards.length) return;
      const gap = parseFloat(window.getComputedStyle(vagasTrackEl).gap || '0') || 0;
      vagasSetSize = vagasOriginalCards.reduce(function (acc, card) {
        const rect = card.getBoundingClientRect();
        return acc + (vagasIsHorizontal() ? rect.width : rect.height);
      }, 0) + (gap * Math.max(0, vagasOriginalCards.length - 1));
      vagasStepSize = vagasSetSize / Math.max(1, vagasOriginalCards.length);
      vagasWrapOffset();
      vagasRender();
    }

    function vagasAnimate(ts) {
      if (!vagasLastTs) vagasLastTs = ts;
      const dt = (ts - vagasLastTs) / 1000;
      vagasLastTs = ts;
      vagasOffset += vagasSpeed * dt;
      vagasWrapOffset();
      vagasRender();
      vagasRaf = requestAnimationFrame(vagasAnimate);
    }

    function vagasStart() {
      if (vagasRaf || vagasPaused || vagasOriginalCards.length <= 1) return;
      vagasLastTs = 0;
      vagasRaf = requestAnimationFrame(vagasAnimate);
    }

    function vagasStop() {
      if (!vagasRaf) return;
      cancelAnimationFrame(vagasRaf);
      vagasRaf = null;
    }

    function vagasStep(direction) {
      if (!vagasStepSize) return;
      vagasOffset += direction * vagasStepSize;
      vagasWrapOffset();
      vagasRender();
    }

    vagasCloneCards();
    vagasMeasure();
    vagasStart();

    if (vagasUp) {
      vagasUp.addEventListener('click', function () {
        vagasStep(-1);
      });
    }

    if (vagasDown) {
      vagasDown.addEventListener('click', function () {
        vagasStep(1);
      });
    }

    vagasTrackEl.addEventListener('mouseenter', function () {
      vagasPaused = true;
      vagasStop();
    });

    vagasTrackEl.addEventListener('mouseleave', function () {
      vagasPaused = false;
      vagasStart();
    });

    window.addEventListener('resize', function () {
      vagasMeasure();
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeContentModal();
      if (galleryModal && galleryModal.classList.contains('is-open')) {
        closeGallery();
      }
    }

    if (galleryModal && galleryModal.classList.contains('is-open')) {
      if (e.key === 'ArrowRight') nextGallery();
      if (e.key === 'ArrowLeft') prevGallery();
    }
  });
})();
