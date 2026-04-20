const fs = require('fs');

const files = ['index.html', 'about.html', 'services.html', 'clients.html', 'contact.html'];

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace .html links
    content = content.replace(/href="([^"]+)\.html(#?[^"]*)"/g, 'href="$1$2"');
    
    // Replace logo div with image, except for the placeholder text inside it, replace whole div
    content = content.replace(/<div class="nav-logo-icon">HB<\/div>/g, '<img src="logo.png" alt="Hi Beam Infotech Logo" class="nav-logo-img" style="height:44px; width:auto; border-radius:8px; box-shadow:0 4px 12px rgba(215,25,32,.4);" />');

    // Make 'index' point to '/'
    content = content.replace(/href="index"/g, 'href="/"');

    fs.writeFileSync(file, content, 'utf8');
});

console.log('Update complete');
