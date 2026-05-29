/**
* Template Name: iPortfolio
* Updated: Jul 27 2023 with Bootstrap v5.3.1
* Template URL: https://bootstrapmade.com/iportfolio-bootstrap-portfolio-websites-template/
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/
(function() {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }

  /**
   * Easy on scroll event listener 
   */
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener)
  }

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = select('#navbar .scrollto', true)
  const navbarlinksActive = () => {
    let position = window.scrollY + Math.min(360, window.innerHeight * 0.36)
    navbarlinks.forEach(navbarlink => {
      if (!navbarlink.hash) return
      let section = select(navbarlink.hash)
      if (!section) return
      const sectionTop = section.getBoundingClientRect().top + window.scrollY
      if (position >= sectionTop && position <= (sectionTop + section.offsetHeight)) {
        navbarlink.classList.add('active')
      } else {
        navbarlink.classList.remove('active')
      }
    })
  }
  window.addEventListener('load', navbarlinksActive)
  onscroll(document, navbarlinksActive)

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    const target = select(el)
    if (!target) return
    let elementPos = target.getBoundingClientRect().top + window.scrollY
    window.scrollTo({
      top: elementPos,
      behavior: 'smooth'
    })
  }

  const scrollToHash = () => {
    if (window.location.hash && select(window.location.hash)) {
      setTimeout(() => scrollto(window.location.hash), 80)
    }
  }

  /**
   * Back to top button
   */
  let backtotop = select('.back-to-top')
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add('active')
      } else {
        backtotop.classList.remove('active')
      }
    }
    window.addEventListener('load', toggleBacktotop)
    onscroll(document, toggleBacktotop)
  }

  /**
   * Mobile nav toggle
   */
  on('click', '.mobile-nav-toggle', function(e) {
    const body = select('body')
    body.classList.toggle('mobile-nav-active')
    this.classList.toggle('bi-list')
    this.classList.toggle('bi-x')
  })

  const mobileNavOverlay = select('.mobile-nav-overly')
  const mobileNavToggle = select('.mobile-nav-toggle')
  if (mobileNavOverlay) {
    mobileNavOverlay.addEventListener('click', () => {
      const body = select('body')
      if (body.classList.contains('mobile-nav-active')) {
        body.classList.remove('mobile-nav-active')
        mobileNavToggle.classList.add('bi-list')
        mobileNavToggle.classList.remove('bi-x')
      }
    })
  }

  /**
   * Scrool with ofset on links with a class name .scrollto
   */
  on('click', '.scrollto', function(e) {
    if (select(this.hash)) {
      e.preventDefault()

      let body = select('body')
      if (body.classList.contains('mobile-nav-active')) {
        body.classList.remove('mobile-nav-active')
        let navbarToggle = select('.mobile-nav-toggle')
        navbarToggle.classList.toggle('bi-list')
        navbarToggle.classList.toggle('bi-x')
      }
      scrollto(this.hash)
      if (history.pushState) {
        history.pushState(null, '', this.hash)
      }
    }
  }, true)

  /**
   * Scroll with ofset on page load with hash links in the url
   */
  window.addEventListener('load', () => {
    scrollToHash()
  });

  window.addEventListener('hashchange', () => {
    scrollToHash()
  });

  scrollToHash()

  /**
   * Hero type effect
   */
  const typed = select('.typed')
  if (typed && typeof Typed !== 'undefined') {
    let typed_strings = typed.getAttribute('data-typed-items')
    typed_strings = typed_strings.split(',')
    new Typed('.typed', {
      strings: typed_strings,
      loop: true,
      typeSpeed: 60,
      backSpeed: 35,
      backDelay: 1500
    });
  }

  /**
   * Theme mode picker
   */
  const themeOptions = select('.theme-option', true);
  const applyTheme = (mode) => {
    if (!mode) return;
    const body = select('body');
    body.classList.remove('mode-neon', 'mode-dark', 'mode-light');
    body.classList.add(`mode-${mode}`);
    if (themeOptions) {
      themeOptions.forEach((button) => {
        button.classList.toggle('active', button.dataset.mode === mode);
      });
    }
    localStorage.setItem('portfolioTheme', mode);
  };

  const storedTheme = localStorage.getItem('portfolioTheme') || 'neon';
  applyTheme(storedTheme);

  if (themeOptions) {
    themeOptions.forEach((button) => {
      button.addEventListener('click', function () {
        applyTheme(this.dataset.mode);
      });
    });
  }

  /**
   * Interactive card tilt
   */
  const tiltCards = select('.portfolio-wrap, .skill-card, .service-card, .fact-card, .about-panel-item, .resume-item', true);
  if (tiltCards && window.matchMedia('(pointer: fine)').matches) {
    tiltCards.forEach((card) => {
      card.addEventListener('pointermove', (event) => {
        const rect = card.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width - 0.5) * 8;
        const y = ((event.clientY - rect.top) / rect.height - 0.5) * -8;
        card.style.setProperty('--tilt-x', `${y}deg`);
        card.style.setProperty('--tilt-y', `${x}deg`);
        card.classList.add('is-tilting');
      });
      card.addEventListener('pointerleave', () => {
        card.classList.remove('is-tilting');
        card.style.removeProperty('--tilt-x');
        card.style.removeProperty('--tilt-y');
      });
    });
  }

  /**
   * Smooth reveal animation
   */
  const revealTargets = select('section, .portfolio-item, .resume-item, .skill-card, .service-card, .fact-card', true);
  if (revealTargets && 'IntersectionObserver' in window) {
    revealTargets.forEach((target) => target.classList.add('reveal-item'));
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12
    });
    revealTargets.forEach((target) => revealObserver.observe(target));
  }

  /**
   * Skills animation
   */
  let skilsContent = select('.skills-content');
  if (skilsContent && typeof Waypoint !== 'undefined') {
    new Waypoint({
      element: skilsContent,
      offset: '80%',
      handler: function(direction) {
        let progress = select('.progress .progress-bar', true);
        progress.forEach((el) => {
          el.style.width = el.getAttribute('aria-valuenow') + '%'
        });
      }
    })
  }

  /**
   * Porfolio isotope and filter
   */
  window.addEventListener('load', () => {
    let portfolioContainer = select('.portfolio-container');
    if (portfolioContainer) {
      if (typeof Isotope === 'undefined') return;
      let portfolioIsotope = new Isotope(portfolioContainer, {
        itemSelector: '.portfolio-item'
      });

      let portfolioFilters = select('#portfolio-flters li', true);

      on('click', '#portfolio-flters li', function(e) {
        e.preventDefault();
        portfolioFilters.forEach(function(el) {
          el.classList.remove('filter-active');
        });
        this.classList.add('filter-active');

        portfolioIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        portfolioIsotope.on('arrangeComplete', function() {
          if (typeof AOS !== 'undefined') AOS.refresh()
        });
      }, true);
    }

  });

  /**
   * Initiate portfolio lightbox 
   */
  if (typeof GLightbox !== 'undefined') {
    GLightbox({
      selector: '.portfolio-lightbox'
    });
  }

  /**
   * Portfolio details slider
   */
  if (typeof Swiper !== 'undefined') {
    new Swiper('.portfolio-details-slider', {
      speed: 400,
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false
      },
      pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true
      }
    });
  }

  /**
   * Testimonials slider
   */
  if (typeof Swiper !== 'undefined') {
    new Swiper('.testimonials-slider', {
      speed: 600,
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false
      },
      slidesPerView: 'auto',
      pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true
      },
      breakpoints: {
        320: {
          slidesPerView: 1,
          spaceBetween: 20
        },

        1200: {
          slidesPerView: 3,
          spaceBetween: 20
        }
      }
    });
  }

  /**
   * Animation on scroll
   */
  window.addEventListener('load', () => {
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 1000,
        easing: 'ease-in-out',
        once: true,
        mirror: false
      })
    }
  });

  /**
   * Initiate Pure Counter 
   */
  if (typeof PureCounter !== 'undefined') {
    new PureCounter();
  }

})()
