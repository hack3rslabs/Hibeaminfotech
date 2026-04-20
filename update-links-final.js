const fs = require('fs');

const files = ['index.html', 'about.html', 'clients.html', 'contact.html', 'services.html', 'hardware.html', 'infrastructure.html', 'software.html', 'managed.html'];

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace hash links inside services with absolute path
    content = content.replace(/href="services(#\w+)"/g, (match, hash) => `href="/${hash.substring(1)}"`);
    content = content.replace(/href="\/services(#\w+)"/g, (match, hash) => `href="/${hash.substring(1)}"`);
    
    // Replace href="services" with href="/services" and similar for top nav
    content = content.replace(/href="services"/g, 'href="/services"');
    content = content.replace(/href="clients"/g, 'href="/clients"');
    content = content.replace(/href="about"/g, 'href="/about"');
    content = content.replace(/href="contact"/g, 'href="/contact"');
    // Ensure the logo path is correct if they access from subpaths (though these are all in root)
    content = content.replace(/src="logo.png"/g, 'src="/logo.png"');
    
    fs.writeFileSync(file, content, 'utf8');
});

console.log('Final link update complete');
