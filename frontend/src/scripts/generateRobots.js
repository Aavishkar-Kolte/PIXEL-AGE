require('dotenv').config();
const fs = require('fs');
const path = require('path');

const parentDir = path.join(__dirname, '../..');
const hostname = process.env.SITE_URL;
console.log(hostname);

const robotsTxtContent = `
User-agent: *
Disallow: /play-online
Disallow: /create-lobby
Disallow: /join-lobby
Disallow: /lobby

Sitemap: ${hostname}/sitemap.xml
`;

fs.writeFileSync(path.join(parentDir, 'public', 'robots.txt'), robotsTxtContent.trim());

console.log(__dirname);
