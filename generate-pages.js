const fs = require('fs');

const generateServicePage = (slug, title, image, contentHtml) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} | Hi Beam Infotech</title>
  <link rel="stylesheet" href="css/style.css" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
</head>
<body>

<nav id="navbar">
  <div class="container">
    <div class="nav-inner">
      <a href="/" class="nav-logo" aria-label="Hi Beam Infotech Home">
        <img src="logo.png" alt="Hi Beam Infotech Logo" class="nav-logo-img" style="height:44px; width:auto; border-radius:8px; box-shadow:0 4px 12px rgba(215,25,32,.4);" />
        <div class="nav-logo-text">
          <strong>Hi Beam Infotech</strong>
          <span>IT Solutions</span>
        </div>
      </a>
      <ul class="nav-links" id="navLinks">
        <li><a href="/">Home</a></li>
        <li><a href="/services" class="active">Our Services</a></li>
        <li><a href="/clients">Our Clients</a></li>
        <li><a href="/about">About Us</a></li>
        <li><a href="/contact" class="nav-cta">Contact Us</a></li>
      </ul>
    </div>
  </div>
</nav>

<section class="page-hero">
  <div class="container">
    <div class="page-hero-content">
      <div class="breadcrumb">
        <a href="/">Home</a>
        <i class="fa-solid fa-chevron-right"></i>
        <a href="/services">Our Services</a>
        <i class="fa-solid fa-chevron-right"></i>
        <span>${title}</span>
      </div>
      <h1>${title}</h1>
    </div>
  </div>
</section>

<section class="service-section">
  <div class="container">
    <div class="service-detail-grid">
      <div class="service-detail-img">
        <img src="${image}" alt="${title}" loading="lazy" />
      </div>
      <div class="service-detail-content">
        ${contentHtml}
        <div style="margin-top:28px;">
          <a href="/contact" class="btn btn-primary"><i class="fa-solid fa-envelope"></i> Get a Quote</a>
        </div>
      </div>
    </div>
  </div>
</section>

<footer class="footer">
  <div class="container">
    <div class="footer-top">
      <div class="footer-brand">
        <a href="/" class="nav-logo">
          <img src="logo.png" alt="Hi Beam Infotech Logo" class="nav-logo-img" style="height:44px; width:auto; border-radius:8px; box-shadow:0 4px 12px rgba(215,25,32,.4);" />
          <div class="nav-logo-text"><strong>Hi Beam Infotech</strong><span>IT Solutions</span></div>
        </a>
      </div>
    </div>
  </div>
</footer>
<script src="js/main.js"></script>
</body>
</html>`;

const services = [
  {
    slug: 'hardware',
    title: 'Hardware Procurement & Supply',
    image: 'https://images.unsplash.com/photo-1600267204091-5c1ab8b10c02?w=800&q=80',
    content: '<h2>Bulk Hardware Supply for Enterprises</h2><p>We specialized in large-scale supply of Dell, HP, Lenovo, and Cisco products. Our tender desk is fully equipped to deliver to government nodes seamlessly.</p>'
  },
  {
    slug: 'infrastructure',
    title: 'IT Infrastructure & Cloud Architecture',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
    content: '<h2>Data Center & Server Networking</h2><p>Building resilient structured cabling and deploying next-generation hyperconverged servers for campus scaling.</p>'
  },
  {
    slug: 'software',
    title: 'Software Licensing & Security Solutions',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80',
    content: '<h2>Enterprise Security Audits</h2><p>We provide authorized endpoints, firewalls, and Microsoft 365 licensing alongside world-class SIEM log monitoring.</p>'
  },
  {
    slug: 'managed',
    title: 'Managed Services & AMC',
    image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80',
    content: '<h2>Complete IT Management</h2><p>Providing robust Annual Maintenance Contracts, with on-site resident engineers and high SLA uptime compliance.</p>'
  }
];

services.forEach(svc => {
  fs.writeFileSync(svc.slug + '.html', generateServicePage(svc.slug, svc.title, svc.image, svc.content));
});

// Update services.html links to point to these pages instead of anchors
let servicesHtml = fs.readFileSync('services.html', 'utf8');
servicesHtml = servicesHtml.replace(/href="services(#\w+)"/g, (match, hash) => `href="/${hash.substring(1)}"`);
fs.writeFileSync('services.html', servicesHtml);
