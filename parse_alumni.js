const fs = require('fs');

try {
  const html = fs.readFileSync('alumni.html', 'utf8');
  // Match any ul that holds the primary nav (often has an id or class like 'menu' or 'nav')
  const uls = html.match(/<ul[^>]*>(.*?)<\/ul>/gis);
  if (!uls) {
    console.log("No uls found");
    process.exit();
  }
  
  // Try to find the one that typically has a bunch of top level items (nav / navbar / menu)
  for (let ul of uls) {
    if (ul.includes('menu-item') || ul.includes('nav')) {
      const lis = ul.match(/<li[^>]*>([\s\S]*?)<\/li>/gi);
      if (lis && lis.length > 5) {
         console.log("--- FOUND MENU: ---");
         const links = ul.match(/<a[^>]*>(.*?)<\/a>/gis);
         if(links) {
           links.forEach(l => {
             const text = l.replace(/<[^>]+>/g, '').trim();
             if (text) console.log(text);
           });
         }
         break;
      }
    }
  }
} catch(e) {
  console.log("Error:", e);
}
