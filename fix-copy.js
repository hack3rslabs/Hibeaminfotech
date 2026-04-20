const fs = require('fs');

const files = ['index.html','about.html','clients.html','contact.html','services.html','hardware.html','infrastructure.html','software.html','managed.html'];

files.forEach(f => {
  if (!fs.existsSync(f)) return;
  let c = fs.readFileSync(f, 'utf8');
  // Update copyright year
  c = c.replace(/© 2024 Hi Beam Infotech/g, '© 2012–2026 Hi Beam Infotech');
  c = c.replace(/© 2012-2026 Hi Beam Infotech/g, '© 2012–2026 Hi Beam Infotech');
  fs.writeFileSync(f, c, 'utf8');
  console.log('Updated:', f);
});
