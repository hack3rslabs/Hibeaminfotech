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
    // Animate hamburger lines
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });
  // Close on link click
  $$('.nav-links a').forEach(a => a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    document.body.style.overflow = '';
  }));
  // Close on outside click
  document.addEventListener('click', e => {
    if (!navbar.contains(e.target) && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
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

// ── SUPPORT MODAL ─────────────────────────────────────────
const modalOverlay  = $('#supportModal');
const floatingBtn   = $('#floatingHelpBtn');
const modalCloseBtn = $('#modalClose');

function openModal()  { modalOverlay && modalOverlay.classList.add('open');    document.body.style.overflow = 'hidden'; }
function closeModal() { modalOverlay && modalOverlay.classList.remove('open'); document.body.style.overflow = ''; }

if (floatingBtn)   floatingBtn.addEventListener('click', openModal);
if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
if (modalOverlay)  modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// Modal tabs (Support Ticket | Sales Enquiry)
$$('.modal-tab').forEach(tab => {
  tab.addEventListener('click', function () {
    $$('.modal-tab').forEach(t => t.classList.remove('active'));
    this.classList.add('active');
    const type = this.dataset.tab;
    $$('.modal-form .field-group').forEach(fg => fg.classList.remove('visible'));
    const group = $(`#modal-${type}-fields`);
    if (group) group.classList.add('visible');
    // Update WhatsApp message target
    updateWhatsAppBtn(type);
  });
});

function updateWhatsAppBtn(type) {
  const waBtn = $('#modalWhatsApp');
  if (!waBtn) return;
  const baseNumber = '918045729158';
  const msg = type === 'support'
    ? 'Hello Hi Beam Infotech! I need technical support. Please help me raise a support ticket.'
    : 'Hello Hi Beam Infotech! I am interested in your products/services. Please assist with a sales enquiry.';
  waBtn.href = `https://wa.me/${baseNumber}?text=${encodeURIComponent(msg)}`;
}
// Init WhatsApp link
updateWhatsAppBtn('support');

// ── MODAL FORM SUBMIT
const modalForm = $('#modalSupportForm');
if (modalForm) {
  modalForm.addEventListener('submit', e => {
    e.preventDefault();
    const activeTab = $('.modal-tab.active');
    const type = activeTab ? activeTab.dataset.tab : 'support';
    const name = modalForm.querySelector('[name="modal_name"]')?.value || '';
    const phone = modalForm.querySelector('[name="modal_phone"]')?.value || '';
    const message = modalForm.querySelector('[name="modal_message"]')?.value || '';
    const email = modalForm.querySelector('[name="modal_email"]')?.value || '';

    // Compose WhatsApp message with form data
    const baseNumber = '918045729158';
    let waMsg;
    if (type === 'support') {
      const ticketType = modalForm.querySelector('[name="ticket_type"]')?.value || 'General';
      waMsg = `*Support Ticket Request*\nName: ${name}\nPhone: ${phone}\nEmail: ${email}\nTicket Type: ${ticketType}\nIssue: ${message}`;
    } else {
      const product = modalForm.querySelector('[name="product_interest"]')?.value || 'General';
      waMsg = `*Sales Enquiry*\nName: ${name}\nPhone: ${phone}\nEmail: ${email}\nInterested In: ${product}\nRequirement: ${message}`;
    }

    // Open WhatsApp with pre-filled message
    window.open(`https://wa.me/${baseNumber}?text=${encodeURIComponent(waMsg)}`, '_blank');
    closeModal();
    modalForm.reset();
  });
}

// ── MAIN CONTACT PAGE FORM ────────────────────────────────
const contactForm = $('#mainContactForm');
if (contactForm) {
  // Enquiry type toggle
  $$('.type-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      $$('.type-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const type = this.dataset.type;
      $$('.field-group').forEach(fg => fg.classList.remove('visible'));
      const group = $(`#${type}-fields`);
      if (group) group.classList.add('visible');
    });
  });
  // Trigger default
  const defaultBtn = $('.type-btn[data-type="sales"]');
  if (defaultBtn) defaultBtn.click();

  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const formData = new FormData(contactForm);
    const type     = $('.type-btn.active')?.dataset.type || 'sales';
    const name     = formData.get('name') || '';
    const email    = formData.get('email') || '';
    const phone    = formData.get('phone') || '';
    const org      = formData.get('organization') || '';
    const message  = formData.get('message') || '';

    // Build email mailto link as primary
    const subject  = type === 'sales' ? 'Sales Enquiry — Hi Beam Infotech' : 'Support Ticket — Hi Beam Infotech';
    let body;

    if (type === 'sales') {
      const product = formData.get('product_interest') || '';
      const budget  = formData.get('budget') || '';
      body = `Name: ${name}\nOrganization: ${org}\nEmail: ${email}\nPhone: ${phone}\nProduct Interest: ${product}\nBudget: ${budget}\n\nRequirement:\n${message}`;
    } else {
      const ticketType = formData.get('ticket_type') || '';
      const priority   = formData.get('priority') || '';
      body = `Name: ${name}\nOrganization: ${org}\nEmail: ${email}\nPhone: ${phone}\nTicket Type: ${ticketType}\nPriority: ${priority}\n\nIssue Description:\n${message}`;
    }

    // Open mailto
    window.location.href = `mailto:support@hibeaminfotech.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // Show success message
    const success = $('#formSuccess');
    if (success) {
      contactForm.style.display = 'none';
      success.classList.add('visible');
    }
  });
}

// ── CLIENTS FILTER
$$('.filter-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    $$('.filter-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    const filter = this.dataset.filter;
    $$('.client-card').forEach(card => {
      if (filter === 'all' || card.dataset.category === filter) {
        card.style.display = '';
        setTimeout(() => card.style.opacity = '1', 10);
      } else {
        card.style.opacity = '0';
        setTimeout(() => card.style.display = 'none', 300);
      }
    });
  });
});

console.log('%c⚡ Hi Beam Infotech IT Solutions', 'color:#D71920;font-weight:900;font-size:16px;');
console.log('%cDeveloped by TWIIS Innovations — https://twiis.in', 'color:#56A0D3;font-size:12px;');
