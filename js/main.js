/* ============================================================
   HI BEAM INFOTECH — SHARED JAVASCRIPT
   Nav | Scroll Animations | Support Modal | Form Handling
   ============================================================ */

// ── HELPERS
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

// ── SET ACTIVE NAV LINK
(function setActiveNav() {
  const rawPath = window.location.pathname;
  const path = rawPath.replace(/\.html$/, '').split('/').pop() || '';
  $$('.nav-links a').forEach(a => {
    let href = a.getAttribute('href').split('/').pop();
    if (href === path || (path === '' && href === '')) {
      a.classList.add('active');
    }
  });
})();

// ── STICKY NAVBAR
const navbar = $('#navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });
}

// ── MOBILE TOGGLE
const navToggle = $('#navToggle');
const navLinks  = $('#navLinks');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    navToggle.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });
  $$('.nav-links a').forEach(a => a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    document.body.style.overflow = '';
  }));
}

// ── SCROLL REVEAL ANIMATIONS
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

$$('.reveal').forEach(el => revealObserver.observe(el));

// ── COUNTER ANIMATION
function animateCounter(el, end, duration = 1600) {
  let start = 0;
  const step = end / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= end) { el.textContent = end; clearInterval(timer); return; }
    el.textContent = Math.floor(start);
  }, 16);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const end = parseInt(el.dataset.count, 10);
      animateCounter(el, end);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });
$$('[data-count]').forEach(el => counterObserver.observe(el));

// ── HERO SLIDER ──────────────────────────────────────────
(function initSlider() {
  const slider = $('#heroSlider');
  if (!slider) return;

  const slides = $$('.hero-slide', slider);
  const dots   = $$('.slider-dot', slider);
  const prev   = $('#sliderPrev');
  const next   = $('#sliderNext');
  let current  = 0;
  let timer;

  function showSlide(idx) {
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active');
    if (dots[current]) dots[current].classList.add('active');
  }

  function nextSlide() { showSlide(current + 1); }
  function prevSlide() { showSlide(current - 1); }

  function startAutoPlay() {
    stopAutoPlay();
    timer = setInterval(nextSlide, 5000);
  }
  function stopAutoPlay() { clearInterval(timer); }

  if (next) next.addEventListener('click', () => { nextSlide(); startAutoPlay(); });
  if (prev) prev.addEventListener('click', () => { prevSlide(); startAutoPlay(); });
  dots.forEach((dot, i) => { dot.addEventListener('click', () => { showSlide(i); startAutoPlay(); }); });

  slider.addEventListener('mouseenter', stopAutoPlay);
  slider.addEventListener('mouseleave', startAutoPlay);
  startAutoPlay();
})();

// ── SUPPORT MODAL ─────────────────────────────────────────
const modalOverlay  = $('#supportModal');
const floatingBtn   = $('#floatingHelpBtn');
const modalCloseBtn = $('#modalClose');

function openModal()  { modalOverlay && modalOverlay.classList.add('open');    document.body.style.overflow = 'hidden'; }
function closeModal() { modalOverlay && modalOverlay.classList.remove('open'); document.body.style.overflow = ''; }

if (floatingBtn)   floatingBtn.addEventListener('click', openModal);
if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
if (modalOverlay)  modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });

// Modal tabs
$$('.modal-tab').forEach(tab => {
  tab.addEventListener('click', function () {
    $$('.modal-tab').forEach(t => t.classList.remove('active'));
    this.classList.add('active');
    const type = this.dataset.tab;
    $$('.modal-form .field-group').forEach(fg => fg.classList.remove('visible'));
    const group = $(`#modal-${type}-fields`);
    if (group) group.classList.add('visible');
  });
});

// ── VALIDATION & FORMS
function validateEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }
function validatePhone(phone) { const clean = phone.replace(/\D/g, ''); return clean.length === 10; }
function showError(input, message) { input.classList.add('error'); input.focus(); alert(message); }
function clearErrors() { $$('input, textarea, select').forEach(el => el.classList.remove('error')); }

// Modal Form
const modalForm = $('#modalSupportForm');
if (modalForm) {
  modalForm.addEventListener('submit', e => {
    e.preventDefault();
    clearErrors();
    const name = modalForm.querySelector('[name="modal_name"]');
    const phone = modalForm.querySelector('[name="modal_phone"]');
    const message = modalForm.querySelector('[name="modal_message"]');
    
    if (!name.value.trim()) return showError(name, 'Full name is required.');
    if (!validatePhone(phone.value)) return showError(phone, 'Enter 10-digit mobile number.');
    if (!message.value.trim()) return showError(message, 'Description is required.');

    const activeTab = $('.modal-tab.active');
    const type = activeTab ? activeTab.dataset.tab : 'support';
    const baseNumber = '918045729158';
    let waMsg = `*${type === 'support' ? 'Support Ticket' : 'Sales Enquiry'}*\nName: ${name.value}\nPhone: ${phone.value}\nMessage: ${message.value}`;

    window.open(`https://wa.me/${baseNumber}?text=${encodeURIComponent(waMsg)}`, '_blank');
    closeModal();
    modalForm.reset();
  });
}

// Main Contact Form
const contactForm = $('#mainContactForm');
if (contactForm && $('#sales-fields')) {
  // Enquiry type toggle
  $$('.type-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      $$('.type-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const type = this.dataset.type;
      $$('.field-group').forEach(fg => fg.classList.remove('visible'));
      $(`#${type}-fields`)?.classList.add('visible');
    });
  });

  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    clearErrors();
    const name = $('#name');
    const org = $('#organization');
    const email = $('#email');
    const phone = $('#phone');
    const msg = $('#message');

    if (!name.value.trim()) return showError(name, 'Name is required.');
    if (!org.value.trim()) return showError(org, 'Organization is required.');
    if (!validateEmail(email.value)) return showError(email, 'Valid email required.');
    if (!validatePhone(phone.value)) return showError(phone, 'Enter 10-digit mobile.');
    if (!msg.value.trim()) return showError(msg, 'Message is required.');

    const type = $('.type-btn.active')?.dataset.type || 'sales';
    const body = `Name: ${name.value}\nOrg: ${org.value}\nPhone: ${phone.value}\n\n${msg.value}`;
    window.location.href = `mailto:support@hibeaminfotech.com?subject=${type} Request&body=${encodeURIComponent(body)}`;
    contactForm.style.display = 'none';
    $('#formSuccess')?.classList.add('visible');
  });
}

// Clients filter
$$('.filter-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    $$('.filter-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    const filter = this.dataset.filter;
    $$('.client-card').forEach(card => {
      card.style.display = (filter === 'all' || card.dataset.category === filter) ? '' : 'none';
    });
  });
});

console.log('%c⚡ Hi Beam Infotech IT Solutions', 'color:#D71920;font-weight:900;font-size:16px;');
